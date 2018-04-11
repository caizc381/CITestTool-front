
const Agent = {
   name:'agent',
   data(){
    return{
      agentList:[],
      hospitalList:[],
      orderList:[],
      mealItems:[],
      delItems:[],
      addItems:[],
      page:{
        rowCount:0,
        currentPage:1,
        pageSize:40
      },
      showDetail:false,
      modalDetail:false
    }
   },

   mounted(){
     this.getHospitalList();

     this.updateTiming = setInterval(() => {
       this.updateStatus();
     }, 5*60*1000);

   },

   filters:{
    orderStatus(value){
      if(value == 0) {
        return '未支付'
      }else if(value == 1){
        return '已支付';
      }else if(value == 2){
        return '已预约';
      }else if(value == 3){
        return '体检完成';
      }else if(value == 4){
        return '未到检';
      }else if(value == 5){
        return '已撤销';
      }else if(value == 6){
        return '已删除';
      }else if(value == 7){
        return '支付中';
      }else if(value == 8){
        return '已关闭';
      }else if(value == 9){
        return '部分退款';
      }else if(value == 10){
        return '导出错误';
      }else if(value == 11){
        return '现场支付';
      }
    }
   },

   beforeDestroy: function() {
     clearInterval(this.updateTiming);
   },

   methods:{
    getHospitalList(){
      this.$http.get('/hospital/listHospital').then((response) => {
          this.hospitalList = response.body;
      }, (res) => {
          this.$Message.error(res.text);
      }).then(()=>{
         this.getAgentList();
      });
    },

    getAgentList(){
      this.$http.get('/manage/agentInfo?rowCount=' +this.page.rowCount + '&currentPage=' + this.page.currentPage +'&pageSize=' + this.page.pageSize).then((response) => {
          this.agentList = this.addHospitalInfo(response.body.records);
          this.page = response.body.page;
          this.updateStatus();
      }, (res) => {
          this.$Message.error(res.text);
      });
    },

    updateStatus(page){
      let url='/manage/updateAgentStatus?rowCount=' +
  				this.page.rowCount + '&currentPage=' + this.page.currentPage +
  				'&pageSize=' + this.page.pageSize;
      this.$http.get(url).then((res) => {
        this.agentList = res.data.records;
        this.setHospital(this.agentList);
      });
    },

    //设置体检中心
    setHospital(agentInfo){
      for(var index in agentInfo) {
        let hospitalId = agentInfo[index].hospitalId;
        for (var i=0; i<this.hospitalList.length; i++) {
          if (hospitalId == this.hospitalList[i].id) {
            agentInfo[index].hospital = this.hospitalList[i];
            agentInfo[index].hospitalName = this.hospitalList[i].name;
            break;
          }
        }
      }
    },

    //添加医院信息
    addHospitalInfo(agentList){
      for(let i=0;i<agentList.length;i++){
        for(let j=0;j<this.hospitalList.length;j++){
          if(agentList[i].hospitalId == this.hospitalList[j].id){
             agentList[i].hospitalName = this.hospitalList[j].name;
          }
        }
      }
      return agentList;
    },

    getDetail(id){
      this.showDetail = true;
      this.$http.get('/manage/abnormalOrders?hospitalId=' + id).then((response)=>{
        this.orderList = response.body;
      },(res)=>{
        this.$Message.error(res.text);
      })
    },

    getOrderDetail(id){
      this.modalDetail = true;
      this.$http.get('/manage/orderDetail?orderId=' + id).then((response)=>{
        var itemList = response.body.itemSnap;
        for (var i in itemList){
          if (itemList[i].typeToMeal == 1) {
            this.mealItems.push(itemList[i]);
          } else if (itemList[i].typeToMeal == 2) {
            this.delItems.push(itemList[i]);
          } else if (itemList[i].typeToMeal == 3) {
            this.addItems.push(itemList[i]);
          }
        }
      },(res)=>{
        this.$Message.error(res.text);
      })
    },

    handleCurrentChange(val) {
      this.page.currentPage = val;
      this.getAgentList();
    },

    handleSizeChange(val) {
      this.page.pageSize = val;
      this.getAgentList();
    },
  },
}

export default Agent
