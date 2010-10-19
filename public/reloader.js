(function() {

	// proxy this method and add timestamp to resource
	var _palmGetResources = palmGetResource;
	palmGetResource = function(resource) { 
		var res = _palmGetResources.call(this, resource);
		if (res) {
			res = res.replace(/.js/g, '.js?' + new Date().getTime());  
			return res;
		}
	};

	function onMessage() {
		var head = document.querySelectorAll('head')[0];
		var body = document.querySelectorAll('body')[0];
		var scripts = document.querySelectorAll("script[src^='app']");
		var i=0;
		for(i=0; i < scripts.length; ++i) {
			head.remove(scripts[i]);
		}

		for(i=0; i < body.children.length; ++i) {
			body.remove(body.children[i]);
		}
	}

	function onDisconnect() {
		connect();
	}

	function connect() {
		var ws = new WebSocket('ws://localhost:3000/socket.io/websocket');
		ws.onmessage = onMessage;
		ws.ondisconnect = onDisconnect;
		console.log('connect');
	}

	window.onload = connect;
})();
