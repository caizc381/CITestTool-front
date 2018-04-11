<template>
  <div>
    <inner-header @handleChange="headerChange"/>

    <div class="approve-body body-content">
     <!-- 查询条件 -->
     <div>
        <span v-show="selectApprovedDateRange" class="ops-query mr5">
          <span>{{query.approvedDate[0] | date('yyyy-MM-dd')}} 至 {{query.approvedDate[1] | date('yyyy-MM-dd')}}</span>
          <Icon type="close" @click.native.stop="clearApprovedDate"></Icon>
        </span>

        <span v-show="selectRefundDateRange" class="ops-query mr5">
          <span>{{query.refundDate[0] | date('yyyy-MM-dd')}} 至 {{query.refundDate[1] | date('yyyy-MM-dd')}}</span>
          <Icon type="close" @click.native.stop="clearRefundDate"></Icon>
        </span>

        <span v-show="onlinePayQuery" class="ops-query mr5">
          <span>{{onlinePayQuery}}</span>
          <Icon type="close" @click.native="onlinePayQuery = '';changeOnlinePayQuery(undefined, undefined)"></Icon>
        </span>

        <span v-show="refundStatusQuery" class="ops-query mr5">
          <span>{{refundStatusQuery}}</span>
          <Icon type="close" @click.native="refundStatusQuery = '';changeRefundStatus([1, 2])"></Icon>
        </span>

      </div>

      <table frame=void class="mt-table mt10">
        <tr>
          <th>
            <DatePicker
              :open="openPicker"
              format="yyyy-MM-dd"
              v-model="query.approvedDate"
              type="daterange"
              placeholder="选择日期范围"
              @on-change="changeApprovedDate">
              <a class="ivu-dropdown hoverblue" @click="handlerClick('approvedDate')">
               审批时间 <i style="font-size:12px;" class="iconfont icon-guolvqi"></i>
              </a>
            </DatePicker>
          </th>
          <th>审批人</th>
          <th>
            <DatePicker
              :open="openRefundPicker"
              format="yyyy-MM-dd"
              v-model="query.refundDate"
              type="daterange"
              placeholder="选择日期范围"
              @on-change="changeRefundDate">
              <a class="ivu-dropdown hoverblue" @click="handlerClick('refundDate')">
               申请时间 <i style="font-size:12px;" class="iconfont icon-guolvqi"></i>
              </a>
            </DatePicker>
          </th>
          <th>体检人</th>
          <th>体检机构 / 单位</th>
          <th>退款总额</th>
          <th>单位支付</th>
          <th>体检卡支付</th>
          <th>
            <Dropdown trigger="click">
                <span class="ivu-dropdown hoverblue">
                    线上支付 <i style="font-size:12px;" class="iconfont icon-guolvqi"></i>
                </span>
                <Dropdown-menu slot="list">
                    <Dropdown-item @click.native="onlinePayQuery = '';changeOnlinePayQuery(undefined, undefined)">全部</Dropdown-item>
                    <Dropdown-item @click.native="onlinePayQuery = '0.00';changeOnlinePayQuery(0, 0)">0.00</Dropdown-item>
                    <Dropdown-item @click.native="onlinePayQuery = '大于0.00';changeOnlinePayQuery(0, undefined)">大于0.00</Dropdown-item>
                </Dropdown-menu>
            </Dropdown>
          </th>
          <th>现场支付</th>
          <th>
            <Dropdown trigger="click" menu-align="start">
              <span class="ivu-dropdown hoverblue">
                审批结果 <i style="font-size:12px;" class="iconfont icon-guolvqi"></i>
              </span>
              <Dropdown-menu slot="list">
                <Dropdown-item @click.native="refundStatusQuery = '';changeRefundStatus([1, 2])">全部</Dropdown-item>
                <Dropdown-item @click.native="refundStatusQuery = '同意退款';changeRefundStatus([1])">同意退款</Dropdown-item>
                <Dropdown-item @click.native="refundStatusQuery = '拒绝退款';changeRefundStatus([2])">拒绝退款</Dropdown-item>
              </Dropdown-menu>
            </Dropdown>
          </th>
        </tr>

        <tr v-if="orderList.length === 0"><td colspan="11"><div class="tc">没有数据</div></td></tr>
        <tr v-for="item in orderList">
          <td>
            <div>{{item.auditTime | date('yyyy-MM-dd')}}</div>
            <div class="gray">{{item.auditTime | date('hh:mm:ss')}}</div>
          </td>
          <td>{{item.operatorName}}</td>
          <td>
            <div>{{item.applyTime | date('yyyy-MM-dd')}}</div>
            <div class="gray">{{item.applyTime | date('hh:mm:ss')}}</div>
          </td>
          <td>
            <div>{{item.accountInfo.name}}</div>
            <div class="gray">{{item.accountInfo.idCard}}</div>
          </td>
          <td>
            <div>{{item.hospitalCompanyInfo.organizationName}}</div>
            <div class="gray"><span class="ops-tag" v-show="isPlatformCompany(item)">平台</span> {{item.hospitalCompanyInfo.name}}</div>
          </td>
          <td>{{item.amount | money}}</td>
          <td>{{item.payDetail.parentCardPayAmount | money}}</td>
          <td>{{item.payDetail.cardPayAmount | money}}</td>
          <td>{{item.payDetail.onlinePayAmount | money}}</td>
          <td>{{item.payDetail.offlinePayAmount | money}}</td>
          <td :class="{'successfont': item.status === 1, 'errorfont': item.status === 2}">

            {{item.status | refundStatus}}

            <Poptip trigger="hover" placement="top-end" v-show="item.reason">
                <Icon type="information-circled hoverblue"></Icon>
                <div slot="content">
                  <div class="ops-poptip-content">{{item.reason}}</div>
                </div>
            </Poptip>
          </td>
        </tr>

      </table>

      <div class="page-wrap">
        <Page
           :total="page.rowCount"
           :page-size="page.pageSize"
           :current-page="page.currentPage"
           show-total
           show-sizer
           :page-size-opts="[20, 50, 100]"
           @on-change="handleCurrentChange"
           @on-page-size-change="handleSizeChange">
        </Page>
      </div>
    </div>

  </div>
