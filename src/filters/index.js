import Vue from 'vue'

const filters = {

  empty: function (val) {
    return val == '' ? '无' : val;
  },

  /*
  * boolean 转换为 中文
  */
  boolean: function (val, type = 1) {
    // boolean 转换中文 格式
    let BOOLEAN_MAP = {
      1: {
        'true': '是',
        'false': '否'
      },
      2: {
        'true': '有',
        'false': '无'
      }
    };
    let str = '';
    if (val === 0 || val === false || val === '0') {
      str = BOOLEAN_MAP[type]['false'];
    } else if (val === 1 || val === true || val === '1') {
      str = BOOLEAN_MAP[type]['true'];
    }
    return str;
  },

  date: function(longTypeDate, sdf = 'yyyy-MM-dd') {
    if (myUtil.isEmpty(longTypeDate)) {
      return '';
    }
    let d = new Date(longTypeDate);
    return d.format(sdf);
  },

  dateType: function (val) {
    let str = '';
    if (val === 'bookDate') {
      str = '预约时间';
    } else if (val === 'examDate') {
      str = '体检时间';
    }
    return str;
  },

  /*
  * 性别转化
  */
  gender: function (num) {
    let str = '';
    if (num === -1) {
      str = '全部';
    } else if (num === 0) {
      str = '男';
    } else if (num === 1) {
      str = '女';
    }
    return str;
  },

  /*
  * 订单状态转化
  */
  orderStatus: function (num) {
    let str = '';
    switch (num) {

      case 0: str = '未支付'; break;
      case 1: str = '已支付'; break;
      case 2: str = '已预约'; break;
      case 3: str = '体检完成'; break;
      case 5: str = '已撤销'; break;
      case 6: str = '已删除'; break;
      case 7: str = '支付中'; break;
      case 8: str = '已关闭'; break;
      case 9: str = '部分退款'; break;
      case 10: str = '导出错误'; break;
      case 110: str = '已导出'; break;

      default:
    }
    return str;
  },
  /**
   * 标记状态转换
   */
  signStatus: function (num) {
    let str = '';
    switch (num) {

      case -1: str = '撤销结算'; break;
      case 1: str = '已结算'; break;
      default : str = '未结算';
    }
    return str;
  },

  /*
  * int型转化为钱，symbol 金钱符号（$、¥）
  */
  money: function (num, symbol = '') {
    let str = '';
    if (/^[-+]?\d+(\.\d+)?$/.test(num)) {
      str = symbol + (Number(num) / 100).toFixed(2);
    }
    return str;
  },

  weekday: function (num) {
    let str = '';
    switch (num) {
      case 0: str = '星期日'; break;
      case 1: str = '星期一'; break;
      case 2: str = '星期二'; break;
      case 3: str = '星期三'; break;
      case 4: str = '星期四'; break;
      case 5: str = '星期五'; break;
      case 6: str = '星期六'; break;

      default:
    }
    return str;

  },

  accountInfoFilter: function (input, attr) {
    var res = '';
    if (attr === 'gender') {
      if (input == '0') {
        res = '男';
      } else if (input == '1') {
        res = '女';
      } else {
        res = '';
      }
    } else if (attr === 'marriageStatus') {
      if (input == '0') {
        res = '未婚';
      } else if (input == '1') {
        res = '已婚';
      } else {
        res = '';
      }
    } else if (attr === 'retire') {
      if (input == '1') {
        res = '退休';
      } else if (input == '0') {
        res = '在职';
      } else  {
        res = '';
      }
    }
    return res
  }

};

Vue.filter('empty', filters.empty);
Vue.filter('date', filters.date);
Vue.filter('gender', filters.gender);
Vue.filter('orderStatus', filters.orderStatus);
Vue.filter('signStatus', filters.signStatus);
Vue.filter('money', filters.money);
Vue.filter('boolean', filters.boolean);
Vue.filter('accountInfo', filters.accountInfoFilter);

export default filters;
