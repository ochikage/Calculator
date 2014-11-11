$(function(){
	//
	// Show setting dialog
	//
	$("#setting_btn").click(function(){
		$("input[name='hostname']").val(localStorage["hostname"]);
		$("input[name='rpn_mode']").prop('checked', (localStorage["rpn_mode"] == "true") ? true : false);
		$("#setting_dialog").modal('show');
	});

	//
	// Change appearance
	//
	var change_expression_color = function() {
		if (localStorage["rpn_mode"] == "true") {
			$("input[name='expression']").css("background-color", "yellow");
		} else {
			$("input[name='expression']").css("background-color", "white");
		}	
	}; 
	change_expression_color();

	//
	// Save setting
	//
	$("#setting_save").click(function(){
		localStorage.setItem("hostname", $("input[name='hostname']").val());
		localStorage.setItem("rpn_mode", $("input[name='rpn_mode']").prop('checked'));
		change_expression_color();
	});

	//
	// Submit the expression
	//
	var submit_expression = function() {
		//
		// Call the API by JSONP
		//
		var url = ""
		if ( localStorage["rpn_mode"] == "true") {
			url = localStorage["hostname"] + '/calc_rpn?callback=?';
		} else {
			url = localStorage["hostname"] + '/calc?callback=?';
		}

		//
		// getJSON cannot handle .error callback when JSONP is used.
		//
		//$.getJSON(url , {'expression': $("input[name='expression']").val()}, function(data, status) {
		//	console.log(status);
		//	console.log(data);
		//	if (status == "success") { 
		//		var result = $("#result");
		//		result.val(data["answer"] + "\n" + result.val());
		//	} else {
		//		alert('Cannot access the server');
		//	}
		//});

		$.jsonp({
			url: url,
			data: {'expression': $("input[name='expression']").val()},
			success: function(data) {
				console.log(data);
				var result = $("#result");
				result.val(data["expression"] + " = " + data["answer"] + "\n" + result.val());
			},
			error: function(xOptions, textStatus) {
				alert("Connection error");
			}
		});
	};

	//
	// Enter is pressed in the text box
	//
	$("input[name='expression']").keypress(function(e){
		if (e.which == 13) {
			submit_expression();
			return false;
		}
	});

	//
	// Submit 
	//
	$("#submit").click(function(){
		submit_expression();
	});

	//
	// misc
	//
	$("input[name='expression']").popover({trigger: 'hover',placement: 'bottom',html: true});

	(function() {
		var	url = localStorage["hostname"] + '/support_op?callback=?';
		console.log(url);

		$.jsonp({
			url: url,
			data: {},
			success: function(data) {
				var support_op_list = $("#support_op_list");
				var monadics = "";
				var dyadics = "";

				for (key in data) {
					if (data[key].params == 1) {
						monadics += key + " ";
					} else {
						dyadics += key + " ";
					}
				}
				support_op_list.html("<h4>Supported operations</h4><p>monadics: " + monadics + "</p>" + "<p>dyadics: " + dyadics + "</p>");
			},
			error: function(xOptions, textStatus) {
				;
			}
		});
	})();

});
