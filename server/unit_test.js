var assert = require("assert");
var Expression = require("./expression");
var Calculator = require("./calculator");
var Converter = require("./converter");

before(function(done){
	console.log("Before");
	exp = new Expression("");
	calc = new Calculator(exp);
	conv = new Converter(exp);
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
			exp.execute("1 + 2");
			assert.equal(exp.answer, 1 + 2);
		});
		it('1+ 2', function() {
			exp.execute("1+ 2");
			assert.equal(exp.answer, 1 + 2);
		});
		it('1 +2', function() {
			exp.execute("1 +2");
			assert.equal(exp.answer, 1 + 2);
		});
		it('-1+2', function() {
			exp.execute("-1+2");
			assert.equal(exp.answer, -1 + 2);
		});
		it('1+-2', function() {
			exp.execute("1+-2");
			assert.equal(exp.answer, 1 + -2);
		});
		it('1.5 - .2', function() {
			exp.execute("1.5 - .2");
			assert.equal(exp.answer, 1.5 - .2);
		});
		it('1.5- .2', function() {
			exp.execute("1.5- .2");
			assert.equal(exp.answer, 1.5 - .2);
		});
		it('1.5 -.2', function() {
			exp.execute("1.5 -.2");
			assert.equal(exp.answer, 1.5 - .2);
		});
		it('-1.5-.2', function() {
			exp.execute("-1.5-.2");
			assert.equal(exp.answer, -1.5 - .2);
		});
		it('1.5--.2', function() {
			exp.execute("1.5--.2");
			assert.equal(exp.answer, 1.5 - -.2);
		});
		it('10.3 * 5', function() {
			exp.execute("10.3 * 5");
			assert.equal(exp.answer, 10.3 * 5);
		});
		it('10.3* 5', function() {
			exp.execute("10.3* 5");
			assert.equal(exp.answer, 10.3 * 5);
		});
		it('10.3 *5', function() {
			exp.execute("10.3 *5");
			assert.equal(exp.answer, 10.3 * 5);
		});
		it('-10.3*5', function() {
			exp.execute("-10.3*5");
			assert.equal(exp.answer, -10.3 * 5);
		});
		it('10.3*-5', function() {
			exp.execute("10.3*-5");
			assert.equal(exp.answer, 10.3 * -5);
		});
		it('35 / 5', function() {
			exp.execute("35 / 5");
			assert.equal(exp.answer, 35 / 5);
		});
		it('35/ 5', function() {
			exp.execute("35/ 5");
			assert.equal(exp.answer, 35 / 5);
		});
		it('35 /5', function() {
			exp.execute("35 / 5");
			assert.equal(exp.answer, 35 / 5);
		});
		it('-35/5', function() {
			exp.execute("-35/5");
			assert.equal(exp.answer, -35 / 5);
		});
		it('35/-5', function() {
			exp.execute("35/-5");
			assert.equal(exp.answer, 35 / -5);
		});

		it('2 +7 *5', function() {
			exp.execute("2 +7 *5");
			assert.equal(exp.answer, 2 + 7 * 5);
		});
		it('2 * 7+5', function() {
			exp.execute("2 * 7+5");
			assert.equal(exp.answer, 2 * 7 + 5);
		});
		it('2 -7 /5', function() {
			exp.execute("2 -7 /5");
			assert.equal(exp.answer, 2 - 7 / 5);
		});
		it('2 / 7-5', function() {
			exp.execute("2 / 7-5");
			assert.equal(exp.answer, 2 / 7 - 5);
		});
		it('(1-3)*5', function() {
			exp.execute("(1-3)*5");
			assert.equal(exp.answer, (1 - 3) * 5);
		});
		it('(1*3)-5', function() {
			exp.execute("(1*3)-5");
			assert.equal(exp.answer, (1 * 3) - 5);
		});
		it('1+3-2+4', function() {
			exp.execute("1+3-2+4");
			assert.equal(exp.answer, 1 + 3 - 2 + 4);
		});
		it('1*3/2*4', function() {
			exp.execute("1*3/2*4");
			assert.equal(exp.answer, 1 * 3 / 2 * 4);
		});
		it('(1+3)*(2-4)/(3+2)', function() {
			exp.execute("(1+3)*(2-4)/(3+2)");
			assert.equal(exp.answer, (1 + 3)*(2 - 4)/(3 + 2));
		});

		it('6*(((2*(1+3))/4)+5)', function() {
			exp.execute("6*(((2*(1+3))/4)+5)");
			assert.equal(exp.answer, 6 * (((2 * (1 + 3)) / 4) + 5));
		});
		it('6*(((2*(-1+3))/4)+5)', function() {
			exp.execute("6*(((2*(-1+3))/4)+5)");
			assert.equal(exp.answer, 6 * (((2 * (-1 + 3)) / 4) + 5));
		});
		it('6*(((2*(-1+3))/4)+5)', function() {
			exp.execute("6*(((2*(-1+3))/4)+5)");
			assert.equal(exp.answer, 6 * (((2 * (-1 + 3)) / 4) + 5));
		});
		it('6*(((2*(1+-3))/4)+5)', function() {
			exp.execute("6*(((2*(1+-3))/4)+5)");
			assert.equal(exp.answer, 6 * (((2 * (1 + -3)) / 4) + 5));
		});
		it('6*(((2*(1+3))/-4)+5)', function() {
			exp.execute("6*(((2*(1+3))/-4)+5)");
			assert.equal(exp.answer, 6 * (((2 * (1 + 3)) / -4) + 5));
		});
		it('6*(((-2*(1+3))/4)+5)', function() {
			exp.execute("6*(((-2*(1+3))/4)+5)");
			assert.equal(exp.answer, 6 * (((-2 * (1 + 3)) / 4) + 5));
		});
		it('6*(((2*(1+3))/4)+-5)', function() {
			exp.execute("6*(((2*(1+3))/4)+-5)");
			assert.equal(exp.answer, 6 * (((2 * (1 + 3)) / 4) + -5));
		});
		it('-6*(((2*(1+3))/4)+5)', function() {
			exp.execute("-6*(((2*(1+3))/4)+5)");
			assert.equal(exp.answer, -6 * (((2 * (1 + 3)) / 4) + 5));
		});
		it('6*(((2*(1+3))/4)-5)', function() {
			exp.execute("6*(((2*(1+3))/4)-5)");
			assert.equal(exp.answer, 6 * (((2 * (1 + 3)) / 4) - 5));
		});
		it('ABS(-19)', function() {
			exp.execute("ABS(-19)");
			assert.equal(exp.answer, Math.abs(-19));
		});
		it('sQrT(46)', function() {
			exp.execute("sQrT(46)");
			assert.equal(exp.answer, Math.sqrt(46) );
		});
		it('SIN (1.5)', function() {
			exp.execute("SIN (1.5)");
			assert.equal(exp.answer, Math.sin(1.5) );
		});
		it('cOs ( PI/3) ', function() {
			exp.execute("cOs ( PI/3) ");
			assert.equal(exp.answer, Math.cos(Math.PI / 3) );
		});
		it('tan (2)', function() {
			exp.execute("tan (2)");
			assert.equal(exp.answer, Math.tan(2) );
		});
		it('LN(5.7)', function() {
			exp.execute("LN(5.7)");
			assert.equal(exp.answer, Math.log(5.7));
		});
		it('LOg ( 5 *3.2)', function() {
			exp.execute("LOg ( 5 *3.2)");
			assert.equal(exp.answer,Math.log(5 * 3.2) / Math.log(10) );
		});
		it('-LoG ( 5 *3.2)', function() {
			exp.execute("-LOg ( 5 *3.2)");
			assert.equal(exp.answer,Math.log(5 * 3.2) / Math.log(10) * -1 );
		});
		it('Nabeatsu (9)', function() {
			exp.execute("Nabeatsu (9)");
			assert.equal(exp.answer, Infinity);
		});
		it('NabeaTsu (123)', function() {
			exp.execute("NabeaTsu (123)");
			assert.equal(exp.answer, Infinity);
		});
		it('194 %9', function() {
			exp.execute("194 %9");
			assert.equal(exp.answer, 194 % 9);
		});
		it('4.6^9.1', function() {
			exp.execute("4.6^9.1");
			assert.equal(exp.answer, Math.pow(4.6, 9.1));
		});
		it('-6*(cos((2*sin(1+3))/4)+5)', function() {
			exp.execute("-6*(cos((2*sin(1+3))/4)+5)");
			assert.equal(exp.answer, -6*(Math.cos((2*Math.sin(1+3))/4)+5));
		});
		it('-6*(tan((2*ln(1+3))/4)+5)', function() {
			exp.execute("-6*(tan((2*ln(1+3))/4)+5)");
			assert.equal(exp.answer, -6*(Math.tan((2*Math.log(1+3))/4)+5));
		});
		it('-6*(((2*(1+3))/4)+5)^2', function() {
			exp.execute("-6*(((2*(1+3))/4)+5)^2");
			assert.equal(exp.answer, -6 * Math.pow((((2*(1+3))/4)+5), 2));
		});
		it('-1+2', function() {
			exp.execute("-1+2");
			assert.equal(exp.answer, -1+2);
		});
		it('1+-2', function() {
			exp.execute("1+-2");
			assert.equal(exp.answer, 1+-2);
		});
		it('-1*2', function() {
			exp.execute("-1*2");
			assert.equal(exp.answer, -1*2);
		});
		it('1*-2', function() {
			exp.execute("1*-2");
			assert.equal(exp.answer, 1*-2);
		});
		it('-sin(pi/2)', function() {
			exp.execute("-sin(pi/2)");
			assert.equal(exp.answer, -Math.sin(Math.PI/2));
		});
		it('-sin(pi/2)*-5', function() {
			exp.execute("-sin(pi/2)*-5");
			assert.equal(exp.answer, -Math.sin(Math.PI/2)*-5);
		});
		it('-5/-sin(pi/2)', function() {
			exp.execute("-5/-sin(pi/2)");
			assert.equal(exp.answer, -5/-Math.sin(Math.PI/2));
		});
		it('(-1+3)*4', function() {
			exp.execute("(-1+3)*4");
			assert.equal(exp.answer, (-1+3)*4);
		});
		it('-(1+3)*4', function() {
			exp.execute("-(1+3)*4");
			assert.equal(exp.answer, -(1+3)*4);
		});
});
