var assert = require("assert");
var Expression = require("./expression");
var Calculator = require("./calculator");
var Converter = require("./converter");

before(function(done){
	console.log("Before");
	exp = new Expression.Expression("");
	calc = new Calculator(exp);
	conv = new Converter(exp);
	done();
});

beforeEach(function(done){
	exp.infix_string_string = "";
	exp.postfix_string = "";
	exp.infix_elements = [];
	exp.postfix_elements = [];
	done();
});

describe('Calculator', function() {
	describe('calculate', function() {
		it('1 2 +', function() {
			exp.postfix_elements = ['1', '2', '+'];
			assert.equal(calc.calculate(), 1 + 2);
		});
		it('1.5 .2 -', function() {
			exp.postfix_elements = ['1.5', '.2', '-'];
			assert.equal(calc.calculate(), 1.5 - 0.2);
		});
		it('10.3 5 *', function() {
			exp.postfix_elements = ['10.3', '5', '*'];
			assert.equal(calc.calculate(), 10.3 * 5);
		});
		it('35 5 /', function() {
			exp.postfix_elements = ['35', '5', '/'];
			assert.equal(calc.calculate(), 35 / 5);
		});

		it('2 7 + 5 *', function() {
			exp.postfix_elements = ['2', '7', '+', '5', '*'];
			assert.equal(calc.calculate(), (2 + 7) * 5);
		});
		it('2 7 * 5 +', function() {
			exp.postfix_elements = ['2', '7', '*', '5', '+'];
			assert.equal(calc.calculate(), 2 * 7 + 5);
		});
		it('2 7 + 5 /', function() {
			exp.postfix_elements = ['2', '7', '+', '5', '/'];
			assert.equal(calc.calculate(), (2 + 7) / 5);
		});
		it('2 7 / 5 +', function() {
			exp.postfix_elements = ['2', '7', '/', '5', '+'];
			assert.equal(calc.calculate(), 2 / 7 + 5);
		});

		it('18.3 -9.8 +', function() {
			exp.postfix_elements = ['18.3', '-9.8', '+'];
			assert.equal(calc.calculate(), 18.3 - 9.8);
		});
		it('-18.3 9.8 +', function() {
			exp.postfix_elements = ['-18.3', '9.8', '+'];
			assert.equal(calc.calculate(), -18.3 + 9.8);
		});
		it('18.3 -9.8 *', function() {
			exp.postfix_elements = ['-18.3', '9.8', '*'];
			assert.equal(calc.calculate(), 18.3 * -9.8);
		});
	});
});

