import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from 'prisma/prisma';

interface RemoveLikeApiRequest extends NextApiRequest {
	query: {
		postId?: string;
	};
}

const removeLike: NextApiHandler = async (
	req: RemoveLikeApiRequest,
	res: NextApiResponse
) => {
	const session = await getSession({ req });

	if (!session) {
		return res.status(401).json({ error: 'Unauthorized' });
	}

	if (req.method !== 'DELETE') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	const { postId } = req.query;

	const existingLike = await prisma.like.findFirst({
		where: {
			postId,
			userId: session.user.id,
		},
	});

	if (!existingLike) {
		return res.status(404).send({ error: `Like not found` });
	}

	const like = await prisma.like.delete({
		where: {
			id: existingLike.id,
		},
	});

	if (!like) {
		return res.status(500).send({ error: `Couldn't create post` });
	}

	return res.status(200).json(like);
};
export default removeLike;
