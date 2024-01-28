

// This sends the results of a game to a Discord Webhook.
const handler = async (req, res) => {
	try {
		const {body}= req;
		const description = `__Formula **${body.viewing}** of **${body.amount}**__
		**Formula:** \`${body.formula}\`
		**Input**: \`${body.reply}\`
		**Correction**: \`${body.correction}\`
		**Feedback**: \`${body.feedback}\``;
		const embed = {
			title: 'New attempt!',
			description,
			color: 0x2f3136,
			footer: {
				text: `GoCalcul`
			},
			timestamp: new Date().toISOString()
		}
		await fetch(process.env.DISCORD_HOOK_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				embeds: [embed]
			})
		});
		res.status(200).end();
	} catch (e) {
		console.error(e);
		res.status(500).send(e.message || 'Something unknown went wrong.');
	}
};
export default handler;