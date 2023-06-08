import { Like, Post, User } from '@prisma/client';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'prisma/prisma';

export type Comment = Post & {
	author: User;
	likes: Like[];
	replyTo: Post & {
		author: User;
		likes: Like[];
	};
};

interface GetUserCommentsApiRequest extends NextApiRequest {
	query: {
		userName?: string;
	};
}

const getUserComments: NextApiHandler = async (
	req: GetUserCommentsApiRequest,
	res: NextApiResponse
) => {
	if (req.method !== 'GET') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	const { userName } = req.query;

	const posts = await prisma.post.findMany({
		where: {
			author: {
				name: userName as string,
			},
			replyToId: {
				not: null,
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
			replyTo: {
				include: {
					author: true,
					likes: true,
				},
			},
		},
	});

	if (!posts) {
		return res.status(500).send({ error: `Couldn't create posts` });
	}

	return res.status(200).json(posts as Comment[]);
};
export default getUserComments;
