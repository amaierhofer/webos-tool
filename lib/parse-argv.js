var sys = require('sys'), fs = require('fs');
function parseArgv() {
	var argv = process.argv, hasAppInfo, g = {};
	function exit(msg) { sys.puts(msg); process.exit(1); }

	if(argv.length != 4) { 
		exit("$ " + argv.slice(0,2).join(' ') + " <srcdir> <mountpoint>"); 
	}

	g.target = argv.pop();
	g.source = argv.pop();

	hasAppInfo = fs.readdirSync(g.source).some(function(f) { 
		return (f === 'appinfo.json'); 
	});

	if (!hasAppInfo) { 
		exit('Error: could not find appinfo.json');
   	}

	g.json = JSON.parse(fs.readFileSync(g.source + '/appinfo.json'));
	return g;
};
exports.parseArgv = parseArgv;
