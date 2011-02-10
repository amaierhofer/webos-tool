var fs = require('fs'),
	sys = require('sys'),
	exec = require('child_process').exec,
	flag = './.monitor',
	timeout = 1000,
	printFiles = true;

fs.writeFileSync(flag,'');

function filter(file) {
	var excludes = ['.swp'];
	if (excludes.some(function(p) { return new RegExp(p).test(file); } )) {
		return false;
	}
	return true;
}

var startMonitor = function(args) {
	var copy = function(files) {
		// we only copy a single thing at once as copying many at once is sloooow
		// 1) how do we deal with :wa
		// 2) how do we deal with palm-generate -t new_scene 
		var src = files.pop();
		var target = src.replace(args.source,args.target);
		var cmd = 'cp -rLv ' + src + ' ' + target;
		exec(cmd, function(err, stdout, stderr) { 
			if (printFiles) { sys.puts(stdout.replace('\n','')); }
			if (args.client) { args.client.send('reload'); }
		});
	};

	setInterval(function() {
		var cmd = 'find ' + args.source + ' -newer ' + flag + ' -print';
		exec(cmd, function (error, stdout, stderr) {
			var files = stdout.split(/\n/);
			files.pop();
			files = files.filter(filter);
			fs.writeFileSync(flag, '');
			if (files.length > 1) { copy(files); }
		});
	}, timeout);
};

exports.startMonitor = startMonitor;
