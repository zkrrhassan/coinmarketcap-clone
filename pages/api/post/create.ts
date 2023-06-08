import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from 'prisma/prisma';

interface CreatePostApiRequest extends NextApiRequest {
	body: {
		content: string;
		status: 'bullish' | 'bearish' | null;
		replyToId: string | null;
	};
}

const createPost: NextApiHandler = async (
	req: CreatePostApiRequest,
	res: NextApiResponse
) => {
	const session = await getSession({ req });

	if (!session) {
		return res.status(401).json({ error: 'Unauthorized' });
	}

	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	const { status, content, replyToId } = req.body;

	const post = await prisma.post.create({
		data: {
			authorId: session.user.id,
			replyToId,
			status,
			content,
			createdAt: new Date(),
		},
	});

	if (!post) {
		return res.status(500).send({ error: `Couldn't create post` });
	}

	return res.status(200).json(post);
};
export default createPost;