</template>

<script>
import InnerHeader from './components/InnerHeader'

export default {
  name: 'WillApprove',
  components: {
    'inner-header': InnerHeader
  },

  data() {
    return {
      height: '',

      orderList: [],

      query: {
        account: '',
        fromSite: undefined,
        hospitalCompanyId: undefined,
        approvedDate: [],
        refundDate: [],

        auditStartTime: undefined,
        auditEndTime: undefined,
        applyStartTime: undefined,
        applyEndTime: undefined,
        minOnlinePay: undefined, // 最小线上支付金额
        maxOnlinePay: undefined, // 最大线上支付金额

        refundType: 0,
        scene: 3,
        statusList: [1, 2],

        addressIds: [],
      },
      onlinePayQuery: '',
      refundStatusQuery: '',

      page: {
        rowCount: -1,
        currentPage: 1,
        pageSize: 20
      },
      
      openPicker: false,
      openRefundPicker: false,
    };
  },

  filters: {
    refundStatus: function(status) {
      if (status === 1) {
        return '同意退款';
      } else if (status === 2) {
        return '拒绝退款';
      }
      return '';
    }
  },

  methods: {
    clearApprovedDate() {
      this.query.approvedDate = [];
      this.searchOrder();
    },

    clearRefundDate() {
      this.query.refundDate = [];
      this.searchOrder();
    },

    isPlatformCompany(comp) {
      return (comp.hospitalCompanyInfo.platformCompanyId && comp.hospitalCompanyInfo.platformCompanyId > 3);
    },

    changeRefundStatus(statusList) {
      this.query.statusList = statusList;
      this.searchOrder();
    },

    changeOnlinePayQuery(min, max) {
      this.query.minOnlinePay = min;
      this.query.maxOnlinePay = max;

      this.searchOrder();
    },

    headerChange(terms) {
      this.query = Object.assign(this.query, terms);
      this.searchOrder();
    },

    changeApprovedDate(val){
      this.query.approvedDate = val
      this.openPicker = false
      this.searchOrder();
    },

    changeRefundDate(val){
      this.query.refundDate = val
      this.openRefundPicker = false
      this.searchOrder();
    },

    handlerClick(refId){
      if(refId == 'refundDate'){
        this.openRefundPicker = !this.openRefundPicker
      }else{
        this.openPicker = !this.openPicker
      }
    },

    searchOrder() {
      this.$http.post('/orderrefund/listRefundApplyRecord', JSON.stringify(this.assembleParams())).then((response) => {
        this.orderList = response.body.records;
        this.page = response.body.page;
      }, (res) => {
      });
    },

    assembleParams() {
      let param = JSON.parse(JSON.stringify(Object.assign(this.query, this.page)));

      if (this.selectRefundDateRange) {
        param.applyStartTime = this.query.refundDate[0];
        param.applyEndTime = this.query.refundDate[1];
      }
      if (this.selectApprovedDateRange) {
        param.auditStartTime = this.query.approvedDate[0];
        param.auditEndTime = this.query.approvedDate[1];
      }
      param.provinceId = this.query.addressIds[0];
      param.cityId = this.query.addressIds[1];
      param.districtId = this.query.addressIds[2];

      return param;
    },

    // 切换分页显示条数
    handleSizeChange(val) {
      this.page.pageSize = val;
      this.searchOrder(true);
    },

    // 切换分页
    handleCurrentChange(val) {
      this.page.currentPage = val;
      this.searchOrder(true);
    },

  },

  computed: {
    selectRefundDateRange() {
      return this.query.refundDate.length > 0 && !!this.query.refundDate[0];
    },

    selectApprovedDateRange() {
      return this.query.approvedDate.length > 0 && !!this.query.approvedDate[0];
    },
  },

  mounted(){
    this.searchOrder();
  }
};
</script>

<style lang="less">
.approve-body {
  overflow-x: auto;
  .approve-body-head {
    padding-bottom: 10px;
    padding-top: 10px;
    height: 50px;
    .approve-body-head-left {
      position: absolute;
      bottom: 10px;
    }
    .approve-body-head-right {
      position: absolute;
      right: 0px;
      text-align: right;
    }
  }
}
.ops-poptip-content {
  max-width: 200px;
  white-space: normal;
}
</style>
