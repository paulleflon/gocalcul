import WolframAlphaAPI from '@wolfram-alpha/wolfram-alpha-api';

const wa = WolframAlphaAPI(process.env.WOLFRAM_APPID);

export default async function handler(req, res) {
	if (process.env.DEVELOPMENT === 'true') {
		const delay = Math.floor(Math.random() * 5000 + 1000);
		return setTimeout(() => {
			res.status(200).json({
		correction: '{-10 x^{9} + 30 x^{6} z^{5} - 16 x^{6} - 7 x^{5} z^{6} + 42 x^{5} z^{5} + 100 y^{2} - 80 y z^{5} - 10 z^{11} + 76 z^{10} + 4 z^{8}}'
			});
		}, delay);
	}
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
