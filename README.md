# slide-flow-control
# Controlling Flow: callbacks are easy //控制流：回调函数是简单的

## What's actually hard? //什么是真正难的

- Doing a bunch of things in a specific order.//按特定顺序做一大堆事情
- Knowing when stuff is done.//了解什么时候事件完成
- Handling failures.//解决错误
- Breaking up functionality into parts (avoid nested inline callbacks)//将功能分解为部分（避免嵌套内联函数）


## Common Mistakes//常见错误

- Abandoning convention and consistency.//放弃惯例和一致性
- Putting all callbacks inline.//把所有回调函数内联
- Using libraries without grokking them.//在不了解图书馆的时候使用它们
- Trying to make async code look sync.努力使异步代码看起来像同步的

## Define Conventions//定义公约

- Two kinds of functions: *actors* take action, *callbacks* get results.
//两种类型的函数:actors采取措施，callback获得结果
- Essentially the continuation pattern. Resulting code *looks* similar to fibers, but is *much* simpler to implement.
//本质上是延续模式。生成的代码looks类似于光纤，但是但是实施起来是简单的
- Node works this way in the lowlevel APIs already, and it's very ﬂexible.
//节点已经用这种方式在低层API工作了，并且非常灵活

## Callbacks//回调函数

- Simple responders
//简单的应答
- Must always be prepared to handle errors, that's why it's the first argument.
//必须随时准备处理错误，这就是为什么它是第一个参数
- Often inline anonymous, but not always.
//经常匿名内联，但并不总是
- Can trap and call other callbacks with modified data, or pass errors upwards.
//可以使用修改后的数据来捕获和调用其他回调，或向上传递错误。

## Actors

- Last argument is a callback.
//最后一个参数是回调函数
- If any error occurs, and can't be handled, pass it to the callback and return.
//如果一些错误发生并且不能被解决，将它传到回调函数并返回数据
- Must not throw. Return value ignored.
//一定不能抛出。返回被忽略的值
- return x ==> return cb(null, x)
//
- throw er ==> return cb(er)
//cb是callback,er是error
```javascript
// return true if a path is either//如果路径是真的，返回true
// a symlink or a directory.//一个符号链接或一个目录
function isLinkOrDir (path, cb) {
  fs.lstat(path, function (er, s) {
    if (er) return cb(er)  //如果发生错误，就将错误传到回调函数
    return cb(null, s.isDirectory() || s.isSymbolicLink())
  })
}
```

# asyncMap

## Usecases//用例

- I have a list of 10 files, and need to read all of them, and then continue when they're all done.
//我有一个十个文件的列表，并且需要阅读所有的，当所有完成之后就继续
- I have a dozen URLs, and need to fetch them all, and then continue when they're all done.
//我有一打的网址，需要把它们都拿来，当所有完成之后再继续
- I have 4 connected users, and need to send a message to all of them, and then continue when that's done.
//我有4个连接用户，并且需要想它们都发送一个信息...
- I have a list of n things, and I need to dosomething with all of them, in parallel, and get the results once they're all complete.
//我有n个东西的清单，我需要对所有的东西都做一些事情，并且，一旦它们都完整就要得到结果

## Solution//解决

```javascript
var asyncMap = require("slide").asyncMap
function writeFiles (files, what, cb) {
  asyncMap(files, function (f, cb) {
    fs.writeFile(f, what, cb)
  }, cb)
}
writeFiles([my, file, list], "foo", cb)
```

# chain//链表

## Usecases//用例

- I have to do a bunch of things, in order. Get db credentials out of a file,
  read the data from the db, write that data to another file.
  //我需要按顺序做一大堆东西。从文件中获取db凭据，从db中阅读数据，在其它文件中写下那个数据
- If anything fails, do not continue.
//如果失败了，就不要继续
- I still have to provide an array of functions, which is a lot of boilerplate,
  and a pita if your functions take args like
  //我仍然需要提供一系列函数，这些函数都是大量的样板，如果你的函数需要参数，还需要一个皮塔

```javascript
function (cb) {
  blah(a, b, c, cb)
}
```

- Results are discarded, which is a bit lame.//一些靠不住的结果已经不再用了
- No way to branch.//没办法分支

## Solution//解决

- reduces boilerplate by converting an array of [fn, args] to an actor
  that takes no arguments (except cb)
  //通过将[fn，args]数组转换为不带参数（除cb外）的actor来减少样板，
- A bit like Function#bind, but tailored for our use-case.
//有一点像函数绑定，但是为我们的用例量身定做
- bindActor(obj, "method", a, b, c)
- bindActor(fn, a, b, c)
- bindActor(obj, fn, a, b, c)
- branching, skipping over falsey arguments
//跳过虚假参数
```javascript
chain([
  doThing && [thing, a, b, c]
, isFoo && [doFoo, "foo"]
, subChain && [chain, [one, two]]
], cb)
```

- tracking results: results are stored in an optional array passed as argument,
  last result is always in results[results.length - 1].
  //跟踪结果：结果存储在作为实参传递的可选数组中，最后的结果总是在结果中
- treat chain.first and chain.last as placeholders for the first/last
  result up until that point.
  //将chain.first和chain.last作为第一个/最后一个结果的占位符，直到这一点。


## Non-trivial example//有意义的例子

- Read number files in a directory
//读取目录中的编号文件
- Add the results together
//把结果加在一起
- Ping a web service with the result
//结果是ping一个web服务器（ping是TCP/IP协议的一部分。利用“ping”命令可以检查网络是否连通）
- Write the response to a file
//将响应写入文件
- Delete the number files
//删除号码文件
```javascript
var chain = require("slide").chain
function myProgram (cb) {
  var res = [], last = chain.last, first = chain.first
  chain([
    [fs, "readdir", "the-directory"]
  , [readFiles, "the-directory", last]
  , [sum, last]
  , [ping, "POST", "example.com", 80, "/foo", last]
  , [fs, "writeFile", "result.txt", last]
  , [rmFiles, "./the-directory", first]
  ], res, cb)
}
```

# Conclusion: Convention Profits//结论：公约的好处

- Consistent API from top to bottom.
//从上到下的API一致
- Sneak in at any point to inject functionality. Testable, reusable, ...
//潜入任何点注入功能。可测试的，可重用的。。。
- When ruby and python users whine, you can smile condescendingly.
//当ruby和python用户抱怨时，你可以微笑（condescendingly:屈尊）
