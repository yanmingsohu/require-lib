# 动态加载代码

## Install

npm install --save require-lib


## Usage

```js
var lib = require('require-lib');

//
// 每次调用都会检查被加载库是否有过更改
//
lib.requireReload('./some.js');

//
// 被加载库是绝对路径
//
lib.requireReload('/dir/some.js', true);

//
// 监视一个目录, 并加载所有源代码
//
var dire = lib.requireDir(__dirname + '/sub');

dire.on('error', function(err) {
  console.log('Error', err, err.stack);
});

//
// 当代码被加载/改动时触发
// program   -- export 导出的对象
// filename  -- 脚本的完整路径
// is_change -- 如果文件被修改为 true
//
dire.on('program', function(program, filename, is_change) {
  console.log('Program', program(2), filename, is_change);
});
```