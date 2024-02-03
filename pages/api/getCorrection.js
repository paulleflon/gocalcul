import WolframAlphaAPI from '@wolfram-alpha/wolfram-alpha-api';

const wa = WolframAlphaAPI(process.env.WOLFRAM_APPID);

export default async function handler(req, res) {
	try {
		if (req.method === 'POST') {
			const response = await wa.getFull("expand " + req.body.formula);
			for (const pod of response.pods) {
				const title = pod.title.toLowerCase();
				if (title === 'result' || title.includes('simplified') || title.includes('expanded')) {
					let text = pod.subpods[0].plaintext;
					text = text.replace(/(\d*[a-z]?)\^(\d+)/gm, '$1^{$2}');
					return res.status(200).json({correction: text});
				}
			}
			res.status(400).json({error: true, message: 'Could not automatically generate a correction.'});
		} else {
			throw 'error'; //tempfixf
		}
	} catch (err) {
		res.status(500).json({error: true, err});
	}
}
