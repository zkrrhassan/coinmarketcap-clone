import { WatchlistInputs } from 'components/pages/watchlist/WatchlistModal/WatchlistModal';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from 'prisma/prisma';

interface UpdateWatchlistApiRequest extends NextApiRequest {
	query: {
		id?: string;
	};
	body: WatchlistInputs;
}

const updateWatchlist: NextApiHandler = async (
	req: UpdateWatchlistApiRequest,
	res: NextApiResponse
) => {
	const session = await getSession({ req });

	if (!session) {
		return res.status(401).json({ error: 'Unauthorized' });
	}

	if (req.method !== 'PATCH') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	const { id } = req.query;
	const { name, description } = req.body;

	const updated = await prisma.watchlist.update({
		where: {
			id,
		},
		data: {
			name,
			description,
		},
	});

	if (!updated) {
		return res.status(500).json({ error: 'Internal server error' });
	}

	return res.status(200).json(updated);
};
export default updateWatchlist;
