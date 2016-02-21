var fs      = require('hexo-fs');
var path    = require('path');
var Event   = require('events').EventEmitter;
var include = require('./require-reload.js');


module.exports = load_dir;


//
// 监视一个目录中的代码修改, 并触发相关事件
// filedir   -- 目录的绝对路径
// recursive -- 是否递归目录
//
// Events:
//   error(err)     -- 出错时触发
//   dirover()      -- 目录加载全部完成
//   remove(file)   -- 代码被移除
//   program(prog, is_change) -- 新的代码被创建时触发, 如果是代码修改, is_change==true
//
function load_dir(filedir, recursive) {
  var file_id = {};
  var programCache = {};
  var ret = new Event();


  fs.listDir(filedir, function(err, files) {
    if (err) return ret.emit('error', err);

    files.forEach(function(file) {
      var fdir = path.join(filedir, file);
      createProgram(fdir);
      watchfile(fdir);
    });
    
    ret.emit('dirover');
  });


  fs.watch(filedir, {recursive:recursive, persistent:true}, function(err, watcher) {
    if (err) {
      ret.emit('error', err);
      return;
    }

    if (!err) {
      watcher.on('add', function(file) {
        createProgram(file);
        watchfile(file);
      });
    } else {
      ret.emit('error', err);
    }
  });


  function createProgram(file, is_change) {
    try {
      var prog = include(file, true);
      file_id[file] = prog;
      ret.emit('program', prog, file, is_change);
    } catch(error) {
      ret.emit('error', error);
    }   
  }


  function watchfile(file) {
    fs.watch(file, function(err, watcher) {
      if (err) return ret.emit('error', err);
    
      watcher.on('change', function() {
        createProgram(file, true);
      });

      watcher.on('unlink', function() {
        ret.emit('remove', file);
        delete file_id[file];
        watcher.close();
      });
    });
  }

  return ret;
}
