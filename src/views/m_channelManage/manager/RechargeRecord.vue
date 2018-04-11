<template>
 <div>
   <Row>
      <Col :span="24" class="header-search">
        <div>
		      <Breadcrumb>
		         <BreadcrumbItem href="/channelManage/managermanagement">客户经理列表</BreadcrumbItem>
		         <BreadcrumbItem>充值记录</BreadcrumbItem>
		      </Breadcrumb>
		    </div>
      </Col>
    </Row>

    <Row class="body-content">
  	  <div class="mb15">
      	<div class="dlb mr15">客户经理：<span>{{managerName}}</span></div>
      	<div class="dlb mr15">账户余额：<span class="orange b">{{balance | money('￥')}}</span></div>
      	<div class="dlb">
      		<Button type="primary" @click="rechargeModal = true">充值</Button>
        </div>
      </div>

      <table class="table">
       <colgroup span="5"></colgroup>
       <thead>
         <tr>
            <th>时间</th>
            <th>类型</th>
            <th>操作人</th>
            <th>金额(￥)</th>
            <th>备注</th>
         </tr>
       </thead>
       <tbody>
         <tr v-for = "record in rechargeRecord">
            <td>{{record.payTime | date('yyyy-MM-dd hh:mm:ss')}}</td>
            <td>充值</td>
            <td>{{record.expenseAccount}}</td>
            <td>{{record.amount | money('￥')}}</td>
            <td>{{record.remark}}</td>
          </tr>
       </tbody>
     </table>

     <mt-none style="padding: 20px;" :show="rechargeRecord.length == 0" size="large" />

     <div class="page-wrap" style="height:200px;">
        <Page
        :total="pagination.rowCount"
        :current="pagination.currentPage"
        :page-size="pagination.pageSize"
        :page-size-opts="[10,20,50]"
        show-sizer
        show-total
        @on-change="handlePageChange"
        @on-page-size-change="handlePageSizeChange"></Page>
      </div>

    </Row>

    <Modal
     v-model="rechargeModal"
     title="充值"
     :mask-closable="false">
      <div>
        <Form :model="rechargeObiect" ref="newModal" :label-width="80">
          <FormItem label="金额" class="ivu-form-item-required">
            <Input v-model.number="rechargeObiect.money" @on-blur="verifyLenDecimal('money')"></Input>
          </FormItem>
          <FormItem label="备注">
            <Input v-model="rechargeObiect.remark"></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="text" @click="rechargeModal = false">取消</Button>
        <Button type="primary" @click="recharge()">确认</Button>
      </div>
    </Modal>

</div>
</template>

<script>
 export default {
  name: 'basicInfo',
  data() {
    return {
      managerName: '',
    	balance: 42233,
    	rechargeRecord: [],
    	pagination:{
  			rowCount: 0,
  			currentPage: 1,
  			pageSize: 20,
  		},
  		page:{
  			rowCount: -1,
  			currentPage: 1,
  			pageSize: 20,
  		},
  		rechargeModal: false,
  		rechargeObiect: {
        money: 0,
        remark:'',
  		},
  		errorInfo: undefined
    }
  },

  mounted() {
    this.getAccountingRecord()
  },

  methods: {
    getAccountingRecord(managerId=this.$route.params.managerId){
      let url='/manager/accounting?managerId='+managerId+
      '&rowCount='+this.page.rowCount+'&pageSize='+this.page.pageSize+
      '&currentPage='+this.page.currentPage;

      this.$http.get(url).then((response) => {
           this.managerName = response.body.manager.account.name;
           this.balance = response.body.manager.balance;
           this.rechargeRecord = response.body.rechargeRecord.records;
           this.pagination =  response.body.rechargeRecord.page;
        }, (res) => {
            this.$Message.error(res.text);
      })

    },

  	handlePageChange(val){
      this.page.currentPage = val;
      this.getAccountingRecord();
  	},
  	
  	handlePageSizeChange(val){
      this.page.pageSize = val;
      this.getAccountingRecord();
  	},

  	//平台客户经理充值
    recharge(){
	    let url = '/manager/recharge?managerId='+this.$route.params.managerId+'&money='+parseInt(this.rechargeObiect.money * 100)+'&remark='+this.rechargeObiect.remark;

	    this.$http.post(url).then((response) => {
	         this.$Message.success('操作成功!');
           this.rechargeModal = false;
           this.getAccountingRecord();
	      }, (res) => {
	          this.$Message.error(res.text);
	    })
	  },

    //只能输入两位小数
    verifyLenDecimal(number){
     var value = this.rechargeObiect[number].toString();
     if(value.indexOf('.') > -1){
       this.rechargeObiect[number] = parseFloat(value.substring(0,value.indexOf('.')+3));
     }
    },

  },
} 
</script>

<style scoped lang="less">

</style>
