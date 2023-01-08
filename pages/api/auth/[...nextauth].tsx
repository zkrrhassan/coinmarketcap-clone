import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import axios from 'axios';

const confirmPasswordHash = (plainPassword: string, hashedPassword: string) => {
	return new Promise<boolean>((resolve) => {
		bcrypt.compare(plainPassword, hashedPassword, (err, res) => {
			resolve(res);
		});
	});
};

export default NextAuth({
	secret: process.env.NEXTAUTH_SECRET,
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
						await axios.post('http://localhost:3000/api/user/get', {
							email,
							password,
						})
					).data;

					if (user !== null && user.emailVerified) {
						const res = await confirmPasswordHash(password, user.password);

						if (res === true) {
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
		jwt: async ({ token, user }) => {
			user && (token.id = user.id);
			return token;
		},
		session: async ({ session, token }) => {
			return {
				...session,
				user: {
					...session.user,
					id: token.id as string,
				},
			};
		},
	},
});
