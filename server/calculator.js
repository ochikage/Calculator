var Calculator = function(expression) {
	this.expression = expression;
	this.operators = expression.operators;
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
		var ops = this.operators;
		var stack = [];

		for (var i = 0; i < elements.length; i++) {
			var element = elements[i];

			if (isNaN(element)) {
				if (ops.is_defined(element)) {
					var p = [];

					if (!ops.elements[element].pop_stack(stack, p)) {
						this.expression.error = this.expression.ERROR_TYPE["SYNTAX_ERROR"];	
						return;
					}

					stack.push(ops.elements[element].run_code(p));
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
