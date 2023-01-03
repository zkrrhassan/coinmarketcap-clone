import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'prisma/prisma';

const like: NextApiHandler = async (
	req: NextApiRequest,
	res: NextApiResponse
) => {
	const { postId } = req.query as { postId: string };
	const { userId } = req.body as { userId: string };

	const likes = (
		await prisma.post.findUnique({
			where: {
				id: postId,
			},
		})
	)?.likes;

	const post = await prisma.post.update({
		where: {
			id: postId,
		},
		data: {
			likes: likes?.filter((id) => id !== userId),
		},
	});

	if (!post) {
		return res.status(500).send({ error: `Couldn't update post` });
	}

	res.json(post);
};
export default like;
