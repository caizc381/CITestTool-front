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

    <Spin size="large" fix v-if="baseLoading"></Spin>

    <div class="check-table-wrap">
      <Checkbox
        v-if="isHandler"
        class="check-page"
        :indeterminate="indeterminatePage"
        v-model="checkPage"
        @click.prevent.native="handlecheckPage">{{checkPageLabel}}</Checkbox>
      <CheckboxGroup v-model="checkGroup" @on-change="checkGroupChange">
        <table class="table">
          <col v-if="isHandler" width="50">
          <col width="60">
          <colgroup span="8"></colgroup>
          <col width="150">
          <thead>
            <tr>
              <th v-if="isHandler" style="width: 40px;"></th>
              <th>ID
               <span class="basic-sort">
                 <Icon class="up" type="arrow-up-b"  @click.native="basicQuery.orderById = '1';basicQuery.orderByBusinessAmount = undefined;"  :class="{'isOrderby':basicQuery.orderById == '1'}" ></Icon>
                 <Icon class="down" type="arrow-down-b"  @click.native="basicQuery.orderById = '-1';basicQuery.orderByBusinessAmount = undefined;"  :class="{'isOrderby':basicQuery.orderById == '-1'}"></Icon>
                </span>
              </th>
              <th>体检中心</th>
              <th>管理员</th>
              <th>业务联系人</th>
              <th>医院等级</th>
              <th>医院类型</th>
              <th>上一年业务量
                <span class="basic-sort">
                 <Icon class="up" type="arrow-up-b"  @click.native="basicQuery.orderByBusinessAmount = '1';basicQuery.orderById = undefined;"  :class="{'isOrderby':basicQuery.orderByBusinessAmount == '1'}" ></Icon>
                 <Icon class="down" type="arrow-down-b"  @click.native="basicQuery.orderByBusinessAmount = '-1';basicQuery.orderById = undefined;"  :class="{'isOrderby':basicQuery.orderByBusinessAmount == '-1'}"></Icon>
                </span>
              </th>
              <th>深浅对接</th>
              <th>运营经理</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="basic in basicInfolist" :key="basic.hospital.id">
              <td v-if="isHandler" style="text-align: center;"><Checkbox :key="basic.id" :label="basic.id" class="hidden-label"></Checkbox></td>
              <td>{{basic.hospital.id}}</td>
              <td>
                <div>
                  <span v-if="!basic.hospital.enable" class="mt-tag">停用</span>
                  <span>{{basic.hospital.name}}</span>
                </div>
                <div class="gray">{{basic.hospital.address.briefAddress}}</div>
              </td>
              <td>
                <div>
                  <span v-if="basic.manager.name">{{basic.manager.name}}</span>
                  <span v-else>-</span>
                </div>
                <div class="gray" v-if="basic.manager.mobile">{{basic.manager.mobile}}</div>
                <div class="gray" v-if="basic.manager.username">账号:{{basic.manager.username}}</div>
              </td>
              <td>
                <div>
                  <span v-if="basic.organizationMediatorInfo">{{basic.organizationMediatorInfo.name}}</span>
                  <span v-else>-</span>
                </div>
                <div class="gray" v-if="basic.organizationMediatorInfo">{{basic.organizationMediatorInfo.mobile}}</div>
              </td>
              <td>{{basic.hospital.level}}</td>
              <td>{{basic.hospital.type}}</td>
              <td>
                <span v-if="basic.hospital.settings.businessAmount">{{basic.hospital.settings.businessAmount}}</span>
                <span v-else>-</span>
              </td>
              <td>{{basic.hospital.settings.exportWithXls == false ? '深对接':'浅对接'}}</td>
              <td>
                <div>
                 <span v-if="basic.opsManager.employeeName">{{basic.opsManager.employeeName}}</span>
                 <span v-else>-</span>
                </div>
                <div class="gray">{{basic.opsManager.mobile}}</div>
                <div class="gray">{{basic.opsManager.departName}}</div>
              </td>
              <td>
                <a @click="$router.push('/hospitalManage/list/edit/basic/' + basic.hospital.id)" >详情</a>
                <more-operation :hospital="basic.hospital" @on-success="getHospitalsBasicList" />
              </td>
            </tr>
          </tbody>
        </table>
      </CheckboxGroup>
    </div>

    <div class="page-wrap" style="height:200px;">
      <Page
      :total="basicPage.rowCount"
      :current="basicPage.currentPage"
      :page-size="basicPage.pageSize"
      :page-size-opts="[10,20,50]"
      show-sizer
      show-total
      @on-change="currentPageInfo"
      @on-page-size-change="pageSizeInfo"></Page>
    </div>

    <Modal v-model="showExport">
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
      basicInfolist: [],
      basicQuery: {
        orderByBusinessAmount: undefined,//年业务量
        orderById: 1,//id排序
      },

      basicPage: {
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
      baseLoading: false
    }
  },

  props: ['organizationQuery','allHospitalIdList','isHandler'],

  watch: {
    basicQuery: {
        handler: function(){
          this.getHospitalsBasicList(true);
        },
        deep: true
    },
  },

  computed: {
    basicIdList() {
      return this.basicInfolist.map(item => { return item.hospital.id });
    }
  },

  mounted() {
    this.getHospitalsBasicList()
  },

  methods: {
      //获取基本信息列表
      getHospitalsBasicList( isChangePage = false, currentPage = 1, pageSize = 20) {
        this.basicQuery.page = {
          currentPage: currentPage,
          pageSize: pageSize,
          rowCount: 0,
        }
        this.loadHospitalsBasicList(isChangePage);
      },

      //获取基本信息列表
      loadHospitalsBasicList(isChangePage) {
        this.baseLoading = true;
        this.$http.post('/listHospitalBaseInfo', JSON.stringify({organizationQuery:this.organizationQuery, privateQuery: this.basicQuery})).then((response) => {
            this.basicInfolist = response.body.records;
            this.basicPage = response.body.page;
            for(let i=0; i<this.basicInfolist.length; i++){
              this.basicInfolist[i].id = this.basicInfolist[i].hospital.id;
            }
            if (!isChangePage) {
              this.resetCheck();
            } else {
              this.checkGroupChange(this.checkGroup);
            }
            this.baseLoading = false;
        }, (res) => {
            this.$Message.error(res.text);
            this.baseLoading = false;
        });
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
              this.checkGroup = MyUtil.merge(this.checkGroup, this.basicIdList);
          } else {
              this.checkGroup = MyUtil.split(this.checkGroup, this.basicIdList);
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
        if (MyUtil.allIn(this.basicIdList, data)) {
            this.indeterminatePage = false;
            this.checkPage = true;
        } else if (MyUtil.someIn(this.basicIdList, data)) {
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
        this.getHospitalsBasicList( false, val, this.basicPage.pageSize)
      },

      //pageSize信息
      pageSizeInfo(val){
        this.getHospitalsBasicList( false, 1, val)
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

  }
}
</script>
