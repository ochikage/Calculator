var config = require("./op_setting.json");

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
				if (config.op[element] !== undefined) {
					//
					// isNaN check is not required here because it is guaranteed that
					// only numbers are pushed.
					//
					var p1 = Number(stack.pop());
					var p2 = Number(stack.pop());

					//
					// If one of the paramter is NaN, the syntax has any problem.
					//
					if (isNaN(p1) || isNaN(p2)) {
						return "Syntax error";
					}

					stack.push(eval(config.op[element].code));
				} else {
					return "Non supported operator";
				}
			} else {
				stack.push(element);
			}
		}
		return stack.pop();
	}
}

exports = module.exports = Calculator;
