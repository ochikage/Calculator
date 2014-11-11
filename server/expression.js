var Calculator = require("./calculator");
var Converter = require("./converter");

var Expression = function() {
	this.infix_string = "";
	this.postfix_string = "";
	this.infix_elements = [];
	this.postfix_elements = [];

	this.ERROR_TYPE = {
		"SYNTAX_ERROR": "Syntax error",
		"NON_SUPPORT_OP": "Non supported operator",
	};
	this.error = "";

	this.answer;

	this.converter = new Converter(this);
	this.calculator = new Calculator(this);
}

Expression.prototype = {
	execute: function(expression_string){
		this.infix_string = expression_string;
		this.converter.execute();
		this.calculator.execute()
		
		return (this.error == "") ? this.answer : this.error;
	},
	handle_negative: function(elements) {
		for (var i = 0; i < elements.length; i++) {
			if (elements[i] == "-" && isNaN(elements[i - 1]) && elements[i - 1] != ")" && !isNaN(elements[i + 1])) {
				elements[i + 1] = "-" + elements[i + 1]
				elements.splice(i, 1);
			}
		}
	},
	calculate: function(expression_string){
		this.postfix_string = expression_string;
		return this.calculator.execute();
	},
	get_infix_expression: function() {
		return this.infix_elements.join(" ");	
	},
	get_postfix_expression: function() {
		return this.postfix_elements.join(" ");	
	},
}

exports = module.exports = Expression;
