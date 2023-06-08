import { Like, Post, User } from '@prisma/client';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'prisma/prisma';

export type PostDetails = Post & {
	author: User;
	likes: Like[];
	replies: (Post & {
		author: User;
		likes: Like[];
	})[];
};

interface GetPostApiRequest extends NextApiRequest {
	query: {
		id?: string;
	};
}

const getPost: NextApiHandler = async (
	req: GetPostApiRequest,
	res: NextApiResponse
) => {
	if (req.method !== 'GET') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	const { id } = req.query;

	const post = await prisma.post.findUnique({
		where: {
			id,
		},
		include: {
			author: true,
			likes: true,
			replies: {
				include: {
					author: true,
					likes: true,
				},
			},
		},
	});

	if (!post) {
		return res.status(500).send({ error: `Couldn't create post` });
	}

	return res.status(200).json(post);
};
export default getPost;