describe('Converter', function() {
	describe('convert', function() {
		it('1 + 2', function() {
			exp.infix_elements = ['1', '+', '2'];
			conv.convert();
			assert.deepEqual(conv.postfix_elements, ['1', '2', '+']);
		});
		it('1.5 - .2', function() {
			exp.infix_elements = ['1.5', '-', '.2'];
			conv.convert();
			assert.deepEqual(conv.postfix_elements, ['1.5', '.2', '-']);
		});
		it('10.3 * 5', function() {
			exp.infix_elements = ['10.3', '*', '5'];
			conv.convert();
			assert.deepEqual(conv.postfix_elements, ['10.3', '5', '*']);
		});
		it('35 / 5', function() {
			exp.infix_elements = ['35', '/', '5'];
			conv.convert();
			assert.deepEqual(conv.postfix_elements, ['35', '5', '/']);
		});

		it('2 + 7 * 5 ', function() {
			exp.infix_elements = ['2', '+', '7', '*', '5'];
			conv.convert();
			assert.deepEqual(conv.postfix_elements, ['2', '7', '5', '*', '+']);
		});
		it('2 * 7 + 5 ', function() {
			exp.infix_elements = ['2', '*', '7', '+', '5'];
			conv.convert();
			assert.deepEqual(conv.postfix_elements, ['2', '7', '*', '5', '+']);
		});
		it('2 - 7 / 5 ', function() {
			exp.infix_elements = ['2', '-', '7', '/', '5'];
			conv.convert();
			assert.deepEqual(conv.postfix_elements, ['2', '7', '5', '/', '-']);
		});
		it('2 / 7 - 5 ', function() {
			exp.infix_elements = ['2', '/', '7', '-', '5'];
			conv.convert();
			assert.deepEqual(conv.postfix_elements, ['2', '7', '/', '5', '-']);
		});

		it('(1 - 3) * 5', function() {
			exp.infix_elements = ['(', '1', '-', '3', ')', '*', '5'];
			conv.convert();
			assert.deepEqual(conv.postfix_elements, ['1', '3', '-', '5', '*']);
		});

		it('(1 * 3) - 5', function() {
			exp.infix_elements = ['(', '1', '*', '3', ')', '-', '5'];
			conv.convert();
			assert.deepEqual(conv.postfix_elements, ['1', '3', '*', '5', '-']);
		});

		it('1 + 3 - 2 + 4', function() {
			exp.infix_elements = ['1', '+', '3', '-', '2', '+', '4'];
			conv.convert();
			assert.deepEqual(conv.postfix_elements, ['1', '3', '+', '2', '-', '4', '+']);
		});
		it('1 * 3 / 2 * 4', function() {
			exp.infix_elements = ['1', '*', '3', '/', '2', '*', '4'];
			conv.convert();
			assert.deepEqual(conv.postfix_elements, ['1', '3', '*', '2', '/', '4', '*']);
		});
		it('(1 + 3) * (2 - 4) / (3 + 2)', function() {
			exp.infix_elements = ['(', '1', '+', '3', ')', '*', '(', '2', '-', '4', ')', '/', '(', '3', '+', '2', ')'];
			conv.convert();
			assert.deepEqual(conv.postfix_elements, ['1', '3', '+', '2', '4', '-', '*', '3', '2', '+', '/']);
		});
		it('6 * (((2 * (1 + 3)) / 4) + 5)', function() {
			exp.infix_elements = ['6', '*', '(', '(', '(', '2', '*', '(', '1', '+', '3', ')', ')', '/', '4', ')', '+', '5', ')'];
			conv.convert();
			assert.deepEqual(conv.postfix_elements, ['6', '2', '1', '3', '+', '*', '4', '/', '5', '+', '*']);
		});
	});
});

