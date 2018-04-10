<template>
  <div>
    <div class="mt-page-header">
      <div class="search-item">单位：
        <mt-select
          style="width: 200px;"
          placeholder="简拼搜索单位"
          v-model="query.newCompanyId"
          :options="companyList"
          :filters="['name', 'pinyin']"
          @on-change="handleCompanyChange">
        </mt-select>
      </div>
      <div class="search-item">发卡时间：
        <DatePicker
          type="daterange"
          v-model="dateRange"
          format="yyyy-MM-dd"
          placement="bottom-start"
          placeholder="请选择"
          @on-change="handleDateChange"
          style="width: 200px">
        </DatePicker>
      </div>
      <div class="search-item">
        搜索：
        <i-input class="input-group" v-model="keyword" placeholder="可搜索卡号或绑定客户" @on-enter="getCardRecord">
          <i-select v-model="keywordType" slot="prepend" style="width: 60px" @on-change="keyword = ''">
            <Option value="cardno">卡号</Option>
            <Option value="customer">客户</Option>
          </i-select>
          <Button slot="append" icon="ios-search" @click="getCardRecord"></Button>
        </i-input>
      </div>
    </div>

    <Row>
      <Col :span="layout.left" class="layout-left">

        <div class="card-operate">
          <Checkbox
            :indeterminate="indeterminateAll"
            :value="checkAll"
            @click.prevent.native="handleCheckAll">
            全选
          </Checkbox>
          <span v-show="checkGroup.length" class="ml10">已选<span class="redfont"> {{checkGroup.length}} </span>条</span>

          <Button class="fr" type="ghost" @click="openChangeDeadline">更改有效期</Button>
          <Button class="fr mr10" type="ghost" @click="revoke">撤销发卡</Button>
          <Button class="fr mr10" type="ghost" @click="recycleBalance">金额回收</Button>
        </div>

        <div class="p10 check-table-wrap">
          <Checkbox
            class="check-page"
            :indeterminate="indeterminatePage"
            v-model="checkPage"
            @click.prevent.native="handleCheckPage">
            {{checkPageLabel}}
          </Checkbox>

          <Checkbox-group v-model="checkGroup" @on-change="checkGroupChange">
            <table class="mt-table">
              <thead>
                <tr>
                  <th width="30"></th>
                  <th>发卡时间/有效期</th>
                  <th>卡名/卡号</th>
                  <th>单位/客户经理</th>
                  <th>
                    <Dropdown trigger="click">
                      <a href="javascript:void(0)">
                        绑定客户{{bindStatusText}}
                        <Icon type="arrow-down-b"></Icon>
                      </a>
                      <DropdownMenu slot="list">
                        <DropdownItem @click.native="handleBindStatusChange(-1)"><div>不限</div></DropdownItem>
                        <DropdownItem v-for="sta in bindStatus" @click.native="handleBindStatusChange(sta.key, sta.label)"><div>{{sta.label}}</div></DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </th>
                  <th>
                    <Dropdown trigger="click">
                      <a href="javascript:void(0)" trigger="click">
                        {{cardAmountTypeText}}
                        <Icon type="arrow-down-b"></Icon>
                      </a>
                      <DropdownMenu slot="list">
                        <DropdownItem @click.native="handleChangeAmountType('不限')">不限</DropdownItem>
                        <Dropdown placement="right-start">
                          <DropdownItem>
                            发卡金额
                            <Icon type="ios-arrow-right"></Icon>
                          </DropdownItem >
                          <DropdownMenu slot="list">
                            <DropdownItem v-for="scope in cardScopeList" @click.native="handleChangeAmountType('发卡金额', scope)">{{scope}}</DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                        <DropdownItem style="padding: 0"></DropdownItem>
                        <Dropdown placement="right-start">
                          <DropdownItem>
                            余额
                            <Icon type="ios-arrow-right"></Icon>
                          </DropdownItem>
                          <DropdownMenu slot="list">
                            <DropdownItem v-for="scope in cardScopeList" @click.native="handleChangeAmountType('余额', scope)">{{scope}}</DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </DropdownMenu>
                    </Dropdown>
                  </th>
                  <th>
                    <Dropdown trigger="click">
                      <a href="javascript:void(0)">
                        状态{{statusTypeText}}
                        <Icon type="arrow-down-b"></Icon>
                      </a>
                      <DropdownMenu slot="list">
                        <DropdownItem @click.native="handleClearStatus"><div>不限</div></DropdownItem>
                        <DropdownItem v-for="sta in useStatus" @click.native="handleStatusChange('useStatus', sta.key, sta.label)"><div>{{sta.label}}</div></DropdownItem>
                        <DropdownItem v-for="sta in status" @click.native="handleStatusChange('status', sta.key, sta.label)"><div>{{sta.label}}</div></DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </th>
                </tr>

                <tr v-for="rec in records" @dblclick="showMealList(rec.id)">
                  <td widtd="60"><Checkbox :key="rec.id" :label="rec.id"><span></span></Checkbox></td>
                  <td>
                    {{rec.insertTime | date}}<br>
                    <span class="grayfont">有效期: {{rec.deadline | date}}</span><br>
                    <Tag color="yellow" v-if="expired(rec)">已过期</Tag>
                  </td>
                  <td>
                    <span :title="rec.name" class="ellipsis" style="width: 130px;">{{rec.name}}</span><br>
                    <span class="grayfont">{{rec.num}}</span>
                  </td>
                  <td>
                    {{rec.companyName}}<br>
                    <span class="grayfont">{{rec.manager}}</span>
                  </td>
                  <td>
                    {{rec.accountName}}<br>
                    <span class="grayfont">{{rec.accountIdcard}}</span><br>
                    <Poptip trigger="click" v-if="rec.account.name">
                      <a>更多客户信息</a>
                      <div slot="title"><i>客户信息</i></div>
                      <div slot="content">
                        <account-info :info="rec.account" />
                      </div>
                    </Poptip>
                  </td>
                  <td>
                    发卡金额：{{rec.amount | money('¥')}}<br>
                    使用金额：{{rec.usedAmount | money('¥')}}<br>
                    收回金额：{{rec.recoverableBalance | money('¥')}}<br>
                    <strong>当前余额：</strong>{{rec.balance | money('¥')}}
                  </td>
                  <td><span :class="rec.statusWrap.cls">{{rec.statusWrap.desc}}</span></td>
                </tr>
              </thead>
            </table>
          </Checkbox-group>
        </div>

        <div v-if="records.length == 0" class="no-data">当前数据列表为空</div>

        <div class="page-wrap">
            <Page
              placement="top"
              :total="page.rowCount"
              :page-size="page.pageSize"
              :current-page="page.currentPage"
              show-total
              show-sizer
              :page-size-opts="[20, 50, 100]"
              @on-change="handleCurrentChange"
              @on-page-size-change="handleSizeChange">
            </Page>
        </div>
      </Col>

      <Col :span="layout.right" class="layout-right">

        <div v-if="layout.right">
          <mt-affix>
            <div class="meal-list-head">
              <strong>详情</strong>
              <Icon class="fr" type="close" @click.native="hideMealList"></Icon>
            </div>
            <Spin fix v-if="loadingMeal">加载中...</Spin>
            <div class="meal-list-wrap" v-bind:style="{'height': height}">
              <table class="mt-table">
                <thead>
                  <tr>
                    <th>套餐名称</th>
                    <th width="80">价格</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="m in mealList">
                    <td>
                      <span :title="m.mealName" class="ellipsis" style="width: 120px;">{{m.mealName}}</span><br>
                      <span :title="m.hospitalName" class="ellipsis grayfont" style="width: 120px;">{{m.hospitalName}}</span><br>
                      <span class="grayfont" >ID: {{m.mealId}}</span>
                      <span v-if="m.mealStatus == 1" class="redfont"> 不可用</span>
                    </td>
                    <td>{{m.mealPrice | money('¥')}}</td>
                  </tr>
                </tbody>
              </table>
            </div>

          </mt-affix>

        </div>
      </Col>
    </Row>

    <Modal
      v-model="changeDeadlineModal"
      :mask-closable="false"
      title="修改有效期">
      <div class="ml20">
        <div>您确定修改这 {{this.checkGroup.length}} 张体检卡的有效期吗，已撤销的体检卡无法修改</div>
        <p class="mt10">
          <RadioGroup v-model="hasDeadline" vertical @on-change="handleDeadlineChange">
            <Radio label="yes">
              有效期至：
              <DatePicker :disabled="hasDeadline == 'no'" v-model="newDeadline" placement="bottom-start" placeholder="请选择" style="width: 200px"></DatePicker>
            </Radio>
            <Radio label="no">
              永久
            </Radio>
          </RadioGroup>
        </p>
      </div>
      <div slot="footer">
          <Button type="text" @click="hideModal">取消</Button>
          <Button type="primary" @click="changeDeadline">确认</Button>
      </div>
    </Modal>

  </div>
