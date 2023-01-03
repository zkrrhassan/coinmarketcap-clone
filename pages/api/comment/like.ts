import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'prisma/prisma';

const like: NextApiHandler = async (
	req: NextApiRequest,
	res: NextApiResponse
) => {
	const { commentId } = req.query as { commentId: string };
	const { userId } = req.body as { userId: string };

	const post = await prisma.comment.update({
		where: {
			id: commentId,
		},
		data: {
			likes: {
				push: userId,
			},
		},
	});

	if (!post) {
		return res.status(500).send({ error: `Couldn't update post` });
	}

	res.json(post);
};
export default like;
