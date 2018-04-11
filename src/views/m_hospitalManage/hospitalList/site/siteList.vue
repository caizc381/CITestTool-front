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

      <span class="ops-query mr5" v-show="siteQuery.showInvoice">
        <span>是否向客户询问要发票:{{siteQuery.showInvoice | showInvoice}}</span>
        <Icon type="close" @click.native="siteQuery.showInvoice = undefined"></Icon>
      </span>

      <span class="ops-query mr5" v-show="siteQuery.siteTemplateId">
        <span>站点模板:{{siteQuery.siteTemplateName}}</span>
        <Icon type="close" @click.native="siteQuery.siteTemplateId = undefined"></Icon>
      </span>

      <a v-if="siteQuery.showInvoice || siteQuery.siteTemplateId" @click="clearQuery()">清空</a>
    </div>

    <Spin size="large" fix v-if="siteLoading"></Spin>

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
            <colgroup span="5"></colgroup>
            <col width="150">
            <thead>
              <tr>
                <th v-if="isHandler" style="width: 40px;"></th>
                <th>ID
                 <span class="basic-sort">
                   <Icon class="up" type="arrow-up-b" @click.native="siteQuery.orderById = '1'"  :class="{'isOrderby':siteQuery.orderById == '1'}"></Icon>
                   <Icon class="down" type="arrow-down-b" @click.native="siteQuery.orderById = '-1'"  :class="{'isOrderby':siteQuery.orderById == '-1'}"></Icon>
                 </span>
                </th>
                <th>体检中心</th>
                <th>
                  <Dropdown trigger="click">
                    <span class="ivu-dropdown hoverblue">
                        站点模板
                        <i style="font-size:12px;" class="iconfont icon-guolvqi"></i>
                    </span>
                    <Dropdown-menu slot="list">
                        <Dropdown-item @click.native="siteQuery.siteTemplateId = undefined">不限</Dropdown-item>
                        <Dropdown-item v-for="template in mobileTemplateList" @click.native="siteQuery.siteTemplateId = template.id;siteQuery.siteTemplateName = template.name">{{template.name}}</Dropdown-item>
                    </Dropdown-menu>
                  </Dropdown>
                </th>
                <th>色调</th>
                <th>
                  <Dropdown trigger="click">
                    <span class="ivu-dropdown hoverblue">
                        询问开票
                        <i style="font-size:12px;" class="iconfont icon-guolvqi"></i>
                    </span>
                    <Dropdown-menu slot="list">
                        <Dropdown-item  @click.native="siteQuery.showInvoice = undefined">不限</Dropdown-item>
                        <Dropdown-item  @click.native="siteQuery.showInvoice = '1'">是</Dropdown-item>
                        <Dropdown-item  @click.native="siteQuery.showInvoice = '2'">检后开票</Dropdown-item>
                        <Dropdown-item  @click.native="siteQuery.showInvoice = '0'">否</Dropdown-item>
                    </Dropdown-menu>
                  </Dropdown>
                </th>
                <th>站点地址</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(site,index) in siteList">
                <td v-if="isHandler" style="text-align: center;"><Checkbox :key="site.id" :label="site.id" class="hidden-label"></Checkbox></td>
                <td>{{site.hospital.id}}</td>
                 <td>
                  <div>
                    <span v-if="!site.hospital.enable" class="mt-tag">停用</span>
                    <span>{{site.hospital.name}}</span>
                  </div>
                  <div class="gray">{{site.hospital.address.briefAddress}}</div>
                </td>
                <td>
                  <span>{{site.templateName}}</span>
                </td>
                <td>
                  <span>{{site.color}}</span>
                </td>
                <td>
                  <span>{{site.showInvoice | showInvoice}}</span>
                </td>
                <td>
                  <div class="ell-3">
                    <input class="siteUrl" readonly type="text" :id="'site'+index" :value="'https://www.mytijian.com/m/'+site.url" />
                    <Button type="text" @click="copyUrl(index)">复制</Button>
                  </div>
                </td>
                <td>
                  <a @click="$router.push('/hospitalManage/list/edit/site/' + site.hospital.id)">详情</a>
                  <more-operation :hospital="site.hospital" @on-success="getHospitalSiteList" />
                </td>
              </tr>
            </tbody>
          </table>
      </Checkbox-group>
    </div>

    <div class="page-wrap" style="height:200px;">
      <Page
      :total="sitePage.rowCount"
      :current="sitePage.currentPage"
      :page-size="sitePage.pageSize"
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
  name: 'siteList',
  components: {
    'more-operation': MoreOperation,
  },
  data() {
    return {
      siteList: [],
      mobileTemplateList: [],
      siteQuery: {
        showInvoice: undefined, //向客户询问要发票
        siteTemplateId: undefined, //站点模板ID
        siteTemplateName: undefined,//站点模板名称
        orderById: 1,
      },

      sitePage: {
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
      siteLoading: false,
    }
  },

  props: ['organizationQuery','allHospitalIdList','isHandler'],

  watch: {
    siteQuery: {
       handler: function(){
          this.getHospitalSiteList(true);
       },
       deep: true
    },
  },

  filters:{
    showInvoice: function(val){
       if(val == '0'){
        return '否'
       }else if(val == '1'){
        return '是'
       }else if(val == '2'){
        return '检后开票'
       }
     },
  },

  computed: {
    siteIdList() {
      return this.siteList.map(item => { return item.hospital.id });
    }
  },

  mounted() {
    this.getCssAndTemplateList()
  },

  methods: {

     getHospitalSiteList( isChangePage = false, currentPage = 1, pageSize = 20){
        this.siteQuery.page = {
          currentPage: currentPage,
          pageSize: pageSize,
          rowCount: 0,
        }
        this.loadHospitalSiteList(isChangePage);
      },

     //获取站点信息列表
      loadHospitalSiteList(isChangePage){
        this.siteLoading = true;
        this.siteQuery.siteTemplateName = undefined;

        this.$http.post('/listHospitalSite', JSON.stringify({organizationQuery:this.organizationQuery, privateQuery: this.siteQuery})).then((response) => {
            this.siteList = response.body.records;
            this.sitePage = response.body.page;
            for(let i=0; i<this.siteList.length; i++){
               this.siteList[i].id = this.siteList[i].hospital.id
            }
            if (!isChangePage) {
              this.resetCheck();
            } else {
              this.checkGroupChange(this.checkGroup);
            }
            this.siteLoading = false;
        }, (res) => {
            this.$Message.error(res.text);
            this.siteLoading = false;
        });
      },

      //获取Template列表
      getCssAndTemplateList(){
        this.$http.get('/siteTemplateAndCss?orgType=1').then((response) => {
            this.mobileTemplateList = response.body.mobileTemplateList;
        }, (res) => {
            this.$Message.error(res.text);
        });
      },

      //清空功能配置条件
      clearQuery() {
        this.siteQuery = {
          showInvoice: undefined, //向客户询问要发票
          siteTemplateId: undefined, //站点模板ID
        }
        this.getHospitalSiteList();
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
            this.checkGroup = MyUtil.merge(this.checkGroup, this.siteIdList);
        } else {
            this.checkGroup = MyUtil.split(this.checkGroup, this.siteIdList);
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
        if (MyUtil.allIn(this.siteIdList, data)) {
            this.indeterminatePage = false;
            this.checkPage = true;
        } else if (MyUtil.someIn(this.siteIdList, data)) {
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
        this.getHospitalSiteList( false, val, this.sitePage.pageSize)
      },

      //pageSize信息
      pageSizeInfo(val){
        this.getHospitalSiteList( false, 1, val)
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
     },

     //复制地址
      copyUrl(index){
        var id = 'site'+index;
        var e = document.getElementById(id);
        e.select(); // 选择对象
        document.execCommand("Copy"); // 执行浏览器复制命令
        this.$Message.info('复制成功');
      }

  }
}
</script>
