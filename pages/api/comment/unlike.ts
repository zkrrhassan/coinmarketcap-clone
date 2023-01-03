import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'prisma/prisma';

const like: NextApiHandler = async (
	req: NextApiRequest,
	res: NextApiResponse
) => {
	const { commentId } = req.query as { commentId: string };
	const { userId } = req.body as { userId: string };

	const likes = (
		await prisma.comment.findUnique({
			where: {
				id: commentId,
			},
		})
	)?.likes;

	const comment = await prisma.comment.update({
		where: {
			id: commentId,
		},
		data: {
			likes: likes?.filter((id) => id !== userId),
		},
	});

	if (!comment) {
		return res.status(500).send({ error: `Couldn't update comment` });
	}

	res.json(comment);
};
export default like;
