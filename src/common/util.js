var MyUtil = {
  isValidCompanyName: function (name) {
    const expr = /^[\u4e00-\u9fa5a-zA-Z0-9()（）]+$/
    return name && expr.test(name)
  },

  formatDate: function (date, fmt) {
    if (!date) {
      return date
    }
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    const o = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds(),
    }
    for (const k in o) {
      if (new RegExp(`(${k})`).test(fmt)) {
        const str = o[k] + ''
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : (('00' + o[k]).substr(('' + o[k]).length)))
      }
    }
    return fmt
  },

  getBeginningOfDate (date) {
    if (!date) {
      return date
    }
    return new Date(this.formatDate(date, 'yyyy/MM/dd') + ' 00:00:00')
  },

  getEnddingOfDate (date) {
    if (!date) {
      return date
    }
    return new Date(this.formatDate(date, 'yyyy/MM/dd') + ' 23:59:59')
  },

  filterBeginningOfDate (date) {
    if (!date) {
      return date
    }
    return date + ' 00:00:00'
  },

  filterEnddingOfDate (date) {
    if (!date) {
      return date
    }
    return date + ' 23:59:59'
  },

  // 数组操作 start
  allIn: function (partArray, allArray) {
    return partArray.every(item => {
      return allArray.indexOf(item) > -1
    })
  },

  someIn: function (partArray, allArray) {
    return partArray.some(item => {
      return allArray.indexOf(item) > -1
    })
  },

  merge: function (array1, array2) {
    array2.forEach(item => {
      if (array1.indexOf(item) < 0) {
        array1.push(item)
      }
    })
    return array1
  },

  split: function (array1, array2) {
    array1 = array1.filter(item => {
      return array2.indexOf(item) < 0
    })
    return array1
  },
  // 数组操作 end

  // 获取天数list
  getDaysList: function (max, text) {
    var list = []
    for (let i = 1; i <= max; i++) {
      list.push({ 'id': i, 'name': i + text })
    }
    return list
  },

  // 30位数字及‘-’
  isPhone: function(mobile){
    var re = /^[0-9-]{1,30}$/;
    return re.test(mobile);
  },

  // 11位手机号
  isMobile: function(mobile){
    var re = /^(1[0-9]{2})[0-9]{8}$/;
    return re.test(mobile);
  },

  //年业务量验证
  isBusinessAmount: function(num){
    var re = /^[0-9]{1,10}$/;
    return re.test(num);
  },

  // 网址
  isUrl: function (url) {
    var re = /^[0-9a-zA-Z]{1,16}$/
    return re.test(url)
  },

  // crm账号名
  isCrmName: function (name) {
    var re = /^[0-9a-zA-Z]{1,30}$/
    return re.test(name)
  },

  isEmail: function (mail) {
    var re = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
    return re.test(mail)
  },

  // 获取远端图片地址
  imageRemoteSite: function () {
    return (document.location.hostname === 'www.mytijian.com' || document.location.hostname === 'vip.mytijian.com' || document.location.hostname === 'mytijian.com') ? 'https://mytijian-img.oss-cn-hangzhou.aliyuncs.com/' : (document.location.hostname === 'stage2.mytijian.cn' ? 'https://yufa.oss-cn-hangzhou.aliyuncs.com/' : 'https://test-i.oss-cn-shanghai.aliyuncs.com/')
  },

  // 10M 以内的 jpg 或 png 图片
  isValidImg (file) {
    var suffix = file.name.substr(file.name.indexOf('.'))
    var pureName = file.name.substr(0, file.name.indexOf('.'))

    return (file.size < 10 * 1024 * 1024 &&
      (suffix === '.jpg' || suffix === '.png' || suffix === '.gif' || suffix === '.jpeg') &&
      /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(pureName))
  },

  obj2UrlPms: function (obj) {
    return Object.keys(obj).map(v => `${v}=${obj[v]}`).join('&')
  },
  guid: function (prefix, len) {
    len = len || 32
    prefix = prefix || 'id'
    function S4 () {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
    }
    return prefix + (S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4()).substring(0, len)
  },

  isIdCard: (idCard) => {
    var re = /^[1-9](\d{7}|\d{5}[1-9]\d{3})((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{3})|(\d{4})|\d{3}[Xx])$/;
    return re.test(idCard);
  },

  toMap: function (list, key) {
    if (!list) return list
    let map = {}
    list.forEach(item => { map[item[key]] = item })
    return map
  },

  groupBy: function (list, key) {
    const tar = {}
    list.forEach(item => {
      if (!tar[item[key]]) {
        tar[item[key]] = [item]
      } else {
        tar[item[key]].push(item)
      }
    })
    return tar
  },

  // 金额不正确. 金额应该是 大于等于0 小于等于100,000的数字. 最多精确到两位小数.
  // minus 是否可以为负数
  isMoney: function (str, minus) {
    if (str === undefined || str == null || str === '') {
      return true
    }
    let reg = minus ? /^-?\d{1,7}(\.\d{1,2})?$/ : /^\d{1,7}(\.\d{1,2})?$/
    return reg.test(str + '');
  },

  isDiscount: function (str) {
    if (str === undefined || str == null || str === '') {
      return true
    }
    return /^(0\.(?!0+$)\d{1,2}|1\.(?!0+$)\d{1,2}|1(\.0{1,2})?|2(\.0{1,2})?)$/.test(str + '')
  },

  contain: function (src, str) {
    return src && (src + '').toUpperCase().indexOf(str.toUpperCase()) > -1
  },
}

window.MyUtil = MyUtil
