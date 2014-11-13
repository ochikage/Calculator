var Operators = require("./operators.js");
var Calculator = require("./calculator");
var Converter = require("./converter");

var Expression = function() {
	this.infix_string = "";
	this.postfix_string = "";
	this.infix_elements = [];
	this.postfix_elements = [];

	this.answer;
	this.ERROR_TYPE = {
		"SYNTAX_ERROR": "Syntax error",
		"NON_SUPPORT_OP": "Non supported operator",
	};
	this.error = "";

	this.operators = new Operators();

	this.converter = new Converter(this);
	this.calculator = new Calculator(this);
}

Expression.prototype = {
	execute: function(expression_string){
		this.infix_string = expression_string;
		this.converter.execute();
		this.calculator.execute();
		
		return (this.error == "") ? this.answer : this.error;
	},

	handle_negative: function(elements) {
		var ops = this.operators;
		for (var i = 0; i < elements.length; i++) {
			if (elements[i] == "-") {
				if (elements[i-1] == undefined || elements[i-1] == "(" || ops.is_dyadic(elements[i-1])) {
					if (!isNaN(elements[i+1])  || elements[i+1] == "(" || ops.is_monadic(elements[i+1])) {
						elements[i] = "NEG";
					}
				}
			}
		}
	},

	check_infix_syntax_error: function() {
		var elements = this.infix_elements;
		var ops = this.operators;

		//
		// If 2 numbers appear side by side, user might input it as postfix notation.
		// This check is required because appropriate postfix notation cannot
		// be distinguished from infix notation in terms of calculation stack.
		//
		for (var i = 0; i < elements.length - 1; i++) {
			if (!isNaN(elements[i]) && !isNaN(elements[i + 1])) {
				this.error = this.ERROR_TYPE["SYNTAX_ERROR"];
			}
		}	
	},

	calculate: function(expression_string){
		this.postfix_string = expression_string;
		this.calculator.execute();
		return (this.error == "") ? this.answer : this.error;
	},

	get_infix_expression: function() {
		return this.infix_elements.join(" ");	
	},

	get_formatted_infix_expression: function() {
		var ops = this.operators;
		var infix = this.infix_elements.join(" ");

		for (var key in ops.elements) {
			if (ops.elements[key]["hidden"] !== undefined) {
				var reg_exp = ops.elements[key].hidden;
				var alternative = ops.elements[key].alternative;
				infix = infix.replace(new RegExp(key), alternative);
			}
		}

		return infix;
	},

	get_postfix_expression: function() {
		return this.postfix_elements.join(" ");	
	},

	get_support_operations: function() {
		return this.operators.get_support_operations();
	}
}

exports = module.exports = Expression;
