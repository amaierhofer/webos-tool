(function() {
	var scripts = ['jquery.js', 'socket.io.js', 'reloader.js'];
	var head = document.querySelectorAll('head')[0];
	scripts.forEach(function(s) {
		var script = document.createElement('script');
		script.src =  'http://localhost:3000/js/' + s;
		script.type = 'text/javascript';
		console.log(script);
		head.appendChild(script);
	});
})();

