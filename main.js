var math = require("mathjs");

// probably would be better if these arrays were sets...
let parens = ["{", "}", "(", ")", " "];
let infixes = ["+", "-", "*", "\\frac_curry", "/", "^", "=", "_", "\\frac"];
let binaryPrefixes = ["\\frac"];
let ignoredCommands = ["\\left", "\\right", " "];
let rightAssoc = ["\\frac", "\\frac_curry", "^"];

var operatorPrecedence = {
	"^": 4,
	"*": 3,
	"/": 3,
	"+": 2,
	"-": 2,
	"(": 0,
	")": 0
}

var symbol2Normal = (s) => {
	if (s === "\\frac" || s === "\\frac_curry") {
		return "/";
	} else {
		return s;
	}
}

var symbol2Function = {
	"^": "pow",
	"*": "multiply",
	"/": "divide",
	"+": "sum",
	"-": "subtract",
	"\\frac": "divide",
	"\\frac_curry": "divide"
}

var tokenise = (s) => {
	let tokens = [];
	let token = "";
	let inCommand = false;
	var checkThenPush = (token) => {
		if (token.length > 0 && !ignoredCommands.includes(token)) {
			tokens.push(token);
		}
	}
	for (let i = 0; i < s.length; i++) {
		let c = s.charAt(i);
		if (parens.includes(c) || infixes.includes(c)) {
			inCommand = false;
			checkThenPush(token);
			checkThenPush(c);
			token = "";
		} else if (c == "\\") {
			checkThenPush(token);
			inCommand = true;
			token = "\\";
		} else if (inCommand) {
			token += c;
		} else {
			tokens.push(c);
		}
	}
	checkThenPush(token);
	return tokens;
}

var isOperand = (token) => {
	if (token.startsWith("\\") || parens.includes(token) || infixes.includes(token)) {
		return false;
	}
	return true;
}

var shuntingYard = (tokens) => {

	var outputOperand = (operand) => {
		output.push(new math.SymbolNode(operand));
	}

	var outputOperator = (operator) => {
		// console.log(output);
		let second = output.pop();
		let first = output.pop();
		let op = new math.OperatorNode(symbol2Normal(operator), symbol2Function[operator], [first, second]);
		output.push(op);
	}

	let output = [];
	let operators = [];
	while (tokens.length > 0) {
		let token = tokens.pop();
		// console.log(`${token} || ${output} || ${operators}`);
		if (isOperand(token)) {
			outputOperand(token);
		} else if (infixes.includes(token)) {
			while (operators.length > 0 &&
				(
					(binaryPrefixes.includes(operators[operators.length - 1])) ||
					(operatorPrecedence[operators[operators.length - 1]] > operatorPrecedence[token]) ||
					(
						(operatorPrecedence[operators[operators.length - 1]] == operatorPrecedence[token]) && 
						(!rightAssoc.includes(operators[operators.length - 1])))
				)) {
				var operator = operators.pop();
				if (binaryPrefixes.includes(operator)) {
					operators.push(operator+"_curry");
				} else {
					outputOperator(operator);
				}
			}
			operators.push(token);
		} else if (token == "(") {
			operators.push(token);
		} else if (token == ")") {
			while ( operators.length > 0 && operators[operators.length - 1] != "(") {
				outputOperator(operators.pop());
			}
			if (operators[operators.length - 1] = "(") {
				operators.pop();
			}
		}
	}
	while ( operators.length > 0 ) {
		outputOperator(operators.pop());
	}
	return output;
}


// console.log(tokenise("\\frac{1}{xy^3+\\frac{2}{4}}"));
// console.log(tokenise("x=\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}"));
// console.log(tokenise("5\\cdot\\left(3+4\\right)"));
// console.log(tokenise("5\\cdot6"));
// console.log(tokenise("5\\cdot 6"));

// console.log(tokenise("3 + 4 * 2 / ( 1 − 5 ) ^ 2 ^ 3"));
// let expression = shuntingYard(tokenise("3 + 4 * 2 / ( 1 - 5 ) ^ 2 ^ 3").reverse());

// let expression = tex2mathjs("3 + 4 * 2 / ( 1 - 5 ) ^ 2 ^ 3");
// console.log(expression[0].toTex());

math.fromTex = (s) => {
	return shuntingYard(tokenise(s).reverse())[0];
}

export default math;