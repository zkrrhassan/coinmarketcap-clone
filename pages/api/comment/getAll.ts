import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'prisma/prisma';

const getAll: NextApiHandler = async (
	req: NextApiRequest,
	res: NextApiResponse
) => {
	const { userId } = req.query as { userId: string };

	const comments = await prisma.comment.findMany({
		where: {
			authorId: userId,
		},
		include: {
			post: {
				include: {
					author: true,
				},
			},
			author: true,
		},
	});

	if (!comments) {
		return res.status(404).send({ error: `Couldn't find watchlist` });
	}

	res.json(comments);
};
export default getAll;
