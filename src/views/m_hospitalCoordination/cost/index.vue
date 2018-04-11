<template>
  <div>
    <div class="header-search">
      <span>申请人：</span>
      <mt-select
        style="width:200px!important"
        v-model="search.applyUserId"
        :options="search.userList"
        placeholder="请选择申请人"
        @on-change="changeUser"
        :option-label="'employeeName'"
        :option-key="'id'"
        :filters="['employeeName', 'pinYin']">
      </mt-select>
      <span class="ml15">地区：</span>
      <Cascader
        class="dlb w200"
        placeholder="请选择地区"
        v-model="search.areaChecked"
        :data="search.areaList"
        :change-on-select=true
        @on-change="changeArea">
      </Cascader>

	     <span class="pl-20">体检中心：</span>
	     <div class="dlb w200">
	       <mt-select
	         v-model="search.hospitalId"
	         placeholder="请选择体检中心"
	         :filters="['name', 'pinyin']"
	         :options="search.hospitalList"
           @on-change="changeHospital">
	        </mt-select>
        </div>
        <span class="ml15">产生时间：</span>
        <DatePicker 
          class="w200"
          @on-change="changeData"
          type="daterange"
          :options="search.dateOption"
          v-model='search.time'
          placement="bottom-start" 
          placeholder="请选择时间范围">
        </DatePicker>
    </div>

    <div class="body-content pl30">
      <span class="b f16 mb10 dib">费用统计</span>
      <table class="table table-bordered text-center user-addborder user-tab">
        <thead>
          <tr>
            <th>费用合计</th>
            <th v-for="(item, idx) in cost.list" :key="idx">{{item.typeName}}</th>
          </tr>
        </thead>            
        <tbody>
          <td>￥{{allMoney*100 | money}}</td>
          <td v-for="(item, idx) in cost.list" :key="idx">￥{{item.moneySum*100 | money}}</td>
        </tbody>
      </table>

      
      <Row class="mt30 mb10">
        <i-col span="20"><span class="b f16 mb10 dib">费用明细</span></i-col>
        <i-col span="4" class="tr">
          <Button type="ghost" @click="exportExcel">导出Excel</Button>
          <Button v-if="financialAuthority" type="primary" class="ml10" @click="addCost">新增费用</Button>
        </i-col>
      </Row>
      <table class="table table-bordered text-center user-addborder user-tab">
        <thead>
          <tr>
            <th>
              费用产生时间
              <span class="basic-sort">
                <Icon class="up" type="arrow-up-b"  @click.native="sortFuc(1,1)"  :class="{'isOrderby':search.orderByProduceTime == 1}" ></Icon>
                <Icon class="down" type="arrow-down-b"  @click.native="sortFuc(1,-1)"  :class="{'isOrderby':search.orderByProduceTime == -1}"></Icon>
              </span>
            </th>
            <th>申请人</th>
            <th>体检中心</th>
            <th>费用名目</th>
            <th>金额
              <span class="basic-sort">
                <Icon class="up" type="arrow-up-b"  @click.native="sortFuc(2,1)"  :class="{'isOrderby':search.orderByMoney == 1}" ></Icon>
                <Icon class="down" type="arrow-down-b"  @click.native="sortFuc(2,-1)"  :class="{'isOrderby':search.orderByMoney == -1}"></Icon>
              </span>
            </th>
            <th>备注</th>
            <th>记录时间
              <span class="basic-sort">
                <Icon class="up" type="arrow-up-b"  @click.native="sortFuc(3,1)"  :class="{'isOrderby':search.orderByCreateTime == 1}" ></Icon>
                <Icon class="down" type="arrow-down-b"  @click.native="sortFuc(3,-1)"  :class="{'isOrderby':search.orderByCreateTime == -1}"></Icon>
              </span>
            </th>
            <th>记录人</th>
          </tr>
        </thead>            
        <tbody>
          <tr v-for="item in list.data" :key="item.id">
            <td>{{item.produceTime | date('yyyy-MM-dd')}}</td>
            <td>{{item.applyUser}}</td>
            <td>{{item.hospitalSimple?item.hospitalSimple.name:'-'}}</td>
            <td>{{item.jointCostTypeDTO.name}}</td>
            <td>{{item.money*100 | costMoney}}</td>
            <td>
              <div style="display:flex;">
                <span class="ell" :title="item.remark">
                  {{item.remark}} <br>
                </span>       
                <Tooltip v-if="item.url">
                    <a style="white-space:nowrap;">图片</a>
                    <div slot="content" >
                      <img :src="imageRemoteSite + item.url" style="max-width:100%;max-height:100%">
                    </div>
                  </Tooltip>         
              </div>
            </td>
            <td>{{item.createTime | date('yyyy-MM-dd hh:mm:ss')}}</td>
            <td>{{item.recordUser}}</td>
          </tr>
        </tbody>
      </table>

      <div class="mt30 tc" v-if="page.total>0">
        <Page 
        :total="page.total" 
        :current="page.current"
        :page-size="page.size"
        @on-change="changePage"
        @on-page-size-change="changeSize"
        show-elevator
        show-sizer
        show-total></Page>
      </div>
      
      <div class="tc mt10 mb20" v-else>当前列表的数据为空</div>

    </div>

    <!--导出modal-->
    <Modal
        v-model="exportModal"
        title="提示">
        <Form :label-width="100">
          <FormItem label="">
            <span>你确定要导出当前筛选条件下所有的明细吗？</span>
          </FormItem>
          
          <FormItem label="申请人：">
            <span v-if="search.applyUserId!=''">{{applyUserName}}</span>
            <span v-else>不限</span>
          </FormItem>
          <FormItem label="地区：">
            <span v-if="search.areaCheckedData.length>0">{{search.areaCheckedData.reduce((arr,item)=>{return arr+=item.label+' '},'')}}</span>
            <span v-else>不限</span>
          </FormItem>
          <FormItem label="体检中心：">
            <span v-if="search.hospitalId!=''">{{hospitalName}}</span>
            <span v-else>不限</span>
          </FormItem>
          <FormItem label="产生时间：">
            <span v-if="search.time.length>0">{{search.time[0] | date('yyyy-MM-dd')}} 至 {{search.time[1] | date('yyyy-MM-dd')}}</span>
            <span v-else>不限</span>
          </FormItem>
        </Form>
        <div slot="footer">
          <a class="mr10" @click="exportModal=false">取消</a>
          <Button type="primary" @click="exportExcelFuc">确定</Button>
        </div>
    </Modal>

    <!--新增modal-->
    <Modal
        v-model="addModal"
        title="新增对接费用"
        width="800px;">
        <Form :label-width="100" inline>
          <FormItem label="体检机构：">
            <mt-select
              style="width:200px!important"
              v-model="addData.hospital"
              placeholder="请选择体检中心"
              :filters="['name', 'pinyin']"
              :options="search.hospitalList"
              @on-change="changeModalSelect">
            </mt-select>
          </FormItem>
          <FormItem label="发生时间：" required>
            <DatePicker 
              v-model="addData.time" 
              type="date" 
              style="width: 200px" 
              :clearable=false
              format="yyyy/MM/dd"></DatePicker>
          </FormItem>
          <FormItem label="申请人：" required>
            <mt-select
              style="width:200px!important"
              v-model="addData.applyUser"
              :options="search.userList"
              :option-label="'employeeName'"
              :option-key="'id'"
              :filters="['employeeName','pinYin']">
            </mt-select>
          </FormItem>
          <FormItem label="费用类型：" required>
            <Select v-model="addData.costType" style="width:200px">
                <Option v-for="item in addData.costTypeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="金额：" required>
            <Input v-model="addData.money" style="width:200px" placeholder="请输入付款金额" @on-blur="validateMoney" />
          </FormItem>
          <FormItem label="图片附件：">
            <div class="w200">
              <div style="display:flex;" v-if="addData.img.name">
                <span  
                  class="ell dib pct100" 
                  :title="addData.img.name"
                  >{{addData.img.name}}</span>
                <span @click="deleteImg"><Icon type="close-round"></Icon></span>
              </div>
              
              <label class="imgUpload" v-else>
                <input type="file" id="environment" @change="uploadImage('environment','environment','environmentList')" />
                <Button type="ghost" icon="ios-cloud-upload-outline">上传图片</Button>
              </label>
            </div>
          </FormItem>
          <FormItem label="备注：">
            <Input 
            v-model="addData.remark" 
            type="textarea" 
            style="width:520px"
            :maxlength=100
            :autosize="{minRows: 2,maxRows: 5}" />
          </FormItem>
        </Form>
        <div slot="footer">
            <a class="mr10" @click="addModal=false">取消</a>
            <Button type="primary" @click="addCostFuc()" 
              :disabled="!(this.addData.costType!='' 
                          && this.addData.money!='' && this.addData.applyUser!='')">确定</Button>
        </div>
    </Modal>

  </div>
