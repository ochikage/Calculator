var http = require("http");
var url = require("url");
var querystring = require("querystring");

function start(route, handler) {

	http.createServer(function(request, response) {
		route(handler, url.parse(request.url).pathname, querystring.parse(url.parse(request.url).query), response);
	}).listen(8888);
	console.log("Server starts");
}

exports.start = start;
