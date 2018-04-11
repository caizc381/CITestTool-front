<template>
 <div class="rel">
    <div class="mb10" v-if="isHandler">
      <Checkbox
        :indeterminate="indeterminateAll"
        :value="checkAll"
        @click.prevent.native="handleCheckAll"
        :disabled="loadingAll">全选</Checkbox>
      <span v-show="checkGroup.length" class="ml10">已选<span class="redfont">{{checkGroup.length}}</span>条</span>

      <a class="fr" @click="showExportModal"><Icon type="archive" style="font-size:16px;margin-right:5px;"></Icon>导出excel</a>
    </div>

    <!-- 查询条件 -->
    <div class="mt10 mb10">

      <span class="ops-query mr5" v-if="functionQuery.syncExamReportAbility">
        <span>体检报告：{{functionQuery.syncExamReportAbility | reportAbility}}</span>
        <Icon type="close" @click.native="functionQuery.syncExamReportAbility = undefined"></Icon>
      </span>

      <span class="ops-query mr5" v-if="functionQuery.openSyncCompany">
        <span>单位同步:{{functionQuery.openSyncCompany == 'true' ? '已开启':'未开启'}}</span>
        <Icon type="close" @click.native="functionQuery.openSyncCompany = undefined"></Icon>
      </span>

      <a v-if="functionQuery.openSyncCompany || functionQuery.syncExamReportAbility" @click="clearQuery()">清空</a>
    </div>

    <Spin size="large" fix v-if="funLoading"></Spin>

    <div class="check-table-wrap">
      <Checkbox
        v-if="isHandler"
        class="check-page"
        :indeterminate="indeterminatePage"
        v-model="checkPage"
        @click.prevent.native="handlecheckPage">{{checkPageLabel}}</Checkbox>
      <Checkbox-group v-model="checkGroup" @on-change="checkGroupChange">
         <table class="table">
            <col v-if="isHandler" width="50">
            <col width="60">
            <colgroup span="10"></colgroup>
            <col width="150">
            <thead>
              <tr>
                <th v-if="isHandler" style="width: 40px;"></th>
                <th>ID
                 <span class="basic-sort">
                   <Icon class="up" type="arrow-up-b"  @click.native="functionQuery.orderById = '1';functionQuery.orderByPreviousExportDays = undefined;functionQuery.orderByPreviousBookDays=undefined;"  :class="{'isOrderby':functionQuery.orderById == '1'}" ></Icon>
                   <Icon class="down" type="arrow-down-b"  @click.native="functionQuery.orderById = '-1';functionQuery.orderByPreviousExportDays = undefined;functionQuery.orderByPreviousBookDays=undefined;"  :class="{'isOrderby':functionQuery.orderById == '-1'}"></Icon>
                 </span>
                </th>
                <th>体检中心</th>
                <th>深浅对接</th>
                <th>支付方式</th>
                <th>现场付款</th>
                <th>退款设置</th>
                <th>提前预约
                  <span class="basic-sort">
                   <Icon class="up" type="arrow-up-b"  @click.native="functionQuery.orderByPreviousBookDays = '1';functionQuery.orderById = undefined;functionQuery.orderByPreviousExportDays=undefined;"  :class="{'isOrderby':functionQuery.orderByPreviousBookDays == '1'}" ></Icon>
                   <Icon class="down" type="arrow-down-b"  @click.native="functionQuery.orderByPreviousBookDays = '-1';functionQuery.orderById = undefined;functionQuery.orderByPreviousExportDays=undefined;"  :class="{'isOrderby':functionQuery.orderByPreviousBookDays == '-1'}"></Icon>
                  </span>
                </th>
                <th>提前导出
                  <span class="basic-sort">
                   <Icon class="up" type="arrow-up-b"  @click.native="functionQuery.orderByPreviousExportDays = '1';functionQuery.orderById = undefined;functionQuery.orderByPreviousBookDays=undefined;"  :class="{'isOrderby':functionQuery.orderByPreviousExportDays == '1'}" ></Icon>
                   <Icon class="down" type="arrow-down-b"  @click.native="functionQuery.orderByPreviousExportDays = '-1';functionQuery.orderById = undefined;functionQuery.orderByPreviousBookDays=undefined;"  :class="{'isOrderby':functionQuery.orderByPreviousExportDays == '-1'}"></Icon>
                  </span>
                </th>
                <th>体检时间</th>
                <th>
                  <Dropdown trigger="click">
                    <span class="ivu-dropdown hoverblue">
                        体检报告
                        <i style="font-size:12px;" class="iconfont icon-guolvqi"></i>
                    </span>
                    <Dropdown-menu slot="list">
                        <Dropdown-item @click.native="functionQuery.syncExamReportAbility = undefined">不限</Dropdown-item>
                        <Dropdown-item @click.native="functionQuery.syncExamReportAbility = '1'">全量报告</Dropdown-item>
                        <Dropdown-item @click.native="functionQuery.syncExamReportAbility = '2'">增量报告</Dropdown-item>
                        <Dropdown-item @click.native="functionQuery.syncExamReportAbility = '0'">未开通</Dropdown-item>
                    </Dropdown-menu>
                  </Dropdown>
                </th>
                <th>
                  <Dropdown trigger="click">
                    <span class="ivu-dropdown hoverblue">
                        单位同步
                        <i style="font-size:12px;" class="iconfont icon-guolvqi"></i>
                    </span>
                    <Dropdown-menu slot="list">
                        <Dropdown-item @click.native="functionQuery.openSyncCompany = undefined">不限</Dropdown-item>
                        <Dropdown-item @click.native="functionQuery.openSyncCompany = 'true'">已开启</Dropdown-item>
                        <Dropdown-item @click.native="functionQuery.openSyncCompany = 'false'">未开启</Dropdown-item>
                    </Dropdown-menu>
                  </Dropdown>
                </th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="fun in functionList">
                <td v-if="isHandler" style="text-align: center;"><Checkbox :key="fun.id" :label="fun.id" class="hidden-label"></Checkbox></td>
                <td>{{fun.id}}</td>
                <td>
                  <div>
                    <span v-if="!fun.enable" class="mt-tag">停用</span>
                    <span>{{fun.name}}</span>
                  </div>
                  <div class="gray">{{fun.address.briefAddress}}</div>
                </td>
                <td><span>{{fun.settings.exportWithXls ? '浅对接':'深对接'}}</span></td>
                <td>
                  <div class="payway">
                    <span v-if="fun.settings.acceptOfflinePay">现场付款</span>
                    <span v-if="fun.settings.accountPay">账户支付</span>
                    <span v-if="fun.settings.aliPay">支付宝</span>
                    <span v-if="fun.settings.weiXinPay">微信支付</span>
                  </div>
                </td>
                <td>{{fun.settings.needLocalPay == true ? '需要确认':'不需要确认'}}</td>
                <td>{{fun.settings.refundRefusedItem == true ? '拒检退款':'拒检不退款'}}</td>
                <td>
                  <div>{{fun.settings.previousBookDays}}天</div>
                  <div class="gray">{{fun.settings.previousBookTime}}</div>
                </td>
                <td>
                  <span v-if="fun.settings.previousExportDays">{{fun.settings.previousExportDays}}天</span>
                  <span v-else>-</span>
                </td>
                <td>
                 <div v-show="fun.settings.workDay">{{fun.settings.workDay}}</div>
                 <div class="gray">{{fun.settings.examStartTime}}-{{fun.settings.examEndTime}}</div>
                </td>
                <td>
                    <span v-if="fun.settings.syncExamReportAbility == null || fun.settings.syncExamReportAbility == 0">未开通</span>
                    <span v-if="fun.settings.syncExamReportAbility == 1">全量报告</span>
                    <span v-if="fun.settings.syncExamReportAbility == 2">增量报告</span>
                </td>
                <td><span>{{fun.settings.openSyncCompany == true ? '已开启':'未开启'}}</span></td>
                <td>
                  <a type="text" @click="$router.push('/hospitalManage/list/edit/function/' + fun.id)">详情</a>
                  <more-operation :hospital="fun" @on-success="getHospitalFunList" />
                </td>
              </tr>
            </tbody>
         </table>
      </Checkbox-group>
    </div>

     <div class="page-wrap" style="height:200px;">
      <Page
      :total="funPage.rowCount"
      :current="funPage.currentPage"
      :page-size="funPage.pageSize"
      :page-size-opts="[10,20,50]"
      show-sizer
      show-total
      @on-change="currentPageInfo"
      @on-page-size-change="pageSizeInfo"></Page>
    </div>

    <Modal  v-model="showExport">
      <p slot="header"><span>提示</span></p>
      <div>
        <div class="mt10">请选择你要导出的内容，然后确认导出：</div>
        <div class="mt10">
          <Checkbox v-model="isBasicInfo">基本信息</Checkbox>
          <Checkbox v-model="isCooperation">平台合作</Checkbox>
          <Checkbox v-model="isFunction">功能配置</Checkbox>
          <Checkbox v-model="isSign">签约信息</Checkbox>
          <Checkbox v-model="isSite">站点设置</Checkbox>
        </div>
      </div>
      <div slot="footer">
        <Button  @click="showExport = false">取消</Button>
        <Button type="primary" @click="confirmExport">确定</Button>
      </div>
    </Modal>

 </div>
