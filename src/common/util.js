(function(global) {
  'use strict';

  let self = {
    arrayToMap: (data, idAttribute = 'id') => {
      if(!data) {
        return undefined;
      }
      let hash = {};
      data.forEach((item) => {
        hash[item[idAttribute]] = item;
      })
      return hash;
    },

    ORDER_STATUS: {

        'PAID': {id: 1, name: '已支付'},
        'BOOK': {id: 2, name: '已预约'},
        'DONE': {id: 3, name: '体检完成'},
        'REFUND': {id: 9, name: '部分退款'},
        'EXPORT_ERROR': {id: 10, name: '导出错误'},
        'LOCAL_PAY': {id: 11, name: '现场付款'},
        'UNPAY': {id: 0, name: '未支付'},
        'REVOKED': {id: 5, name: '已撤销'},
        'DELETE': {id: 6, name: '已删除'},
        'PAYING': {id: 7, name: '支付中'},
        'CLOSE': {id: 8, name: '已关闭'}
    },

    isEmpty(s) {
      return (s === undefined || s === null || s === '');
    },

    isPassword: (pwd) => {
      return pwd.match("^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{8,20}$");
    },

    isEmptyObject(e) {
      var t;
      for (t in e)
        return !1;
      return !0
    },

    equals(a, b) {
      if (a instanceof Array && b instanceof Array) {
        let ac = Object.assign([], a);
        let bc = Object.assign([], b);
        if (a.length == b.length) {
          ac = ac.sort();
          bc = bc.sort();
          return ac.toString() == bc.toString();
        }
      }
      return a == b;
    },

    getFirstAndLastDayOfMonth(year, month) {
      let lastdate = '';
      let firstdate = '';
      if (year && month) {
        firstdate = year + '-' + month + '-01';

        let day = new Date(year, month, 0);
        lastdate = year + '-' + month + '-' + day.getDate();
      }

      return [firstdate, lastdate];

    },

    // 数组操作 start
    allIn: function(partArray, allArray) {
      if (!allArray || allArray.length == 0) {
        return false
      }
      return partArray.every(item => {
        return allArray.indexOf(item) > -1;
      })
    },

    someIn: function(partArray, allArray) {
      return partArray.some(item => {
        return allArray.indexOf(item) > -1;
      })
    },

    merge: function(array1, array2) {
      array2.forEach(item => {
        if (array1.indexOf(item) < 0) {
          array1.push(item);
        }
      })
      return array1;
    },

    split: function(array1, array2) {
      array1 = array1.filter(item => {
        return array2.indexOf(item) < 0;
      })
      return array1;
    }
    // 数组操作 end

  };

  Date.prototype.format = function(format) {
      var o = {
          "M+": this.getMonth() + 1,
          "d+": this.getDate(),
          "h+": this.getHours(),
          "m+": this.getMinutes(),
          "s+": this.getSeconds(),
          "q+": Math.floor((this.getMonth() + 3) / 3),
          "S": this.getMilliseconds()
      }
      if (/(y+)/.test(format)) {
          format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
      }
      for (var k in o) {
          if (new RegExp("(" + k + ")").test(format)) {
              format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
          }
      }
      return format;
  }

  global.myUtil = self;

})(window);
