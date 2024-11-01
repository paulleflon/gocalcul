export const TERM_TYPES = {
	'expression': generateExpression, // (x1 + x2 + x3 + ...)^y
	'monome': generateMonome, // ax^b
	'simple_factorized': generateFactorized, // a(b+ c)
	'double_factorized': generateDoubleFactorized, // (a+b)(c+d)
	'multiple_factorized': generateMultipleFactorized, // (x1 + x2 + ...)(y1 + y2 + ...)[...]
	'long_factorized': generateLongFactorized, // (x1 + x2 + ...)(y1 + y2 + ...)
	'binomial_square': generateBinomialSquare, // (a + b)^2 or (a - b)^2 or (a+b)(a-b)
	'square_factorized': generateSquareFactorized, // (x1 + x2 + ...)^2(y1 + y2 + ....)
}

export const TYPOLOGY = {
	'expression': '(x_1 + x_2 + x_3 + ...)^y',
	'monome': 'ax^b',
	'simple_factorized': 'a(b + c)',
	'double_factorized': '(a + b)(c + d)',
	'multiple_factorized': '(x_1 + x_2 + ...)(y_1 + y_2 + ...)[...]',
	'long_factorized': '(x_1 + x2 + ...)(y_1 + y_2 + ...)',
	'binomial_square': 'Identités remarquables',
	'square_factorized': '(x1 + x2 + ...)^2(y1 + y2 + ....)',
}


export function randInt(min, max, excludeZero = false) {
	let result;
	do {
		result = Math.floor(Math.random() * (max - min + 1)) + min;
	} while (excludeZero && result === 0);
	return result;
}

export function randArrayElement(array) {
	return array[randInt(0,array.length - 1)];
}

export function generateMonome(settings = {}) {
	settings = {
		maxScalar: 10,
		variable: 'x',
		scalar: undefined,
		power: randInt(settings.allowNoVariable === undefined ? true : settings.allowNoVariable ? 0 : 1, settings.maxPower || 5),
		excludeNegative: false,
		...settings
	};
	const {maxScalar, variable, power, excludeNegative} = settings;
	let {scalar} = settings;
	if (scalar === undefined) {
		if (excludeNegative)
			scalar = randInt(1, maxScalar);
		else
			scalar = randInt(-maxScalar, maxScalar, true);
	}
	if (power === 0)
		return `${scalar}`;
	return `${scalar === 1 ? '' : scalar === -1 ? '-' : scalar}${variable}${(power === 1 ? '' : `^{${power}}`)}`;
}

export function generateExpression(settings = {}) {
	settings = {
		variables: ['x'],
		maxTerms: 5,
		ensureRelevance: false,
		allowedRecursivity: 0,
		recursiveProbability: 0.3,
		monomeSettings: {},
		recursiveIndex: 0,
		nbTerms: randInt(2, settings.maxTerms || 5),
		power: randInt(1,2),
		...settings
	};
	const {variables, nbTerms, power, ensureRelevance, allowedRecursivity, recursiveProbability, monomeSettings, recursiveIndex} = settings;
	let used = [];
	const usedParser = /\d*([a-z])(?:\^{(\d+)})*/gm;
	const maxLength = (settings.power ? 1 : settings.maxPower || 5) * variables.length + 1;
	let result = '';
	for (let i = 0;i < nbTerms; i++) {
		let term;
		let parsed;
		do {
			if (recursiveIndex < allowedRecursivity && Math.random() < recursiveProbability)
				term = generateExpression({...settings, maxTerms: nbTerms - 1, recursiveIndex: recursiveIndex + 1});
			else {
				term = generateMonome({variable: randArrayElement(variables), ...monomeSettings});
				if (/^-?\d+$/gm.test(term))
					parsed = `scalar`;
				else {
					const matches = [...term.matchAll(usedParser)][0].slice(1);
					if (matches[1] === undefined)
						matches[1] = 1;
					parsed = `${matches[0]}^${matches[1]}`;
				}
			}
		} while (used.length < maxLength && ensureRelevance && used.includes(parsed));
		if (used.length < maxLength)
			used.push(parsed);

		if (i > 0 && term[0] !== '-')
			result += '+';
		result += term;
	}
	return `(${result})${power === 1 ? '' : `^{${power}}`}`;
}

export function generateFactorized({variables, monomeSettings, factorSettings} = {}) {
	if (variables === undefined)
		variables = ['x'];
	const expr = generateExpression({variables, nbTerms: 2, power: 1, ensureRelevance: true, monomeSettings});
	let factor;
	do {
		factor = generateMonome({variable: randArrayElement(variables), ...(factorSettings || monomeSettings || {})});
	} while (factor === '1')
	return `${factor}${expr}`;
}

