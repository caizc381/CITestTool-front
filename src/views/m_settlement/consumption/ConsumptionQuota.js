import _ from 'lodash'

const ConsumptionQuota={
   name:'ConsumptionQuota',
   data(){
     return{
      queryList: {
        organizationId: undefined,
        provinceId: undefined,
        cityId: undefined,
        districtId: undefined,
      },
      privateQuery:{
        startTime: undefined,
        endTime: undefined,
        statusQuery: -1,
        sceneQuery: undefined,
      },
      hosList: [],
      hospitalDate: [],
      hospitalPage: {
        currentPage: 1,
        pageSize: 20,
        rowCount: 0,
      },
      changeHosPage: {
        currentPage: 1,
        pageSize: 20,
      },
      areaList: [],
      area: [],
      consumptionList: [],
      consumptionPage: {
        currentPage: 1,
        pageSize: 20,
        rowCount: 0,
      },
      totalConsumpetionList: {},
      changeConPage: {
        currentPage: 1,
        pageSize: 20,
      },
      openPicker: false,
      dialogNew: false,
      dialogRevoke: false,
      newObject:{
         organizationId: undefined,
         companyId: undefined,
         payTime: undefined,
         scene: undefined,
         amount: undefined,
         certificate: undefined,
         remark: undefined
       },
       rules: {
        organizationId: [
            { required: true, message: '请选择机构', trigger: 'change' }
          ],
          payTime: [
            { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
          ],
          scene: [
            { required: true, message: '请选择付款类型', trigger: 'change' }
          ],
          amount: [
             { required: true, message: '金额不能为空'},
             { type: 'number', message: '金额必须为数字值'}
          ]
       },
       companyList: [],
       activeTab:'hosital',
       currentDetail: {},
       hosLoading: false,
       consumLoading: false,
       errorInfo: undefined,
     }
   },

   watch: {
      queryList: {
        handler: function() {
          this.activeTab == 'hosital' && this.getHospitalData();
          this.activeTab == 'consumpe' && this.getConsumptionList();
          this.getTotalConsumpetionList();
        },
        deep: true
      },
      privateQuery: {
        handler: function() {
           this.getConsumptionList();
        },
        deep: true
     }
   },

   mounted(){
    this.getHosList();
    this.getAreaList();
    this.getHospitalData();
    this.getTotalConsumpetionList();
   },

   filters:{
     scene:function(value){
       if (value == 1) return "医院开票";
       else if (value == 2) return "账务调整";
       else if (value == 3) return "结算盈余";
       else if (value == 4) return "结算支付";
       else if (value == 5) return "平台服务费";
     },

     status:function(value){
       if (value == 1) return "医院审核中";
       else if (value == 2) return "冻结中";
       else if (value == 3) return "医院已确认";
       else if (value == 4) return "平台已撤销";
     },

     img:function(value){
        if(value){
          return value.substring(value.indexOf('certificate')+12);
        }else{
          return '';
        }
     }
   },

   methods:{

     //医院消费额度总计
     getTotalConsumpetionList(){
       this.$http.post('/settlement/getPlatformConsumeQuotaStatistics',JSON.stringify(this.queryList)).then((response) => {
            this.totalConsumpetionList = response.body;
        }, (res) => {
            this.$Message.error(res.text);
        })
     },

     //医院统计数据
     getHospitalData(){
       this.hosLoading = true;
       var query = JSON.parse(JSON.stringify(this.queryList));
       query.page = this.changeHosPage;
       this.$http.post('/settlement/consumeQuotaManage',JSON.stringify(query)).then((response) => {
            this.hospitalDate = response.body.records;
            this.hospitalPage = response.body.page;
            this.hosLoading = false;
        }, (res) => {
            this.$Message.error(res.text);
            this.hosLoading = false;
        })
     },

     //获取消费额度列表
     getConsumptionList(){
       this.consumLoading = true;

       //处理status&scene
        this.privateQuery.status = [];
        this.privateQuery.status.push(parseInt(this.privateQuery.statusQuery));

       if(this.privateQuery.sceneQuery){
         this.privateQuery.scene = [];
         this.privateQuery.scene.push(parseInt(this.privateQuery.sceneQuery));
       }

       var query= _.assign(JSON.parse(JSON.stringify(this.queryList)), this.privateQuery);

       query.page = this.changeConPage;
       this.$http.post('/settlement/listConsumeQuotaDetail',JSON.stringify(query)).then((response) => {
            this.consumptionList = response.body.records;
            this.consumptionPage = response.body.page;
            //处理remark
            for(let i=0; i<this.consumptionList.length; i++){
              if(this.consumptionList[i].remark){
                this.consumptionList[i].remark = this.consumptionList[i].remark.split('/n');
              }
            }
            this.consumLoading = false;
        }, (res) => {
            this.$Message.error(res.text);
            this.consumLoading = false;
        })
     },

     getdaterange(val){
       this.privateQuery.startTime = MyUtil.filterBeginningOfDate(val[0]);
       this.privateQuery.endTime = MyUtil.filterEnddingOfDate(val[1]);
       this.openPicker = false
     },

     handlerClick(){
      this.openPicker = !this.openPicker
     },

    //获取医院列表
     getHosList(){
      var qureyValue={
        provinceId:this.queryList.provinceId,
        cityId:this.queryList.cityId,
        districtId:this.queryList.districtId,
        orgType:1
       };
       this.$http.post('/hospital/queryOrg',JSON.stringify(qureyValue)).then((response) => {
            this.hosList = response.body;
        }, (res) => {
            this.$Message.error(res.text);
        })
     },

      //获取单位
     getCompanyList(id){
       this.$http.get('/hospital/listCompany?hospitalId='+id).then((response) => {
         this.companyList = response.body;
       }, (res) => {
         this.$Message.error(res.text);
       })
     },

     //获取地址列表
     getAreaList(){
       this.$http.get('/hospital/queryArea').then((response) => {
            this.areaList = response.body.provinces;
        }, (res) => {
            this.$Message.error(res.text);
        })
     },

      //获取省市区id
      getDetailId(val) {
          this.queryList.provinceId = val[0];
          this.queryList.cityId = val[1];
          this.queryList.districtId = val[2];
          this.getHosList();
      },

      //选择机构更新单位
      changeHospital(id){
         if(!id){
           this.queryList.companyId = '';
         }else{
          this.getCompanyList(id);
         }
      },

      clearQuery(){
        this.privateQuery.sceneQuery= undefined;
        this.privateQuery.scene= undefined;
        this.privateQuery.startTime = undefined;
        this.privateQuery.endTime = undefined;
      },

      openNewForm(){
        this.dialogNew = true;
        this.$refs['newForm'].resetFields();
        this.newObject = {
         organizationId: undefined,
         companyId: undefined,
         payTime: undefined,
         scene: undefined,
         amount: undefined,
         certificate: undefined,
         remark: undefined
       }
      },

      newConsumption(form){
        //当类型为医院开票是金额不能为负数
        if(this.newObject.scene == 1 && this.newObject.amount < 0){
           this.errorInfo = '金额不能为负数';
           return ;
        }
        this.errorInfo = undefined;

        this.$refs[form].validate((valid) => {
         if (valid) {

            //防止精度丢失
            this.newObject.amount = (this.newObject.amount * 100).toFixed();

            this.$http.post('/settlement/addConsumeQuotaDetail', JSON.stringify(this.newObject)).then((response) => {
              this.$Message.success('操作成功!');
              this.dialogNew = false;
              this.getHospitalData();
              this.$refs[form].resetFields();
              this.getConsumptionList()
            }, (res) => {
              this.$Message.error(res.text);
            });
          } else {
            this.$Message.error('表单验证失败!');
          }
        });
      },

      action(flag){
         var  files = document.getElementById('fileNew').files[0];
         var formData = new FormData();
         formData.append('file',files);
         this.$http.post('/settlement/uploadImage',formData).then((response) => {
              this.newObject.certificate = response.bodyText;
            }, (res) => {
             this.$Message.error(res.text);
         })
       },

      currentPageInfo(val){
        if(this.activeTab == 'hosital'){
          this.changeConPage.currentPage = val;
          this.getHospitalData();
        }else{
          this.changeConPage.currentPage = val;
          this.getConsumptionList();
        }
      },

      pageSizeInfo(val){
        if(this.activeTab == 'hosital'){
          this.changeConPage.pageSize = val;
          this.getHospitalData();
        }else{
          this.changeConPage.pageSize = val;
          this.getConsumptionList();
        }
      },

      // 当前点击tab
      clickCurrentTab(){
        this.activeTab == 'hosital' && this.getHospitalData();
        this.activeTab == 'consumpe' && this.getConsumptionList();
        this.getTotalConsumpetionList();
      },

      openRevoke(obj){
        this.dialogRevoke = true;
        this.currentDetail = obj;
      },

      //撤销
      revoke(){
        this.$http.get('/settlement/revokeConsumeQuotaDetail?sn='+this.currentDetail.sn).then((response) => {
              this.dialogRevoke = false;
              this.$Message.success('操作成功!');
              this.getConsumptionList();
            }, (res) => {
             this.$Message.error(res.text);
         })
      },

      jumpToDetail(hos, statusQuery){
        this.activeTab = 'consumpe';
        this.queryList.organizationId = hos.organizationId;
        this.privateQuery.statusQuery = statusQuery;
        this.consumptionList = this.consumptionList.filter(item =>{
          return item.organizationId == hos.organizationId;
        })
        this.consumptionPage.rowCount = this.consumptionList.length;
      },

      //金额只能输入两位小数
      verifyLen(flag){
        var value = this.newObject[flag].toString();
        if(value.indexOf('.') > -1){
          this.newObject[flag] = parseFloat(value.substring(0,value.indexOf('.')+3));
        }
     },
  }
}

export default ConsumptionQuota
