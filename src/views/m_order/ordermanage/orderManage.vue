<template>
<div class="order-manage" v-loading="loadingDate">
  <el-popover
    ref="popoverForSearchPeople"
    placement="bottom"
    width="250"
    @show="clearNameOrIdCard"
    trigger="click">
    <div class="search-exam-person">
      <div class="search-input">
        <el-input
          v-model="nameOrIdCard"
          placeholder="输入姓名或身份证"
          icon="search">
        </el-input>
        <span v-show=false>{{query.nameOrIdCard.val}}</span>
      </div>
      <div class="search-btn">
        <el-button type="primary" class="fl" @click="searchByNameOrIdCard()">搜索选择时段</el-button>
        <el-button type="primary" class="fr" @click="searchByNameOrIdCard('totalDateRange')">搜索所有时段</el-button>
      </div>
    </div>
  </el-popover>

  <el-popover
    ref="popoverForSearchStatus"
    placement="bottom"
    width="200"
    trigger="click">
    <div>
      <el-checkbox-group v-model="query.orderStatuses.val" @change="changeOrderStatus">
        <el-checkbox class="order-status" v-for="sta in orderStatusList" :label="sta.id">{{sta.name}}</el-checkbox>
      </el-checkbox-group>
      <div class="all-status">
        <el-checkbox @click.native.prevent="checkAllOrderStatus" class="order-status" v-model="isCheckAllOrderStatus">所有状态</el-checkbox>
      </div>
    </div>
  </el-popover>

  <div class="part-one">
        <el-select class="date-type" v-model="query.dateType.val" @change="changeDateType" filterable placeholder="请选择">
          <el-option
            v-for="item in dateTypes"
            :label="item.label"
            :value="item.name">
          </el-option>
        </el-select>

        <el-date-picker
          v-model="query.dateRange.val"
          type="daterange"
          align="right"
          placeholder="选择日期范围"
          format="yyyy-MM-dd"
          @change="search"
          :clearable="pickerOptions2.clearable"
          :editable="pickerOptions2.editable"
          :picker-options="pickerOptions2">
        </el-date-picker>
        <a href="javascript:void(0)" @click="selectToday">当天</a>

        <el-select class="ml20" v-model="query.hospital.val" @change="search" filterable placeholder="请选择体检中心">
          <el-option
            v-for="item in hospitals"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>

        <el-select v-model="query.company.val" @change="search" filterable placeholder="请选择单位">
          <el-option
            v-for="item in companies"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <a href="javascript:void(0)">高级筛选</a>

        <!-- <el-button type="primary" @click="search">查询</el-button> -->

        <el-dropdown class="fr" trigger="click">
          <el-button>
            更多 <i class="el-icon-arrow-down grayfont"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item><div @click="handleExportExamine">导出查看</div></el-dropdown-item>
            <!--<el-dropdown-item><div @click="handleSignOrder(true)">标记为已结算</div></el-dropdown-item>-->
            <!--<el-dropdown-item><div @click="handleSignOrder(false)">标记为撤销结算</div></el-dropdown-item>-->
          </el-dropdown-menu>
        </el-dropdown>
        <el-button class="fr ml10 mr10" @click="handleRevokeOrder(orderIds)">撤销</el-button>
        <el-button class="fr" @click="handleSendMsg">发送短信</el-button>

      </div>

  <div class="part-two">
      <span v-show="orderIds.length > 0">已选 {{orderIds.length}} 条</span>
        <span class="ml10">
          <query-condition v-for="item in showQueries" :item="item" :hospitals="hospitals" :companies="companies" @delete="deleteQueryItem"></query-condition>
          <a class="dispalyinline" href="javascript:void(0)" v-if="!isEmptyObject(showQueries)" @click="clearQuery">清空筛选</a>
        </span>

        <span class="fr">
          <span>{{query.onlyShowValid.label}}：</span>
          <el-switch
            v-model="query.onlyShowValid.val"
            @change="switchOnlyShowValid"
            on-text="ON"
            off-text="OFF">
          </el-switch>
          <el-tooltip popper-class="mt-tooltip" :content="onlyShowValidTip" placement="bottom" effect="light">
            <i class="iconfont icon-wenhao hoverblue"></i>
          </el-tooltip>
        </span>
      </div>

  <div class="part-three">
    <table frame=void class="mt-table">
      <tr>
        <th width="50"><el-checkbox v-model="isCheckedAll" @click.native.prevent="handleCheckAll"></el-checkbox></th>
        <th>体检时间</th>
        <th><span v-popover:popoverForSearchPeople class="hoverblue">体检人 <i class="el-icon-arrow-down grayfont"></i></span></th>
        <th>
          <el-dropdown trigger="click" menu-align="start">
            <span class="el-dropdown-link hoverblue">
              性别<span v-show=false>{{query.gender.val}}</span> <i class="el-icon-arrow-down grayfont"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native.prevent="changeGender(-1)">全部</el-dropdown-item>
              <el-dropdown-item @click.native.prevent="changeGender(0)">男</el-dropdown-item>
              <el-dropdown-item @click.native.prevent="changeGender(1)">女</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </th>
        <th>单位</th>
        <th><span v-popover:popoverForSearchStatus class="hoverblue">订单状态 <i class="el-icon-arrow-down grayfont"></i></span></th>
        <th>订单金额</th>
        <th>
          <el-dropdown trigger="click" menu-align="start">
            <span class="el-dropdown-link hoverblue">
              线上自付<span v-show=false>{{query.hasSelfPay.val}}</span> <i class="el-icon-arrow-down grayfont"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native.prevent="changeSelfPay(-1)">全部</el-dropdown-item>
              <el-dropdown-item @click.native.prevent="changeSelfPay(1)">有</el-dropdown-item>
              <el-dropdown-item @click.native.prevent="changeSelfPay(0)">无</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </th>
        <th>体检中心</th>
        <th>客户经理</th>
        <th>下单时间</th>
        <th>套餐名称</th>
        <th>标记</th>
        <th width="100">操作</th>
      </tr>

      <tr v-if="tableData.length === 0"><td colspan="14"><div class="tc">没有数据</div></td></tr>
      <tr v-for="row in tableData">
        <td class="tc"><label><input type="checkbox" v-model="orderIds" :value="row.id"/></label></td>
        <td>{{row.examDate | date('yyyy-MM-dd')}}<br /><span class="grayfont">{{row.examTimeIntervalName}}</span></td>
        <td>{{row.account ? row.account.name : ''}}<br />
          <el-tooltip :openDelay=800 :content="row.account ? row.account.idCard : ''" placement="bottom" effect="light">
            <span class="grayfont ellipsis">{{row.account ? row.account.idCard : ''}}</span>
          </el-tooltip>
        </td>
        <td>{{(row.accountRelation ? row.accountRelation.gender : '') | gender}}</td>
        <td>
          <el-tooltip :openDelay=800 :content="row.examCompany.name" placement="bottom" effect="light">
            <span class="ellipsis">{{row.channelCompany.name}}</span>
          </el-tooltip>
        </td>
        <td>{{row.status | orderStatusWithExport(row.isExport)}}</td>
        <td>{{row.orderPrice | money('')}}</td>
        <td>{{row.selfMoney}}</td>
        <td>
          <el-tooltip :openDelay=800 :content="row.hospital ? row.hospital.name : ''" placement="bottom" effect="light">
            <span class="ellipsis">{{row.hospital ? row.hospital.name : ''}}</span>
          </el-tooltip>
        </td>
        <td>{{row.manager}}</td>
        <td>{{row.insertTime | date('yyyy-MM-dd')}}<br /><span class="grayfont">{{row.insertTime | date('hh:mm:ss')}}</span></td>
        <td>
          <el-tooltip :openDelay=800 :content="row.mealName" placement="bottom" effect="light">
            <span class="ellipsis">{{row.mealName}}</span>
          </el-tooltip>
        </td>
        <td class="tc">{{row.channelSettleSign | signStatus}} <br /><span class="grayfont">{{row.channelSettleBatch ? row.channelSettleBatch : ''}}</span> </td>
        <td>
          <a href="javascript:void(0)" @click="showOrderDetail(row)">查看</a>
          <a href="javascript:void(0)" v-if="canChangeDate(row)" @click="showChangeExamDate(row)">改期</a>
          <a href="javascript:void(0)" v-if="canRevoke(row)" @click="handleRevokeOrder([ row.id ])">撤销</a>
        </td>
      </tr>
    </table>

    <div class="page-div">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.currentPage"
        :page-sizes="[10, 50, 100]"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next"
        :total="page.rowCount">
      </el-pagination>
    </div>
  </div>

  <div v-if="showExportExamineDialog">
    <el-dialog title="导出查看" v-model="showExportExamineDialog" size="tiny">
      <el-form :model="query">
        <el-form-item v-if="item.name !== 'fromSite' && item.name !== 'isExport'" class="mb0" v-for="item in queryForExport" :label="item.label" label-width="120px">
          <span>{{item | parseShowVal(hospitals,companies)}}</span>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="showExportExamineDialog = false">取 消</el-button>
        <el-button type="primary" @click="exportExamine">确 定</el-button>
      </div>
    </el-dialog>
  </div>


  <!--批量发送短信 -->
  <el-dialog title="发送短信" v-model="showSendMsgDialog">
    <div>
      <span> 你已经选择了 {{orderIds.length}} 条订单</span>
      <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
          v-model="msgContent">
      </el-input>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="showSendMsgDialog = false">取 消</el-button>
      <el-button type="primary" @click="sendMsg">确 定</el-button>
    </div>
  </el-dialog>

  <!-- 撤销订单 -->
  <div v-if="showRevokeOrderDialog">
    <el-dialog title="撤销订单" v-model="showRevokeOrderDialog">
      <p>确定撤销这 <span class="redfont">{{this.revokeOrderIds.length}}</span> 条订单么</p>
      <el-checkbox v-model="isSendMsg">发送撤单短信</el-checkbox>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showRevokeOrderDialog = false">取 消</el-button>
        <el-button type="primary" @click="revokeOrder">确 定</el-button>
      </div>
    </el-dialog>
  </div>

  <!--订单改期 -->
  <div v-if="showChangeExamDateDialog">
    <el-dialog title="订单改期" v-model="showChangeExamDateDialog" size="small">
      <change-exam-date :order="selectedOrder" @closeDialog="closeChangeExamDate"></change-exam-date>
    </el-dialog>
  </div>

  <!--订单改期 -->
  <div v-if="showOrderDetailDialog">
    <el-dialog title="订单详情" custom-class="right-dialog" v-model="showOrderDetailDialog" size="full">
      <order-detail :order="showOrder" :showOrderSnap="showOrderSnap"></order-detail>
    </el-dialog>
  </div>

