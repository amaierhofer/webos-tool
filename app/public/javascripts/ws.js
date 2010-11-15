
(function($) {
	var ws = new io.Socket('localhost', { port: 3000});
	ws.connect();
	ws.on('message', function(msg) {
		$("script[src^='app']").remove();
		$("body").attr('class', '').find('*').remove();
		$("link[href*='" + Mojo.appInfo.title + ".css']").each(updateStylesheet);
		Mojo.View.templates = {};
		Mojo.loadApplicationSources();
	});
	ws.on('disconnect', function() {
		console.log('disconnected');
	});

	function updateStylesheet(i,node) {
		//$(node).remove();
		$.ajax({url: node.href, success: function(data) {
			var style = '<style>' + data + '</style>';
			$("body").append(style);
		}});
		console.log(node.href);
	}

	var _palmGetResources = palmGetResource;
	palmGetResource = function(resource) { 
		var res = _palmGetResources.call(this, resource);
		if (res) {
			res = res.replace(/.js/g, '.js?' + new Date().getTime());  
			return res;
		}
	};
})(jQuery);
