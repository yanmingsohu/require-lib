var path = require('path');
var os   = require('os');
var fs   = require('fs');


var isWindows = os.type().indexOf('Windows') >= 0;
module.exports = requireReload;

var file_md = {};


//
// lib_name    -- 代码库路径
// is_absolute -- lib_name 是否绝对路径
//
function requireReload(lib_name, is_absolute) {
  // .parent        == require-lib/index.js
  // .parent.parent == self

  var dir = is_absolute || path.dirname( module.parent.parent.filename );
  var key = is_absolute ?  path.normalize(lib_name) : path.join(dir, lib_name);
  var stat = fs.statSync(key);

  if (isWindows) {
    key = key[0].toUpperCase() + key.substr(1);
  }

  //console.log('::', key, lib_name, key[0].toUpperCase());
  //console.log(key, file_md[key] , typeof stat.mtime);

  if (require.cache[key]) {
    if (file_md[key] != stat.mtime.getTime()) {
      delete require.cache[key];
    } else {
      // console.log("not modify");
    }
  } else {
    //console.log('requireNoCache not has key:', lib_name, key);
  }

  file_md[key] = stat.mtime.getTime();
  return require(key);
}
