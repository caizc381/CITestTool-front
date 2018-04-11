<template>
  <div>
    <inner-header @handleChange="headerChange"/>

    <div class="approve-body body-content" style="padding-top: 0px;">

      <div class="ivu-row approve-body-head">
        <i-col :span="16" class="approve-body-head-left">
          <label>
            <Checkbox
              :indeterminate="indeterminateAll"
              :value="checkAll"
              @click.prevent.native="handleCheckAll"
              :disabled="loadingAll">全选</Checkbox>
          </label>
          <span v-show="checkGroup.length" class="ml10">已选<span class="redfont">{{checkGroup.length}}</span>条</span>
          <label class="ml10">
            <Checkbox v-model="query.recentThreeDay" :disabled="selectDateRange" @on-change="changeRecentThreeDay">隐藏最近三日退款</Checkbox>
          </label>
        </i-col>

        <i-col :span="8" class="approve-body-head-right">
          <i-button type="success" v-permission="'refundApprove:willApprove:agree'" @click="agree()">同意退款</i-button>
          <i-button type="error" v-permission="'refundApprove:willApprove:refuse'" class="ml10" @click="refuse()">拒绝退款</i-button>
        </i-col>
      </div>

      <div style="padding-bottom:10px">
        <span v-show="selectDateRange" class="ops-query mr5">
          <span>{{query.daterange[0] | date('yyyy-MM-dd')}} 至 {{query.daterange[1] | date('yyyy-MM-dd')}}</span>
          <Icon type="close" @click.native.stop="clearDateRange()"></Icon>
        </span>

        <span v-show="onlinePayQuery" class="ops-query mr5">
          <span>{{onlinePayQuery}}</span>
          <Icon type="close" @click.native="onlinePayQuery = '';changeOnlinePayQuery(undefined, undefined)"></Icon>
        </span>

        <span v-show="refundTypeQuery" class="ops-query mr5">
          <span>{{refundTypeQuery}}</span>
          <Icon type="close" @click.native="refundTypeQuery = '';changeRefundType(undefined)"></Icon>
        </span>

      </div>

      <div class="check-table-wrap">
        <Checkbox
          class="check-page"
          :indeterminate="indeterminatePage"
          v-model="checkPage"
          @click.prevent.native="handlecheckPage">{{checkPageLabel}}</Checkbox>
        <Checkbox-group v-model="checkGroup" @on-change="checkGroupChange">
          <table class="mt-table">
            <tr>
              <th style="width: 40px;"></th>
              <th>
                <DatePicker
                  :open="openPicker"
                  v-model="query.daterange"
                  type="daterange"
                  @on-change="dateRangeChange">
                  <a class="ivu-dropdown hoverblue" @click="handlerClick">
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
                <Dropdown trigger="click">
                    <span class="ivu-dropdown hoverblue">
                        退款类型 <i style="font-size:12px;" class="iconfont icon-guolvqi"></i>
                    </span>
                    <Dropdown-menu slot="list">
                        <Dropdown-item @click.native="refundTypeQuery = '';changeRefundType(undefined)">全部</Dropdown-item>
                        <Dropdown-item @click.native="refundTypeQuery = '全额退款';changeRefundType(0)">全额退款</Dropdown-item>
                        <Dropdown-item @click.native="refundTypeQuery = '部分退款';changeRefundType(1)">部分退款</Dropdown-item>
                    </Dropdown-menu>
                </Dropdown>
              </th>
              <th width="100">操作</th>
            </tr>

            <tr v-if="orderList.length === 0"><td colspan="11"><div class="tc">没有数据</div></td></tr>

              <tr v-for="item in orderList" :key="item.orderNum">
                <td style="text-align: center;"><Checkbox :key="item.orderNum" :label="item.orderNum" class="hidden-label"></Checkbox></td>
                <td>
                  <div>{{item.applyTime | date('yyyy-MM-dd')}}</div>
                  <div class="gray">{{item.applyTime | date('hh:mm:ss')}}</div>
                </td>
                <td>
                  <div v-if="item.accountInfo">{{item.accountInfo.name}}</div>
                  <div class="gray" v-if="item.accountInfo">{{item.accountInfo.idCard}}</div>
                </td>
                <td style="text-align: left;">
                  <div>{{item.hospitalCompanyInfo.organizationName}}</div>
                  <div class="gray"><span class="ops-tag" v-show="isPlatformCompany(item)">平台</span> {{item.hospitalCompanyInfo.name}}</div>
                </td>
                <td>{{item.amount | money}}</td>
                <td>{{item.payDetail.parentCardPayAmount | money}}</td>
                <td>{{item.payDetail.cardPayAmount | money}}</td>
                <td>{{item.payDetail.onlinePayAmount | money}}</td>
                <td>{{item.payDetail.offlinePayAmount | money}}</td>
                <td :class="{'warningfont': item.refundType === 1, 'errorfont': item.refundType === 0}">{{item.refundType | refundType}}</td>
                <td>
                  <a class="hoverblue" v-permission="'refundApprove:willApprove:agree'" @click="agree(item.orderNum)">同意</a>
                  <a class="hoverblue" v-permission="'refundApprove:willApprove:refuse'" @click="refuse(item.orderNum)">拒绝</a>
                </td>

              </tr>
          </table>
        </Checkbox-group>
      </div>

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

    <Modal
      v-model="agreeForm.show"
      title="同意退款"
      :loading="loading"
      @on-ok="confirmAgree">
      <Form ref="agreeForm" :model="agreeForm" :label-width="80">
        <FormItem label="提示:">
          <div class="successfont">同意退款后，退款金额将自动原路退回，并且无法更改</div>
        </FormItem>
        <FormItem label="备注:" prop="remark">
          <i-input v-model="agreeForm.remark" :maxlength="100" type="textarea"></i-input>
        </FormItem>
      </Form>
    </Modal>

    <Modal
      v-model="refuseForm.show"
      title="拒绝退款"
      :loading="loading"
      @on-ok="confirmRefuse">
      <Form ref="agreeForm" :model="refuseForm" :label-width="80">
        <FormItem label="提示:" class="errorfont">
          <div class="errorfont">拒绝退款后，用户将无法收到退款，并且无法更改</div>
        </FormItem>
        <FormItem label="备注:" prop="remark">
          <i-input v-model="refuseForm.remark" :maxlength="100" type="textarea"></i-input>
        </FormItem>
      </Form>
    </Modal>

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
      checkPageLabel: '',

      orderList: [],

      query: {
        account: undefined,
        fromSite: undefined,
        hospitalCompanyId: undefined,
        daterange: [],
        recentThreeDay: true,

        applyStartTime: undefined,
        applyEndTime: undefined,
        minOnlinePay: undefined, // 最小线上支付金额
        maxOnlinePay: undefined, // 最大线上支付金额

        refundType: undefined,
        scene: 3,
        statusList: [0],

        addressIds: [],
      },

      onlinePayQuery: '',
      refundTypeQuery: '',

      page: {
        rowCount: -1,
        currentPage: 1,
        pageSize: 20
      },

      orderNumList: [],

      agreeForm: {
        show: false,
        remark: '',
      },

      refuseForm: {
        show: false,
        remark: '',
      },

      showRefuseDialog: false,
      loading: true,

      // checkbox 选择相关变量
      indeterminatePage: false,
      checkPage: false,
      checkGroup: [],
      allOrderIdList: [],
      indeterminateAll: false,
      checkAll: false,
      loadingAll: false,
      openPicker: false,
    };
  },

  filters: {
    refundType: function(type) {
      if (type === 0) {
        return '全额退款';
      } else if (type === 1) {
        return '部分退款';
      }
      return '';
    }
  },

  computed: {
      orderIdList() {
        return this.orderList.map(item => { return item.orderNum });
      },
      selectDateRange() {
        return this.query.daterange.length > 0 && !!this.query.daterange[0];
      },
   },

  methods: {
    clearDateRange() {
      this.query.daterange = [];
      this.searchOrder()
    },

    isPlatformCompany(comp) {
      return (comp.hospitalCompanyInfo.platformCompanyId && comp.hospitalCompanyInfo.platformCompanyId > 3);
    },

    // checkbox 选择逻辑 start
    handlecheckPage () {
        if (this.indeterminatePage) {
            this.checkPage = false;
        } else {
            this.checkPage = !this.checkPage;
        }
        this.indeterminatePage = false;
        if (this.checkPage) {
            this.checkGroup = MyUtil.merge(this.checkGroup, this.orderIdList);
        } else {
            this.checkGroup = MyUtil.split(this.checkGroup, this.orderIdList);
        }
        this.checkGroupChange(this.checkGroup);
    },
    handleCheckAll() {
      if (this.indeterminateAll) {
        this.checkAll = false;
      } else {
        this.checkAll = !this.checkAll;
      }
      this.indeterminateAll = false;

      if (this.checkAll) {
        this.checkGroup = this.allOrderIdList;
      } else {
        this.checkGroup = [];
      }
      this.checkGroupChange(this.checkGroup);
    },
    checkGroupChange (data) {
      // 本页全选
      if (MyUtil.allIn(this.orderIdList, data)) {
          this.indeterminatePage = false;
          this.checkPage = true;
      } else if (MyUtil.someIn(this.orderIdList, data)) {
          this.indeterminatePage = true;
          this.checkPage = false;
      } else {
          this.indeterminatePage = false;
          this.checkPage = false;
      }

      // 所有页全选
      if (data.length === this.allOrderIdList.length) {
        this.indeterminateAll = false;
        this.checkAll = true;
      } else if (data.length > 0) {
        this.indeterminateAll = true;
        this.checkAll = false;
      } else {
        this.indeterminateAll = false;
        this.checkAll = false;
      }

    },
    // checkbox 选择逻辑 end

    agree(orderNum) {
      this.orderNumList = orderNum ? [orderNum] : this.checkGroup;
      if (this.orderNumList.length == 0) {
        this.$Message.warning('请先选择要操作的订单');
        return;
      }
      this.agreeForm.show = true;
      this.agreeForm.remark = '';
    },

    refuse(orderNum) {
      this.orderNumList = orderNum ? [orderNum] : this.checkGroup;
      if (this.orderNumList.length == 0) {
        this.$Message.warning('请先选择要操作的订单');
        return;
      }
      this.refuseForm.show = true;
      this.refuseForm.remark = '';
    },

    headerChange(terms) {
      this.query = Object.assign(this.query, terms);
      this.searchOrder();
    },

    changeOnlinePayQuery(min, max) {
      this.query.minOnlinePay = min;
      this.query.maxOnlinePay = max;

      this.searchOrder();
    },

    changeRefundType(type) {
      this.query.refundType = type;
      this.searchOrder();
    },

    changeRecentThreeDay() {
      this.searchOrder();
    },

    handlerClick(){
      this.openPicker = !this.openPicker
    },

    dateRangeChange(val) {
      this.query.daterange = val;
      this.openPicker = false;
      this.query.recentThreeDay = !this.selectDateRange;
      this.searchOrder();
    },

    searchOrder(isChangePage) {
      this.$http.post('/orderrefund/listRefundApply', JSON.stringify(this.assembleParams())).then((response) => {

        this.orderList = response.body.records;
        this.page = response.body.page;
        if (!isChangePage) {
          this.resetCheck();
        } else {
          this.checkGroupChange(this.checkGroup);
        }
      }, (res) => {
      });

      this.searchAllOrder(); //查询所有订单，用于全选
    },

    resetCheck() {
      this.checkGroup = [];
      this.checkAll = false;
      this.checkPage = false;
      this.indeterminateAll = false;
      this.indeterminatePage = false;
    },

    searchAllOrder() {
      this.loadingAll = true;
      this.$http.post('/orderrefund/listRefundApply', JSON.stringify(this.assembleParams(true))).then((response) => {
        this.allOrderIdList = response.body.records.map(item => { return item.orderNum });
        this.loadingAll = false;
      }, (res) => {
        this.loadingAll = false;
      });
    },

    assembleParams(isAll = false) {
      let page = isAll ? {currentPage: undefined, pageSize: undefined} : this.page;
      let param = Object.assign(this.query, page);
      if (this.selectDateRange) {
        param.applyStartTime = this.query.daterange[0];
        param.applyEndTime =this.query.daterange[1];
      } else if (this.query.recentThreeDay) {
        param.applyEndTime = new Date(new Date().getTime() - 3 * 24 * 3600 * 1000);
        param.applyEndTime = param.applyEndTime;
        param.applyStartTime = undefined;
      } else {
        param.applyStartTime = undefined;
        param.applyEndTime = undefined;
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

    confirmAgree() {
      let params = {orderNumList: this.orderNumList, reason: this.agreeForm.remark};
      this.$http.post('/orderrefund/agreeRefund', JSON.stringify(params)).then((response) => {
        this.$Notice.success({desc: '操作成功，请至“审批记录”中查看结果'});
        this.searchOrder();
        this.agreeForm.show = false;
      }, (res) => {
        this.agreeForm.show = false;
      });
    },

    confirmRefuse() {
      let params = {orderNumList: this.orderNumList, reason: this.refuseForm.remark};
      this.$http.post('/orderrefund/refuseRefund', JSON.stringify(params)).then((response) => {
        this.$Notice.success({desc: '操作成功，请至“审批记录”中查看结果'});
        this.searchOrder();
        this.refuseForm.show = false;
      }, (res) => {
        this.refuseForm.show = false;
      });
    },

  },

  mounted(){
    this.searchOrder();
  }
};
</script>

<style lang="less">

.check-table-wrap {
  position: relative;
  .check-page {
    position: absolute;
    top: 13px;
    left: 10px;
  }
}

.hidden-label {
  > span {
    display: none;
  }
  .ivu-checkbox {
    display: block;
  }
}
.hiden-date-picker {

}
</style>
