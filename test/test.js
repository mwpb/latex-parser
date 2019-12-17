import math from "../main.js";

var assert = require("assert");

it("One should be equal to one.", () => {
	assert.equal(true, 1 === 1);
});

it("Parsing binary addition.", () => {
	var expression = math.fromTex("1 + 3");
	var n1 = new math.SymbolNode("1");
	var n3 = new math.SymbolNode("3");
	var expected = new math.OperatorNode("+", "operator", [n1, n3]);
	assert.deepEqual(expected, expression);
});