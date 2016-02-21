
var lib = require('../');

var dire = lib.requireDir(__dirname + '/sub');

dire.on('error', function(err) {
  console.log('Error', err, err.stack);
});


dire.on('program', function(program, file, is_change) {
  console.log('Program', program(3), file, is_change);
});