var Operators = require("./operators.js");

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
}

Expression.prototype = {

	handle_alternative: function(elements) {
		var ops = this.operators;

		for (var i = 0; i < elements.length; i++) {
			for (key in ops.elements) {
				var alt = ops.elements[key].alternative ;
				if (alt !== undefined && elements[i] == alt) {
					if (eval(ops.elements[key].alternative_condition)) {
						elements[i] = key;
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

	get_infix_expression: function() {
		return this.infix_elements.join(" ");	
	},

	//
	// e.g. 'NEG' --> '-'
	//
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
