import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'prisma/prisma';

const getUser: NextApiHandler = async (
	req: NextApiRequest,
	res: NextApiResponse
) => {
	const { name } = req.query;

	const user = await prisma.user.findFirst({
		where: { name: name as string },
	});

	if (!user) {
		return res
			.status(404)
			.send({ error: `Couldn't find user with name ${name}` });
	}

	res.json(user);
};
export default getUser;
