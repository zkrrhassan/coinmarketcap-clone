import { WatchlistInputs } from 'components/pages/watchlist/WatchlistModal/WatchlistModal';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from 'prisma/prisma';

interface CreateWatchlistApiRequest extends NextApiRequest {
	body: WatchlistInputs;
}

const create: NextApiHandler = async (
	req: CreateWatchlistApiRequest,
	res: NextApiResponse
) => {
	const session = await getSession({ req });

	if (!session) {
		return res.status(401).json({ error: 'Unauthorized' });
	}

	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	const { name, description } = req.body;

	const watchlist = await prisma.watchlist.create({
		data: {
			userId: session.user.id,
			name,
			description,
			isMain: false,
		},
	});

	if (!watchlist) {
		return res.status(500).send({ error: `Couldn't create watchlist` });
	}

	return res.status(200).json(watchlist);
};
export default create;
