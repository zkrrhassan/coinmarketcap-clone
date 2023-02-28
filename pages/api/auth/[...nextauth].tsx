import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import axios from 'axios';
import { User } from 'prisma/prisma-client';
import { NextApiRequest, NextApiResponse } from 'next';
import { randomUUID } from 'crypto';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from 'prisma/prisma';
import { decode, encode } from 'next-auth/jwt';
import Cookies from 'cookies';

const confirmPasswordHash = (plainPassword: string, hashedPassword: string) => {
	return new Promise<boolean>((resolve) => {
		bcrypt.compare(plainPassword, hashedPassword, (err, res) => {
			resolve(res);
		});
	});
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const data = requestWrapper(req, res);
	return await NextAuth(...data);
};

export default handler;

function requestWrapper(
	req: NextApiRequest,
	res: NextApiResponse
): [req: NextApiRequest, res: NextApiResponse, opts: NextAuthOptions] {
	const generateSessionToken = () => randomUUID();

	const fromDate = (time: number, date = Date.now()) =>
		new Date(date + time * 1000);

	const adapter = PrismaAdapter(prisma);

	const opts: NextAuthOptions = {
		adapter,
		providers: [
			CredentialsProvider({
				id: 'credentials',
				name: 'credentials',
				credentials: {
					email: {
						label: 'Email',
						type: 'text',
						placeholder: 'example@email.com',
					},
					password: {
						label: 'Password',
						type: 'password',
						placeholder: 'password',
					},
				},
				async authorize(credentials, req) {
					if (!credentials) return null;
					const { email, password } = credentials;
					try {
						const user = (
							await axios.post<User>(
								`${process.env.NEXTAUTH_URL}/api/user/get`,
								{
									email,
									password,
								}
							)
						).data;

						if (user !== null) {
							const valid = await confirmPasswordHash(password, user.password);

							if (valid === true) {
								return user;
							} else {
								return null;
							}
						} else {
							return null;
						}
					} catch (error) {
						return null;
					}
				},
			}),
		],
		callbacks: {
			session: async ({ session, user }) => {
				// Include user.id on session
				if (session.user) {
					session.user.id = user.id;
				}

				return session;
			},
			async signIn({ user, account, profile, email, credentials }) {
				if (
					req.query.nextauth?.includes('callback') &&
					req.query.nextauth?.includes('credentials') &&
					req.method === 'POST'
				) {
					if (user) {
						const sessionToken = generateSessionToken();
						const sessionMaxAge = 60 * 60 * 24 * 30; // 30 Days
						const sessionExpiry = fromDate(sessionMaxAge);

						await adapter.createSession({
							sessionToken: sessionToken,
							userId: user.id,
							expires: sessionExpiry,
						});

						const cookies = new Cookies(req, res);

						cookies.set('next-auth.session-token', sessionToken, {
							expires: sessionExpiry,
						});
					}
				}

				return true;
			},
		},
		jwt: {
			encode: async ({ token, secret, maxAge }) => {
				if (
					req.query.nextauth?.includes('callback') &&
					req.query.nextauth.includes('credentials') &&
					req.method === 'POST'
				) {
					const cookies = new Cookies(req, res);
					const cookie = cookies.get('next-auth.session-token');
					if (cookie) return cookie;
					else return '';
				}
				// Revert to default behaviour when not in the credentials provider callback flow
				return encode({ token, secret, maxAge });
			},
			decode: async ({ token, secret }) => {
				if (
					req.query.nextauth?.includes('callback') &&
					req.query.nextauth.includes('credentials') &&
					req.method === 'POST'
				) {
					return null;
				}

				// Revert to default behaviour when not in the credentials provider callback flow
				return decode({ token, secret });
			},
		},
	};

	return [req, res, opts];
}
