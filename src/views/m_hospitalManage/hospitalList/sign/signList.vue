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

      <span class="ops-query mr5" v-show="signQuery.contractType">
        <span>协议类型:{{signQuery.contractType | contractType}}</span>
        <Icon type="close" @click.native="signQuery.contractType = undefined"></Icon>
      </span>

      <span class="ops-query mr5" v-show="signQuery.contractStatus">
        <span>协议状态:{{signQuery.contractStatus | contractStatus}}</span>
        <Icon type="close" @click.native="signQuery.contractStatus = undefined"></Icon>
      </span>

      <a v-if="signQuery.contractType || signQuery.contractStatus" @click="clearQuery()">清空</a>
    </div>

    <Spin size="large" fix v-if="signLoading"></Spin>

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
                 <Icon class="up" type="arrow-up-b" @click.native="signQuery.orderById = '1';"  :class="{'isOrderby':signQuery.orderById == '1'}"></Icon>
                 <Icon class="down" type="arrow-down-b"  @click.native="signQuery.orderById = '-1';"  :class="{'isOrderby':signQuery.orderById == '-1'}"></Icon>
               </span>
              </th>
              <th>体检中心</th>
              <th>主任</th>
              <th>信息科</th>
              <th>HIS厂商</th>
              <th>
                <Dropdown trigger="click">
                  <span class="ivu-dropdown hoverblue">
                      合同签约
                      <i style="font-size:12px;" class="iconfont icon-guolvqi"></i>
                  </span>
                  <Dropdown-menu slot="list">
                      <Dropdown-item disabled>协议类型</Dropdown-item>
                      <Dropdown-item @click.native="signQuery.contractType = undefined">不限</Dropdown-item>
                      <Dropdown-item @click.native="signQuery.contractType = '1'">服务协议</Dropdown-item>
                      <Dropdown-item @click.native="signQuery.contractType = '2'">保密协议</Dropdown-item>
                      <Dropdown-item @click.native="signQuery.contractType = '3'">代收协议</Dropdown-item>
                      <Dropdown-item @click.native="signQuery.contractType = '4'">折扣协议</Dropdown-item>
                      <Dropdown-item disabled divided>协议状态</Dropdown-item>
                      <Dropdown-item @click.native="signQuery.contractStatus = undefined">不限</Dropdown-item>
                      <Dropdown-item @click.native="signQuery.contractStatus = '1'">即将过期</Dropdown-item>
                      <Dropdown-item @click.native="signQuery.contractStatus = '2'">已过期</Dropdown-item>
                  </Dropdown-menu>
                </Dropdown>
              </th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="sign in signList">
              <td v-if="isHandler" style="text-align: center;"><Checkbox :key="sign.id" :label="sign.id" class="hidden-label"></Checkbox></td>
              <td>{{sign.hospital.id}}</td>
               <td>
                <div>
                  <span v-if="!sign.hospital.enable" class="mt-tag">停用</span>
                  <span>{{sign.hospital.name}}</span>
                </div>
                <div class="gray">{{sign.hospital.address.briefAddress}}</div>
              </td>
              <td>
                <div v-if="sign.examMediator">{{sign.examMediator.name}}</div>
                <div v-if="sign.examMediator">{{sign.examMediator.mobile}}</div>
                <div v-else>-</div>
              </td>
              <td>
                <div v-if="sign.infoMediator">{{sign.infoMediator.name}}</div>
                <div v-if="sign.infoMediator">{{sign.infoMediator.mobile}}</div>
                <div v-else>-</div>
              </td>
              <td>
                <div v-if="sign.hisMediator">{{sign.hisMediator.name}}</div>
                <div v-if="sign.hisMediator">{{sign.hisMediator.mobile}}</div>
                <div v-else>-</div>
                <div><span>{{sign.cooperateCompany}}</span>
                  <span v-if="sign.cooperateCompany && sign.cooperateType != null">|</span>
                  <span>{{sign.cooperateType | cooperateType}}</span></div>
              </td>
              <td>
                <div class="dlb ml5" v-for="item in sign.signMap">
                  <span :class="{'orange':item.status == 1,'redfont':item.status == 2}">
                    <Tooltip v-if="item.status == 1" :content="'即将过期:'+ formatDate(item.startDate) +'-'+ formatDate(item.endDate)">
                      {{item.type == 1 ? '服务':(item.type == 2 ? '保密':(item.type == 3 ? '代收':'折扣'))}}
                    </Tooltip>
                    <Tooltip v-else-if="item.status == 2" :content="'已过期:'+ formatDate(item.startDate) +'-'+ formatDate(item.endDate)">
                      {{item.type == 1 ? '服务':(item.type == 2 ? '保密':(item.type == 3 ? '代收':'折扣'))}}
                    </Tooltip>
                    <span v-else>
                      {{item.type == 1 ? '服务':(item.type == 2 ? '保密':(item.type == 3 ? '代收':'折扣'))}}
                    </span>
                  </span>
                </div>
              </td>
              <td>
                <a @click="$router.push('/hospitalManage/list/edit/sign/' + sign.hospital.id)">详情</a>
                <more-operation :hospital="sign.hospital" @on-success="getHospitalSignList" />
              </td>
            </tr>
          </tbody>
        </table>
      </Checkbox-group>
    </div>

    <div class="page-wrap" style="height:200px;">
      <Page
      :total="signPage.rowCount"
      :current="signPage.currentPage"
      :page-size="signPage.pageSize"
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
  name: 'signList',
  components: {
    'more-operation': MoreOperation,
  },
  data() {
    return {
      signList: [],
      signQuery: {
        contractStatus: undefined, //签约状态
        contractType: undefined, //签约合同类型
        orderById: 1, //id排序
      },

      signPage: {
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
      signLoading: false
    }
  },

  props: ['organizationQuery','allHospitalIdList','isHandler'],

  watch: {
    signQuery: {
       handler: function(){
          this.getHospitalSignList(true);
       },
       deep: true
    }
  },

  filters: {
     contractStatus: function(val){
      if(val == '1'){
        return '即将过期';
      }else if(val == '2'){
        return '已过期';
      }else if(val == '3'){
        return '正常';
      }
     },
     contractType: function(val){
      if(val == '1'){
        return '服务协议'
      }else if(val == '2'){
        return '保密协议'
      }else if(val == '3'){
        return '代收协议'
      }else if(val == '4'){
        return '折扣协议'
      }
     },
     cooperateType: function(val){
       if(val == '0'){
        return '自对接'
       }else if(val == '1'){
        return '厂商对接'
       }
     },
   },

  computed: {
    signIdList() {
      return this.signList.map(item => { return item.hospital.id });
    }
  },

  mounted() {
  },

  methods: {
     
      getHospitalSignList( isChangePage = false, currentPage = 1, pageSize = 20){
        this.signQuery.page = {
          currentPage: currentPage,
          pageSize: pageSize,
          rowCount: 0,
        }
        this.loadHospitalSignList(isChangePage);
      },

      //获取签约对接列表
      loadHospitalSignList(isChangePage){
        this.signLoading = true;
        this.$http.post('/hospitalListBySign', JSON.stringify({organizationQuery:this.organizationQuery, privateQuery: this.signQuery})).then((response) => {
            this.signList = response.body.records;
            this.signPage = response.body.page;
            for(let i=0; i<this.signList.length; i++){
               this.signList[i].id = this.signList[i].hospital.id
            }
            if (!isChangePage) {
              this.resetCheck();
            } else {
              this.checkGroupChange(this.checkGroup);
            }
            this.signLoading = false;
        }, (res) => {
            this.$Message.error(res.text);
            this.signLoading = false;
        });
      },

      //清空功能配置条件
      clearQuery() {
         this.signQuery = {
            contractStatus: undefined, //签约状态
            contractType: undefined, //签约合同类型
            orderById: undefined, //id排序
          }
         this.getHospitalSignList();
      },

      formatDate (data) {
        if(!data){
         return '';
        }
        return MyUtil.formatDate(new Date(data), 'yyyy/MM/dd');
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
            this.checkGroup = MyUtil.merge(this.checkGroup, this.signIdList);
        } else {
            this.checkGroup = MyUtil.split(this.checkGroup, this.signIdList);
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
        if (MyUtil.allIn(this.signIdList, data)) {
            this.indeterminatePage = false;
            this.checkPage = true;
        } else if (MyUtil.someIn(this.signIdList, data)) {
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
        this.getHospitalSignList( false, val, this.signPage.pageSize)
      },

      //pageSize信息
      pageSizeInfo(val){
        this.getHospitalSignList( false, 1, val)
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
