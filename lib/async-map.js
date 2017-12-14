
/*
usage:

// do something to a list of things
asyncMap(myListOfStuff, function (thing, cb) { doSomething(thing.foo, cb) }, cb)
// do more than one thing to each item
asyncMap(list, fooFn, barFn, cb)

*/
用法:
	对一些事情做些什么
	对每个项目都做不止一件事情
	

module.exports = asyncMap
//公开asyncMap模块
function asyncMap () {
	//定义
  var steps = Array.prototype.slice.call(arguments)
    , list = steps.shift() || []        //list  返回数组的第一个元素并删除
    , cb_ = steps.pop()                 //cb_  返回数组的最后一个元素并删除
    
  if (typeof cb_ !== "function") throw new Error(
    "No callback provided to asyncMap")     //如果数组最后一个元素不是“function”，抛出错误“没有对asyncMap提供回调函数”
  if (!list) return cb_(null, [])         //如果实参的第一个元素为空，调用回调函数
  if (!Array.isArray(list)) list = [list]   //如果实参的第一个元素不为数组，list=[list],将元素变成数组形式
    
 var n = steps.length                    //n是step的长度
    , data = [] // 2d array
    , errState = null
    , l = list.length       //l为实参的第一个元素的长度
    , a = l * n         
    //判断是否为二维数组
  if (!a) return cb_(null, [])  //如果a是0（即第一个元素长度为0或数组长度为0），返回cb_(null,[])
  //cb函数
  function cb (er) {           
    if (er && !errState) errState = er //如果传入错误为真，而错误状态为null，则errstate=er

    var argLen = arguments.length
    for (var i = 1; i < argLen; i ++) if (arguments[i] !== undefined) {
      data[i - 1] = (data[i - 1] || []).concat(arguments[i])
    }//(data[i - 1] || [])：data[i-1]为空false，返回空数组。              data[i-1]=arguments[i]
    // see if any new things have been added.看一些新东西是否被加入
    if (list.length > l) {   //如果数组第一个元素的长度大于1
      var newList = list.slice(l)
      a += (list.length - l) * n //n为实参长度，
      l = list.length
      process.nextTick(function () { //process.nextTick让函数在下一个时间点运行
        newList.forEach(function (ar) {
          steps.forEach(function (fn) { fn(ar, cb) })
        })
      })
    }

    if (--a === 0) cb_.apply(null, [errState].concat(data))
  }
  // expect the supplied cb function to be called  期望提供的cb函数被调用
  // "n" times for each thing in the array.  数组中每个事物的n次。
  list.forEach(function (ar) {
    steps.forEach(function (fn) { fn(ar, cb) })
  })
}
