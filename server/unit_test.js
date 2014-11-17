var assert = require("assert");
var Expression = require("./expression");
var Calculator = require("./calculator");
var Converter = require("./converter");
var CalcFacade = require("./calc_facade");

before(function(done){
	console.log("Before");
	exp = new Expression("");
	calc = new Calculator(exp);
	conv = new Converter(exp);
	cf = new CalcFacade();
	done();
});

beforeEach(function(done){
	exp.infix_string = "";
	exp.postfix_string = "";
	exp.infix_elements = [];
	exp.postfix_elements = [];
	done();
});

describe('Calculator', function() {
	describe('calculate', function() {
		it('1 2 +', function() {
			exp.postfix_elements = ['1', '2', '+'];
			calc.calculate();
			assert.equal(calc.expression.answer, 1 + 2);
		});
		it('1.5 .2 -', function() {
			exp.postfix_elements = ['1.5', '.2', '-'];
			calc.calculate();
			assert.equal(calc.expression.answer, 1.5 - 0.2);
		});
		it('10.3 5 *', function() {
			exp.postfix_elements = ['10.3', '5', '*'];
			calc.calculate();
			assert.equal(calc.expression.answer, 10.3 * 5);
		});
		it('35 5 /', function() {
			exp.postfix_elements = ['35', '5', '/'];
			calc.calculate();
			assert.equal(calc.expression.answer, 35 / 5);
		});

		it('2 7 + 5 *', function() {
			exp.postfix_elements = ['2', '7', '+', '5', '*'];
			calc.calculate();
			assert.equal(calc.expression.answer, (2 + 7) * 5);
		});
		it('2 7 * 5 +', function() {
			exp.postfix_elements = ['2', '7', '*', '5', '+'];
			calc.calculate();
			assert.equal(calc.expression.answer, 2 * 7 + 5);
		});
		it('2 7 + 5 /', function() {
			exp.postfix_elements = ['2', '7', '+', '5', '/'];
			calc.calculate();
			assert.equal(calc.expression.answer, (2 + 7) / 5);
		});
		it('2 7 / 5 +', function() {
			exp.postfix_elements = ['2', '7', '/', '5', '+'];
			calc.calculate();
			assert.equal(calc.expression.answer, 2 / 7 + 5);
		});

		it('18.3 -9.8 +', function() {
			exp.postfix_elements = ['18.3', '-9.8', '+'];
			calc.calculate();
			assert.equal(calc.expression.answer, 18.3 - 9.8);
		});
		it('-18.3 9.8 +', function() {
			exp.postfix_elements = ['-18.3', '9.8', '+'];
			calc.calculate();
			assert.equal(calc.expression.answer, -18.3 + 9.8);
		});
		it('18.3 -9.8 *', function() {
			exp.postfix_elements = ['-18.3', '9.8', '*'];
			calc.calculate();
			assert.equal(calc.expression.answer, 18.3 * -9.8);
		});
		it('PI 2 / SIN NEG 5 * NEG', function() {
			exp.postfix_elements = ['3.141592653589793', '2', '/', 'SIN', 'NEG', '5', '*', 'NEG'];
			calc.calculate();
			assert.equal(calc.expression.answer, -Math.sin(Math.PI/2)*-5);
		});
		it('1 3 + NEG 4 *', function() {
			exp.postfix_elements = ['1', '3', '+', 'NEG', '4', '*'];
			calc.calculate();
			assert.equal(calc.expression.answer, -(1+3)*4);
		});
		it('3 8 + NEG 2 ^', function() {
			exp.postfix_elements = ['3', '8', '+', 'NEG', '2', '^'];
			calc.calculate();
			assert.equal(calc.expression.answer,Math.pow(-(3+8), 2));
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

describe('CalcFacade', function() {
		it('1 + 2', function() {
			assert.equal(cf.execute("1 + 2"), 1 + 2);
		});
		it('1+ 2', function() {
			assert.equal(cf.execute("1+ 2"), 1+ 2);
		});
		it('-1+2', function() {
			assert.equal(cf.execute("-1+2"), -1+2);
		});
		it('1+-2', function() {
			assert.equal(cf.execute("1+-2"), 1+-2);
		});
		it('1.5 - .2', function() {
			assert.equal(cf.execute("1.5 - .2"), 1.5 - .2);
		});
		it('10.3 * 5', function() {
			assert.equal(cf.execute("10.3 * 5"), 10.3 * 5);
		});
		it('35 / 5', function() {
			assert.equal(cf.execute("35 / 5"), 35 / 5);
		});

		it('2 +7 *5', function() {
			assert.equal(cf.execute("2 +7 *5"), 2 +7 *5);
		});
		it('2 * 7+5', function() {
			assert.equal(cf.execute("2 * 7+5"), 2 * 7+5);
		});
		it('2 -7 /5', function() {
			assert.equal(cf.execute("2 -7 /5"), 2 -7 /5);
		});
		it('2 / 7-5', function() {
			assert.equal(cf.execute("2 / 7-5"), 2 / 7-5);
		});
		it('(1-3)*5', function() {
			assert.equal(cf.execute("(1-3)*5"), (1-3)*5);
		});
		it('(1*3)-5', function() {
			assert.equal(cf.execute("(1*3)-5"), (1*3)-5);
		});
		it('1+3-2+4', function() {
			assert.equal(cf.execute("1+3-2+4"), 1+3-2+4);
		});
		it('1*3/2*4', function() {
			assert.equal(cf.execute("1*3/2*4"), 1*3/2*4);
		});
		it('(1+3)*(2-4)/(3+2)', function() {
			assert.equal(cf.execute("(1+3)*(2-4)/(3+2)"), (1+3)*(2-4)/(3+2));
		});

		it('6*(((2*(1+3))/4)+5)', function() {
			assert.equal(cf.execute("6*(((2*(1+3))/4)+5)"), 6*(((2*(1+3))/4)+5));
		});

		it('ABS(-19)', function() {
			assert.equal(cf.execute("ABS(-19)"), Math.abs(-19));
		});
		it('sQrT(46)', function() {
			assert.equal(cf.execute("sQrT(46)"), Math.sqrt(46));
		});
		it('SIN (1.5)', function() {
			assert.equal(cf.execute("SIN (1.5)"), Math.sin(1.5));
		});
		it('cOs ( PI/3) ', function() {
			assert.equal(cf.execute("cOs ( PI/3)"), Math.cos( Math.PI/3));
		});
		it('tan (2)', function() {
			assert.equal(cf.execute("tan (2)"), Math.tan(2));
		});
		it('LN(5.7)', function() {
			assert.equal(cf.execute("LN(5.7)"), Math.log(5.7));
		});
		it('LOg ( 5 *3.2)', function() {
			assert.equal(cf.execute("LOg ( 5 *3.2)"), Math.log( 5 *3.2) / Math.log(10));
		});
		it('-LoG ( 5 *3.2)', function() {
			assert.equal(cf.execute("-LoG ( 5 *3.2)"), -Math.log( 5 *3.2) / Math.log(10));
		});
		it('Nabeatsu (9)', function() {
			assert.equal(cf.execute("Nabeatsu (9)"), Infinity);
		});
		it('NabeaTsu (123)', function() {
			assert.equal(cf.execute("NabeaTsu (123)"), Infinity);
		});
		it('194 %9', function() {
			assert.equal(cf.execute("194 %9"), 194 %9);
		});
		it('4.6^9.1', function() {
			assert.equal(cf.execute("4.6^9.1"), Math.pow(4.6, 9.1));
		});
		it('-6*(cos((2*sin(1+3))/4)+5)', function() {
			assert.equal(cf.execute("-6*(cos((2*sin(1+3))/4)+5)"), -6*(Math.cos((2*Math.sin(1+3))/4)+5));
		});
		it('-6*(tan((2*ln(1+3))/4)+5)', function() {
			assert.equal(cf.execute("-6*(tan((2*ln(1+3))/4)+5)"), -6*(Math.tan((2*Math.log(1+3))/4)+5));
		});
		it('-6*(((2*(1+3))/4)+5)^2', function() {
			assert.equal(cf.execute("-6*(((2*(1+3))/4)+5)^2"), -6*Math.pow(((2*(1+3))/4)+5, 2));
		});
		it('-sin(pi/2)', function() {
			assert.equal(cf.execute("-sin(pi/2)"), -Math.sin(Math.PI/2));
		});
		it('-sin(pi/2)*-5', function() {
			assert.equal(cf.execute("-sin(pi/2)*-5"), -Math.sin(Math.PI/2)*-5);
		});
		it('-5/-sin(pi/2)', function() {
			assert.equal(cf.execute("-5/-sin(pi/2)"), -5/-Math.sin(Math.PI/2));
		});
		it('(-1+3)*4', function() {
			assert.equal(cf.execute("(-1+3)*4"), (-1+3)*4);
		});
		it('-(1+3)*4', function() {
			assert.equal(cf.execute("-(1+3)*4"), -(1+3)*4);
		});
});

describe('Syntax error', function() {
		it('(', function() {
			assert.equal(cf.execute("("), "Syntax error");
		});
		it(')', function() {
			assert.equal(cf.execute(")"), "Syntax error");
		});
		it('1 2', function() {
			assert.equal(cf.execute("1 2"), "Syntax error");
		});
		it('3 log(10)', function() {
			assert.equal(cf.execute("3 log(10)"), "Syntax error");
		});
});

describe('Non supported operator', function() {
		it('&', function() {
			assert.equal(cf.execute("&"), "Non supported operator");
		});
		it('4 # sin(pi/4)', function() {
			assert.equal(cf.execute("4 # sin(pi/4)"), "Non supported operator");
		});
});
