import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'prisma/prisma';

function exclude<User, Key extends keyof User>(
	user: User,
	keys: Key[]
): Omit<User, Key> {
	for (let key of keys) {
		delete user[key];
	}
	return user;
}

interface GetUserRequest extends NextApiRequest {
	query: {
		name?: string;
	};
}

const getUser: NextApiHandler = async (
	req: GetUserRequest,
	res: NextApiResponse
) => {
	if (req.method !== 'GET') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	const { name } = req.query;

	const user = await prisma.user.findFirst({
		where: {
			name: name as string,
		},
	});

	if (!user) {
		return res
			.status(404)
			.send({ error: `Couldn't find user with name ${name}` });
	}

	return res.status(200).json(exclude(user, ['password']));
};
export default getUser;
