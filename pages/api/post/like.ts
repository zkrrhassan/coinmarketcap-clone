import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'prisma/prisma';

const like: NextApiHandler = async (
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

	if (existingLike) {
		return res.status(409).send({ error: `Already liked post` });
	}

	const like = await prisma.like.create({
		data: {
			postId,
			userId,
		},
	});

	if (!like) {
		return res.status(500).send({ error: `Couldn't like post` });
	}

	res.json(like);
};
export default like;
