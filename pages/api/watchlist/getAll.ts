import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'prisma/prisma';

const getAll: NextApiHandler = async (
	req: NextApiRequest,
	res: NextApiResponse
) => {
	const { userId } = req.query;

	const watchlists = await prisma.watchlist.findMany({
		where: { userId: userId as string },
	});

	if (!watchlists) {
		return res.status(404).send({ error: `Couldn't find watchlist` });
	}

	res.json(watchlists);
};
export default getAll;
