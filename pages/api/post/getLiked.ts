import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'prisma/prisma';

const get: NextApiHandler = async (
	req: NextApiRequest,
	res: NextApiResponse
) => {
	const { userId } = req.query as { userId: string };

	const posts = await prisma.post.findMany({
		where: {
			likes: {
				has: userId,
			},
		},
		include: {
			author: true,
		},
	});

	if (!posts) {
		return res.status(500).send({ error: `Couldn't create posts` });
	}

	res.json(posts);
};
export default get;
