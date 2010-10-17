var fs = require('fs'),
	sys = require('sys'),
	events = require('events'),
	childProcess = require('child_process'),
	exec = childProcess.exec,
	flag = './.monitor';

function Monitor(globals) {
	var self = this;
	this.src = globals.source;
	this.tgt = globals.target;
	events.EventEmitter.call(this);
	fs.writeFileSync(flag, '');
	setInterval(function() {self.find(); }, 1000);
};

Monitor.prototype.find = function() {
	var cmd = 'find ' + this.src + ' -type f -newer ' + flag + ' -print';
	var self = this;
	exec(cmd, function (error, stdout, stderr) {
		var files = stdout.split(/\n/);
		files = files.filter(function(f) { if(/swp/.test(f)) { return false;}  return true; });
		files.pop(); // remove blank line ending and split
		if (files.length) {
			fs.writeFileSync(flag, '');
			self.copy(files);
		}
	});
};

Monitor.prototype.copy = function(files) {
	var filesToCopy = files.length;
	var self = this;
	files.forEach(function(f) {
		var cmd = 'cp -v ' + f + ' ' + f.replace(self.src, self.tgt);
		sys.puts(cmd);
		exec(cmd, function(err, stdout,stderr) {
			filesToCopy--;
			if (filesToCopy === 0) {
				self.emit('reload');
			}
		});
	});
};


Monitor.prototype.__proto__ = events.EventEmitter.prototype;
exports.Monitor = Monitor;
