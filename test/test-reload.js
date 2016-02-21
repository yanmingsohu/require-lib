var lib  = require('../index.js');
var fs   = require('fs');
var path = require('path');


trr('./a.js');
trr('./sub/a.js', true);


function trr(_libname, modify) {
	var c = 99
	var a = lib.requireReload(_libname);
	console.log(a(c));

	if (modify) {
		var file = path.join(__dirname, _libname);
		fs.utimesSync(file, new Date(), new Date());
	}

	var a = lib.requireReload(_libname);
	console.log(a());

	if ((modify && a()==0) || (modify==null && a() == c)) {
		console.log("requireReload work");
	} else {
		console.log("requireReload not work");
	}
}