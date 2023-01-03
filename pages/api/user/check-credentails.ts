import type {
	NextApiHandler,
	NextApiRequest,
	NextApiResponse,
	PageConfig,
} from 'next';
import { prisma } from 'prisma/prisma';

export const config: PageConfig = {
	api: {
		bodyParser: false,
	},
};

const getUser: NextApiHandler = async (
	req: NextApiRequest,
	res: NextApiResponse
) => {
	const { email, password } = req.query;

	const user = await prisma.user.findFirst({
		where: { email: email as string },
	});

	if (!user) {
		return res
			.status(404)
			.send({ error: `Couldn't find user with name ${name}` });
	}

	res.json(user);
};
export default getUser;
