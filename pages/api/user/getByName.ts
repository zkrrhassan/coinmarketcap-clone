import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'prisma/prisma';

function exclude<User, Key extends keyof User>(
	user: User,
	keys: Key[]
): Omit<User, Key> {
	for (let key of keys) {
		delete user[key];
	}
	return user;
}

const getByName: NextApiHandler = async (
	req: NextApiRequest,
	res: NextApiResponse
) => {
	try {
		const { name } = req.query as { name: string };

		const user = await prisma.user.findFirst({
			where: { name },
			include: {
				posts: {
					include: {
						postAuthor: true,
						likes: true,
					},
				},
				replies: {
					include: {
						replyAuthor: true,
						likes: true,
						replyTo: {
							include: {
								postAuthor: true,
								replyAuthor: true,
							},
						},
					},
				},
				likes: {
					include: {
						post: {
							include: {
								postAuthor: true,
								replyAuthor: true,
								likes: true,
							},
						},
					},
				},
			},
		});

		if (!user) {
			return res
				.status(404)
				.send({ error: `Couldn't find user with name ${name}` });
		}

		res.status(200).json(exclude(user, ['password']));
	} catch (error) {
		console.error(error);
		res.status(500).send({ message: 'Internal server error' });
	}
};
export default getByName;
