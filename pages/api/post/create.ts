import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'prisma/prisma';

const create: NextApiHandler = async (
	req: NextApiRequest,
	res: NextApiResponse
) => {
	const { postAuthorId, replyAuthorId, replyToId } = req.query as {
		postAuthorId: string | undefined;
		replyAuthorId: string | undefined;
		replyToId: string | undefined;
	};
	const {
		status,
		content,
	}: { status: 'bullish' | 'bearish'; content: string } = req.body;

	const post = await prisma.post.create({
		data: {
			postAuthorId,
			replyAuthorId,
			replyToId,
			status,
			content,
			createdAt: new Date(),
		},
	});

	if (!post) {
		return res.status(500).send({ error: `Couldn't create post` });
	}

	res.json(post);
};
export default create;
