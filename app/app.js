var express = require('express'),
    connect = require('connect'),
		io = require ('socket.io'),
		sys = require('sys'),
		fs = require('fs'),
		childProcess = require('child_process'),
		exec = childProcess.exec,
		monitor = require('./Monitor');

var globals = {
	clients: []
};
(function checkArgs() {
	var exit = require('sys').exit;
	if(process.argv.length != 4) {
		sys.puts("$ " + process.argv.slice(0,2).join(' ') + " <srcdir> <mountpoint>");
		process.exit(1);
	}
	globals.target = process.argv.pop();
	globals.source = process.argv.pop();
	globals.json = JSON.parse(fs.readFileSync(globals.source + '/appinfo.json'));
})();


var app = module.exports = express.createServer();

// Configuration
app.configure(function(){
    app.use(app.router);
    app.use(connect.staticProvider(__dirname + '/public'));
});

// Routes
app.get('/', function(req, res){
	var path = 'http://localhost:5581/media/cryptofs/apps/usr/palm/applications/';
	path += globals.json.id;
	path += '/index.html?device=pre';
	res.redirect(path);
});

var mon = new monitor.Monitor(globals);
mon.on('reload', function() {
	if(globals.client) {
		sys.puts('sending reload command');
		globals.client.send('reload');
	} else {
		sys.puts('lost connection to client');
	}
});

var socket = io.listen(app, {log:function(){}});
socket.on('connection', function(client){
	sys.puts('client connected');
	globals.client = client;
	client.on('disconnect', function() {
		sys.puts('client disconnected');
		delete globals.client;
	});
});

// Only listen on $ node app.js
if (!module.parent) app.listen(3000);
sys.puts('listening on localhost:3000');
