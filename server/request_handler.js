var CalcFacade = require("./calc_facade");

function start(query, response) {
	response.writeHead(200, {"Content-Type": "text/plain"});
	response.write("Welcome to Calculator server.");
	response.end();
}

function calc(query, response) {
	var ret = "";

	if (query["expression"] === undefined) {
		ret = "Unexpected error";
	} else {
		var calc_facade = new CalcFacade();
		var answer = calc_facade.execute(query["expression"]);
		var expression_infix = calc_facade.get_formatted_infix_expression();

		ret = "{\"answer\": \"" + answer + "\", \"expression\":\"" + expression_infix + "\"}";
	}
	//
	// JSON
	//
	//response.writeHead(200, {"Content-Type": "text/plain", "Access-Control-Allow-Origin": "*"});
	//response.write("{\"answer\": " + answer + "}");
	//response.end();

	//
	// JSONP
	//
	response.writeHead(200, {"Content-Type": "application/javascript; charset=utf-8"});
	response.end(query["callback"] ? query["callback"] + "(" + ret + ")" : ret);
}

function calc_rpn(query, response) {
	var ret = "";

	if (query["expression"] === undefined) {
		ret = "Unexpected error";
	} else {
		var calc_facade = new CalcFacade();
		var answer = calc_facade.calculate(query["expression"]);
		var expression_postfix = calc_facade.get_postfix_expression();

		ret = "{\"answer\": \"" + answer + "\", \"expression\":\"" + expression_postfix + "\"}";
	}
	//
	// JSONP
	//
	response.writeHead(200, {"Content-Type": "application/javascript; charset=utf-8"});
	response.end(query["callback"] ? query["callback"] + "(" + ret + ")" : ret);

}

function support_op(query, response) {
	var calc_facade = new CalcFacade();
	var ret = calc_facade.get_support_operations();

	response.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});
	response.end(query["callback"] ? query["callback"] + "(" + ret + ")" : ret);
}

exports.start = start;
exports.calc = calc;
exports.calc_rpn = calc_rpn;
exports.support_op = support_op;
