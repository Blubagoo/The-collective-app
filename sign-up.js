//listen for submit button
function listenForSubmit() {
	console.log('listening');
	$('.form').submit(function(e) {
		e.preventDefault();
		let username = $('user').val();
		$('user').val('');
		let password = $('pass').val();
		$('pass').val('');
		let firstname = $('firstname').val();
		$('firstname').val('');
		let lastname = $('lastname').val();
		$('lastname').val('');
		let email = $('email').val();
		$('email').val('');
		console.log('got input');
		sendDataToServer(username,password,firstname,lastname,email, redirect);
		console.log('started sendDataToServer');
	});
}

//send api
function sendDataToServer(username, password, firstname, lastname, email, callback) {
	const settings = {
		url: 'http://www.example.com',
		data: {
			username: username,
			password: password,
			firstname: firstname,
			lastname: lastname,
			email: email
		},
		datatype: 'json',
		type: 'POST',
		success: callback
	};
	console.log('object loaded');
	$.ajax(settings);
}
function redirect() {
	window.location = login.html
}
$(listenForSubmit);