export function generateDoubleFactorized({variables, monomeSettings} = {}) {
	const expr1 = generateExpression({variables, nbTerms: 2, power: 1, ensureRelevance: true, monomeSettings});
	const expr2 = generateExpression({variables, nbTerms: 2, power: 1, ensureRelevance: true, monomeSettings});
	return `${expr1}${expr2}`;
}

export function generateMultipleFactorized({variables, maxTerms, maxExpressions, nbExpressions, monomeSettings} = {}) {
	if (maxExpressions === undefined)
		maxExpressions = 4;
	if (nbExpressions === undefined)
		nbExpressions = randInt(2, maxExpressions);
	let expressions = [];
	for (let i = 0;i < nbExpressions;i++) {
		expressions.push(generateExpression({variables, maxTerms: maxTerms || 5, power: 1, ensureRelevance: true, monomeSettings}));
	}
	return expressions.join('');
}

export function generateLongFactorized({variables, maxTerms, monomeSettings} = {}) {
	return generateMultipleFactorized({variables, maxTerms, nbExpressions: 2, monomeSettings});
}

export function generateBinomialSquare({variables, type, monomeSettings} = {}) {
	if (type === undefined)
		type = randInt(0,2);

	let expression = generateExpression({variables,
		nbTerms: 2, power: 1,
		ensureRelevance: true,
		monomeSettings: {...monomeSettings, excludeNegative: true}
	});
	if (type === 0)
		return `${expression}^2`;
	if (type === 1)
		return `${expression.replace(/\+/, '-')}^2`;
	return `${expression}${expression.replace(/\+/, '-')}`;
}

export function generateSquareFactorized({variables, monomeSettings} = {}) {
	const expr1 = generateExpression({variables, power: 2, ensureRelevance: true, monomeSettings});
	const expr2 = generateExpression({variables, power: 1, ensureRelevance: true, monomeSettings});
	return `${expr1}${expr2}`;
}

export function generateFormula(settings = {}) {
	settings = {
		variables: ['x'],
		allowedTerms: Object.keys(TERM_TYPES),
		minTerms: 1,
		maxTerms: 3,
		expressionSettings: {},
		nbTerms: randInt(settings.minTerms || 1, settings.maxTerms || 3),
		monomeSettings: {},
		preventRedundancy: true,
		...settings
	};
	const {variables, allowedTerms, nbTerms, monomeSettings, preventRedundancy, expressionSettings} = settings;
	let terms = [];
	for (let i = 0; i < nbTerms; i++) {
		let term;
		do {
			term = randArrayElement(allowedTerms);
		} while (preventRedundancy && terms.length < allowedTerms.length && terms.includes(term));
		terms.push(term);
	}
	let result = '';
	for (const term of terms) {
		const add = term === 'expression' ? expressionSettings : {};
		if (term === 'expression' && nbTerms === 1) {
			add.ensureRelevance = false;
			add.maxTerms = 6;
		}
		result += `${TERM_TYPES[term]({variables, monomeSettings, ...add})} + `;
	}
	return result.slice(0,-3);
}

export const DIFFICULTIES = {
	EASY: {
		variables: ['x'],
		allowedTerms: ['expression', 'simple_factorized', 'double_factorized', 'binomial_square'],
		nbTerms: 1,
		monomeSettings: {
			maxScalar: 5,
			maxPower: 2,
		},
		expressionSettings: {
			maxTerms: 2,
			power: 1
		}
	},
	MEDIUM: {
		variables: ['x', 'y'],
		allowedTerms: ['expression', 'simple_factorized', 'double_factorized', 'binomial_square'],
		maxTerms: 3,
		minTerms: 2,
		monomeSettings: {
			maxScalar: 7,
			maxPower: 3,
		},
		expressionSettings: {
			maxTerms: 3
		}
	},
	HARD: {
		variables: ['x', 'y', 'z'],
		allowedTerms: ['expression', 'simple_factorized', 'double_factorized', 'binomial_square', 'long_factorized'],
		maxTerms: 4,
		minTerms: 3,
		monomeSettings: {
			maxScalar: 50,
			maxPower: 3,
		},
		expressionSettings: {
			maxTerms: 4
		}
	},
	INSANE: {
		variables: ['x', 'y', 'z'],
		maxTerms: 5,
		minTerms: 3,
		monomeSettings: {
			maxScalar: 100,
			maxPower: 4,
		},
		expressionSettings: {
			maxTerms: 5,
			allowedRecursivity: 1,
			recursiveProbability: 0.4
		}
	}
};