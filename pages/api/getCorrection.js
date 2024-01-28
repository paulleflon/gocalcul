import WolframAlphaAPI from '@wolfram-alpha/wolfram-alpha-api';

const wa = WolframAlphaAPI(process.env.WOLFRAM_APPID);

export default async function handler(req, res) {
	const response = await wa.getFull("expand " + req.body.formula);
	for (const pod of response.pods) {
		const title = pod.title.toLowerCase();
		if (title === 'result' || title.includes('simplified') || title.includes('expanded')) {
			res.status(200).send({correction: pod.subpods[0].plaintext});
		}
	}
	res.status(400).send({error: true, message: 'Could not automatically generate a correction.'});
}
