import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from 'prisma/prisma';
import { Watchlist } from 'prisma/prisma-client';

interface AddCoinApiRequest extends NextApiRequest {
	query: {
		watchlistId?: string;
	};
	body: {
		coinId: string;
	};
}

const addCoin: NextApiHandler<Watchlist> = async (
	req: AddCoinApiRequest,
	res: NextApiResponse
) => {
	const session = await getSession({ req });

	if (!session) {
		return res.status(401).json({ error: 'Unauthorized' });
	}

	if (req.method !== 'PATCH') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	const { watchlistId } = req.query;
	const { coinId } = req.body;

	const updatedWatchlist = await prisma.watchlist.update({
		where: {
			id: watchlistId,
		},
		data: {
			coinIds: {
				push: coinId,
			},
		},
	});

	return res.status(200).json(updatedWatchlist);
};
export default addCoin;
