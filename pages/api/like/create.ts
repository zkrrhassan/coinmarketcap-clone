import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from 'prisma/prisma';

interface RemoveLikeApiRequest extends NextApiRequest {
	body: {
		postId: string;
	};
}

const createLike: NextApiHandler = async (
	req: RemoveLikeApiRequest,
	res: NextApiResponse
) => {
	const session = await getSession({ req });

	if (!session) {
		return res.status(401).json({ error: 'Unauthorized' });
	}

	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	const { postId } = req.body;

	const existingLike = await prisma.like.findFirst({
		where: {
			postId,
			userId: session.user.id,
		},
	});

	if (existingLike) {
		return res.status(409).send({ error: `Already liked post` });
	}

	const like = await prisma.like.create({
		data: {
			postId,
			userId: session.user.id,
		},
	});

	if (!like) {
		return res.status(500).send({ error: `Couldn't like post` });
	}

	return res.status(200).json(like);
};
export default createLike;
