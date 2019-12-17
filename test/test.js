import math from "../main.js";

var assert = require("assert");

it("One should be equal to one.", () => {
	assert.equal(true, 1 === 1);
});

it("Parsing binary addition.", () => {
	var expression = math.fromTex("1 + 3");
	var n1 = new math.SymbolNode("1");
	var n3 = new math.SymbolNode("3");
	var expected = new math.OperatorNode("+", "sum", [n1, n3]);
	assert.deepEqual(expected, expression);
});

it("Parsing infix operators.", () => {
	var expression = math.fromTex("3 + 4 * 2 / (( 1 - 5 ) ^ 2) ^ 3");
	var n1 = new math.SymbolNode("1");
	var n2 = new math.SymbolNode("2");
	var n22 = new math.SymbolNode("2");
	var n3 = new math.SymbolNode("3");
	var n32 = new math.SymbolNode("3");
	var n4 = new math.SymbolNode("4");
	var n5 = new math.SymbolNode("5");
	var minus = new math.OperatorNode("-", "subtract", [n1, n5]);
	var expTwo = new math.OperatorNode("^", "pow", [minus, n22]);
	var expThree = new math.OperatorNode("^", "pow", [expTwo, n32]);
	var mult = new math.OperatorNode("*", "multiply", [n4, n2]);
	var divides = new math.OperatorNode("/", "divide", [mult, expThree]);
	var plus = new math.OperatorNode("+", "sum", [n3, divides]);
	assert.deepEqual(plus, expression);
})