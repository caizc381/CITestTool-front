<template>
  <div>
    <div class="header-search">
      <!-- 体检中心选择 -->
      <div class="dib">
        <span>渠道商：</span>
        <div class="dib w300">
          <mt-select
            style="width: 200px"
            v-model="hospitalId"
            placeholder="请选择渠道商"
            @on-change="handleHospitalChange"
            :filters="['name', 'pinyin']"
            :disabled="!this.hosList.length"
            :options="hosList" />
        </div>
      </div>
    </div>

    <div class="body-content">
      <Tabs :value="currentTab" @on-click="handleTabClick" :animated="false">
        <TabPane label="渠道统计" name="list">
          <table class="table">
            <thead>
              <tr>
                <th width="80">ID</th>
                <th>渠道商</th>
                <th>管理员</th>
                <th>账号</th>
                <th>默认账户余额</th>
                <th>预警状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="hos in hosListWithBalance" v-if="!hos.hide" :key="hos.id">
                <td>{{hos.id}}</td>
                <td>{{hos.hosName}}</td>
                <td>
                  {{hos.manager}}
                  <br>
                  <span class="gray">{{hos.mobile}}</span>
                </td>
                <td>{{hos.account}}</td>
                <td>{{hos.balance | money('￥')}}</td>
                <td>{{hos.warningStatus | warningState}}</td>
                <td>
                  <a class="dib" @click="charge(hos)" v-permission="'channelManage:balance:recharge'">账户充值</a>
                  <a class="dib" @click="$router.push('/channelManage/balanceManage/lowBalanceWarning/' + hos.id)">低频预警</a>
                  <a class="dib" @click="toChargeRecord(hos)">充值记录</a>
                </td>
              </tr>
            </tbody>
          </table>
        </TabPane>

        <TabPane label="充值记录" name="record">
          <table class="table">
            <thead>
              <tr>
                <th>充值时间</th>
                <th>渠道商</th>
                <th>充值账号</th>
                <th>充值金额</th>
                <th>充后余额</th>
                <th>操作人</th>
                <th>备注</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="record in chargeRecord">
                <td>
                  {{record.time | date('yyyy-MM-dd')}}<br>
                  <span class="gray">{{record.time | date('hh:mm:ss')}}</span>
                </td>
                <td>{{record.hosName}}</td>
                <td>{{record.userName}}</td>
                <td>{{record.amount | money('￥')}}</td>
                <td>{{record.balance | money('￥')}}</td>
                <td>{{record.operator}}</td>
                <td>{{record.remark}}</td>
              </tr>
            </tbody>
          </table>

          <div class="page-wrap" style="height:200px;">
            <Page
            :total="page.rowCount"
            :current="page.currentPage"
            :page-size="page.pageSize"
            :page-size-opts="[10,20,50]"
            show-sizer
            show-total
            @on-change="handlePageChange"
            @on-page-size-change="handlePageSizeChange"></Page>
          </div>

        </TabPane>

      </Tabs>

    </div>

    <charge-modal v-if="chargeBillShow"
    :charge-bill-show="chargeBillShow"
    :charge-bill="chargeBill"
    :on-close="closeCharge"
    :on-success="handleSuccess"></charge-modal>

  </div>
</template>

<script>
import ChargeModal from './components/ChargeModal'

export default {
  name: 'balanceManage',
  components: {
   'charge-modal': ChargeModal
  },
  data() {
    return {
      currentTab: 'list',

      hospitalId: undefined,
      hosList: [],
      hosListWithBalance: [],
      chargeRecord: [],

      chargeBillShow: false,
      chargeBill: {},

      page: {
        currentPage: 1,
        pageSize: 20,
        rowCount: -1,
      },
    };
  },

  filters: {
    warningState: function (value) {
      if (value == 1) return "监控";

      return '不监控';
    }
  },

  methods: {
    handleSuccess () {
      //this.hosListWithBalance = [];
      this.getHosStatistics();
    },

    toChargeRecord (hos) {
      this.currentTab = 'record';
      this.hospitalId = hos.id;
      this.getChargeRecord();
    },

    handlePageChange (currentPage) {
      this.page.currentPage = currentPage;
      this.getChargeRecord();
    },

    handlePageSizeChange (pageSize) {
      this.page.pageSize = pageSize;
      this.getChargeRecord();
    },

    closeCharge () {
      this.chargeBillShow = false;
    },

    charge (hos) {
      this.chargeBill = JSON.parse(JSON.stringify(hos));
      this.chargeBill.amount = (this.chargeBill.amount || 0)
      this.chargeBillShow = true;
    },

    handleTabClick (item) {
      if (this.currentTab != item) {
        if (item === 'record') {
          this.getChargeRecord();
        } else {
          this.getHosStatistics();
        }
      }
      this.currentTab = item;
    },

    handleHospitalChange() {
      if (this.currentTab == 'list') {
        this.filterHos();
      } else {
        this.getChargeRecord();
      }
    },

    filterHos () {
      this.hosListWithBalance = this.hosListWithBalance.map(item => {
        if (!this.hospitalId) {
          item.hide = false;
          return item;
        }
        item.hide = this.hospitalId != item.id;
        return item;
      })
    },

    getHospital () {
      this.$http.get('/company/channel/channelList').then((response) => {
        this.hosList = response.body;
      });
    },

    getHosStatistics () {
      this.$http.get('/amount/list').then((response) => {
        this.hosListWithBalance = this.digest(response.body);
        this.filterHos();
      }, (res) => {
      });
    },

    digest(list) {
      list = list.map(item => {
        let newItem = {};
        newItem.id = item.org.id;
        newItem.hosName = (item.org || {}).name;
        newItem.manager = (item.manage || {}).name;
        newItem.mobile = (item.manage || {}).mobile;
        newItem.account = item.loginName;
        newItem.balance = item.amount;
        newItem.warningStatus = (item.rule || {}).enable;
        return newItem;
      })
      return list;
    },

    digestRecord(list) {
      list = list.map(item => {
        let newItem = {};
        newItem.time = item.result.rechargeDate;
        newItem.hosName = item.hospitalName;
        newItem.userName = item.userName
        newItem.amount = item.result.amount;
        newItem.balance = item.result.afterrecharge;
        newItem.operator = item.operator;
        newItem.remark = item.result.remark;
        return newItem;
      })
      return list;
    },

    getChargeRecord () {
      let params = {
        orgId: this.hospitalId || null,
        currentPage: this.page.currentPage,
        pageSize: this.page.pageSize,
        rowCount: -1,
      }
      this.$http.post('/amount/rechquery', params).then((response) => {
        this.chargeRecord = this.digestRecord(response.body.records);
        this.page = response.body.page;
      }, (res) => {
      });

    }

  },

  mounted(){
    this.getHospital();
    this.getHosStatistics();
  }
};
</script>