</template>

<script type="text/ecmascript-6">
import AccountInfo from './components/accountInfo'

export default {
  data () {
    return {
      records: [],
      allRecords: [],

      query: {
        channelId: this.$store.state.m_public.channel.id || '',
        newCompanyId: '',
        bindStatus: '',
        status: '',
        useStatus: '',
        searchKey: '',
        cardNum: '',
        createTimeStart: '',
        createTimeEnd: '',
        cardBalanceIsZero: '',
        cardCapacityIsZero: ''
      },
      companyList: [],
      companyMap: {},
      hospitalMap: {},
      managerMap: {},
      page: {
        currentPage: 1,
        rowCount: -1,
        pageSize: 20
      },

      // checkbox 选择相关变量
      checkPageLabel: '',
      indeterminatePage: false,
      checkPage: false,
      checkGroup: [],
      allOrderIdList: [],
      indeterminateAll: false,
      checkAll: false,

      changeDeadlineModal: false,
      newDeadline: '',
      hasDeadline: 'yes',

      cardAmountTypeText: '金额',
      cardScopeList: [ '不限', '0', '大于0' ],

      keywordType: 'customer',
      keyword: '',
      dateRange: [],
      status: [
        // {key: 0, label: '不可用'},
        // {key: 1, label: '可用'},
        {key: 2, label: '已撤销'},
        {key: 3, label: '余额收回'}
      ],
      useStatus: [
        {key: 0, label: '未使用'},
        {key: 1, label: '已使用'}
      ],
      bindStatus: [
        {key: 1, label: '已绑定'},
        {key: 2, label: '未绑定'}
      ],
      bindStatusText: '',
      statusTypeText: '',

      layout: {
        left: 24,
        right: 0
      },
      mealList: [],
      loadingMeal: false,

      height: ''
    };
  },

  components: {
    'account-info': AccountInfo
  },

  methods: {
    expired (card) {
      return (new Date().getTime() - card.deadline > 0) && card.status != 2
    },

    hideModal () {
      this.changeDeadlineModal = false;
    },

    showMealList (cardId) {
      this.layout = {
        left: 18,
        right: 6
      }

      this.loadingMeal = true
      this.$http.get('listCardMeals?cardId=' + cardId).then((response) => {
        this.loadingMeal = false
        this.mealList = response.body.map(item => {
          item.hospitalName = (this.hospitalMap[item.hospitalId] || {}).name;
          return item;
        });
      });

    },

    hideMealList () {
      this.layout = {
        left: 24,
        right: 0
      }
    },

    handleBindStatusChange (val, text) {
      if (val === -1) {
        this.query.bindStatus = ''
        this.bindStatusText = ''
      } else {
        this.query.bindStatus = val
        this.bindStatusText = '(' + text + ')'
      }
      this.getCardRecord()
    },


    handleStatusChange (statusType, val, text) {
      this.clearStatus()
      this.query[statusType] = val
      this.statusTypeText = '(' + text + ')'
      this.getCardRecord()
    },

    clearStatus () {
      this.query.status = ''
      this.query.useStatus = ''
      this.statusTypeText = ''
    },

    handleClearStatus () {
      this.clearStatus();
      this.getCardRecord()
    },

    handleChangeAmountType (type, scope) {
      if (type == '不限') {
        this.query.cardBalanceIsZero = ''
        this.query.cardCapacityIsZero = ''
      }
      if (type == '发卡金额') {
        this.query.cardBalanceIsZero = ''
        this.decodeAmountScope('cardCapacityIsZero', scope)
      } else if (type == '余额') {
        this.query.cardCapacityIsZero = ''
        this.decodeAmountScope('cardBalanceIsZero', scope)
      }

      this.cardAmountTypeText = scope ? (type + ' ' + scope) : '金额';
      this.getCardRecord();
    },

    decodeAmountScope (val, code) {
      if (code == '0') {
        this.query[val] = true
      } else if (code == '大于0') {
        this.query[val] = false
      } else {
        this.query[val] = ''
      }
    },

    handleDateChange (val) {
      this.dateRange = val;
      this.getCardRecord();
    },

    // checkbox 选择逻辑 start
    handleCheckPage () {
        if (this.indeterminatePage) {
            this.checkPage = false;
        } else {
            this.checkPage = !this.checkPage;
        }
        this.indeterminatePage = false;
        if (this.checkPage) {
            this.checkGroup = myUtil.merge(this.checkGroup, this.recordIdList);
        } else {
            this.checkGroup = myUtil.split(this.checkGroup, this.recordIdList);
        }
        this.checkGroupChange(this.checkGroup);
    },
    handleCheckAll () {
      if (this.indeterminateAll) {
        this.checkAll = false;
      } else {
        this.checkAll = !this.checkAll;
      }
      this.indeterminateAll = false;

      if (this.checkAll) {
        this.checkGroup = this.allRecordIdList;
      } else {
        this.checkGroup = [];
      }
      this.checkGroupChange(this.checkGroup);
    },
    checkGroupChange (data) {
      // 本页全选
      if (myUtil.allIn(this.recordIdList, data)) {
          this.indeterminatePage = false;
          this.checkPage = true;
      } else if (myUtil.someIn(this.recordIdList, data)) {
          this.indeterminatePage = true;
          this.checkPage = false;
      } else {
          this.indeterminatePage = false;
          this.checkPage = false;
      }

      // 所有页全选
      if (data.length === this.allRecordIdList.length && this.allRecordIdList.length != 0) {
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

    handleDeadlineChange () {
      if (this.hasDeadline == 'no') {
        this.newDeadline = '';
      }
    },

    changeDeadline () {
      if (this.hasDeadline == 'yes' && !this.newDeadline) {
        this.$Message.warning('请选择有效日期')
        return;
      }
      let params = {
        cardIds: this.checkGroup,
        newDate: this.newDeadline || new Date('3000-01-01')
      }
      this.$http.post('updateCardExpireDate', JSON.stringify(params)).then((res) => {
        this.$Notice.success({
          desc: res.body.resultCount + ' 张体检卡有效期更改成功',
          duration: 5
        });
        this.hideModal()
        this.getCardRecord()
      }, (res) => {
        this.$Message.error(res.text)
      });

    },

    handleCompanyChange () {
      this.getCardRecord();
    },

    handleCurrentChange (val) {
      this.page.currentPage = val;
      this.getCardRecord(true);
    },

    handleSizeChange (val) {
      this.page.pageSize = val;
      this.getCardRecord(true);
    },

    recycleBalance () {
      if (this.checkGroup.length == 0) {
        this.$Message.warning('请选择选择体检卡后再操作')
        return;
      }

      this.$Modal.confirm({
        title: '提示',
        content: '本操作将会使体检卡余额变为0，您确定要回收此 ' + this.checkGroup.length + ' 张体检卡余额吗?',
        okText: '确定回收',
        onOk: () => {
          this.$http.post('recoverBalance', JSON.stringify(this.checkGroup)).then((res) => {
            this.$Notice.success({
              desc: res.body.resultCount + ' 张体检卡金额回收成功',
              duration: 5
            });
            this.getCardRecord();
          }, (res) => {
            this.$Message.error(res.text);
          });
        }
      })
    },

    revoke () {
      if (this.checkGroup.length == 0) {
        this.$Message.warning('请选择选择体检卡后再操作')
        return;
      }

      this.$Modal.confirm({
        title: '提示',
        content: '本操作将会使体检卡无法使用，您确定要撤销此 ' + this.checkGroup.length + ' 张体检卡吗？',
        okText: '确定撤销',
        onOk: () => {
          this.$http.post('revokeCard', JSON.stringify(this.checkGroup)).then((res) => {
            this.$Notice.success({
              desc: res.body.resultCount + ' 张体检卡撤销成功',
              duration: 5
            });
            this.getCardRecord();
          }, (res) => {
            this.$Message.error(res.text);
          });
        }
      })

    },

    openChangeDeadline () {
      if (this.checkGroup.length == 0) {
        this.$Message.warning('请选择选择体检卡后再操作')
        return;
      }

      this.changeDeadlineModal = true;
    },

    getCompanyList () {
      this.$http.get('getHospitalsAndCompanysByOrganizationId?channelId=' + this.query.channelId).then((response) => {
        this.companyList = response.body.companies.filter(item => {return !item.deleted});
        this.companyMap = myUtil.arrayToMap(response.body.companies);
        if (this.records.length > 0) { // 如果单位列表接口比较慢，但是发卡记录接口已经返回数据
          this.replaceManagerIdOrCompanyId(this.companyMap, 'company');
        }
      });
    },

    getHospitalList () {
      this.$http.get('resource/listAllHospital').then((response) => {
        this.hospitalList = response.body;
        this.hospitalMap = myUtil.arrayToMap(this.hospitalList);
      });
    },

    getManagerList () {
      this.$http.get('listChannelManager?channelId=' + this.query.channelId).then((response) => {
        this.managerMap = myUtil.arrayToMap(response.body);
        if (this.records.length > 0) { // 如果客户经理列表接口比较慢，但是发卡记录接口已经返回数据
          this.replaceManagerIdOrCompanyId(this.managerMap, 'manager');
        }
      });
    },

    assembleParams () {
      this.page.rowCount = -1
      let params = {
        organizationType: 2,
        fromHospital: this.query.channelId,
        newCompanyId: this.query.newCompanyId,
        bindStatus: this.query.bindStatus === '' ? undefined : this.query.bindStatus,
        status: this.query.status === '' ? undefined : this.query.status,
        useStatus: this.query.useStatus === '' ? undefined : this.query.useStatus,
        searchKey: this.keyword && this.keywordType == 'customer' ? this.keyword : undefined,
        cardNum: this.keyword && this.keywordType == 'cardno' ? this.keyword : undefined,
        cardBalanceIsZero: this.query.cardBalanceIsZero === '' ? undefined : this.query.cardBalanceIsZero,
        cardCapacityIsZero: this.query.cardCapacityIsZero === '' ? undefined : this.query.cardCapacityIsZero,
        createTimeStart: this.startDate,
        createTimeEnd: this.endDate,
        page: this.page
      }
      return params
    },

    getAllCardRecord () {
      let params = this.assembleParams();
      params.page = {};
      this.$http.post('cardRecord', JSON.stringify(params)).then((response) => {
        this.allRecords = response.data.records;
      })
    },

    getCardRecord (isPageChange = false) {
      this.hideMealList()
      this.$http.post('cardRecord', JSON.stringify(this.assembleParams())).then((response) => {
        this.records = this.digest(response.data.records);
        this.page = response.data.page;

        if (!isPageChange) {
          this.resetCheck()
        } else {
          this.checkGroupChange(this.checkGroup)
        }

      });

      this.getAllCardRecord() // 查询所有记录，全选操作时使用

    },

    digest (src) {
      src = src.map(item => {
        item.id = item.card.id
        item.insertTime = item.card.createDate
        item.deadline = item.card.expiredDate || new Date('3000-01-01').getTime()
        item.name = item.card.cardName
        item.num = item.card.cardNum
        item.companyName = (this.companyMap[item.card.newCompanyId] || {}).name
        item.manager = (this.managerMap[item.card.managerId] || {}).name
        item.account = (item.account || {});
        item.accountName = item.account.name
        item.accountIdcard = item.account.idCard
        item.amount = item.card.capacity || 0
        item.recoverableBalance = item.card.recoverableBalance || 0
        item.balance = item.card.balance || 0
        item.usedAmount = item.amount - item.recoverableBalance - item.balance
        item.hidePrice = item.cardSetting.showCardMealPrice
        item.status = item.card.status
        item.statusWrap = this.transferStatus(item.card)
        return item;
      })

      return src;
    },

    // 把返回记录中的 客户经理id 和 单位id 转换为名称
    replaceManagerIdOrCompanyId (compnayOrManagerMap, type) {
      if (type == 'manager') {
        this.records = this.records.map(item => {
          item.manager = (compnayOrManagerMap[item.card.managerId] || {}).name
          return item
        })
      } else if (type == 'company') {
        this.records = this.records.map(item => {
          item.companyName = (compnayOrManagerMap[item.card.newCompanyId] || {}).name
          return item
        })
      }
    },

    transferStatus (card) {
      if (card.status == 2) {
        return {desc: '已撤销', cls: 'grayfont'}
      } else if (card.status == 3) {
        return {desc: '余额收回', cls: 'primaryfont'}
      } else if (card.status == 0 || card.status == 1) {
        if (card.capacity == card.balance) {
          return {desc: '未使用', cls: 'warningfont'}
        } else {
          return {desc: '已使用', cls: 'infofont'}
        }
      } else {
        return {}
      }

    }

  },

  mounted () {
    this.height = (window.innerHeight - 100) + 'px'

    this.getCompanyList()
    this.getHospitalList()
    this.getManagerList()
    this.getCardRecord()

  },

  computed: {
    recordIdList () {
      return this.records.map(item => { return item.id });
    },

    allRecordIdList () {
      return this.allRecords.map(item => { return item.card.id });
    },

    startDate () {
      return this.dateRange[0] ? new Date(new Date(this.dateRange[0]).format('yyyy-MM-dd') + ' 00:00:00') : undefined
    },

    endDate () {
      return this.dateRange[1] ? new Date(new Date(this.dateRange[1]).format('yyyy-MM-dd') + ' 23:59:59'): undefined
    }
  }
};
</script>

<style scoped lang="less">
.check-table-wrap {
  position: relative;
  .check-page {
    position: absolute;
    top: 20px;
    left: 16px;
  }
}
.search-item {
  display: inline-block;
  line-height: 40px;
  margin-right: 20px;
  .input-group {
    width: 260px;
    float: right;
    top: 5px;
  }
}
.card-operate {
  padding: 10px;
  line-height: 40px;
  height: 40px;
}
.layout-left {
  border-right: 1px solid #eaeefb;
}
.layout-right {
  padding: 10px;
}
.meal-list-wrap {
  overflow-y: auto;
}
.meal-list-head {
  i:hover {
    color: #666;
    cursor: pointer;
  }
}
.no-data {
  text-align: center;
}
</style>
