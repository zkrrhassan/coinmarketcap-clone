import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import { createTransport } from 'nodemailer';
import jwt from 'jsonwebtoken';
import { prisma } from 'prisma/prisma';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { email, password } = req.body;

	try {
		const hashedPassword = await bcrypt.hash(password, 12);

		// check if name is occupied
		for (;;) {
			const name = createUserName();
			const occupied = await prisma.user.findFirst({
				where: {
					name,
				},
			});
			if (occupied) continue;

			const user = await prisma.user.create({
				data: {
					email,
					password: hashedPassword,
					name,
					displayName: name,
				},
			});
			await prisma.watchlist.create({
				data: {
					name: 'My First Watchlist',
					isMain: true,
					userId: user.id,
				},
			});
			break;
		}

		await sendVerificationEmail(email);

		return res.status(200).end();
	} catch (err) {
		return res.status(503).json({ err });
	}
}
const EMAIL_SECRET = 'filox-secret';

async function sendVerificationEmail(email: string) {
	const transport = createTransport(process.env.EMAIL_SERVER);

	try {
		jwt.sign(
			{
				email,
			},
			EMAIL_SECRET,
			{
				expiresIn: 60 * 15,
			},
			(err, emailToken) => {
				const url = `http://localhost:3000/api/confirmation/${emailToken}`;

				transport.sendMail({
					to: email,
					from: process.env.EMAIL_FROM,
					subject: 'Confirm Email',
					html: `Please click this email to confirm your email: <a href="${url}">${url}</a>`,
				});
			}
		);
	} catch (error) {}
}
const createUserName = () => {
	const CHARSET =
		'0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';
	const NAME_LENGTH = 10;

	return [...Array(NAME_LENGTH)]
		.map((_) => CHARSET[Math.floor(Math.random() * CHARSET.length)])
		.join('');
};
