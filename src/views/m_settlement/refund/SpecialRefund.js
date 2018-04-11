const SpecialRefund={
   name: 'SpecialRefund',
   data(){
     return{
       queryList:{
         organizationId: '',
         companyId: '',
         startTime: undefined,
         endTime: undefined,
         type: '-1',
         settlementStatus: '-1'
       },
       page:{
          currentPage: 1,
          pageSize: 10
       },
       rowCount: 0,
       time: [],
       hosList: [],
       companyList: [],
       billList: [],
       billModal:{
         organizationId: undefined,
         companyId: undefined,
         paymentTime: undefined,
         type: undefined,
         amount: undefined,
         certificate: undefined,
         remark: undefined
       },
       editModal:{
         organizationId: undefined,
         companyId: undefined,
         paymentTime: undefined,
         type: undefined,
         amount: undefined,
         certificate: undefined,
         remark: undefined
       },
       rules:{
         organizationId: [
            { required: true, message: '请选择机构', trigger: 'change' }
          ],
          companyId: [
            { required: true, message: '请选择单位', trigger: 'change' }
          ],
          paymentTime: [
            { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
          ],
          type: [
            { required: true, message: '请选择退款类型', trigger: 'change' }
          ],
          amount: [
             { required: true, message: '金额不能为空'},
             { type: 'number', message: '金额必须为数字值'}
          ]
       },
      dialogNew: false,
      dialogEdit: false,
      dialogCertificate: false,
      certificate: '',
      qureyValue: {},
      loadingCompany: false,
      openPicker: false,
      settleLoading: false,
     }
   },

   watch: {
      queryList: {
          handler: function() {
            this.getBillList();
          },
          deep: true
      }
    },

   mounted(){
    this.getBillList();
    this.getHosList();
   },

   filters:{
     payType:function(value){
       if (value == 0) return "个人开票";
       else if (value == 1) return "单位开票";
       else if (value == 2) return "特殊退款";
       else if (value == 3) return "结余";
     },

     status:function(value){
       if (value == 0) return "未结算";
       else if (value == 1) return "已结算";
       else if (value == 2) return "已删除";
     },

     img:function(value){
        if(value){
          var arr = value.split('/');
          return arr[arr.length-1];
        }else{
          return '';
        }
     }
   },

   methods:{
     //获取账单列表
     getBillList(){
       this.settleLoading = true;
       this.queryList.page = this.page;
       this.$http.post('/settlement/getPrepaymentRecordList',JSON.stringify(this.queryList)).then((response) => {
            this.billList = response.body.records;
            this.page={
              currentPage:response.body.page.currentPage,
              pageSize:response.body.page.pageSize
            }
            this.rowCount = response.body.page.rowCount;
            this.settleLoading = false;
        }, (res) => {
            this.$Message.error(res.text);
            this.settleLoading = false;
        })
     },

     //获取医院列表
     getHosList(){
       this.qureyValue.orgType = 1;
       this.$http.post('/hospital/queryOrg',JSON.stringify(this.qureyValue)).then((response) => {
            this.hosList = response.body;
        }, (res) => {
            this.$Message.error(res.text);
        })
     },

     //获取单位
     getCompanyList(id){
       this.loadingCompany = true;
       this.$http.get('/hospital/listCompany?hospitalId='+id).then((response) => {

         if (response.body.length > 1500) {
           setTimeout(() => {this.loadingCompany = false}, 1000);
         } else {
           this.loadingCompany = false;
         }
         this.companyList = response.body;
         this.queryList.companyId = undefined;
       }, (res) => {
         this.$Message.error(res.text);
       })
     },

     //选择机构更新单位
      changeHospital(id)
      {
         if(!id){
           this.queryList.companyId = '';
         }else{
          this.getCompanyList(id);
         }
      },

      getdaterange(val){
        this.time = val;
        this.openPicker = false;
        this.queryList.startTime = MyUtil.filterBeginningOfDate(this.time[0]);
        this.queryList.endTime = MyUtil.filterEnddingOfDate(this.time[1]);
      },

      newForm(){
        this.$refs['newForm'].resetFields();
        this.billModal = {
         organizationId: '',
         companyId: '',
         paymentTime: '',
         type: '',
         amount: '',
         certificate: '',
         remark: ''
       };
       this.dialogNew = true;
      },

     //新增特殊退款
     newBill(form){
      this.$refs[form].validate((valid) => {
        if (valid) {
           //防止精度丢失
          this.billModal.amount = (this.billModal.amount*100).toFixed();

          this.$http.post('/settlement/addPrepaymentRecord', JSON.stringify(this.billModal)).then((response) => {
            this.$Message.success('操作成功!');
            this.dialogNew = false;
            this.getBillList();
            this.$refs[form].resetFields();
          }, (res) => {
            this.$Message.error(res.text);
          });
        } else {
          this.$Message.error('表单验证失败!');
        }
      });

     },

     //编辑特殊退款
     editBill(id){
      this.item = this.getBillModel(id);
      this.editModal = this.item;
      this.editModal.amount = parseFloat((this.item.amount/100).toFixed(2));
      this.editModal.type = this.item.type+'';
      this.editModal.organizationId = this.item.organizationId+'';
      this.editModal.companyId = this.item.companyId+'';
      this.editModal.paymentTime = new Date(this.item.paymentTime);

      this.dialogEdit = true;
      this.getCompanyList(this.item.organizationId);
    },

     //获取单个特殊退款信息
     getBillModel(id)
     {
       for(let i=0;i<this.billList.length;i++){
         if(this.billList[i].id == id)
         {
           return JSON.parse(JSON.stringify(this.billList[i]));
         }
       }
     },

     confirmEditBill(form){
      this.$refs[form].validate((valid) => {
        if (valid) {
          //防止精度丢失
          this.editModal.amount = (this.editModal.amount*100).toFixed();

          this.$http.post('/settlement/updatePrepaymentRecord', JSON.stringify(this.editModal)).then((response) => {
            this.$Message.success('操作成功!');
            this.dialogEdit = false;
            this.getBillList();
          }, (res) => {
            this.$Message.error('表单验证失败!');
          });
        } else {
          return false;
        }
      });
     },

     //删除特殊退款账单
     deleteBill(id){
      this.$Modal.confirm({
        title:'提示',
        content:'是否删除当前选中特殊退款?',
        onOk:()=>{
          this.$http.get('/settlement/deletePrepaymentRecord?prepaymentRecordId='+id).then((response) => {
            this.$Message.success('操作成功!');
            this.getBillList();
          }, (res) => {
            this.$Message.error(res.text);
          })
        }
      });
     },

     handlerClick(){
      this.openPicker = !this.openPicker
     },

     clearDateRange(){
       this.time = [];
       this.queryList.startTime = undefined;
       this.queryList.endTime = undefined;
     },

     clearStatus(filed){
      this.queryList[filed]='-1';
     },

     action(flag){
       var files='';
       if(flag == 'new'){
         files = document.getElementById('fileNew').files[0];
       }else if( flag == 'update'){
         files = document.getElementById('fileUpdate').files[0];
       }
       var formData = new FormData();
       formData.append('file',files);
       this.$http.post('/settlement/uploadImage',formData).then((response) => {
            if(flag == 'new'){
              this.billModal.certificate = response.bodyText;
            }else if(flag == 'update'){
              this.editModal.certificate = response.bodyText;
            }
          }, (res) => {
           this.$Message.error(res.text);
       })
     },
     handleCurrentChange(val) {
        this.page.currentPage = val;
        this.getBillList();
      },
     handleReset (name) {
        this.dialogNew = false;
        this.dialogEdit = false;
     },
     verifyLenAmount(number){
       var value = this[number].amount.toString();
       if(value.indexOf('.') > -1){
        this[number].amount = parseFloat(value.substring(0,value.indexOf('.')+3));
       }
     },

  }
}

export default SpecialRefund
