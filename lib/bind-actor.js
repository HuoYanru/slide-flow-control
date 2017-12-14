module.exports = bindActor
function bindActor () {
  var args = 
        Array.prototype.slice.call
        (arguments) // jswtf.
    , obj = null
    , fn
  if (typeof args[0] === "object") {   //如果实参的第一个元素是 “ object ” ， obj 为 args 的第一个元素，fn为第二个元素，删除这两个元素
    obj = args.shift()
    fn = args.shift()          //fn
    if (typeof fn === "string")           //如果fn是字符串，
      fn = obj[ fn ]
  } else fn = args.shift()
  return function (cb) {
    fn.apply(obj, args.concat(cb)) }
}
