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
		if (localStorage["rpn_mode"]== "true") {
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
	// popover of the input field 
	//
	$("input[name='expression']").popover({trigger: 'hover',placement: 'bottom',html: true});

	//
	// Show supported operators 
	//
	(function() {
		var	url = localStorage["hostname"] + '/support_op?callback=?';

		$.jsonp({
			url: url,
			data: {},
			success: function(data) {
				var $list_title = $("<h4/>");
				var $monadics_title = $("<span/>");
				var $dyadics_title = $("<span/>");

				$list_title.text("Supported operators");
				$monadics_title.text("monadic operators: ");	
				$dyadics_title.text("dyadics operators: ");	

				var $monadics = $("<div/>");
				var $dyadics = $("<div/>");

				$monadics.append($monadics_title);
				$dyadics.append($dyadics_title);

				for (key in data) {
					var $op = $("<a/>");
					$op.text(key + " ");
					$op.attr("data-toggle", "tooltip");
					$op.attr("title", data[key].description);

					if (data[key].params == 1) {
						$monadics.append($op);
					} else {
						$dyadics.append($op);
					}
				}

				$("#support_op_list").append($list_title).append($monadics).append($dyadics);
			},
			error: function(xOptions, textStatus) {
				;
			}
		});
	})();

});
