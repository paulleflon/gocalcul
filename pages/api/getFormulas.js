import OpenAI from 'openai';

const gpt = new OpenAI({
	organization: process.env.OPENAI_ORG,
	apiKey: process.env.OPENAI_KEY,
});

export default async function handler(req, res) {
	const settings = {
		difficulty: req.query.difficulty || 'hard',
		variables: req.query.variables || 'x',
		fractions: req.query.fractions || 'no',
		length: req.query.length || 'long',
		amount: parseInt(req.query.amount) || 5
	};
	if (settings.amount > 10)
		settings.amount = 10;
	const prompt =  `Generate literal expressions. These should be made for young middle school students to practice literal calculations. Include multiple terms in each formula and expressions multiplying each other. Do not include any solution, only problems. Each formula should simplifyable. Make them with the following properties:
Number of expressions: ${settings.amount}
Variables: ${settings.variables}
Must always include: simple terms addition, factorized expressions, double distributivity, binomal squares.
Difficulty: ${settings.difficulty}
Length of each formula: ${settings.length}
Include square roots: no
Include known constants (pi, e, i): no
Include fractions: ${settings.fractions}
Maximum power on a simple monome: 5
Maximum power on a parenthesis: 2
Maximum parenthesis multiplied by each other (...)*(...)* ... : 3
Please give them in a json array of the form ["formula 1", "formula 2", ...].The formulas must be written in LaTeX(but don't include the $ sign). Don't include anything else in your response.`;
	const response = await gpt.chat.completions.create({
		messages: [{
			role: 'user',
			content: prompt,
		}],
		model: 'gpt-3.5-turbo',
	});
	 res.status(200).json(JSON.parse(response.choices[0].message.content));
}
