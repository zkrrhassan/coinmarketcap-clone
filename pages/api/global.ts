import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { data } = (await axios.get(`${process.env.CMC_API_URI}/global`)).data;
	if (!data) {
		return res.status(500).send({ error: `Couldn't get coins global data.` });
	}
	res.status(200).json(data);
}
