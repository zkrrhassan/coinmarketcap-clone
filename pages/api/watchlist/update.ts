import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'prisma/prisma';

const removeCoin: NextApiHandler = async (
	req: NextApiRequest,
	res: NextApiResponse
) => {
	const { watchlistId } = req.query;
	const { name, isMain } = req.body;

	const updated = await prisma.watchlist.update({
		where: {
			id: watchlistId as string,
		},
		data: {
			name: name,
			isMain: isMain ? Boolean(isMain) : undefined,
		},
	});

	res.json(updated);
};
export default removeCoin;
