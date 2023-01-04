import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'prisma/prisma';

const get: NextApiHandler = async (
	req: NextApiRequest,
	res: NextApiResponse
) => {
	const { watchlistId, name, isMain, userId } = req.query;

	const watchlist = await prisma.watchlist.findFirst({
		where: {
			id: watchlistId as string,
			userId: userId as string,
			name: name as string,
			isMain: isMain ? Boolean(isMain) : undefined,
		},
	});

	if (!watchlist) {
		return res.status(404).send({ error: `Couldn't find watchlist` });
	}

	res.status(200).json(watchlist);
};
export default get;
