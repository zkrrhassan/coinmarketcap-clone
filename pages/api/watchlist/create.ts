import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'prisma/prisma';

const create: NextApiHandler = async (
	req: NextApiRequest,
	res: NextApiResponse
) => {
	const { userId } = req.query as { userId: string };
	const { name } = req.body as { name: string };

	const watchlist = await prisma.watchlist.create({
		data: {
			userId,
			name,
			isMain: false,
		},
	});

	if (!watchlist) {
		return res.status(500).send({ error: `Couldn't create watchlist` });
	}

	res.json(watchlist);
};
export default create;
