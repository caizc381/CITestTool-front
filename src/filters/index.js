import Vue from 'vue'
import {DataMore} from './../views/m_orderAndUser/order/data'
Vue.filter('empty', function(value) {
    return value == '' ? '无' : value
});

//格式化时间
Vue.filter('formatDate', MyUtil.formatDate)

Vue.filter('date', function(time, fmt) {
  if (!time) {
    return '';
  }
  return MyUtil.formatDate(new Date(time), fmt);
})

//toString
Vue.filter('toStr', function(value) {
    return value.toString();
});

//过滤性别
Vue.filter('filterGender', function(value) {
    if (value == 2) return "通用";
    else if (value == 0) return "男";
    else if (value == 1) return "女";
});

//金额，symbol(￥)
Vue.filter('money', function(value, symbol = '') {
  if (value === undefined || value === null) {
    return ''
  }
  var flag = '';
  if(value > 0){
    flag = '+';
  }else{
    flag = '-';
  }
  return symbol + (value/100).toFixed(2);
});

//金额,symbol(￥),区分正负
Vue.filter('moneyAddSymbol', function(value, symbol = '￥') {
  if (value === undefined || value === null) {
    return ''
  }
  var flag = '';
  if(value > 0){
    flag = '+';
  }
  return symbol + flag + (value/100).toFixed(2);
});

Vue.filter('boolean', function(value) {
  if (value === undefined || value === null || value === '') {
    return '';
  } else if (value == true) {
    return '是';
  } else if (value == false) {
    return '否';
  }
});

//百分比数据
Vue.filter('toPercentage', function(value) {
    if(!value){
      return '0%';
    }else if(value == '/'){
      return value;
    }
    else{
      return (value*100).toFixed(2)+'%';
    }  
});

//两位小数
Vue.filter('twoDecimal', function(value) {
   value = value.toString();
   if(value.indexOf('.') > -1){
     return parseFloat(value).toFixed(2);
   }else {
     return value;
   } 
});

//订单状态
Vue.filter('status', function (value) {
  let arr = DataMore.orderStatusesArr;
  let statusText = "";
  arr.map(res => {
    if (res.value === value) {
      statusText = res.label;
    }
  });
  return statusText
});
