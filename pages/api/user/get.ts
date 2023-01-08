import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'prisma/prisma';

type GetUserRequest = {
	name: string;
	email: string;
};

const getUser: NextApiHandler = async (
	req: NextApiRequest,
	res: NextApiResponse
) => {
	const { name, email } = req.query as GetUserRequest;

	const user = await prisma.user.findFirst({
		where: { name, email },
	});

	if (!user) {
		return res
			.status(404)
			.send({ error: `Couldn't find user with name ${name}` });
	}

	res.json(user);
};
export default getUser;
