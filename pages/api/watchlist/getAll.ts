import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from 'prisma/prisma';

const getAll: NextApiHandler = async (
	req: NextApiRequest,
	res: NextApiResponse
) => {
	const session = await getSession({ req });

	if (!session) {
		return res.status(401).json({ error: 'Unauthorized' });
	}

	if (req.method !== 'GET') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	const watchlists = await prisma.watchlist.findMany({
		where: { userId: session.user.id },
	});

	if (!watchlists) {
		return res.status(404).send({ error: `Couldn't find watchlist` });
	}

	return res.status(200).json(watchlists);
};
export default getAll;
