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

      <span class="ops-query mr5" v-show="coopQuery.isIndividuationPlatformMeal">
        <span>平台定制套餐:{{coopQuery.isIndividuationPlatformMeal == 'true' ? '支持':'不支持'}}</span>
        <Icon type="close" @click.native="coopQuery.isIndividuationPlatformMeal = undefined"></Icon>
      </span>

      <span class="ops-query mr5" v-show="coopQuery.isPlatformSuspense">
        <span>平台挂账:{{coopQuery.isPlatformSuspense == 'true' ? '支持':'不支持'}}</span>
        <Icon type="close" @click.native="coopQuery.isPlatformSuspense = undefined"></Icon>
      </span>

      <span class="ops-query mr5" v-show="coopQuery.isPrepayInvoice">
        <span>预付开票:{{coopQuery.isPrepayInvoice == 'true' ? '支持':'不支持'}}</span>
        <Icon type="close" @click.native="coopQuery.isPrepayInvoice = undefined"></Icon>
      </span>

      <a v-if="coopQuery.isIndividuationPlatformMeal || coopQuery.isPlatformSuspense || coopQuery.isPrepayInvoice" @click="clearQuery()">清空</a>
    </div>

    <Spin size="large" fix v-if="cooLoading"></Spin>

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
                   <Icon class="up" type="arrow-up-b" @click.native="coopQuery.orderById = '1';coopQuery.orderByGuestOfflineCompDiscount = undefined;coopQuery.orderByGuestOnlineCompDiscount = undefined;coopQuery.orderByHospitalCompDiscount = undefined;coopQuery.orderByPlatformCompDiscount = undefined;coopQuery.orderByPlatformGuestDiscount = undefined"  :class="{'isOrderby':coopQuery.orderById == '1'}"></Icon>
                   <Icon class="down" type="arrow-down-b"  @click.native="coopQuery.orderById = '-1';coopQuery.orderByGuestOfflineCompDiscount = undefined;coopQuery.orderByGuestOnlineCompDiscount = undefined;coopQuery.orderByHospitalCompDiscount = undefined;coopQuery.orderByPlatformCompDiscount = undefined;coopQuery.orderByPlatformGuestDiscount = undefined"  :class="{'isOrderby':coopQuery.orderById == '-1'}"></Icon>
                 </span>
                </th>
                <th>体检中心</th>
                <th>平台显示</th>
                <th>
                  <Dropdown trigger="click">
                    <span class="ivu-dropdown hoverblue">
                        平台定制套餐
                        <i style="font-size:12px;" class="iconfont icon-guolvqi"></i>
                    </span>
                    <Dropdown-menu slot="list">
                        <Dropdown-item  @click.native="coopQuery.isIndividuationPlatformMeal = undefined">不限</Dropdown-item>
                        <Dropdown-item  @click.native="coopQuery.isIndividuationPlatformMeal = 'true'">支持</Dropdown-item>
                        <Dropdown-item  @click.native="coopQuery.isIndividuationPlatformMeal = 'false'">不支持</Dropdown-item>
                    </Dropdown-menu>
                  </Dropdown>
                </th>
                <th>
                  <Dropdown trigger="click">
                    <span class="ivu-dropdown hoverblue">
                        平台挂账
                        <i style="font-size:12px;" class="iconfont icon-guolvqi"></i>
                    </span>
                    <Dropdown-menu slot="list">
                        <Dropdown-item @click.native="coopQuery.isPlatformSuspense = undefined">不限</Dropdown-item>
                        <Dropdown-item @click.native="coopQuery.isPlatformSuspense = 'true'">支持</Dropdown-item>
                        <Dropdown-item @click.native="coopQuery.isPlatformSuspense = 'false'">不支持</Dropdown-item>
                    </Dropdown-menu>
                  </Dropdown>
                </th>
                <th>
                  <Dropdown trigger="click">
                    <span class="ivu-dropdown hoverblue">
                        预付开票
                        <i style="font-size:12px;" class="iconfont icon-guolvqi"></i>
                    </span>
                    <Dropdown-menu slot="list">
                        <Dropdown-item @click.native="coopQuery.isPrepayInvoice = undefined">不限</Dropdown-item>
                        <Dropdown-item @click.native="coopQuery.isPrepayInvoice = 'true'">支持</Dropdown-item>
                        <Dropdown-item @click.native="coopQuery.isPrepayInvoice = 'false'">不支持</Dropdown-item>
                    </Dropdown-menu>
                  </Dropdown>
                </th>
                <th>平台散客
                  <span class="basic-sort">
                   <Icon class="up" type="arrow-up-b" @click.native="coopQuery.orderById = undefined;coopQuery.orderByGuestOfflineCompDiscount = undefined;coopQuery.orderByGuestOnlineCompDiscount = undefined;coopQuery.orderByHospitalCompDiscount = undefined;coopQuery.orderByPlatformCompDiscount = undefined;coopQuery.orderByPlatformGuestDiscount = '1'"  :class="{'isOrderby':coopQuery.orderByPlatformGuestDiscount == '1'}"></Icon>
                   <Icon class="down" type="arrow-down-b" @click.native="coopQuery.orderById = undefined;coopQuery.orderByGuestOfflineCompDiscount = undefined;coopQuery.orderByGuestOnlineCompDiscount = undefined;coopQuery.orderByHospitalCompDiscount = undefined;coopQuery.orderByPlatformCompDiscount = undefined;coopQuery.orderByPlatformGuestDiscount = '-1'"  :class="{'isOrderby':coopQuery.orderByPlatformGuestDiscount == '-1'}"></Icon>
                 </span>
                </th>
                <th>平台单位
                  <span class="basic-sort">
                   <Icon class="up" type="arrow-up-b" @click.native="coopQuery.orderById = undefined;coopQuery.orderByGuestOfflineCompDiscount = undefined;coopQuery.orderByGuestOnlineCompDiscount = undefined;coopQuery.orderByHospitalCompDiscount = undefined;coopQuery.orderByPlatformCompDiscount = '1';coopQuery.orderByPlatformGuestDiscount = undefined"  :class="{'isOrderby':coopQuery.orderByPlatformCompDiscount == '1'}"></Icon>
                   <Icon class="down" type="arrow-down-b" @click.native="coopQuery.orderById = undefined;coopQuery.orderByGuestOfflineCompDiscount = undefined;coopQuery.orderByGuestOnlineCompDiscount = undefined;coopQuery.orderByHospitalCompDiscount = undefined;coopQuery.orderByPlatformCompDiscount = '-1';coopQuery.orderByPlatformGuestDiscount = undefined"  :class="{'isOrderby':coopQuery.orderByPlatformCompDiscount == '-1'}"></Icon>
                 </span>
                </th>
                <th>网上预约
                  <span class="basic-sort">
                   <Icon class="up" type="arrow-up-b" @click.native="coopQuery.orderById = undefined;coopQuery.orderByGuestOfflineCompDiscount = undefined;coopQuery.orderByGuestOnlineCompDiscount = '1';coopQuery.orderByHospitalCompDiscount = undefined;coopQuery.orderByPlatformCompDiscount = undefined;coopQuery.orderByPlatformGuestDiscount = undefined"  :class="{'isOrderby':coopQuery.orderByGuestOnlineCompDiscount == '1'}"></Icon>
                   <Icon class="down" type="arrow-down-b" @click.native="coopQuery.orderById = undefined;coopQuery.orderByGuestOfflineCompDiscount = undefined;coopQuery.orderByGuestOnlineCompDiscount = '-1';coopQuery.orderByHospitalCompDiscount = undefined;coopQuery.orderByPlatformCompDiscount = undefined;coopQuery.orderByPlatformGuestDiscount = undefined"  :class="{'isOrderby':coopQuery.orderByGuestOnlineCompDiscount == '-1'}"></Icon>
                 </span>
                </th>
                <th>前台散客
                  <span class="basic-sort">
                   <Icon class="up" type="arrow-up-b" @click.native="coopQuery.orderById = undefined;coopQuery.orderByGuestOfflineCompDiscount = '1';coopQuery.orderByGuestOnlineCompDiscount = undefined;coopQuery.orderByHospitalCompDiscount = undefined;coopQuery.orderByPlatformCompDiscount = undefined;coopQuery.orderByPlatformGuestDiscount = undefined"  :class="{'isOrderby':coopQuery.orderByGuestOfflineCompDiscount == '1'}"></Icon>
                   <Icon class="down" type="arrow-down-b" @click.native="coopQuery.orderById = undefined;coopQuery.orderByGuestOfflineCompDiscount = '-1';coopQuery.orderByGuestOnlineCompDiscount = undefined;coopQuery.orderByHospitalCompDiscount = undefined;coopQuery.orderByPlatformCompDiscount = undefined;coopQuery.orderByPlatformGuestDiscount = undefined"  :class="{'isOrderby':coopQuery.orderByGuestOfflineCompDiscount == '-1'}"></Icon>
                 </span>
                </th>
                <th>普通单位
                  <span class="basic-sort">
                   <Icon class="up" type="arrow-up-b" @click.native="coopQuery.orderById = undefined;coopQuery.orderByGuestOfflineCompDiscount = undefined;coopQuery.orderByGuestOnlineCompDiscount = undefined;coopQuery.orderByHospitalCompDiscount = '1';coopQuery.orderByPlatformCompDiscount = undefined;coopQuery.orderByPlatformGuestDiscount = undefined"  :class="{'isOrderby':coopQuery.orderByHospitalCompDiscount == '1'}"></Icon>
                   <Icon class="down" type="arrow-down-b" @click.native="coopQuery.orderById = undefined;coopQuery.orderByGuestOfflineCompDiscount = undefined;coopQuery.orderByGuestOnlineCompDiscount = undefined;coopQuery.orderByHospitalCompDiscount = '-1';coopQuery.orderByPlatformCompDiscount = undefined;coopQuery.orderByPlatformGuestDiscount = undefined"  :class="{'isOrderby':coopQuery.orderByHospitalCompDiscount == '-1'}"></Icon>
                 </span>
                </th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="coop in cooperationList" :key="coop.id">
                <td v-if="isHandler" style="text-align: center;"><Checkbox :key="coop.id" :label="coop.id" class="hidden-label"></Checkbox></td>
                <td>{{coop.id}}</td>
                <td>
                  <div>
                    <span v-if="!coop.enable" class="mt-tag">停用</span>
                    <span>{{coop.name}}</span>
                  </div>
                  <div class="gray">{{coop.address.briefAddress}}</div>
                </td>
                <td>
                 <span>{{coop.showInList ? '显示':'不显示'}}</span>
                </td>
                <td>
                 <span>{{coop.settings.isIndividuationPlatformMeal ? '支持':'不支持'}}</span>
                </td>
                <td>
                 <span>{{coop.settings.isPlatformSuspense ? '支持':'不支持'}}</span>
                </td>
                <td>
                 <span>{{coop.settings.isPrepayInvoice ? '支持':'不支持'}}</span>
                </td>
                <td>
                 <span>{{coop.settings.platformGuestDiscount}}</span>
                </td>
                <td>
                 <span>{{coop.settings.platformCompDiscount}}</span>
                </td>
                <td>
                 <span>{{coop.settings.guestOnlineCompDiscount}}</span>
                </td>
                <td>
                 <span>{{coop.settings.guestOfflineCompDiscount}}</span>
                </td>
                <td>
                 <span>{{coop.settings.hospitalCompDiscount}}</span>
                </td>
                <td>
                  <a @click="$router.push('/hospitalManage/list/edit/cooperation/' + coop.id)">详情</a>
                  <more-operation :hospital="coop" @on-success="getHospitalCoopList" />
                </td>
              </tr>
            </tbody>
          </table>
      </Checkbox-group>
    </div>

     <div class="page-wrap" style="height:200px;">
      <Page
      :total="coopPage.rowCount"
      :current="coopPage.currentPage"
      :page-size="coopPage.pageSize"
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
  name: 'basicInfo',
  components: {
    'more-operation': MoreOperation,
  },
  data() {
    return {
      cooperationList: [],
      coopQuery: {
        isIndividuationPlatformMeal: undefined, //平台定制套餐
        isPlatformSuspense: undefined,//平台挂账
        isPrepayInvoice: undefined,//预付开票
        orderByGuestOfflineCompDiscount: undefined,//前台散客折扣
        orderByGuestOnlineCompDiscount: undefined,//网上预约折扣
        orderByHospitalCompDiscount: undefined,//普通单位折扣
        orderById: 1,//id排序
        orderByPlatformCompDiscount: undefined,//平台单位折扣
        orderByPlatformGuestDiscount: undefined,//平台散客折扣
      },

      coopPage: {
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
      cooLoading: false,
    }
  },

  props: ['organizationQuery','allHospitalIdList','isHandler'],

  watch: {
    coopQuery: {
        handler: function(){
          console.log(213);
          this.getHospitalCoopList(true);
        },
        deep: true
    },
  },

  computed: {
    coopIdList() {
      return this.cooperationList.map(item => { return item.id });
    }
  },

  mounted() {
  },

  methods: {

     //获取平台合作列表
      getHospitalCoopList( isChangePage = false, currentPage = 1, pageSize = 20) {
        this.coopQuery.page = {
          currentPage: currentPage,
          pageSize: pageSize,
          rowCount: 0,
        }
        this.loadHospitalCoopList(isChangePage);
      },

      //获取平台合作列表
      loadHospitalCoopList(isChangePage){
        this.cooLoading = true;
        this.$http.post('/cooperationInfoList', JSON.stringify({organizationQuery:this.organizationQuery, privateQuery: this.coopQuery})).then((response) => {
            this.cooperationList = response.body.records;
            this.coopPage = response.body.page;
            if (!isChangePage) {
              this.resetCheck();
            } else {
              this.checkGroupChange(this.checkGroup);
            }
            this.cooLoading = false;
        }, (res) => {
            this.$Message.error(res.text);
            this.cooLoading = false;
        });
      },

      //清空功能配置条件
      clearQuery() {
        this.coopQuery = {
          isIndividuationPlatformMeal: undefined, //平台定制套餐
          isPlatformSuspense: undefined,//平台挂账
          isPrepayInvoice: undefined,//预付开票
          orderByGuestOfflineCompDiscount: undefined,//前台散客折扣
          orderByGuestOnlineCompDiscount: undefined,//网上预约折扣
          orderByHospitalCompDiscount: undefined,//普通单位折扣
          orderById: 1,//id排序
          orderByPlatformCompDiscount: undefined,//平台单位折扣
          orderByPlatformGuestDiscount: undefined,//平台散客折扣
        }
        this.getHospitalCoopList();
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
            this.checkGroup = MyUtil.merge(this.checkGroup, this.coopIdList);
        } else {
            this.checkGroup = MyUtil.split(this.checkGroup, this.coopIdList);
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
        if (MyUtil.allIn(this.coopIdList, data)) {
            this.indeterminatePage = false;
            this.checkPage = true;
        } else if (MyUtil.someIn(this.coopIdList, data)) {
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
        this.getHospitalCoopList( false, val, this.coopPage.pageSize)
      },

      //pageSize信息
      pageSizeInfo(val){
        this.getHospitalCoopList( false, 1, val)
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
