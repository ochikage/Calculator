var op_setting = require("./op_setting.json");

var Converter = function(expression) {
	this.expression = expression;
	this.stack = [];
	this.postfix_elements = [];
}

Converter.prototype = {
	handle_input : function () {
		var exp = this.expression;

		//
		// If 2 numbers appear side by side, user might input it as RPN.
		// Set invalid operator and calculator will occurs syntax error.
		//
		if (exp.infix_string.search(new RegExp(op_setting.reg.error)) != -1) {
			exp.error = exp.ERROR_TYPE["SYNTAX_ERROR"];
		}

		//
		// Add space around operators and parens, then split the expression by space
		//
		var reg_ops = "(";
		for (key in op_setting.op) {
			if (key.match(/[.^$[\]*+?|]/)) key = "\\" + key;
			reg_ops += key + "|";
		}
		reg_ops += "\\(|\\))"; // Parens are not operators but need to be detected

		exp.infix_string = exp.infix_string.replace(new RegExp(reg_ops, "g"), " $& ").trim().toUpperCase();
		exp.infix_elements = exp.infix_string.split(/ +/);

		//
		// ['-', '5', '+', '3'] --> ['-5', '+', '3']
		//
		this.expression.handle_negative(exp.infix_elements);
	},

	execute : function () {
		this.handle_input();
		this.convert();
		this.expression.postfix_string = this.postfix_elements.join(" ");
	},

	convert : function() {
		this.stack = [];
		this.postfix_elements = [];
		var elements = this.expression.infix_elements;

		for (var i = 0; i < elements.length; i++) {
			var element = elements[i];
			if (!isNaN(element)) {
				this.postfix_elements.push(element);
			} else if (element == "(" || element == ")") {
				this.parse_paren(element);
			} else {
				this.parse_operator(element);
			}
		}

		while (this.stack.length > 0) {
			this.postfix_elements.push(this.stack.pop());
		}
	},

	parse_operator : function(element) {
		//
		// Calculator will handle non supported operator error
		//
		if (op_setting.op[element] === undefined) {
			this.postfix_elements.push(element);
			return;
		}

		while (this.stack.length > 0) {
			var stack_top = this.stack[this.stack.length - 1];

			//
			// Operation is closed in the parens
			//
			if (stack_top == "(" ) {
				break;
			}

			//
			// If the priority of the op in stack is higher than that of current one
			// the stack is poped.
			//
			if (op_setting.op[stack_top].priority >= op_setting.op[element].priority) {
				this.postfix_elements.push(stack_top);
				this.stack.pop();
			} else {
				break;
			}
		}
		this.stack.push(element);
	},

	parse_paren : function (element) {
		if (element == ")") {
			while (this.stack.length > 0) {
				var stack_top = this.stack[this.stack.length - 1];

				if (stack_top == "(") {
					//
					// Parens are just removed.
					//
					this.stack.pop();
					break;
				} else {
					this.postfix_elements.push(this.stack.pop());	
				}
			}

		} else {
			this.stack.push(element);
		}
	},
}

exports = module.exports = Converter;
