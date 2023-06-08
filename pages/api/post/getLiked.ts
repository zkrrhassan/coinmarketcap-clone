import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'prisma/prisma';

interface GetLikedApiRequest extends NextApiRequest {
	query: {
		userName?: string;
	};
}

const getLiked: NextApiHandler = async (
	req: GetLikedApiRequest,
	res: NextApiResponse
) => {
	if (req.method !== 'GET') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	const { userName } = req.query;

	const likes = await prisma.like.findMany({
		where: {
			user: {
				name: userName as string,
			},
		},
		orderBy: [
			{
				createdAt: 'desc',
			},
		],
		include: {
			post: {
				include: {
					author: true,
					likes: true,
				},
			},
		},
	});

	if (!likes) {
		return res.status(500).send({ error: `Couldn't create posts` });
	}

	const posts = likes.map((like) => like.post);

	return res.status(200).json(posts);
};
export default getLiked;
