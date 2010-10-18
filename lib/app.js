var sys = require('sys'), fs = require('fs');
var globals = {};
(function checkArgs(g) {
	var argv = process.argv, hasAppInfo;
	function exit(msg) { sys.puts(msg); process.exit(1); }

	if(argv.length != 4) { exit("$ " + argv.slice(0,2).join(' ') + " <srcdir> <mountpoint>"); }

	g.target = argv.pop();
	g.source = argv.pop();

	hasAppInfo = fs.readdirSync(g.source).some(function(f) { return (f === 'appinfo.json'); });
	if (!hasAppInfo) { exit('Error: could not find appinfo.json'); }
	g.json = JSON.parse(fs.readFileSync(g.source + '/appinfo.json'));
})(globals);


(function createExpressServer(g) {
	var express = require('express'), connect = require('connect'), app;
	app = express.createServer();
	app.configure(function(){
			app.use(app.router);
			app.use(connect.staticProvider(__dirname + '/../public'));
	});

	app.get('/', function(req, res){
		var path = 'http://localhost:5581/media/cryptofs/apps/usr/palm/applications/';
		path += globals.json.id + '/index.html?device=pre';
		res.redirect(path);
	});

	sys.puts('listening on localhost:3000');
	app.listen(3000);
	g.app = app;
})(globals);

(function createMonitor(g) {
	var monitor = require(__dirname + "/monitor.js");	
	var mon = new monitor.Monitor(g);
	mon.on('reload', function() {
		if (g.client) {  g.client.send('reload'); }
	});
})(globals);

(function createWebSocket(g) {
	var io = require('socket.io');	
	var socket = io.listen(g.app, {log:function(){}});
	socket.on('connection', function(client){
		sys.puts('client connected');
		g.client = client;
		client.on('disconnect', function() {
			sys.puts('client disconnected');
			delete g.client;
		});
	});
})(globals);


// Only listen on $ node app.js