</div>

</template>

<script>
import service from '../service'
import filters from '../../../filters'
import queryCondition from './c-queryCondition'
import changeExamDate from './c-changeExamDate'
import orderDetail from './c-orderDetail'

// 查询条件对象
class QueryItem {
  constructor(name, label, val, showChange = false) {
    this.name = name;
    this.label = label;
    this.val = val;
    this.defaultVal = val;
    this.showChange = showChange; //当值改变时，是否显示搜索条件
  }
};

export default {
  components: {
    'query-condition': queryCondition,
    'change-exam-date': changeExamDate,
    'order-detail': orderDetail
  },

  filters: {
    parseShowVal: function(item,hospitals,companies) {
      return service.parseShowVal(item,hospitals,companies);
    },

    orderStatusWithExport: function(item, isExport) {
      return item === 2 && isExport ? '已导出': filters.orderStatus(item);
    }
  },

  data() {
    const defaultHospital = {id: -1, name: '所有体检中心'};
    const defaultCompany = {id: -1, name: '所有单位'};

    return {
      loadingDate: false,

      orderStatusList: service.orderStatusList,

      dateTypes: [
        {
          name: 'examDate',
          label: '体检日期'
        },
        {
          name: 'bookDate',
          label: '预约日期'
        }
      ],

      query: {
        dateType: new QueryItem('dateType', '日期类型', 'examDate', false),
        dateRange: new QueryItem('dateRange', '体检日期', [new Date(), new Date()], true),
        orderStatuses: new QueryItem('orderStatuses', '订单状态', service.validStatusList, true),
        hospital: new QueryItem('hospital', '体检中心', defaultHospital.id, true),
        company: new QueryItem('company', '单位', defaultCompany.id, true),
        gender: new QueryItem('gender', '性别', -1, true),
        nameOrIdCard: new QueryItem('nameOrIdCard', '姓名或身份证', '', true),
        onlyShowValid: new QueryItem('onlyShowValid', '仅显示有效订单', true, true),
        hasSelfPay: new QueryItem('hasSelfPay', '线上自付', -1, true),
        fromSite: new QueryItem('fromSite', '渠道商', (this.$store.state.m_public.channel.id || ''), true),
        isExport: new QueryItem('isExport', '是否已导出', undefined, true),

      },

      onlyShowValidTip: '有效订单包括: 已支付、已预约、体检完成、部分退款、导出失败、已导出',

      pickerOptions2: {
        clearable: false,
        editable: false,
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },

      hospitals: [ defaultHospital ],
      companies: [ defaultCompany ],
      nameOrIdCard: '',
      msgContent: '',
      tableData: [],
      isSendMsg: false,

      page: {
        rowCount: -1,
        currentPage: 1,
        pageSize: 10
      },

      showQueries: {},

      selectedOrder: {},
      orderIds: [],
      revokeOrderIds: [],

      showExportExamineDialog: false,
      queryForExport: {},

      showChangeExamDateDialog: false,
      showSendMsgDialog: false,
      showRevokeOrderDialog: false,

      showOrderDetailDialog: false,
      showOrderSnap: {}

    };
  },

  beforeMount() {
    this.fetchHosAndComp();
  },

  watch: {
    query: {
      handler: function(val, oldVal) {

        for (let item in val) {
          let queryItem = val[item];
          // 当前值和默认值不一样，且是"需要显示改变"的查询条件，就加到showQueries中展示出来
          if (!myUtil.equals(queryItem.val, queryItem.defaultVal) && queryItem.showChange) {
            this.showQueries[queryItem.name] = queryItem;
          } else {
            delete this.showQueries[queryItem.name];
          }
        }
      },
      deep: true
    }

  },

  methods: {

    // 订单是否可撤销
    canRevoke(order) {
      const can = !(order.hasSettlementOpen && [2,4,5].indexOf(order.settleSign)>-1);
      return can && !order.isExport && (
        order.status ===  myUtil.ORDER_STATUS.PAID.id
        || order.status === myUtil.ORDER_STATUS.BOOK.id
        || order.status === myUtil.ORDER_STATUS.LOCAL_PAY.id
      );
    },

    // 订单是否可改期
    canChangeDate(order) {
      return !order.isExport
      &&
      (
        order.status ===  myUtil.ORDER_STATUS.PAID.id
        || order.status === myUtil.ORDER_STATUS.BOOK.id
        || order.status === myUtil.ORDER_STATUS.LOCAL_PAY.id
      );
    },

    //获取体检中心 和 单位 列表
    fetchHosAndComp() {
      service.getHospitalAndCompany(this.query.fromSite.val).then((response) => {
        let comps = response.body.companies.filter(item => {return !item.deleted});
        this.companies = [...this.companies, ...comps];
        this.hospitals = [...this.hospitals, ...response.body.hospitals];
        this.search();
      }, (res) => {
        this.$message.warning(res.text);
      });
    },

    // 移除某个查询条件
    deleteQueryItem(item) {
      this.resetQuery(item);
      this.search();
    },

    resetQuery(item) {
      item.val = item.defaultVal;
      this.query[item.name] = item;
      if (item.name === 'nameOrIdCard') {
        this.nameOrIdCard = item.defaultVal;
      }
    },

    // 清空筛选条件
    clearQuery() {
      for (let item in this.query) {
        let queryItem = this.query[item];
        if (queryItem.showChange && queryItem.val != queryItem.defaultVal) {
          this.resetQuery(queryItem);
        }
      }
      this.search();
    },

    // 清空姓名和身份证筛选
    clearNameOrIdCard() {
      this.nameOrIdCard = '';
    },

    // 根据姓名和身份证查询
    searchByNameOrIdCard(totalDateRange = false) {
      if (totalDateRange) {
        this.query.dateRange.val = [null, null];
      }
      this.query.nameOrIdCard.val = this.nameOrIdCard;
      this.search();
    },

    // 选择订单状态
    changeOrderStatus() {
      this.query.onlyShowValid.val = false;
      this.search();
    },

    // 切换是否仅显示有效订单
    switchOnlyShowValid(val) {
      if (val) {
        this.resetQuery(this.query.orderStatuses);
      } else {
        let allStatus = this.orderStatusList.map((item) => { return item.id });
        this.query.orderStatuses.val = allStatus;
        this.setAllOrderStatus();
      }
      this.search();

    },

    setAllOrderStatus() {
      let allStatus = this.orderStatusList.map((item) => { return item.id });
      this.query.orderStatuses.val = allStatus;
    },

    // 选择所有订单状态
    checkAllOrderStatus() {
      if (!this.isCheckAllOrderStatus) {
        this.setAllOrderStatus();
        this.query.onlyShowValid.val = false;
      } else {
        this.query.orderStatuses.val = [];
      }
      this.search();
    },

    // 点击全选
    handleCheckAll() {
      if (!this.isCheckedAll) {
        this.checkAll();
      } else {
        this.clearCheck();
      }
    },

    // 清空全选
    clearCheck() {
      this.orderIds = [];
    },

    checkAll() {
      if (this.page.rowCount > 3000) {
        this.$message.warning('订单超过3000条，无法全选，请再筛选一下吧');
        return;
      }
      service.getAllOrder(this.query, this.page, true).then((response) => {
        this.orderIds = response.data || [];
      })
    },

    // 切换日期类型
    changeDateType(val) {
      if (val === 'bookDate') {
        this.query.dateRange.label = '预约日期';
      } else if (val === 'examDate') {
        this.query.dateRange.label = '体检日期';
      }
      this.search();

    },

    // 切换分页显示条数
    handleSizeChange(val) {
      this.page.pageSize = val;
      this.search(true);
    },

    // 切换分页
    handleCurrentChange(val) {
      this.page.currentPage = val;
      this.search(true);
    },

    // 切换性别
    changeGender(g) {
      if (g === this.query.gender.val) {
        return;
      }
      this.query.gender.val = g;
      this.search();
    },

    // 切换是否有自付金额
    changeSelfPay(status) {
      if (status === this.query.hasSelfPay.val) {
        return;
      }
      this.query.hasSelfPay.val = status;
      this.search();
    },

    // 日期选择「当天」
    selectToday() {
      this.query.dateRange.val = this.query.dateRange.defaultVal;
    },

    // 根据筛选条件获取订单信息
    // isPageChange 是否是翻页操作，如果是查询后不清空选择
    search(isPageChange = false) {
      this.loadingDate = true;
      service.getOrder(this.query, this.page).then((response) => {
        this.tableData = response.data.records;
        this.page = response.data.page;
        this.loadingDate = false;
        if (!isPageChange) {
          this.orderIds = [];
        }
      }, (error) => {
        this.$message.warning(error.text || '出错了');
        this.loadingDate = false;
      });
    },

    // 发送短信
    handleSendMsg() {
      if(this.orderIds.length === 0){
        this.$message.warning('请先选择要发送短信的订单');
        return;
      }
      this.showSendMsgDialog = true;
    },

    sendMsg() {
      if(this.msgContent.length < 10 || this.msgContent.length >500 ){
        this.$message.warning('短信内容应该在10-500之间!');
        return;
      }

      let param = {
        orderIds: this.orderIds,
        msgContent: this.msgContent
      }
      service.sendMsg(param).then((response) => {
        this.showSendMsgDialog = false;
        this.msgContent= '';
        this.$notify.success('发送短信成功');
      }, (res) => {
        this.$notify.error(res.text);
      });
    },

    handleRevokeOrder(orderIds) {

      this.revokeOrderIds = orderIds;
      if(orderIds.length === 0) {
        this.$message.warning('请先选择要撤销的订单');
        return;
      }
      this.isSendMsg = false;
      this.showRevokeOrderDialog = true;
    },

    revokeOrder() {
      let param = {
        orderIds: this.revokeOrderIds,
        sendMsg: this.isSendMsg
      };
      service.revokeChannelOrder(param).then((response) => {
        this.$notify.success('撤单成功');
        this.showRevokeOrderDialog = false;
        this.search();
      }, (res) => {
        this.$alert('撤销失败，订单不符合撤销条件！', '提示', {
          confirmButtonText: '确定',
          type: 'error'
        });
      });
      this.showRevokeOrderDialog = false;
    },

    // 显示订单详情
    showOrderDetail(order) {
      this.showOrderDetailDialog = true;
      this.showOrder = order;
      service.getOrderDetails(order.id).then((res)=>{
        this.showOrderSnap = res.body;
      },(err) => {
      });
    },

    showChangeExamDate(order) {
      this.selectedOrder = order;
      service.getOrderItems(order.id).then((res)=>{
          order.itemIds =res.body;
      },(error)=>{
        this.$notify.error(error.text);
      });

      this.showChangeExamDateDialog = true;
    },

    closeChangeExamDate(succ) {
      this.showChangeExamDateDialog = false;
      this.selectedOrder = {};
      if (succ) {
        this.search();
      }

    },

    // 点击导出查看
    handleExportExamine() {
      // 过滤掉无效的订单
      let queryExport = service.deepClone(this.query);
      for (let item in queryExport) {
        let queryItem = queryExport[item];
        if (queryItem.name === 'orderStatuses') {
          queryExport[item].val = queryItem.val.filter(sta => service.validStatusList.includes(sta));
        }
      }
      this.queryForExport = queryExport;
      service.isExportCheckbookOverRange(this.queryForExport).then((res)=>{
        if(res && !res.body.isOverRange) {
          if(res.body.count && res.body.count > 0){
            this.showExportExamineDialog = true;
          } else {
            this.$message.warning("没有可以导出的订单");
          }

        } else {
          this.$notify.info(res.body.msg)
        }
      }, (error) => {
        this.$notify.error(error.text);
      })

    },

    exportExamine() {
      this.showExportExamineDialog = false;
      service.exportExamine(this.queryForExport)
      //弹框提示
      this.$notify({
        title: '提示',
        message: '正在努力生成excel中☺',
        duration: 3000
      });
    },

    // 点击标记结算
    handleSignOrder(isSettle) {
      if(this.orderIds.length <1) {
        this.$message.warning('未选择订单');
        return;
      }

      let tip = '确定将这 ' + this.orderIds.length + ' 个订单，标记为' + (isSettle ? '已结算' : '撤销结算') + '?'

      this.$confirm(tip, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        this.signOrder(isSettle);
      }).catch(() => {
      });

    },

    signOrder(isSettle) {
      let param = {
        channelId: this.fromSite,
        orderIds: this.orderIds,
        signSettle: isSettle
      };
      service.signOrderSettle(param).then((response) => {

        if (!isSettle) {
          this.$notify.success('标记撤销结算成功');
        } else {
          this.$alert('标记结算成功，批次为： ' + response.body, '提示', {
            confirmButtonText: '确定'
          });
        }

        this.search();
      }, (res) => {
        this.$notify.error(res.text);
      });
    },

    isEmptyObject(item) {
      return myUtil.isEmptyObject(item);
    }

  },

  computed: {
    isCheckedAll() {
      return this.page.rowCount > 0 && this.orderIds.length === this.page.rowCount;
    },

    isCheckAllOrderStatus() {
      return this.orderStatusList.length === this.query.orderStatuses.val.length;
    }

  }

};
</script>

<style scoped lang="less">
@import '../../../assets/style/common.less';

.order-manage {
  padding: 0px 10px;
}

.part-one {
  padding: 10px 0px;
  .date-type {
    width: 120px;
  }
}

.part-two {
  padding: 10px 0px;
}

.part-three {
  position: relative;
  width: 100%;
  overflow-y: auto;
  .page-div {
    padding-top: 10px;
    text-align: center;
  }
}

.search-exam-person {
  .search-input {
    .el-input { font-size: 12px!important; }
  }
  .search-btn {
    padding-top: 10px;
  }
}

.order-status {
  margin-left: 10px;
  width: 80px;
}

.all-status {
  border-top: 1px solid #eaeefb;
  padding-top: 5px;
  margin-top: 5px;
}

</style>
