import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from 'prisma/prisma';

const allowedMethods = ['POST'];

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		if (!allowedMethods.includes(req.method!) || req.method == 'OPTIONS') {
			return res.status(405).send({ message: 'Method not allowed.' });
		}

		const { email, password } = req.body;
		const hashedPassword = await bcrypt.hash(password, 12);

		// generate user name
		const name = await generateUserName();

		//create user
		const user = await prisma.user.create({
			data: {
				email,
				password: hashedPassword,
				name,
				displayName: name,
			},
		});

		//create first watchlist
		await prisma.watchlist.create({
			data: {
				name: 'My First Watchlist',
				isMain: true,
				userId: user.id,
			},
		});

		return res.status(200).json(user);
	} catch (error) {
		console.error(error);
		return res.status(500).send({ message: 'Server error!' });
	}
}

const generateUserName = async (): Promise<string> => {
	for (;;) {
		const name = createUserName();
		const occupied = await prisma.user.findUnique({
			where: {
				name,
			},
		});
		if (occupied) continue;
		else return name;
	}
};

const createUserName = () => {
	const CHARSET = 'wertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';
	const NAME_LENGTH = 10;

	return [...Array(NAME_LENGTH)]
		.map((_) => CHARSET[Math.floor(Math.random() * CHARSET.length)])
		.join('');
};
