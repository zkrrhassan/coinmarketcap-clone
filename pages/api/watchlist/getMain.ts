import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'prisma/prisma';

const getMain: NextApiHandler = async (
	req: NextApiRequest,
	res: NextApiResponse
) => {
	const { userId } = req.query;

	const watchlist = await prisma.watchlist.findFirst({
		where: {
			userId: userId as string,
			isMain: true,
		},
	});

	if (!watchlist) {
		return res.status(404).send({ error: `Couldn't find watchlist` });
	}

	res.json(watchlist);
};
export default getMain;
