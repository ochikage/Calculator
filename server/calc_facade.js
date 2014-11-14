var Expression = require("./expression.js");
var Calculator = require("./calculator");
var Converter = require("./converter");

var CalcFacade = function() {
	this.expression = new Expression();
	this.converter = new Converter(this.expression);
	this.calculator = new Calculator(this.expression);
}

CalcFacade.prototype = {

	execute: function(expression_string){
		this.expression.infix_string = expression_string;
		this.converter.execute();
		this.calculator.execute();
		
		return (this.expression.error == "") ? this.expression.answer : this.expression.error;
	},

	calculate: function(expression_string){
		this.expression.postfix_string = expression_string;
		this.calculator.execute();
		return (this.expression.error == "") ? this.expression.answer : this.expression.error;
	},

	get_infix_expression: function() {
		return this.expression.get_infix_expression();	
	},

	get_formatted_infix_expression: function() {
		return this.expression.get_formatted_infix_expression();
	},

	get_postfix_expression: function() {
		return this.expression.get_postfix_expression();
	},

	get_support_operations: function() {
		return this.expression.get_support_operations();
	}
}

exports = module.exports = CalcFacade;
