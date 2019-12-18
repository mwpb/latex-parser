import math from "../main.js";

var assert = require("assert");

it("One should be equal to one.", () => {
	assert.equal(true, 1 === 1);
});

it("Parsing binary addition.", () => {
	var expression = math.fromTex("1 + 3");
	var n1 = new math.ConstantNode(1);
	var n3 = new math.ConstantNode("3");
	var expected = new math.OperatorNode("+", "sum", [n1, n3]);
	assert.deepEqual(expected, expression);
});

it("Parsing nested infixes.", () => {
	var expression = math.fromTex("3 + 4 * 2 / (( 1 - 5 ) ^ 2) ^ 3");
	var n1 = new math.ConstantNode("1");
	var n2 = new math.ConstantNode("2");
	var n22 = new math.ConstantNode("2");
	var n3 = new math.ConstantNode("3");
	var n32 = new math.ConstantNode("3");
	var n4 = new math.ConstantNode("4");
	var n5 = new math.ConstantNode("5");
	var minus = new math.OperatorNode("-", "subtract", [n1, n5]);
	var expTwo = new math.OperatorNode("^", "pow", [minus, n22]);
	var expThree = new math.OperatorNode("^", "pow", [expTwo, n32]);
	var mult = new math.OperatorNode("*", "multiply", [n4, n2]);
	var divides = new math.OperatorNode("/", "divide", [mult, expThree]);
	var plus = new math.OperatorNode("+", "sum", [n3, divides]);
	assert.deepEqual(plus, expression);
})

it("Multiply before plus.", () => {
	var expression = math.fromTex("x * y + z");
	var x = new math.SymbolNode("x");
	var y = new math.SymbolNode("y");
	var z = new math.SymbolNode("z");
	var mult = new math.OperatorNode("*", "multiply", [x, y]);
	var expected = new math.OperatorNode("+", "sum", [mult, z]);
	assert.deepEqual(expected, expression);
});

it("Plus before multiply.", () => {
	var expression = math.fromTex("x + y * z");
	var x = new math.SymbolNode("x");
	var y = new math.SymbolNode("y");
	var z = new math.SymbolNode("z");
	var mult = new math.OperatorNode("*", "multiply", [y, z]);
	var expected = new math.OperatorNode("+", "sum", [x, mult]);
	assert.deepEqual(expected, expression);
});

it("Simple \\frac.", () => {
	var expression = math.fromTex("\\frac{1}{2}");
	var n1 = new math.ConstantNode("1");
	var n2 = new math.ConstantNode("2");
	var expected = new math.OperatorNode("/", "divide", [n1, n2]);
	assert.deepEqual(expected, expression);
	// console.log(JSON.stringify(expected, null, 2));
	// console.log(JSON.stringify(expression, null, 2));
});

it("Nested \\frac.", () => {
	var expression = math.fromTex("\\frac{1}{\\frac{1}{x}}");
	var n11 = new math.ConstantNode("1");
	var n12 = new math.ConstantNode("1");
	var x = new math.SymbolNode("x");
	var fracInner = new math.OperatorNode("/", "divide", [n11, x]);
	var expected = new math.OperatorNode("/", "divide", [n12, fracInner]);
	assert.deepEqual(expected, expression);
});

it("Simple unary minus.", () => {
	var expression = math.fromTex("-1");
	var n1 = new math.ConstantNode("1");
	var expected = new math.OperatorNode("-", "unary_minus", [n1]);
	assert.deepEqual(expected, expression);
});

it("Simple unary plus.", () => {
	var expression = math.fromTex("+1");
	var expected = new math.ConstantNode("1");
	assert.deepEqual(expected, expression);
});

it("Unary minus.", () => {
	var expression = math.fromTex("1+-1");
	var n11 = new math.ConstantNode("1");
	var n12 = new math.ConstantNode("1");
	var minus = new math.OperatorNode("-", "unary_minus", [n11]);
	var expected = new math.OperatorNode("+", "sum", [n12, minus]);
	assert.deepEqual(expected, expression);
});

it("Unary plus.", () => {
	var expression = math.fromTex("1++1");
	var n11 = new math.ConstantNode("1");
	var n12 = new math.ConstantNode("1");
	var expected = new math.OperatorNode("+", "sum", [n11, n12]);
	assert.deepEqual(expected, expression);
});

it("Simple integer greater than 10.", () => {
	var expression = math.fromTex("109");
	var expected = new math.ConstantNode("109");
	assert.deepEqual(expected, expression);
});