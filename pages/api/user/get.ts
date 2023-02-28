import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'prisma/prisma';

type GetUserRequest = {
	name: string;
	email: string;
};

function exclude<User, Key extends keyof User>(
	user: User,
	keys: Key[]
): Omit<User, Key> {
	for (let key of keys) {
		delete user[key];
	}
	return user;
}

const getUser: NextApiHandler = async (
	req: NextApiRequest,
	res: NextApiResponse
) => {
	try {
		const { name, email } = req.query as GetUserRequest;

		const user = await prisma.user.findFirst({
			where: { name, email },
		});

		if (!user) {
			return res
				.status(404)
				.send({ error: `Couldn't find user with name ${name}` });
		}

		res.status(200).json(exclude(user, ['password']));
	} catch (error) {
		console.error(error);
		res.status(500).send({ message: 'Internal server error' });
	}
};
export default getUser;
