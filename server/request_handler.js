var Expression = require("./expression");

function start(query, response) {
	response.writeHead(200, {"Content-Type": "text/plain"});
	response.write("Starts");
	response.end();
}

function calc(query, response) {
	var expression = new Expression();
	var answer = expression.execute(query["expression"]);
	var expression_infix = expression.get_infix_expression();
	var ret = "{\"answer\": \"" + answer + "\", \"expression\":\"" + expression_infix + "\"}";

	//
	// JSON
	//
	//response.writeHead(200, {"Content-Type": "text/plain", "Access-Control-Allow-Origin": "*"});
	//response.write("{\"answer\": " + answer + "}");
	//response.end();

	//
	// JSONP
	//
	response.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});
	response.end(query["callback"] ? query["callback"] + "(" + ret + ")" : ret);

}

function calc_rpn(query, response) {
	var expression = new Expression();
	var answer = expression.calculate(query["expression"]);
	var expression_postfix = expression.get_postfix_expression();
	var ret = "{\"answer\": \"" + answer + "\", \"expression\":\"" + expression_postfix + "\"}";

	//
	// JSONP
	//
	response.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});
	response.end(query["callback"] ? query["callback"] + "(" + ret + ")" : ret);

}
exports.start = start;
exports.calc = calc;
exports.calc_rpn = calc_rpn;