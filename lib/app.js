var sys = require('sys'), fs = require('fs'), io = require('socket.io'),
	express = require('express'), connect = require('connect'), 
	app, args, socket, client;

args = require(__dirname + '/parse-argv.js').parseArgv();

app = express.createServer();
app.configure(function(){
	app.use(app.router);
	app.use(connect.staticProvider(__dirname + '/../public'));
});

app.get('/', function(req, res){
	var path = 'http://localhost:5581/media/cryptofs/apps/usr/palm/applications/';
		path += args.json.id + '/index.html?device=pre';
	res.redirect(path);
});

var socket = io.listen(app, {log:function(){}});
socket.on('connection', function(client){
	sys.puts('client connected');
	client.on('disconnect', function() { sys.puts('client disconnected');} );
	args.client = client;
});

sys.puts('listening on localhost:3000');
app.listen(3000);
require(__dirname + "/monitor.js").startMonitor(args);


