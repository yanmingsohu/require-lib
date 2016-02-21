
function tt() {
	var r = require('../index.js').requireReload;
	var c = require('change-tmp');

	c();
	c();
}

function clearAll() {
	require.cache = {};
}

tt();
clearAll();
tt();

console.log('', module.constructor.prototype , "\n\n>>>>>>\n\n")