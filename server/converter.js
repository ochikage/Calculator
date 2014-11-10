var config = require("./op_setting.json");

var Converter = function(expression) {
	this.expression = expression;
	this.stack = [];
	this.postfix_elements = [];
}

Converter.prototype = {
	handle_input : function () {
		//
		// Add space around operators and parens, then split the expression by space
		//
		var exp = this.expression;
		exp.infix_string = exp.infix_string.replace(new RegExp(config.reg.ops, "g"), " $& ").replace(new RegExp(config.reg.space_head), "").replace(new RegExp(config.reg.space_tail), "");
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
		while (this.stack.length > 0) {
			var stack_top = this.stack[this.stack.length - 1];

			//
			// Calculator will handle non supported operator error
			//
			if (config.op[element] === undefined) {
				this.postfix_elements.push(element);
				return;
			}

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
			if (config.op[stack_top].priority >= config.op[element].priority) {
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
