import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'prisma/prisma';

const get: NextApiHandler = async (
	req: NextApiRequest,
	res: NextApiResponse
) => {
	const { postId, withComments } = req.query as {
		postId: string;
		withComments?: string;
	};

	const post = await prisma.post.findUnique({
		where: {
			id: postId,
		},
		include: {
			author: true,
			comments: withComments
				? {
						include: {
							author: true,
						},
						orderBy: {
							createdAt: 'desc',
						},
				  }
				: false,
		},
	});

	if (!post) {
		return res.status(500).send({ error: `Couldn't create post` });
	}

	res.json(post);
};
export default get;
