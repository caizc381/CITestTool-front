import Vue from 'vue'
import filters from '../../filters'

const dataSource = {

  orderStatusList: [
    {id: 1, name: '已支付'},
    {id: 2, name: '已预约'},
    {id: 3, name: '体检完成'},
    {id: 9, name: '部分退款'},
    {id: 10, name: '导出错误'},
    {id: 110, name: '已导出'},
    {id: 0, name: '未支付'},
    {id: 5, name: '已撤销'},
    {id: 6, name: '已删除'},
    {id: 7, name: '支付中'},
    {id: 8, name: '已关闭'}

  ],

  // 有效订单状态
  validStatusList: [1, 2, 3, 9, 10, 110], // 已支付、已预约、体检完成、部分退款、导出失败、已导出

  /*
  * 获取体检中心容量，改期时用于展示可选日期
  */
  getBookDate(monthDayRange, companyId, hospitalId) {
    let param = {
      hospitalId: hospitalId,
      companyId: companyId,
      startDate: monthDayRange[0],
      endDate: monthDayRange[1]
    }
    return Vue.http.post('capacity', JSON.stringify(param));
  },

  /*
  * 发送短信
  */
  sendMsg(param) {
    return Vue.http.post('batchSendMsg', JSON.stringify(param));
  },

  /*
  * 撤销订单
  */
  revokeChannelOrder(param) {
    return Vue.http.post('revokeChannelOrder', JSON.stringify(param));
  },

  /*
  * 根据订单id获取订单详情
  */
  getOrderDetails(orderId) {
    return Vue.http.get('getOrderDetails?orderId=' + orderId);
  },

  /**
   * 确认是否可以导出查看
   * @param {*} query
   */
  isExportCheckbookOverRange(query){
    let paramObj = this.formatParam(query,undefined);
  return Vue.http.post('isExportCheckbookOverRange', JSON.stringify(paramObj));
  },
  /*
  * 导出查看
  */
  exportExamine(query) {
    let data = this.formatParam(query,undefined);

    let form = $('<form id="ngDownloadForm" style="display:none" method="POST" action="' + Vue.http.options.root +'/exportCheckbook"></form>');
    if (data) {
        let paramKey = Object.keys(data);
        paramKey.forEach(function (key) {
          //去除undefined的值
          if(data[key]!== undefined){
              form.append('<input type="hidden" name="' + key + '" value="' + data[key] + '">');
          }
        });
    }
    $('body').append(form);
    let ngDownloadForm = $('#ngDownloadForm');
    ngDownloadForm.submit();
    ngDownloadForm.remove();
    // return Vue.http.post('exportCheckbook',JSON.stringify(paramObj));
  },

  /*
  * 标记订单结算状态
  */
  signOrderSettle(param) {
    return Vue.http.post('signOrderSettle', JSON.stringify(param));
  },

  /*
  * 订单改期
  */
  changeOrderExamDate(param) {
    return Vue.http.post('changeOrderExamDate', JSON.stringify(param));
  },

  /**
   * 获取订单项目id
   */
  getOrderItems(orderId){
    return Vue.http.get('orderExamItems?orderId='+orderId);
  },
  //判断当前项目人数预留
  modifyItemCheckCapacity(order,rangeId,selectDay){
    let param ={
      companyId : order.examCompanyId,
      hospitalId: order.hospital.id,
      dayRangeId:rangeId,
      examItemIdList:order.itemIds,
      currDate:selectDay
    };
    return Vue.http.post('modifyItemCheckCapacity',JSON.stringify(param));
  },
  /*
  * 根据渠道商id获取对应的 体检中心 和 单位
  */
  getHospitalAndCompany(channelId) {
    return Vue.http.get('getHospitalsAndCompanysByOrganizationId?channelId=' + channelId);
  },

  getAllOrder(query, page) {
    let pa = Object.assign({}, page);
    pa.currentPage = 1;
    pa.pageSize = 3000;

    let paramObj = this.formatParam(query,pa);

    return Vue.http.post('selectAll', JSON.stringify(paramObj));
  },

  deepClone(initalObj) {
    if (typeof initalObj != 'object') {
      return initalObj;
    }
    let obj = {};
    obj = JSON.parse(JSON.stringify(initalObj));
    return obj;
  },

  /*
  * 根据查询条件获取订单列表
  */
  getOrder: function(queryObj, page) {
    let query = this.deepClone(queryObj);
    let pa = Object.assign({}, page);

    let paramObj = this.formatParam(query,pa);

    return Vue.http.post('listChannelMongoOrders', JSON.stringify(paramObj));
  },

  formatParam( query, page) {
    var obj = this.getOrderStatuses(query);
    let paramObj = {
      hospitalIds: query.hospital.val === -1 ? undefined : [query.hospital.val],
      channelCompanyIds: query.company.val === -1 ? undefined : [query.company.val],
      gender: (query.gender.val === -1) ? undefined : query.gender.val,
      orderStatuses: obj.orderStatuses,
      keyWord: query.nameOrIdCard.val ? query.nameOrIdCard.val : undefined,
      isSelfMoneyZero: (query.hasSelfPay.val === -1) ? undefined : !query.hasSelfPay.val,
      isExport: obj.isExport,
      fromSites: query.fromSite.val ? [query.fromSite.val] : undefined
    };

    let startDate = query.dateRange.val[0] ? new Date(filters.date(query.dateRange.val[0]) + ' 00:00:00') : undefined;
    let endDate = query.dateRange.val[1] ?  new Date(filters.date(query.dateRange.val[1]) + ' 23:59:59') : undefined;

    if (query.dateType.val === 'bookDate') {
      paramObj.insertStartDate = startDate;
      paramObj.insertEndDate = endDate;
    } else {
      paramObj.examStartDate = startDate;
      paramObj.examEndDate = endDate;
    }

    if(page){
      paramObj.page = page;
    }

    return paramObj;
  },

  // 过滤订单状态，当仅显示有效订单时
  getOrderStatuses(query) {
    let obj = {};
    let statusList = this.deepClone(query.orderStatuses.val);
    if(statusList.indexOf(110) > -1){
      statusList.splice(statusList.indexOf(110),1);
      if(statusList.indexOf(2) < 0){
        // 只选择了已经导出，未选择已预约
        statusList.push(2);
        obj.isExport = true;
      } else {
        obj.isExport = undefined;
      }
    } else {
       obj.isExport = false;
    }
    if (query.onlyShowValid.val) {
      statusList = statusList.filter(sta => this.validStatusList.includes(sta));
    }
    if (statusList.length ===  0) {
      statusList = [-1];
    }
    obj.orderStatuses = statusList
    return obj;
  },

  parseShowVal(item, hospitals, companies) {
    let showWord = '';
    switch(item.name)
    {
    case 'gender':
      showWord = filters.gender(item.val);
      break;

    case 'dateType':
      showWord = filters.dateType(item.val);
      break;

    case 'orderStatuses':
      let statusList = item.val;
      if (statusList instanceof Array) {
        statusList = statusList.map(function(s) {
          return filters.orderStatus(s);
        })

        if (statusList.length === this.orderStatusList.length) {
          showWord = '全部';
        } else {
          showWord = statusList.length === 0 ? '无' : statusList.join(', ');
        }
      }
      break;

    case 'hospital':
      let hospitalName;
      hospitals.forEach((hos) => {
        if (hos.id == item.val) {
          hospitalName = hos.name;
        }
      })
      showWord = hospitalName || '全部';
      break;

    case 'company':
      let companyName;
      companies.forEach((comp) => {
        if (comp.id == item.val) {
          companyName = comp.name;
        }
      })
      showWord = companyName || '全部';
      break;

    case 'dateRange':
      let dateRange = item.val;
      if (dateRange instanceof Array) {
        dateRange = dateRange.map(function(s) {
          let dateNum = new Date(s).getTime();
          return filters.date(dateNum, 'yyyy-MM-dd');
        })
        showWord = dateRange[0] === '1970-01-01' ? '全部' : dateRange.join(' 至 ');
      }
      break;

    case 'hasSelfPay':
      showWord = filters.boolean(item.val, 2) || '全部';
      break;

    case 'onlyShowValid':
      showWord = filters.boolean(item.val, 1) || '全部';
      break;

    case 'nameOrIdCard':
      showWord = item.val || '无';
      break;

    default:
      showWord = item.val;
    }

    return showWord;
  },

  parseDateList(dateList, dayRanges) {
    let res = [];

    if (dateList && dateList.length > 0) {
      this.fillEmptyDate(dateList[0], res);
      for (let i=0; i<dateList.length; i++) {
        let dateObj = dateList[i];
        dateObj = this.assembleDisplayDate(dateObj, dayRanges);
        res.push(dateObj);
      }

    }

    return res;
  },

  fillEmptyDate(dateObj, res) {
    let date = new Date(dateObj.date);
    let weekday = date.getDay();
    let fillNum = (weekday === 0 ? 6 : weekday - 1);
    while (fillNum > 0) {
      res.push({
        weekday: '',
        date: '',
        ranges: [],
        indicators: ''
      })
      fillNum--;
    }
  },

  assembleDisplayDate(dateObj, dayRanges) {
    let date = new Date(dateObj.date);

    dateObj.weekday = filters.weekday(date.getDay()); // 星期
    dateObj.date = date.format('dd'); // 日期
    dateObj.ranges = this.assembleDateRangeList(this.getDayRangesObj(dayRanges), dateObj); // 时段

    return dateObj;
  },

  getDayRangesObj(dayRanges) {
    let dayRangesObj = {};
    for (let i=0; i<dayRanges.length; i++) {
      dayRangesObj[dayRanges[i].id] = dayRanges[i];
    }
    return dayRangesObj;
  },

  assembleDateRangeList(dayRangesObj, dateObj) {
    let ranges = [];
    for (let i=0; i<dateObj.durationAvaliables.length; i++) {

      let r = dayRangesObj[dateObj.durationAvaliables[i]];
      // 去除内部使用时段
      if (!r.internalUsePeriod) {
        ranges.push(r);
      }

    }
    return ranges;
  }

}

export default dataSource;
