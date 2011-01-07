
var	sys = require('sys'), Step = require('step');
exec = require('child_process').exec;
var process = 'com.palm.app.browser';



var getRunning = function() {
	var cmd = 'luna-send -n 1 palm://com.palm.applicationManager/running {}';
	exec(cmd,this);
};
var parseResponse = function(err,stdout,stderr) {
	var x = stderr, json;
	x = x.substring(x.indexOf('{'));
	json = JSON.parse(x);
	return json;
};
var findProcess = function(err, json) {
	var process = null;
	for (var p in json.running) {
		if(json.running[p].id === process) {
			process = json.running[p];
		}
	}
	return process;
};

var closeProcess = function(err,  process) {
	if (process) {
		var cmd = 'luna-send -n 1 "palm://com.palm.applicationManager/close" ';
		cmd += ' "{\\"processId\\": \\"' + process.processid + '\\"}"';
		sys.puts(cmd);
		exec(cmd,this);
	} else {
		return null;
	}
};
var startProcess = function(err) {
	var cmd = 'luna-send -n 1 palm://com.palm.applicationManager/launch ';
	cmd += ' "{\\"id\\": \\"' + process + '\\"}"';
	sys.puts(cmd);
	exec(cmd,this);
};

Step(stepOne, stepTwo, stepThree, stepFour, stepFive);

