import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { prisma } from 'prisma/prisma';

const SECRET = 'filox-secret';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { token } = req.query;
	const { email } = jwt.verify(token as string, SECRET) as { email: string };

	try {
		await prisma.user.update({
			where: {
				email,
			},
			data: {
				emailVerified: new Date(),
			},
		});
		return res.status(200).json({ message: 'HELLO' });
	} catch (error) {
		res.status(400).json(error);
	}
}
