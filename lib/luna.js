
var	sys = require('sys'), Step = require('step');
exec = require('child_process').exec;
var app = 'com.palm.app.browser', restart = false, debug = false;

var argv = process.argv, hasAppInfo, g = {};
function exit(msg) { sys.puts(msg); process.exit(1); }

if(argv.length > 2) { 
	argv.slice(2).forEach(function(arg) {
		if (/\./.test(arg)) {app = arg; }
		if(/debug/.test(arg)) { debug = true; }
		if(/restart/.test(arg)) { restart = true; }
	});
}

sys.puts("---- little luna helper");
sys.puts("     app: " +  app);
sys.puts("   debug: " +  debug);
sys.puts(" restart: " +  restart);
sys.puts("-------------------------");



var getRunning = function() {
	var cmd = 'luna-send -n 1 palm://com.palm.applicationManager/running {}';
	exec(cmd,this);
};
var parseResponse = function(err,stdout,stderr) {
	var x = stdout, json;
	x = x.substring(x.indexOf('{'));
	json = JSON.parse(x);
	if (debug)  { sys.puts(sys.inspect(json)); }
	return json;
};
var findProcess = function(err, json) {
	var proc = [];
	json.running.forEach(function(obj,idx) {
		if(debug) { sys.puts(sys.inspect(obj)); }
		if(obj.id === app) { proc.push(obj.processid); }
	});
	return proc;
};
var closeProcess = function(err,  proc) {
	if (proc.length > 0) {
		proc.forEach(function(p) {
			var cmd = 'luna-send -n 1 "palm://com.palm.applicationManager/close" ';
			cmd += ' "{\\"processId\\": \\"' + p + '\\"}"';
			if (debug) { sys.puts(cmd); }
			exec(cmd,this);
		});
	} else {
		return null;
	}
};
var startProcess = function(err) {
	var cmd = 'luna-send -n 1 palm://com.palm.applicationManager/launch ';
	cmd += ' "{\\"id\\": \\"' + app + '\\"}"';
	sys.puts(cmd);
	exec(cmd,this);
};

if(restart) {
	Step(getRunning, parseResponse, findProcess, closeProcess, startProcess);
} else {
	Step(getRunning, parseResponse, findProcess, closeProcess);
}

