import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'prisma/prisma';
import { Watchlist } from 'prisma/prisma-client';

export type AddCoinParams = { userId: string };
export type GetSignoutLinkRequest = { authenticationType: string };

const addCoin: NextApiHandler<Watchlist> = async (
	req: NextApiRequest,
	res: NextApiResponse
) => {
	const { userId } = req.query as AddCoinParams;
	const { coinId } = req.body;

	const watchlist = await prisma.watchlist.findFirst({
		where: {
			userId,
			isMain: true,
		},
	});

	if (!watchlist) {
		return res.status(404).send({ error: `Couldn't find watchlist` });
	}

	const updatedWatchlist = await prisma.watchlist.update({
		where: {
			id: watchlist.id,
		},
		data: {
			coinIds: {
				push: coinId,
			},
		},
	});

	res.status(200).json(updatedWatchlist);
};
export default addCoin;
