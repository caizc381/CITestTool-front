const RecordList={
   name:'recordList',
   data(){
    return{
      queryList:{
        organizationId: '',
        startTime: undefined,
        endTime: undefined,
        provinceId: '',
        cityId: '',
        districtId: ''
      },
      hosList: [],
      areaList: [],
      area: [],
      paymentTime: '',
      recordList: [],
      rowCount: 0,
      page:{
        currentPage: 1,
        pageSize: 10
      },
      dialogCertificate: false,
      certificate: '',
      recordLoading: false,
    }
   },

   watch: {
        queryList: {
            handler: function() {
              this.getRecordList();
            },
            deep: true
        }
    },

   mounted(){
     this.getRecordList();
     this.getHosList();
     this.getAreaList();
   },

   methods:{
     //获取账单记录列表
     getRecordList(){
       this.recordLoading = true;
       this.queryList.page = this.page;
       this.$http.post('/settlement/getSettlementPayRecordList',JSON.stringify(this.queryList)).then((response) => {
            this.recordList = response.body.records;
            this.page={
              currentPage:response.body.page.currentPage,
              pageSize:response.body.page.pageSize
            }
            this.rowCount = response.body.page.rowCount;
            this.recordLoading = false;
        }, (res) => {
            this.$Message.error(res.text);
            this.recordLoading = false;
        })
     },

     //获取医院列表
     getHosList(){
      var qureyValue={
        provinceId:this.queryList.provinceId,
        cityId:this.queryList.cityId,
        districtId:this.queryList.districtId,
        orgType:1
      }
       this.$http.post('/hospital/queryOrg',JSON.stringify(qureyValue)).then((response) => {
            this.hosList = response.body;
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

     getdaterange(val){
        this.paymentTime = val
        this.queryList.startTime = MyUtil.filterBeginningOfDate(this.paymentTime[0]);
        this.queryList.endTime = MyUtil.filterEnddingOfDate(this.paymentTime[1]);
      },

      handleCurrentChange(val) {
        this.page.currentPage = val;
        this.getRecordList();
      },

      //下载详单
      download(sn){
        this.$http.get('/settlement/downloadSettlementBill?hospitalPlatformBillSns='+[sn]).then((response) => {
          this.$Message.success('正在下载中....');
          window.location.href = response.url;
        }, (res) => {
            this.$Message.error(res.text);
        })
      },

   },
}

export default RecordList
