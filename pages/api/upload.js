import Cors from "cors";
const cloudinary = require("cloudinary").v2;

cloudinary.config({
	cloud_name: process.env.CLD_NAME,
	api_key: process.env.CLD_API_KEY,
	api_secret: process.env.CLD_API_SECRET,
	secure: true,
});

const cors = Cors({
	methods: ["GET", "HEAD", "POST"],
});

function runMiddleware(req, res, fn) {
	return new Promise((resolve, reject) => {
		fn(req, res, (result) => {
			if (result instanceof Error) {
				return reject(result);
			}
			return resolve(result);
		});
	});
}

export default async function handler(req, res) {
	await runMiddleware(req, res, cors);
	
	try {
		await cloudinary.uploader.upload(req.body.image, (error, result) => {
			const response = cloudinary.video(`${result.public_id}`, {
				// effect: "zoompan:mode_ztl;maxzoom_2.4;du_8",
				effect: "zoompan:from_(zoom_1;x_300;y_100);to_(zoom_4;x_950;y_800)",
				resource_type: "image",
			});

			res.status(200).json(response);
		});
	} catch (error) {
		res.status(500).json(error);
	}
}

export const config = {
	api: {
		bodyParser: {
			sizeLimit: "4mb",
		},
	},
};
