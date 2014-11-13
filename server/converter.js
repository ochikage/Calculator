var Converter = function(expression) {
	this.expression = expression;
	this.stack = [];
	this.postfix_elements = [];
	this.operators = expression.operators;
}

Converter.prototype = {
	handle_input : function () {
		var exp = this.expression;
		var ops = this.operators;

		//
		// Add space around operators and parens, then split the expression by space
		//
		var reg_ops = ops.get_reg_exp();

		exp.infix_string = exp.infix_string.replace(new RegExp(reg_ops, "g"), " $& ").trim().toUpperCase();
		exp.infix_elements = exp.infix_string.split(/ +/);

		//
		// ['-', '5', '+', '3', '*', '-', 'SIN'] --> ['-5', '+', '3', '*', '-SIN']
		//
		this.expression.handle_alternative(exp.infix_elements);
		console.log(exp.infix_elements)
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

			if (element == "PI") element = Math.PI;
			if (element == "E") element = Math.E;

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

		this.expression.check_infix_syntax_error();	
	},

	parse_operator : function(element) {
		var ops = this.operators;

		//
		// Calculator will handle non supported operator error
		//
		if (!ops.is_defined(element)) {
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
			if (ops.is_high_priority(stack_top, element)) {
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
