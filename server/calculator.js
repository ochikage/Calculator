var op_setting = require("./op_setting.json");

var Calculator = function(expression) {
	this.expression = expression;
}

Calculator.prototype = {
	handle_input : function() {
		//
		// Space is recognized as a delimiter. 
		//
		var exp = this.expression;
		exp.postfix_elements = exp.postfix_string.split(/ +/);
		console.log(exp.postfix_elements);
	},	

	execute : function() {
		this.handle_input();
		return this.calculate();
	},

	calculate : function() {
		var elements = this.expression.postfix_elements;
		var stack = [];

		for (var i = 0; i < elements.length; i++) {
			var element = elements[i];

			if (isNaN(element)) {
				if (op_setting.op[element] !== undefined) {
					//
					// isNaN check is not required here because it is guaranteed that
					// only numbers are pushed.
					//
					var p1 = 0, p2 = 0;
					if (op_setting.op[element].params == 1) {
						p1 = Number(stack.pop());
					} else if (op_setting.op[element].params == 2) {
						p1 = Number(stack.pop());
						p2 = Number(stack.pop());
					}

					//
					// If one of the paramter is NaN, the syntax has any problem.
					//
					if (isNaN(p1) || isNaN(p2)) {
						this.expression.error = this.expression.ERROR_TYPE["SYNTAX_ERROR"];	
						return;
					}

					stack.push(eval(op_setting.op[element].code));
				} else {
					this.expression.error = this.expression.ERROR_TYPE["NON_SUPPORT_OP"];	
					return;
				}
			} else {
				stack.push(element);
			}
		}
		this.expression.answer = stack.pop();
	}
}

exports = module.exports = Calculator;
