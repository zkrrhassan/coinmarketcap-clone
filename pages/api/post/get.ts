import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'prisma/prisma';

const get: NextApiHandler = async (
	req: NextApiRequest,
	res: NextApiResponse
) => {
	const { postId } = req.query as {
		postId: string;
	};

	const post = await prisma.post.findUnique({
		where: {
			id: postId,
		},
		include: {
			postAuthor: true,
			replies: {
				include: {
					replyAuthor: true,
					likes: true,
				},
			},
			likes: true,
		},
	});

	if (!post) {
		return res.status(500).send({ error: `Couldn't create post` });
	}

	res.json(post);
};
export default get;
