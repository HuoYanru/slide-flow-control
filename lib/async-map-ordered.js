
throw new Error("TODO: Not yet implemented.")
//抛出新错误：尚未执行
/*
usage:

Like asyncMap, but only can take a single cb, and guarantees
the order of the results.
*/
//用法:就像asyncMap,但是只能用简单的cb，并且保证结果的顺序

module.exports = asyncMapOrdered
//fn，cb类型需为function
function asyncMapOrdered (list, fn, cb_) {
	//判断cb_的类型是否是“function”，如果不是，则抛出错误
  if (typeof cb_ !== "function") throw new Error(
    "No callback provided to asyncMapOrdered")
	
	//判断fn的类型是否为function，若不是，抛出错误
  if (typeof fn !== "function") throw new Error(
    "No map function provided to asyncMapOrdered")
	
	//如果list的值和类型为undefined或null时，返回。。
  if (list === undefined || list === null) return cb_(null, [])
  //当list不为数组时，将它变成数组
  if (!Array.isArray(list)) list = [list]
  //当list的长度为空时，返回。。
  if (!list.length) return cb_(null, [])

	//定义
  var errState = null
    , l = list.length
    , a = l              //a是list长度
    , res = []
    , resCount = 0
    , maxArgLen = 0
	//定义cb函数
  function cb (index) { return function () {
  	//当有错误状态时，返回
    if (errState) return
    var er = arguments[0]     //er为实参的第一个元素
    var argLen = arguments.length    //argLen为实参长度
    maxArgLen = Math.max(maxArgLen, argLen)   //若实参的长度大于 0 ，则返回实参长度，否则返回0
    res[index] = argLen === 1 ? [er] : Array.apply(null, arguments)  //实参长度等于 1 时，返回er，否则返回数组

    // see if any new things have been added.看是否有新东西被加入
    if (list.length > l) {
      var newList = list.slice(l)
      a += (list.length - l)          //a
      var oldLen = l
      l = list.length
      process.nextTick(function () {
        newList.forEach(function (ar, i) { fn(ar, cb(i + oldLen)) })
      })
    }
		
		//如果没有错误或
    if (er || --a === 0) {
      errState = er
      cb_.apply(null, [errState].concat(flip(res, resCount, maxArgLen)))
    }
  }}
  // expect the supplied cb function to be called
  // "n" times for each thing in the array.
  list.forEach(function (ar) {
    steps.forEach(function (fn, i) { fn(ar, cb(i)) })
  })
}

function flip (res, resCount, argLen) {
  var flat = []
  // res = [[er, x, y], [er, x1, y1], [er, x2, y2, z2]]
  // return [[x, x1, x2], [y, y1, y2], [undefined, undefined, z2]]
  
