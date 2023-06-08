import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from 'prisma/prisma';

const getMain: NextApiHandler = async (
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

	const watchlist = await prisma.watchlist.findFirst({
		where: {
			userId: session.user.id,
			isMain: true,
		},
	});

	if (!watchlist) {
		return res.status(404).send({ error: `Couldn't find watchlist` });
	}

	if (watchlist.userId !== session.user.id) {
		return res.status(403).json({ error: 'Forbidden' });
	}

	return res.status(200).json(watchlist);
};
export default getMain;
