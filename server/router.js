function route(handler, pathname, query, response) {
	if (typeof handler[pathname] === 'function') {
		handler[pathname](query, response);
	} else {
		response.writeHead(404, {"Content-Type": "text/plain"});
		response.write("404 " + pathname + " not found on this server");
		response.end(); 	
	}
}

exports.route = route;
