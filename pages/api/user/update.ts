import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from 'prisma/prisma';

export interface UpdateUserBody {
	displayName?: string;
	name?: string;
	biography?: string | null;
	birthday?: string | null;
	website?: string | null;
	image?: string | null;
}

interface UpdateUserApiRequest extends NextApiRequest {
	body: UpdateUserBody;
}

const updateUser: NextApiHandler = async (
	req: UpdateUserApiRequest,
	res: NextApiResponse
) => {
	const session = await getSession({ req });

	if (!session) {
		return res.status(401).json({ error: 'Unauthorized' });
	}

	if (req.method !== 'PATCH') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	const { displayName, name, biography, birthday, website, image } = req.body;

	const user = await prisma.user.update({
		where: {
			id: session.user.id,
		},
		data: {
			displayName,
			name,
			biography,
			website,
			birthday: birthday && new Date(birthday),
			image,
		},
	});

	if (!user) {
		return res
			.status(404)
			.send({ error: `Couldn't find user with name ${name}` });
	}

	return res.status(200).json(user);
};
export default updateUser;
