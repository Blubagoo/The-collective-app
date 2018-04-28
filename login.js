//retrieve data from form
function eventListener() {
	$('#login-form').submit('.submit-button', function(e) {
		e.preventDefault();
		console.log("button squelched");
		let username = $('#username-field').val();
		let password = $('#password-field').val();
		$('#username-field').val('');
		$('#password-field').val('');
		sendData(username, password, redirect);

	})
}
//make api call 
function sendData(username, password, callback) {
	console.log('request being sent');
	const settings = {
		url: "/api/users",
		data: {
			username: username,
			password: password
		},
		dataType: 'json',
		type: 'POST',
		success: callback
	};

	$.ajax(settings);
}
function redirect() {
	console.log('redirected')
	window.location = beer.html;
}

$(eventListener);