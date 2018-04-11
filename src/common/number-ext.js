/**
 * 对 Number.prototype 扩展 乘mul / 除div / 加add / 减sub / 保留小数fix 五个方法
 * summary: 用于修复JS原生对浮点数计算丢失精度的问题 https://segmentfault.com/a/1190000005022170
 * exmple: (0.2).add(0.4) // 0.6  (1.335).fix(2) // 1.33
 */

// 除法函数，用来得到精确的除法结果
// 说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
// 调用：accDiv(arg1,arg2)
// 返回值：arg1除以arg2的精确结果
function accDiv (arg1, arg2) {
  var t1 = 0, t2 = 0, r1, r2;
  try{t1 = arg1.toString().split(".")[1].length}catch(e){}
  try{t2 = arg2.toString().split(".")[1].length}catch(e){}
  r1 = Number(arg1.toString().replace(".",""));
  r2 = Number(arg2.toString().replace(".",""));
  return (r1 / r2) * Math.pow(10, t2 - t1);
}

//乘法函数，用来得到精确的乘法结果
//说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
//调用：accMul(arg1,arg2)
//返回值：arg1乘以arg2的精确结果
function accMul(arg1, arg2){
  var m = 0,s1 = arg1.toString(),s2 = arg2.toString();
  try{m += s1.split(".")[1].length}catch(e){}
  try{m += s2.split(".")[1].length}catch(e){}
  return Number(s1.replace(".","")) * Number(s2.replace(".","")) / Math.pow(10,m);
}

//加法函数，用来得到精确的加法结果
//说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
//调用：accAdd(arg1,arg2)
//返回值：arg1加上arg2的精确结果
function accAdd(arg1, arg2){
  var r1, r2, m;
  try{r1 = arg1.toString().split(".")[1].length}catch(e){r1 = 0}
  try{r2 = arg2.toString().split(".")[1].length}catch(e){r2 = 0}
  m = Math.pow(10,Math.max(r1,r2));
  return (arg1 * m + arg2 * m) / m;
}

//减法函数
function accSub(arg1, arg2){
  var r1, r2, m, n;
  try{r1 = arg1.toString().split(".")[1].length}catch(e){r1 = 0}
  try{r2 = arg2.toString().split(".")[1].length}catch(e){r2 = 0}
  m = Math.pow(10,Math.max(r1,r2));
  //last modify by deeka
  //动态控制精度长度
  n = (r1 >= r2) ? r1 : r2;
  return ((arg2 * m - arg1 * m) / m).toFixed(n);
}

// toFixed 修复 1.335.toFixed(2) => 1.33
function toFixed(s, num) {
    var times = Math.pow(10, s)
    var des = num * times + 0.5
    des = parseInt(des, 10) / times
    return des + ''
}

function extend(targetObj, data){
  for(var key in data){
    !targetObj.hasOwnProperty(key) && (targetObj[key]=data[key]);
  }
  return targetObj;
}

extend(Number.prototype, {
  mul: function(arg){
    return accMul(arg, this);
  },
  add: function(arg){
    return accAdd(arg, this);
  },
  div: function(arg){
    return accDiv(arg, this);
  },
  sub: function(arg){
    return accSub(arg, this);
  },
  fix: function(arg){
    return toFixed(arg, this)
  }
})

export { accDiv, accMul, accAdd, accSub, toFixed }