describe('Convert + Calculate', function() {
		it('1 + 2', function() {
			exp.infix_string = "1 + 2";
			assert.equal(exp.execute(), 1 + 2);
		});
		it('1+ 2', function() {
			exp.infix_string = "1+ 2";
			assert.equal(exp.execute(), 1 + 2);
		});
		it('1 +2', function() {
			exp.infix_string = "1 +2";
			assert.equal(exp.execute(), 1 + 2);
		});
		it('-1+2', function() {
			exp.infix_string = "-1+2";
			assert.equal(exp.execute(), -1 + 2);
		});
		it('1+-2', function() {
			exp.infix_string = "1+-2";
			assert.equal(exp.execute(), 1 + -2);
		});
		it('1.5 - .2', function() {
			exp.infix_string = "1.5 - .2";
			assert.equal(exp.execute(), 1.5 - .2);
		});
		it('1.5- .2', function() {
			exp.infix_string = "1.5- .2";
			assert.equal(exp.execute(), 1.5 - .2);
		});
		it('1.5 -.2', function() {
			exp.infix_string = "1.5 -.2";
			assert.equal(exp.execute(), 1.5 - .2);
		});
		it('-1.5-.2', function() {
			exp.infix_string = "-1.5-.2";
			assert.equal(exp.execute(), -1.5 - .2);
		});
		it('1.5--.2', function() {
			exp.infix_string = "1.5--.2";
			assert.equal(exp.execute(), 1.5 - -.2);
		});
		it('10.3 * 5', function() {
			exp.infix_string = "10.3 * 5";
			assert.equal(exp.execute(), 10.3 * 5);
		});
		it('10.3* 5', function() {
			exp.infix_string = "10.3* 5";
			assert.equal(exp.execute(), 10.3 * 5);
		});
		it('10.3 *5', function() {
			exp.infix_string = "10.3 *5";
			assert.equal(exp.execute(), 10.3 * 5);
		});
		it('-10.3*5', function() {
			exp.infix_string = "-10.3*5";
			assert.equal(exp.execute(), -10.3 * 5);
		});
		it('10.3*-5', function() {
			exp.infix_string = "10.3*-5";
			assert.equal(exp.execute(), 10.3 * -5);
		});
		it('35 / 5', function() {
			exp.infix_string = "35 / 5";
			assert.equal(exp.execute(), 35 / 5);
		});
		it('35/ 5', function() {
			exp.infix_string = "35/ 5";
			assert.equal(exp.execute(), 35 / 5);
		});
		it('35 /5', function() {
			exp.infix_string = "35 / 5";
			assert.equal(exp.execute(), 35 / 5);
		});
		it('-35/5', function() {
			exp.infix_string = "-35/5";
			assert.equal(exp.execute(), -35 / 5);
		});
		it('35/-5', function() {
			exp.infix_string = "35/-5";
			assert.equal(exp.execute(), 35 / -5);
		});

		it('2 +7 *5', function() {
			exp.infix_string = "2 +7 *5";
			assert.equal(exp.execute(), 2 + 7 * 5);
		});
		it('2 * 7+5', function() {
			exp.infix_string = "2 * 7+5";
			assert.equal(exp.execute(), 2 * 7 + 5);
		});
		it('2 -7 /5', function() {
			exp.infix_string = "2 -7 /5";
			assert.equal(exp.execute(), 2 - 7 / 5);
		});
		it('2 / 7-5', function() {
			exp.infix_string = "2 / 7-5";
			assert.equal(exp.execute(), 2 / 7 - 5);
		});
		it('(1-3)*5', function() {
			exp.infix_string = "(1-3)*5";
			assert.equal(exp.execute(), (1 - 3) * 5);
		});
		it('(1*3)-5', function() {
			exp.infix_string = "(1*3)-5";
			assert.equal(exp.execute(), (1 * 3) - 5);
		});
		it('1+3-2+4', function() {
			exp.infix_string = "1+3-2+4";
			assert.equal(exp.execute(), 1 + 3 - 2 + 4);
		});
		it('1*3/2*4', function() {
			exp.infix_string = "1*3/2*4";
			assert.equal(exp.execute(), 1 * 3 / 2 * 4);
		});
		it('(1+3)*(2-4)/(3+2)', function() {
			exp.infix_string = "(1+3)*(2-4)/(3+2)";
			assert.equal(exp.execute(), (1 + 3)*(2 - 4)/(3 + 2));
		});

		it('6*(((2*(1+3))/4)+5)', function() {
			exp.infix_string = "6*(((2*(1+3))/4)+5)";
			assert.equal(exp.execute(), 6 * (((2 * (1 + 3)) / 4) + 5));
		});
		it('6*(((2*(-1+3))/4)+5)', function() {
			exp.infix_string = "6*(((2*(-1+3))/4)+5)";
			assert.equal(exp.execute(), 6 * (((2 * (-1 + 3)) / 4) + 5));
		});
		it('6*(((2*(-1+3))/4)+5)', function() {
			exp.infix_string = "6*(((2*(-1+3))/4)+5)";
			assert.equal(exp.execute(), 6 * (((2 * (-1 + 3)) / 4) + 5));
		});
		it('6*(((2*(1+-3))/4)+5)', function() {
			exp.infix_string = "6*(((2*(1+-3))/4)+5)";
			assert.equal(exp.execute(), 6 * (((2 * (1 + -3)) / 4) + 5));
		});
		it('6*(((2*(1+3))/-4)+5)', function() {
			exp.infix_string = "6*(((2*(1+3))/-4)+5)";
			assert.equal(exp.execute(), 6 * (((2 * (1 + 3)) / -4) + 5));
		});
		it('6*(((-2*(1+3))/4)+5)', function() {
			exp.infix_string = "6*(((-2*(1+3))/4)+5)";
			assert.equal(exp.execute(), 6 * (((-2 * (1 + 3)) / 4) + 5));
		});
		it('6*(((2*(1+3))/4)+-5)', function() {
			exp.infix_string = "6*(((2*(1+3))/4)+-5)";
			assert.equal(exp.execute(), 6 * (((2 * (1 + 3)) / 4) + -5));
		});
		it('-6*(((2*(1+3))/4)+5)', function() {
			exp.infix_string = "-6*(((2*(1+3))/4)+5)";
			assert.equal(exp.execute(), -6 * (((2 * (1 + 3)) / 4) + 5));
		});
		it('6*(((2*(1+3))/4)-5)', function() {
			exp.infix_string = "6*(((2*(1+3))/4)-5)";
			assert.equal(exp.execute(), 6 * (((2 * (1 + 3)) / 4) - 5));
		});
});
