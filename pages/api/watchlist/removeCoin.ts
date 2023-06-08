import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from 'prisma/prisma';

const removeCoin: NextApiHandler = async (
	req: NextApiRequest,
	res: NextApiResponse
) => {
	const session = await getSession({ req });

	if (!session) {
		return res.status(401).json({ error: 'Unauthorized' });
	}

	if (req.method !== 'PATCH') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	const { coinId, watchlistId } = req.query;

	const watchlist = await prisma.watchlist.findFirst({
		where: {
			userId: session.user.id,
			id: watchlistId as string,
		},
	});

	if (!watchlist) {
		return res.status(404).send({ error: `Couldn't find watchlist` });
	}

	if (watchlist.userId !== session.user.id) {
		return res.status(403).json({ error: 'Forbidden' });
	}

	const updatedWatchlist = await prisma.watchlist.update({
		where: {
			id: watchlist.id,
		},
		data: {
			coinIds: {
				set: watchlist.coinIds.filter((id) => id !== coinId),
			},
		},
	});

	return res.status(200).json(updatedWatchlist);
};
export default removeCoin;
