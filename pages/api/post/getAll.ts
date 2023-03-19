import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'prisma/prisma';

const get: NextApiHandler = async (
	req: NextApiRequest,
	res: NextApiResponse
) => {
	const posts = await prisma.post.findMany({
		where: {
			NOT: {
				postAuthor: null,
			},
		},
		orderBy: [
			{
				createdAt: 'desc',
			},
		],
		include: {
			postAuthor: true,
			likes: true,
		},
	});

	if (!posts) {
		return res.status(500).send({ error: `Couldn't create posts` });
	}

	res.json(posts);
};
export default get;
