import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'prisma/prisma';

interface GetUserPostsApiRequest extends NextApiRequest {
	query: {
		userName?: string;
	};
}

const getUserPosts: NextApiHandler = async (
	req: GetUserPostsApiRequest,
	res: NextApiResponse
) => {
	if (req.method !== 'GET') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	const { userName } = req.query;

	const posts = await prisma.post.findMany({
		where: {
			author: {
				name: userName,
			},
			replyToId: {
				equals: null,
			},
		},
		orderBy: [
			{
				createdAt: 'desc',
			},
		],
		include: {
			author: true,
			likes: true,
		},
	});

	if (!posts) {
		return res.status(500).send({ error: `Couldn't create posts` });
	}

	return res.status(200).json(posts);
};
export default getUserPosts;
