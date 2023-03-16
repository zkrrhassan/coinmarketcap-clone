import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { PageConfig } from 'next/types';
import { prisma } from 'prisma/prisma';

const getUser: NextApiHandler = async (
	req: NextApiRequest,
	res: NextApiResponse
) => {
	const { userId } = req.query;
	const {
		displayName,
		name,
		biography,
		birthday,
		website,
		image,
	}: {
		displayName: string;
		name: string;
		biography: string;
		birthday: string;
		website: string;
		image: string;
	} = req.body;

	const user = await prisma.user.update({
		where: {
			id: userId as string,
		},
		data: {
			displayName,
			name,
			biography,
			website,
			birthday: new Date(birthday),
			image,
		},
	});

	if (!user) {
		return res
			.status(404)
			.send({ error: `Couldn't find user with name ${name}` });
	}

	res.json(user);
};
export default getUser;

export const config: PageConfig = {
	api: {
		bodyParser: {
			sizeLimit: '1mb',
		},
		responseLimit: '1mb',
	},
};
