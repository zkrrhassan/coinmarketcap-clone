import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'prisma/prisma';

const create: NextApiHandler = async (
	req: NextApiRequest,
	res: NextApiResponse
) => {
	const { postId, userId } = req.query as { postId: string; userId: string };
	const {
		status,
		content,
	}: { status: 'bullish' | 'bearish'; content: string } = req.body;

	const comment = await prisma.comment.create({
		data: {
			postId,
			authorId: userId,
			content,
			status,
		},
	});

	if (!comment) {
		return res.status(500).send({ error: `Couldn't create comment` });
	}

	res.json(comment);
};
export default create;
