var fs = require('fs'),
	sys = require('sys'),
	exec = require('child_process').exec,
	flag = './.monitor',
	timeout = 1000,
	printFiles = false;

fs.writeFileSync(flag,'');

var startMonitor = function(args) {
	var copy = function() {
		var cmd = 'cp -rv ' + args.source + '/* ' + args.target;
		exec(cmd, function(err, stdout, stderr) { 
			if (printFiles) { 
				sys.puts(new Date());
				sys.puts(stdout);
		   	}
		});
		if (args.client) { args.client.send('reload'); }
	};

	setInterval(function() {
		var cmd = 'find ' + args.source + ' -newer ' + flag + ' -print';
		exec(cmd, function (error, stdout, stderr) {
			var files = stdout.split(/\n/);
			fs.writeFileSync(flag, '');
			if (files.length > 1) { copy(); }
		});
	}, timeout);
	copy();
};

exports.startMonitor = startMonitor;
