import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'prisma/prisma';

const unlike: NextApiHandler = async (
	req: NextApiRequest,
	res: NextApiResponse
) => {
	const { postId, userId } = req.query as {
		postId: string;
		userId: string;
	};

	const existingLike = await prisma.like.findFirst({
		where: {
			postId,
			userId,
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

	res.json(like);
};
export default unlike;
