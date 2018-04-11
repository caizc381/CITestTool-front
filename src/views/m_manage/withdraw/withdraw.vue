<template>
  <div>
    <Row>
        <Col span="24" class="header-search">
          <Input v-model="keyWord"
            class="l w320"
            placeholder="请输入关键词" 
            icon="search"
            @on-click="search">
            <Select v-model="userName" slot="prepend" class="w120 tl" placeholder="用户名">
                <Option v-for="item in userNameArr" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </Input>
          <!-- <Button type="text" @click="clear" class="ml10 mt5">清空</Button> -->
        </Col>
        <Col span="24" class="body-content button-group">
          <ButtonGroup>
              <Button :type="status===1?'primary':'ghost'" @click="changeStatus(1)">未审核</Button>
              <Button :type="status===2?'primary':'ghost'" @click="changeStatus(2)">财务审核</Button>
              <Button :type="status===3?'primary':'ghost'" @click="changeStatus(3)">已完成</Button>
              <Button :type="status===4?'primary':'ghost'" @click="changeStatus(4)">已拒绝</Button>
          </ButtonGroup>
        </Col>
    </Row>
    <Row class="body-content">
      <Col span="24">
        <table class="table">
            <thead>
               <tr>
                 <th>编号</th>
                 <th>申请人</th>
                 <th>联系方式</th>
                 <th>提现信息</th>
                 <th>账户余额</th>
                 <th>提现金额</th>
                 <th>申请时间</th>
                 <th>状态</th>
                 <th>操作</th>
               </tr>
            </thead>

            <tbody>
              <template v-for="(user,index) in dataList">
                <tr>
                  <td><span>{{user.id}}</span></td>
                  <td><span>{{user.account.name}}</span></td>
                  <td><span>{{user.account.mobile}}</span></td>
                  <td>
                    <span>
                      <span><span>提现方式：</span>

                            {{["","支付宝","银行转账","原路退回"][user.withdrawType]}}
                          </span>
                          <span v-if="user.withdrawType==2">
                            <br><span>开户银行：</span>{{user.channelName}}
                          </span>
                      <br>
                    帐 号：{{user.receivable}}<br>
                    姓 名：{{user.realName}}</span>
                  </td>
                  <td><span>￥{{user.balance|money}}</span></td>
                  <td><span>￥{{user.amount*100|money}}</span></td>
                  <td><span>{{user.createDate | date('yyyy-MM-dd hh:mm:ss')}}</span></td>
                  <td>
                    <span class="c-or" v-if="user.state===1">客服通过</span>
                    <span class="c-rd" v-else-if="user.state===0">未处理</span>
                    <span class="c-gr" v-else-if="user.state===3">财务通过</span>
                    <span class="c-gr" v-else-if="user.state===4">财务拒绝</span>
                    <span v-else>客服拒绝</span>
                  </td>
                  <td>
                    <a @click="getDetail(user.accountId)" class="infofont">查看记录</a>
                    <span v-if="ableExamine && user.state!=1 && user.state!=2">
                      <a v-if="(ableExamine&&user.state==0) || (ableExamine&&user.state==1)" @click="passRequst(user)" class="infofont ml10">通过</a>
                      <a v-if="(ableExamines&&user.state==0) || (ableExamines&&user.state==1)" @click="refuseModel(user)" class="infofont ml10">拒绝</a>
                    </span>
                    <span v-if="ableExamine1 && user.state!=3 && user.state!=4">
                      <a v-if="(ableExamine1&&user.state==0) || (ableExamine1&&user.state==1)" @click="passRequstFinance(user)" class="infofont ml10">通过</a>
                      <a v-if="(ableExamines1&&user.state==0) || (ableExamines1&&user.state==1)" @click="refuseModel(user)" class="infofont ml10">拒绝</a>
                    </span>
                    
                  </td>
                </tr>

                <tr v-if="status===4 || user.state==4 || user.state==2" :key="index">
                  <td colspan="9">
                    <span>拒绝理由:{{user.remark}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                    <span>操作员:{{user.operator}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                    <span>操作时间: {{user.updateDate | date('yyyy-MM-dd hh:mm:ss')}}</span>
                  </td>                  
                </tr>

              </template>
              
            </tbody>
          </table>
      </Col>
      <Col span="24"  class="page-wrap" v-if="pageTotal>0">
        <Page 
          :total="pageTotal"
          :current="currentPage"
          :page-size="pageSize"
          @on-change="changePage" 
          @on-page-size-change="changeSize" 
          show-total
          show-sizer></Page>
      </Col>
      <Col span="24"  class="page-wrap tc" v-else>
        <span>当前列表数据为空</span>
      </Col>
    </Row>

    <!--弹出层-->
    <Modal
        v-model="model"
        title="用户信息"
        width="700px">
      <Form :model="userInfo" :label-width="120" inline>
        <FormItem label="用户名：">
          <span class="dib w200">{{userInfo.account.name}}</span>
        </FormItem>
        <FormItem label="身份证号：">
          <span class="dib w200">{{userInfo.account.idCard}}</span>
        </FormItem>
        <FormItem label="手机号码：">
          <span class="dib w200">{{userInfo.account.mobile}}</span>
        </FormItem>
        <FormItem label="账户余额：">
          <span class="dib w200">{{userInfo.accounting.balance | money | moneyY}}</span>
        </FormItem>
      </Form>
      <div>
        <div class="f14 lh20 b">近期现金支付信息</div>
        <span class="dvd-x bg-gray mt15 mb10"></span>
        <div style="max-height:300px;overflowY:auto;">
          <p class="mt10 mr10 ml10 lh15" v-for="(orderdetail,indexs) in userInfo.list" :key="indexs">
            <span class="mr10">{{orderdetail.date | date('yyyy-MM-dd hh:mm:ss')}}</span>

            <span @click="selectOrderId=orderdetail.orderId">订单
                <span style="background: #900;" v-if="selectOrderId==orderdetail.orderId">
                    &nbsp;
                </span>
                    {{orderdetail.orderId}}
            </span>

            <span v-if="orderdetail.tradeType==1" class="mr10" style="color:#060;">
                支付
            </span>

            <span v-if="orderdetail.tradeType==2 || orderdetail.tradeType==3" class="mr10" style="color:#900;">
                退款
            </span>

            <span class="mr10">{{orderdetail.payType}} {{orderdetail.payedMoney}} </span>
            <span class="mr10">￥{{orderdetail.useBlance|money}} </span><br>
            <span v-if="orderdetail.wxbill" v-for="(bill,index) in orderdetail.wxbill"  :key="index"
                  style="padding-left: 10px;">
                --&gt; 微信单号{{bill.wxOrderId}}
                <span style="color:#000;">{{initBankNames[bill.bank]}}</span>
                <span v-if="bill.tradeState=='SUCCESS'" style="color:#060;">已支付</span>
                <span v-if="bill.tradeState=='REFUND'" style="color:#900;">已退款</span>
                  {{bill.currency}}
                <span v-if="bill.tradeState=='SUCCESS'" style="color:#060;">{{bill.amount}}</span>
                <span v-if="bill.tradeState=='REFUND'" style="color:#900;">{{bill.refundAmount}}</span>
            </span>
          </p>
        </div>
        
      </div>
      <div>
        <div class="f14 lh20 b mt20">提现记录</div>
        <span class="dvd-x bg-gray mt15 mb10"></span>
        <div style="max-height:150px;overflowY:auto;">
          <p class="mt10 mr10 ml10 lh15" v-for="(item,index) in userInfo.withdrawList" :key="index">
            <span>{{item.createDate|date('yyyy-MM-dd hh:mm:ss')}}</span>
            <span class="ml10">申请提现：￥{{item.amount*100|money}}</span>
            <span class="ml10">{{item.state | stateWithdraw}}</span>
            <span class="ml10">{{item.remark?'拒绝的理由：'+item.remark:''}}</span>
          </p>
        </div>
      </div>
      <div slot="footer">
            
        </div>
    </Modal>

    <Modal
        v-model="modal2"
        title="提示"
        @on-ok="refuseModelFuc">
        <Form  :label-width="120" >
          <FormItem label="拒绝理由：">
              <Input v-model="textarea" type="textarea"></Input>
          </FormItem>
        </Form>
    </Modal>
    <Modal
        v-model="modalCost"
        title="打款信息"
        @on-ok="passRequstFinanceFuc">
        <Form  :label-width="120" >
          <FormItem label="打款金额：">
              <Input v-model="money" disabled></Input>
          </FormItem>
          <FormItem label="流水号：">
              <Input v-model="serialNumber"></Input>
          </FormItem>
        </Form>
    </Modal>
  </div>
</template>
<script>
export default {
  data() {
    return {
      status: 0,
      userName: "",
      userNameArr: [
        {
          value: "用户名",
          label: "用户名"
        },
        {
          value: "身份证",
          label: "身份证"
        },
        {
          value: "手机号",
          label: "手机号"
        },
        {
          value: "支付宝账号",
          label: "支付宝账号"
        },
        {
          value: "银行卡号",
          label: "银行卡号"
        },
        {
          value: "流水号",
          label: "流水号"
        }
      ],
      keyWord: "",
      currentPage: 1,
      pageTotal: 0,
      pageSize: 10,
      dataList: [],
      model: false,
      selectOrderId: "",
      userInfo: {
        withdrawList: [
          {
            id: 4100421,
            realName: "测试习大大",
            amount: "0.01",
            channelName: "原路退回",
            accountId: 582969,
            state: 2,
            withdrawType: 3,
            createDate: 1504686750000,
            updateDate: 1505355199000,
            operator: "客服",
            remark: "测试",
            balance: 1,
            account: { name: "测试习大大", mobile: "", status: 0 }
          }
        ],
        accounting: { id: 578728, accountId: 582969, balance: 1 },
        list: [
          {
            date: 1504597384000,
            payType: "微信支付",
            useBlance: 1,
            status: 1,
            tradeNo: "4000932001201709050358593357",
            wxbill: [
              {
                tradeDate: 1504597394000,
                openid: "wx3e7cc53186ef0e44",
                mchid: "1246357601",
                submachId: "0",
                driverId: "",
                wxOrderId: "4000932001201709050358593357",
                mytijianOrderId: "170905034303298918824515277649",
                userIdentify: "obkv3spCGrxjQ0_4ArYLrzrTe7pM",
                tradeType: "JSAPI",
                tradeState: "SUCCESS",
                bank: "CFT",
                currency: "CNY",
                amount: "0.01",
                refundAmount: "0.00",
                refundType: "",
                refundState: "",
                goodsName: "体检预约-测试通用套餐",
                datapack: "20170905154258087083918",
                factorage: "0.00000",
                rate: "0.00%",
                createDate: 1504664967000
              }
            ],
            tradeType: 1,
            orderId: "20170905154258087083918"
          }
        ],
        account: {
          createTime: 1504597085000,
          updateTime: 1507705306000,
          id: 582969,
          name: "测试习大大",
          mobile: "",
          idCard: "130631197003149758",
          employeeId: "",
          status: 0,
          type: 2,
          idType: 1,
          system: 1
        }
      },

      modal2: false,
      textarea: '',
      dataCu: {},

      modalCost: false,
      costData: '',
      serialNumber: '',

      getType: false,//true为搜索条件查询
    };
  },
  filters: {
    stateWithdraw(x) {
      if (x == 0) {
        return "正在处理";
      } else if (x == 1) {
        return "等待提现";
      } else if (x == 2 || x == 4) {
        return "已拒绝";
      } else if (x == 3) {
        return "已经提现";
      }
    },
    moneyY(x) {
      return "￥" + x;
    },
  },
  computed: {
    initBankNames() {
      let bankNames = {};
      bankNames["ICBC_DEBIT"] = "工商银行(借记卡)";
      bankNames["ICBC_CREDIT"] = "工商银行(信用卡)";
      bankNames["ABC_DEBIT"] = "农业银行(借记卡)";
      bankNames["ABC_CREDIT"] = "农业银行(信用卡)";
      bankNames["PSBC_DEBIT"] = "邮政储蓄银行(借记卡)";
      bankNames["PSBC_CREDIT"] = "邮政储蓄银行(信用卡)";
      bankNames["CCB_DEBIT"] = "建设银行(借记卡)";
      bankNames["CCB_CREDIT"] = "建设银行(信用卡)";
      bankNames["CMB_DEBIT"] = "招商银行(借记卡)";
      bankNames["CMB_CREDIT"] = "招商银行(信用卡)";
      bankNames["BOC_DEBIT"] = "中国银行(借记卡)";
      bankNames["BOC_CREDIT"] = "中国银行(信用卡)";
      bankNames["COMM_DEBIT"] = "交通银行(借记卡)";
      bankNames["SPDB_DEBIT"] = "浦发银行(借记卡)";
      bankNames["SPDB_CREDIT"] = "浦发银行(信用卡)";
      bankNames["GDB_DEBIT"] = "广发银行(借记卡)";
      bankNames["GDB_CREDIT"] = "广发银行(信用卡)";
      bankNames["CMBC_DEBIT"] = "民生银行(借记卡)";
      bankNames["CMBC_CREDIT"] = "民生银行(信用卡)";
      bankNames["PAB_DEBIT"] = "平安银行(借记卡)";
      bankNames["PAB_CREDIT"] = "平安银行(信用卡)";
      bankNames["CEB_DEBIT"] = "光大银行(借记卡)";
      bankNames["CEB_CREDIT"] = "光大银行(信用卡)";
      bankNames["CIB_DEBIT"] = "兴业银行(借记卡)";
      bankNames["CIB_CREDIT"] = "兴业银行(信用卡)";
      bankNames["CITIC_DEBIT"] = "中信银行(借记卡)";
      bankNames["CITIC_CREDIT"] = "中信银行(信用卡)";
      bankNames["BOSH_DEBIT"] = "上海银行(借记卡)";
      bankNames["BOSH_CREDIT"] = "上海银行(信用卡)";
      bankNames["CRB_DEBIT"] = "华润银行(借记卡)";
      bankNames["HZB_DEBIT"] = "杭州银行(借记卡)";
      bankNames["HZB_CREDIT"] = "杭州银行(信用卡)";
      bankNames["BSB_DEBIT"] = "包商银行(借记卡)";
      bankNames["BSB_CREDIT"] = "包商银行(信用卡)";
      bankNames["CQB_DEBIT"] = "重庆银行(借记卡)";
      bankNames["SDEB_DEBIT"] = "顺德农商行(借记卡)";
      bankNames["SZRCB_DEBIT"] = "深圳农商银行(借记卡)";
      bankNames["HRBB_DEBIT"] = "哈尔滨银行(借记卡)";
      bankNames["BOCD_DEBIT"] = "成都银行(借记卡)";
      bankNames["GDNYB_DEBIT"] = "南粤银行(借记卡)";
      bankNames["GDNYB_CREDIT"] = "南粤银行(信用卡)";
      bankNames["GZCB_DEBIT"] = "广州银行(借记卡)";
      bankNames["GZCB_CREDIT"] = "广州银行(信用卡)";
      bankNames["JSB_DEBIT"] = "江苏银行(借记卡)";
      bankNames["JSB_CREDIT"] = "江苏银行(信用卡)";
      bankNames["NBCB_DEBIT"] = "宁波银行(借记卡)";
      bankNames["NBCB_CREDIT"] = "宁波银行(信用卡)";
      bankNames["NJCB_DEBIT"] = "南京银行(借记卡)";
      bankNames["JZB_DEBIT"] = "晋中银行(借记卡)";
      bankNames["KRCB_DEBIT"] = "昆山农商(借记卡)";
      bankNames["LJB_DEBIT"] = "龙江银行(借记卡)";
      bankNames["LNNX_DEBIT"] = "辽宁农信(借记卡)";
      bankNames["LZB_DEBIT"] = "兰州银行(借记卡)";
      bankNames["WRCB_DEBIT"] = "无锡农商(借记卡)";
      bankNames["ZYB_DEBIT"] = "中原银行(借记卡)";
      bankNames["ZJRCUB_DEBIT"] = "浙江农信(借记卡)";
      bankNames["WZB_DEBIT"] = "温州银行(借记卡)";
      bankNames["XAB_DEBIT"] = "西安银行(借记卡)";
      bankNames["JXNXB_DEBIT"] = "江西农信(借记卡)";
      bankNames["NCB_DEBIT"] = "宁波通商银行(借记卡)";
      bankNames["NYCCB_DEBIT"] = "南阳村镇银行(借记卡)";
      bankNames["NMGNX_DEBIT"] = "内蒙古农信(借记卡)";
      bankNames["SXXH_DEBIT"] = "陕西信合(借记卡)";
      bankNames["SRCB_CREDIT"] = "上海农商银行(信用卡)";
      bankNames["SJB_DEBIT"] = "盛京银行(借记卡)";
      bankNames["SDRCU_DEBIT"] = "山东农信(借记卡)";
      bankNames["SRCB_DEBIT"] = "上海农商银行(借记卡)";
      bankNames["SCNX_DEBIT"] = "四川农信(借记卡)";
      bankNames["QLB_DEBIT"] = "齐鲁银行(借记卡)";
      bankNames["QDCCB_DEBIT"] = "青岛银行(借记卡)";
      bankNames["PZHCCB_DEBIT"] = "攀枝花银行(借记卡)";
      bankNames["ZJTLCB_DEBIT"] = "浙江泰隆银行(借记卡)";
      bankNames["TJBHB_DEBIT"] = "天津滨海农商行(借记卡)";
      bankNames["WEB_DEBIT"] = "微众银行(借记卡)";
      bankNames["YNRCCB_DEBIT"] = "云南农信(借记卡)";
      bankNames["WFB_DEBIT"] = "潍坊银行(借记卡)";
      bankNames["WHRC_DEBIT"] = "武汉农商行(借记卡)";
      bankNames["ORDOSB_DEBIT"] = "鄂尔多斯银行(借记卡)";
      bankNames["XJRCCB_DEBIT"] = "新疆农信银行(借记卡)";
      bankNames["ORDOSB_CREDIT"] = "鄂尔多斯银行(信用卡)";
      bankNames["CSRCB_DEBIT"] = "常熟农商银行(借记卡)";
      bankNames["JSNX_DEBIT"] = "江苏农商行(借记卡)";
      bankNames["GRCB_CREDIT"] = "广州农商银行(信用卡)";
      bankNames["GLB_DEBIT"] = "桂林银行(借记卡)";
      bankNames["GDRCU_DEBIT"] = "广东农信银行(借记卡)";
      bankNames["GDHX_DEBIT"] = "广东华兴银行(借记卡)";
      bankNames["FJNX_DEBIT"] = "福建农信银行(借记卡)";
      bankNames["DYCCB_DEBIT"] = "德阳银行(借记卡)";
      bankNames["DRCB_DEBIT"] = "东莞农商行(借记卡)";
      bankNames["CZCB_DEBIT"] = "稠州银行(借记卡)";
      bankNames["CZB_DEBIT"] = "浙商银行(借记卡)";
      bankNames["CZB_CREDIT"] = "浙商银行(信用卡)";
      bankNames["GRCB_DEBIT"] = "广州农商银行(借记卡)";
      bankNames["CSCB_DEBIT"] = "长沙银行(借记卡)";
      bankNames["CQRCB_DEBIT"] = "重庆农商银行(借记卡)";
      bankNames["CBHB_DEBIT"] = "渤海银行(借记卡)";
      bankNames["BOIMCB_DEBIT"] = "内蒙古银行(借记卡)";
      bankNames["BOD_DEBIT"] = "东莞银行(借记卡)";
      bankNames["BOD_CREDIT"] = "东莞银行(信用卡)";
      bankNames["BOB_DEBIT"] = "北京银行(借记卡)";
      bankNames["BNC_DEBIT"] = "江西银行(借记卡)";
      bankNames["BJRCB_DEBIT"] = "北京农商行(借记卡)";
      bankNames["AE_CREDIT"] = "AE(信用卡)";
      bankNames["GYCB_CREDIT"] = "贵阳银行(信用卡)";
      bankNames["JSHB_DEBIT"] = "晋商银行(借记卡)";
      bankNames["JRCB_DEBIT"] = "江阴农商行(借记卡)";
      bankNames["JNRCB_DEBIT"] = "江南农商(借记卡)";
      bankNames["JLNX_DEBIT"] = "吉林农信(借记卡)";
      bankNames["JLB_DEBIT"] = "吉林银行(借记卡)";
      bankNames["JJCCB_DEBIT"] = "九江银行(借记卡)";
      bankNames["HXB_DEBIT"] = "华夏银行(借记卡)";
      bankNames["HXB_CREDIT"] = "华夏银行(信用卡)";
      bankNames["HUNNX_DEBIT"] = "湖南农信(借记卡)";
      bankNames["HSB_DEBIT"] = "徽商银行(借记卡)";
      bankNames["HSBC_DEBIT"] = "恒生银行(借记卡)";
      bankNames["HRXJB_DEBIT"] = "华融湘江银行(借记卡)";
      bankNames["HNNX_DEBIT"] = "河南农信(借记卡)";
      bankNames["HKBEA_DEBIT"] = "东亚银行(借记卡)";
      bankNames["HEBNX_DEBIT"] = "河北农信(借记卡)";
      bankNames["HBNX_DEBIT"] = "湖北农信(借记卡)";
      bankNames["HBNX_CREDIT"] = "湖北农信(信用卡)";
      bankNames["GYCB_DEBIT"] = "贵阳银行(借记卡)";
      bankNames["GSNX_DEBIT"] = "甘肃农信(借记卡)";
      bankNames["JCB_CREDIT"] = "JCB(信用卡)";
      bankNames["MASTERCARD_CREDIT"] = "MASTERCARD(信用卡)";
      bankNames["VISA_CREDIT"] = "VISA(信用卡)";
      bankNames["CFT"] = "微信余额(财付通)";
      return bankNames;
    },
    ableExamine:function(){
      let a = localStorage.permissions.split(',').indexOf('manage:withdraw:pass') > -1 && (this.status == 1 || this.status == 0)
        return a;
     },
    ableExamines:function(){
        return localStorage.permissions.split(',').indexOf('manage:withdraw:refuse') > -1;
     },
    ableExamine1:function(){
        return localStorage.permissions.split(',').indexOf('manage:withdraw:pass1') > -1 && (this.status == 2 || this.status == 0)
     },
    ableExamines1:function(){
        return localStorage.permissions.split(',').indexOf('manage:withdraw:refuse1') > -1;
     },
     money () {
       let a = this.costData.amount ? this.costData.amount:0
       return '￥ ' + (a/1).toFixed(2)
     }
  },
  methods: {
    search() {
      this.getType = true
      this.currentPage = 1
      this.pageTotal = 0
      this.status = 0;
      this.getDataList(true);
    },
    clear() {
      this.userName = "";
      this.keyWord = "";
      this.getDataList();
    },
    changePage(currentPage) {
      this.currentPage = currentPage;
      this.getDataList();
    },
    changeSize(size) {
      this.pageSize = size;
      this.currentPage = 1;
      this.getDataList();
    },
    changeStatus(type) {
      this.getType = false
      this.currentPage = 1
      this.pageTotal = 0
      this.status = type;
      this.getDataList();
    },
    getDataList(a) {
      let url =
        "/withdrawaudit/firstTrialList?rowCount=" +
        (this.pageTotal==0?-1: this.pageTotal) +
        "&currentPage=" +
        this.currentPage +
        "&pageSize=" +
        this.pageSize;
      let data = {
        username: null,
        idCard: null,
        mobile: null,
        receivable: null,
        serialNumber: null,
        state: [],
        auditType: 1
      };

      if (this.getType) {
        if(this.keyWord==''){
          this.keyWord = null
        }
        data.auditType = 0;
        switch (this.userName) {
          case "用户名":
            data.username = this.keyWord;
            data.idCard = null;
            data.mobile = null;
            data.receivable = null;
            data.serialNumber = null;
            break;
          case "身份证":
            data.username = null;
            data.idCard = this.keyWord;
            data.mobile = null;
            data.receivable = null;
            data.serialNumber = null;
            break;
          case "手机号":
            data.username = null;
            data.idCard = null;
            data.mobile = this.keyWord;
            data.receivable = null;
            data.serialNumber = null;
            break;
          case "支付宝账号":
            data.username = null;
            data.idCard = null;
            data.mobile = null;
            data.receivable = this.keyWord;
            data.serialNumber = null;
            break;
          case "银行卡号":
            data.username = null;
            data.idCard = null;
            data.mobile = null;
            data.receivable = this.keyWord;
            data.serialNumber = null;
            break;
          case "流水号":
            data.username = null;
            data.idCard = null;
            data.mobile = null;
            data.receivable = null;
            data.serialNumber = this.keyWord;
            break;

          default:
            data.username = this.keyWord;
            data.idCard = null;
            data.mobile = null;
            data.receivable = null;
            data.serialNumber = null;
            break;
        }
      } else {
        if (this.status === 0) {
          data.state = [0];
          data.auditType = 0;
        } else if (this.status === 1) {
          data.auditType = 1;
        } else if (this.status === 2) {
          data.auditType = 2;
        } else if (this.status === 3) {
          data.auditType = 0;
          data.state = [3];
        } else if (this.status === 4) {
          data.auditType = 0;
          data.state = [2, 4];
        }
      }

      this.$http.post(url, data, { emulateJSON: false }).then(
        res => {
          this.pageTotal = res.data.page.rowCount;
          this.dataList = res.data.records;
        },
        res => {
          this.$Message.error(res.text);
        }
      );
    },
    getDetail(id) {
      this.$http.post("/withdrawaudit/userInfo", { id: id }).then(
        res => {
          this.userInfo = res.data;
          this.model = true;
        },
        res => {
          this.$Message.error(res.text);
        }
      );
    },
    passRequstFinance(data) {
      this.costData = data
      this.modalCost = true
    },
    passRequstFinanceFuc() {
      this.$http.post("/withdrawaudit/transfer", 
      { id: this.costData.id,serialNumber: this.serialNumber}).then(
        res => {
          this.$Message.success('操作成功！')
          this.modalCost = false;
           this.getDataList()
        },
        res => {
          this.$Message.error(res.text);
        }
      );
    },
    passRequst(data) {
      let a = {
        succ: true,
        id:data.id
      }
      this.$http.post("/withdrawaudit/doFirstTrial", a).then(
        res => {
           this.$Message.success('操作成功');
           this.getDataList()
        },
        res => {
          this.$Message.error(res.text);
        }
      );
    },
    refuseModel (data) {
      this.dataCu =data
      this.modal2 = true
    },
    refuseModelFuc(data) {
      if (this.textarea.length==0) {
        this.$Message.error('拒绝理由不能为空！')
        return
      }
      let a = {
        succ: false,
        remark: this.textarea,
        id:this.dataCu.id
      }
      this.$http.post("/withdrawaudit/doFirstTrial", a).then(
        res => {
           this.$Message.success('操作成功');
           this.getDataList()
        },
        res => {
          this.$Message.error(res.text);
        }
      );
    }
  },
  created() {
    localStorage.permissions.split(',').indexOf('manage:withdraw:pass') > -1?this.status=1:this.status=2
    this.getDataList();
  }
};
</script>
<style scoped lang="less">
.button-group {
  text-align: right;
  padding-bottom: 0;
}
</style>