</template>

<script>
import MoreOperation from '../components/MoreOperation'

export default {
  name: 'funInfo',
  components: {
    'more-operation': MoreOperation,
  },
  data() {
    return {
      functionList: [],
      functionQuery: {
        openSyncCompany: undefined,//单位同步
        orderById: 1,//id排序
        orderByPreviousExportDays: undefined, //提前导出天数
        syncExamReportAbility: undefined,  //体检报告
        orderByPreviousBookDays: undefined,
      },

      funPage: {
        currentPage: 1,
        pageSize: 20,
        rowCount: 0,
      },

      checkGroup: [],
      checkPage: false,
      checkAll: false,
      loadingAll: false,
      indeterminatePage: false,
      indeterminateAll: false,
      checkPageLabel: '',

      isBasicInfo: false,
      isCooperation: false,
      isFunction: false,
      isSign: false,
      isSite: false,

      showExport: false,

      executeState: undefined,
      funLoading: false,
    }
  },

  props: ['organizationQuery','allHospitalIdList','isHandler'],

  watch: {
    functionQuery: {
        handler: function(){
          this.getHospitalFunList(true);
        },
        deep: true
    },
  },

  filters: {
     reportAbility:function(val){
       if(val == '0'){
         return '未开通 ';
       }else if(val == '1'){
         return '全量同步';
       }else if(val == '2'){
         return '增量同步';
       }
     },
   },

  computed: {
    functionIdList() {
      return this.functionList.map(item => { return item.id });
    }
  },

  mounted() {
  },

  methods: {

      getHospitalFunList( isChangePage = false, currentPage = 1, pageSize = 20){
         this.functionQuery.page = {
          currentPage: currentPage,
          pageSize: pageSize,
          rowCount: 0,
        }
        this.loadHospitalFunList(isChangePage);
      },

      //获取功能配置列表
      loadHospitalFunList(isChangePage){
        this.funLoading = true;
        this.$http.post('/listFunction', JSON.stringify({organizationQuery:this.organizationQuery, privateQuery: this.functionQuery})).then((response) => {
            this.functionList = response.body.records;
            this.funPage = response.body.page;
            if (!isChangePage) {
              this.resetCheck();
            } else {
              this.checkGroupChange(this.checkGroup);
            }
            this.funLoading = false;
        }, (res) => {
            this.$Message.error(res.text);
            this.funLoading = false;
        });
      },

      //清空功能配置条件
      clearQuery() {
        this.functionQuery = {
            openSyncCompany: undefined,//单位同步
            syncExamReportAbility: undefined,  //体检报告
          }
        this.getHospitalFunList();
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
            this.checkGroup = MyUtil.merge(this.checkGroup, this.functionIdList);
        } else {
            this.checkGroup = MyUtil.split(this.checkGroup, this.functionIdList);
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
          this.checkGroup = this.allHospitalIdList;
        } else {
          this.checkGroup = [];
        }
        this.checkGroupChange(this.checkGroup);
      },
      checkGroupChange (data) {
        // 本页全选
        if (MyUtil.allIn(this.functionIdList, data)) {
            this.indeterminatePage = false;
            this.checkPage = true;
        } else if (MyUtil.someIn(this.functionIdList, data)) {
            this.indeterminatePage = true;
            this.checkPage = false;
        } else {
            this.indeterminatePage = false;
            this.checkPage = false;
        }

        // 所有页全选
        if (data.length === this.allHospitalIdList.length) {
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

      resetCheck() {
        this.checkGroup = [];
        this.checkAll = false;
        this.checkPage = false;
        this.indeterminateAll = false;
        this.indeterminatePage = false;
      },

     // checkbox 选择逻辑 end

     //page信息
      currentPageInfo(val){
        this.getHospitalFunList( false, val, this.funPage.pageSize);
      },

      //pageSize信息
      pageSizeInfo(val){
        this.getHospitalFunList( false, 1, val);
      },

      showExportModal(){
        if(this.checkGroup.length > 0){
           this.showExport = true;
        }else{
           this.$Message.error('请先选择体检中心');
        }
      },

      //导出
      confirmExport(){
      if(!this.isBasicInfo && !this.isCooperation && !this.isFunction && !this.isSign && !this.isSite){
          this.$Message.error('请先选择导出内容')
          return false
       }
       this.$http.get('/hospitalInfoExport?hospitalIds='+this.checkGroup+'&isBasicInfo='+this.isBasicInfo+'&isCooperation='+this.isCooperation+'&isFunction='+this.isFunction+'&isSign='+this.isSign+'&isSite='+this.isSite).then((response) => {
          this.$Message.success('正在下载中....');
          window.location.href = response.url;
        }, (res) => {
            this.$Message.error(res.text);
        });
     }
  }
}
</script>