</template>
<script>
export default {
  data() {
    return {
      search: {
        applyUserId: '',
        userList: [],
        areaList: [],
        areaChecked: [],
        areaCheckedData: [],
        hospitalList: [],
        hospitalId: '',
        time: '',

        orderByProduceTime: null,
        orderByMoney: null,
        orderByCreateTime: null,
        //ivew时间组件自定义按钮
        dateOption: {
          shortcuts: [
            {
              text: "今天",
              value() {
                const end = new Date();
                const start = new Date();
                return [start, end];
              }
            },
            {
              text: "上个月",
              value() {
                const end = new Date();
                const start = new Date();
                end.setDate(0);
                start.setDate(0);
                start.setDate(1);
                return [start, end];
              }
            },
            {
              text: "本月",
              value() {
                let date = new Date();
                let y = date.getFullYear();
                let m = date.getMonth() + 1;
                let temp = new Date(y, m, 0);
                let days = temp.getDate();
                return [new Date(y, m - 1, 1), new Date(y, m - 1, days)];
              }
            }
          ]
        }, 
      },
      cost: {
        list: []
      },
      list: {
        data: []
      },

      page: {
        current: 1,
        total: 0,
        size: 20
      },

      //导出相关数据
      exportModal: false,
      exportData: {},

      addModal: false,
      addData: {
        hospital: '',
        costTypeList: [],
        costType: '',
        time: '',
        applyUser: '',
        money: '',
        remark: '',
        img: {},
      }
    };
  },
  watch: {
    //模态框弹出隐藏的时候清空里面的数据
    addModal () {
      this.clearModalData()
    }
  },
  filters: {
    costMoney(value) {
      if (value === undefined || value === null) {
        return ''
      }
      return '￥' + (value/100).toFixed(2);
    },
  },
  computed: {
    applyUserName () {
      let applyUser = ''
      for(let i of this.search.userList) {
        if(i.id==this.search.applyUserId) {
          applyUser = i.employeeName
        }
      }
      return applyUser
    },
    hospitalName () {
      for(let i of this.search.hospitalList) {
        if (i.id == this.search.hospitalId) {
          return i.name
        }
      }
    },
    allMoney () {
      return this.cost.list.reduce((money,i)=>{
                return money + i.moneySum
              },0)
    },
    financialAuthority:function(){
      let a = localStorage.permissions.split(',').indexOf('hospital:coordination:pass') > -1
      return a;
    },
  },
  methods: {

    //申请人选择框函数
    changeUser (data) {
      this.page.current = 1
      this.getCostList()
    },

    //地区选择框函数
    changeArea (data,selectedData) {
      this.search.areaChecked = data
      this.search.areaCheckedData = selectedData
      this.page.current = 1
      this.search.hospitalId = ''
      this.getHospitalList()
      this.getCostList()
    },

    //医院选择函数
    changeHospital (data) {
      this.page.current = 1
      this.getCostList()
    },

    //时间选择函数
    changeData (data) {
      this.$nextTick(()=>{
        this.page.current = 1
        this.getCostList()
      })
    },

    //排序函数
    sortFuc (type,value) {
      this.search.orderByProduceTime = null
      this.search.orderByMoney = null
      this.search.orderByCreateTime = null
      if(type==1) {
        this.search.orderByProduceTime =value
      }else if(type==2) {
        this.search.orderByMoney =value
      }else {
        this.search.orderByCreateTime =value
      }
      this.getCostList()
    },

    changeSize (value) {
      this.page.size = value;
      this.page.current = 1
      this.getCostList()
    },
    changePage (value) {
      this.page.current = value;
      this.getCostList()
    },
    exportExcel () {
      this.exportModal = true;
    },
    exportExcelFuc () {
      let url = '/work/jointCostInfoExport'
      let num = 0
      if(this.search.hospitalId!='') {
        if(num==0) {
          url += '?hospitalIds=' + this.search.hospitalId
        }
        num ++
      }
      if(this.search.areaChecked.length>0) {
        if(num==0) {
          url += '?addressId=' + this.search.areaChecked[this.search.areaChecked.length-1]/1
        }else {
          url += '&addressId=' + this.search.areaChecked[this.search.areaChecked.length-1]/1
        }
        num ++
      }
      if(this.search.applyUserId!='') {
        if(num==0) {
          url += '?applyUserId=' + this.search.applyUserId
        }else {
          url += '&applyUserId=' + this.search.applyUserId
        }
        num ++
      }

      if (this.search.time.length>0) {
        if(num==0) {
          url += '?timeStart=' + MyUtil.formatDate(this.search.time[0],'yyyy/MM/dd') + 
                  '&timeEnd=' + MyUtil.formatDate(this.search.time[1],'yyyy/MM/dd')
        }else {
          url += '&timeStart=' + MyUtil.formatDate(this.search.time[0],'yyyy/MM/dd') + 
                  '&timeEnd=' + MyUtil.formatDate(this.search.time[1],'yyyy/MM/dd')
        }
        num ++
      }

      this.exportModal = false

      window.location.href =
        this.$http.options.root + url
    },
    uploadImage (id, res, list){
       var file = document.getElementById(id).files[0];

       if (!MyUtil.isValidImg(file)) {
         this.$Message.warning('只能上传10M以内的图片类型文件, 文件名只能是数字、字母、汉字及下划线');
         document.getElementById(id).value = '';
         return;
       }

       var previewUrl = this.getObjectURL(file);

       this.addData.img = {
         name: file.name,
         value: '/coordination/'+file.name,
       }

       OssClient.addOssObject('/coordination/',file)
    },
    //获取图片地址
    getObjectURL (file) {
      var url = null ;
      if (window.createObjectURL!=undefined) { // basic
        url = window.createObjectURL(file) ;
      } else if (window.URL!=undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file) ;
      } else if (window.webkitURL!=undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file) ;
      }
      return url ;
    },
    deleteImg () {
      this.addData.img = {}
    },
    //新增费用，根据运营中心获取运营经理
    changeModalSelect (id) {
      if(id=='') {
        return
      }
      this.$http.get('/work/getManager?hospitalId=' + id ).then(
        res => {
          this.addData.applyUser = res.data.id;
        },
        err => {
          this.$message.error(err.data);
        }
      );
    },
    addCost () {
      this.addModal = true;
    },
    validateMoney () {
      let reg = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/
      let isMoney
      if(this.addData.money.substring(0,1)=='-') {
        isMoney = reg.test(this.addData.money.substring(1))
      }else {
        isMoney = reg.test(this.addData.money)
      }
      if(!isMoney) {
        this.$message.error('输入的金额不正确,最多小数点两位')
        return false
      }else {
        return true
      }
    },
    addCostFuc () {
      if(!this.validateMoney()) {
        return false
      }
      let applyUser
      for(let i of this.search.userList) {
        if(i.id==this.addData.applyUser) {
          applyUser = i.employeeName
        }
      }
      let pagram = {
        hospitalSimple: {
          id: this.addData.hospital?this.addData.hospital/1:''
        },
        jointCostTypeDTO: {
          id: this.addData.costType/1
        },
        money: this.addData.money/1,
        remark: this.addData.remark,
        applyUser: applyUser,
        applyUserId: this.addData.applyUser,
        produceTime: Date.parse(this.addData.time),
        createTime: Date.parse(new Date()),
        recordUser: localStorage.employeeName,
        recordUserId: localStorage.CurrentUserId
      }
      if(this.addData.img.value) {
        pagram.url = this.addData.img.value
      }
      this.$http.post('/work/addCostDetail',JSON.stringify(pagram)).then(
        res => {
          this.addModal = false
          this.clearSearch()
          this.getCostList()
          this.$message.success('操作成功！')
        },
        err => {
          this.$message.error(err.data);
        }
      );
    },
    clearModalData () {
      let time =new Date()
      this.addData.time = time.getFullYear() + '/' + (time.getMonth() + 1) + '/' + time.getDate()
      this.addData.hospital = ''
      this.addData.costType = ''
      this.addData.applyUser = ''
      this.addData.money = ''
      this.addData.remark = ''
      this.addData.img = {}
    },
    //清空筛选条件
    clearSearch () {
      this.search.applyUserId = ''
      this.search.hospitalId = ''
      this.search.time = ''
      this.search.areaChecked = []
    },

    //获取地区列表数据
    getAreaList () {
      this.$http.get('/hospital/queryArea').then(
        res => {
          this.search.areaList = res.data.provinces;
        },
        err => {
          this.$message.error(err.data);
        }
      );
    },
    //获取用户列表数据
    getUserList () {
      this.$http.post('/user/list', {pageSize:999}).then(
        res => {
          this.search.userList = res.data.list;
        },
        err => {
          this.$message.error(err.data);
        }
      );
    },
    //获取体检中心列表数据
    getHospitalList () {
      let pagram = {
        orgType: 1,
      }
      if(this.search.areaChecked.length>0) {
        pagram.provinceId = this.search.areaChecked[0]
        if (this.search.areaChecked.length>1) {
          pagram.cityId = this.search.areaChecked[1]
          if (this.search.areaChecked.length>2) {
            pagram.districtId = this.search.areaChecked[2]
          }
        }
      }
      this.$http.post('/hospital/queryOrg', JSON.stringify(pagram),).then(
        res => {
          this.search.hospitalList = res.data;
        },
        err => {
          this.$message.error(err.data);
        }
      );
    },
    //获取费用类型列表数据
    getCostTypeList () {
      this.$http.post('/work/listCostType').then(
        res => {
          this.addData.costTypeList = res.data
        },
        err => {
          this.$message.error(err.data);
        }
      );
    },
    //获取消费列表数据
    getCostList () {
      
      let pagram = {
        page: {
          currentPage: this.page.current,
          pageSize: this.page.size
        }
      }
      if (this.search.hospitalId!='') {
        let a = []
        a.push(this.search.hospitalId/1)
        pagram.hospitalIds = a
      }
      if (this.search.areaChecked.length>0) {
        pagram.addressId = this.search.areaChecked[this.search.areaChecked.length-1]/1
      }
      if (this.search.applyUserId!='') {
        pagram.applyUserId = this.search.applyUserId
      }
      if (this.search.orderByProduceTime) {
        pagram.orderByProduceTime = this.search.orderByProduceTime
      }
      if (this.search.orderByMoney) {
        pagram.orderByMoney = this.search.orderByMoney
      }
      if (this.search.orderByCreateTime) {
        pagram.orderByCreateTime = this.search.orderByCreateTime
      }

      if (this.search.time.length>0) {
        pagram.timeStart = MyUtil.getBeginningOfDate(this.search.time[0])
        pagram.timeEnd = MyUtil.getEnddingOfDate(this.search.time[1])
      }
      this.$http.post('/work/listCostDetail', JSON.stringify(pagram)).then(
        res => {
          this.list.data = res.data.jointCostDetailDTO.records;
          this.cost.list = res.data.jointCostSumDTO;
          this.page.total = res.data.jointCostDetailDTO.page.rowCount
        },
        err => {
          this.$Message.error(err.text);
        }
      );
    }
  },
  created() {
    let time = new Date()
    this.addData.time = time.getFullYear() + '/' + (time.getMonth() + 1) + '/' + time.getDate()
    this.getAreaList()
    this.getUserList()
    this.getHospitalList()
    this.getCostList()
    this.getCostTypeList()
  },
  mounted() {
    this.url = location.href.split('#')[0] + '#/preview';
    this.imageRemoteSite = MyUtil.imageRemoteSite();
  }
};
</script>