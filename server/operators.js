var operators = require("./operators.json");

//
// Exposed class
//
var Operators = function() {
	this.elements= {};

	for (key in operators) {
		switch (operators[key].params) {
		case 1:
			this.elements[key] = new Monadics(operators[key]);
			break;
		case 2:
			this.elements[key] = new Dyadics(operators[key]);
			break;
		default:
			console.log("Unsupported number of parameters.");
			break;
		}
	}
};

Operators.prototype = {
	is_defined: function(op) {
		return (this.elements[op] !== undefined);
	},

	is_monadic : function(op) {
		return (this.elements[op] instanceof Monadics);
	},

	is_dyadic: function(op) {
		return (this.elements[op] instanceof Dyadics);
	},

	is_high_priority: function(op1, op2) {
		return (this.elements[op1].priority >= this.elements[op2].priority);
	},

	get_reg_exp: function() {
		var reg_exp = "(";

		for (key in this.elements) {
			if (key.match(/[.^$[\]*+?|]/)) key = "\\" + key;
			reg_exp += key + "|";
		}
		reg_exp += "\\(|\\))"; // Parens are not operators but need to be detected

		return reg_exp;
	},

	get_support_operations: function() {
		var elements = this.elements;
		var ret = "{";

		for (key in elements) {
			if (!elements[key].hidden) { 
				var params = (elements[key] instanceof Monadics) ? 1 : 2;
				ret += "\"" + key + "\":{params:" + params + ", description:\"" + elements[key].description + "\"},";
			}
		}
		ret += "}";

		return ret;
	}
}


//
// Parent class
//
var Operator = function() {
	this.priority = 0;
	this.code = "";
	this.description = "";
	this.hidden = false;
	this.alternative = "";
}
Operator.prototype = {
	constructor : function(operator) {
		this.priority = operator.priority;
		this.code = operator.code;
		this.description = operator.description;
		this.hidden = operator.hidden;
		this.alternative = operator.alternative;
	}
}


//
// Child classes
//

//
// Monadics means ABS, SQRT...
//
var Monadics = function(operator) {
	Operator.apply(this, arguments);
	this.constructor(operator);
}

Monadics.prototype = new Operator();

Monadics.prototype.pop_stack = function(stack, p) {
	p[0] = Number(stack.pop());	

	//
	// If the paramter is NaN, the syntax has any problem.
	//
	if (isNaN(p[0])) {
		return false;
	}

	return true;
}

Monadics.prototype.run_code = function(p) {
	var p1 = p[0];
	return eval(this.code);	
}


//
// Dyadics means +, -...
//
var Dyadics = function(operator) {
	Operator.apply(this, arguments);
	this.constructor(operator);
}

Dyadics.prototype = new Operator();

Dyadics.prototype.pop_stack = function(stack, p) {
	p[0] = Number(stack.pop());	
	p[1] = Number(stack.pop());	

	//
	// If one of the paramter is NaN, the syntax has any problem.
	//
	if (isNaN(p[0]) || isNaN(p[1])) {
		return false;
	}

	return true;
}
Dyadics.prototype.run_code = function(p) {
	var p1 = p[0];
	var p2 = p[1];
	return eval(this.code);	
}


exports = module.exports = Operators;
