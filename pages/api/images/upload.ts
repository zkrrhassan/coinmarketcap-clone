import type {
	NextApiHandler,
	NextApiRequest,
	NextApiResponse,
	PageConfig,
} from 'next';
import { v4 as uuid } from 'uuid';
import { IncomingForm } from 'formidable';
import path from 'path';
import fs from 'fs/promises';

export const config: PageConfig = {
	api: {
		bodyParser: false,
	},
};

const readFile = (req: NextApiRequest): Promise<string> => {
	const imageName = uuid();

	const form = new IncomingForm({
		uploadDir: path.join(process.cwd(), '/public/uploads'),
		filename: (name, ext, part, form) => {
			return imageName + '.jpeg';
		},
		maxFileSize: 4000 * 1024 * 1024,
	});

	return new Promise((resolve, reject) => {
		form.parse(req, (err, fields, files) => {
			if (err) reject(err);
			resolve(imageName);
		});
	});
};

const upload: NextApiHandler = async (
	req: NextApiRequest,
	res: NextApiResponse
) => {
	try {
		await fs.readdir(path.join(process.cwd() + '/public', '/uploads'));
	} catch (error) {
		await fs.mkdir(path.join(process.cwd() + '/public', '/uploads'));
	}
	const imageName = await readFile(req);

	res.status(200).json({ msg: 'Uploaded successfuly!', imageName });
};
export default upload;
