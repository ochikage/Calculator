var server = require("./server");
var router = require("./router");
var request_handler = require("./request_handler");

var handler = {
	"/": request_handler.start,
	"/start": request_handler.start,
	"/calc": request_handler.calc,
	"/calc_rpn": request_handler.calc_rpn,
	"/support_op": request_handler.support_op,
};

server.start(router.route, handler);
