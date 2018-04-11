<template>
  <div>
    <div class="header-search">
      <mt-select class="w200" v-model="hospitalId" placeholder="搜索体检机构站点" @on-change="onHospitalChange" :filters="['name', 'pinyin']" :disabled="!this.hosList.length" :options="hosList" />
    </div>

    <div class="body-content">
      <table class="table">
        <thead>
          <tr>
            <th>来源站点</th>
            <th>留言时间</th>
            <th>用户</th>
            <th>留言内容</th>
            <th>
              <Dropdown trigger="click">
                <span class="ivu-dropdown hoverblue">
                  状态
                  <i style="font-size:12px;" class="iconfont icon-guolvqi"></i>
                </span>
                <Dropdown-menu slot="list">
                  <Dropdown-item v-for="item in statusList" @click.native="handleStatusChange(item.id)" :key="item.id" :selected="item.id == status">{{item.name}}</Dropdown-item>
                </Dropdown-menu>
              </Dropdown>
            </th>
            <th style="width: 80px;">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in list" :key="item.id">
            <td>{{item.feedback.hospitalName}}</td>
            <td>{{item.feedback.saveTime | date('yyyy-MM-dd')}}</td>
            <td>{{item.username || '匿名'}}</td>
            <td>
              <div class="ell" :title="item.feedback.content">{{item.feedback.content}}</div>
            </td>
            <td>
              <span :class="item.staClass">{{item.feedback.status | staFilter}}</span>
            </td>
            <td>
              <a @click="$router.push('/messageManage/feedback/detail?feedbackId=' + item.feedback.id)">详情</a>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="mt20 tc" v-if="list.length > 0">
        <Page :total="page.rowCount" :current="page.currentPage" :page-size="page.pageSize" @on-change="changePage" @on-page-size-change="changeSize" show-total show-sizer></Page>
      </div>

      <mt-none class="p20" :show="list.length == 0" size="large" />

    </div>

  </div>
</template>

<script>
const statusList = [
  { id: 999, name: '全部', cls: '' },
  { id: 0, name: '未处理', cls: '' },
  { id: 1, name: '已处理', cls: 'successfont' },
  { id: -1, name: '忽略', cls: 'c-9' }
]

export default {
  name: 'feedbackList',
  components: {},

  data() {
    return {
      hosList: [],
      list: [],
      hospitalId: '',

      statusList,
      status: 999,
      page: {
        rowCount: -1,
        currentPage: 1,
        pageSize: 20
      }
    }
  },

  filters: {
    staFilter: (value, map) => {
      for (let i = 0; i < statusList.length; i++) {
        if (statusList[i].id === value) {
          return statusList[i].name
        }
      }
      return value
    }
  },

  watch: {},

  methods: {
    changePage(currentPage) {
      this.page.currentPage = currentPage
      this.getFeedback()
    },

    changeSize(pageSize) {
      this.page.pageSize = pageSize
      this.getFeedback()
    },

    onHospitalChange() {
      this.getFeedback()
    },

    handleStatusChange(sta) {
      this.status = sta
      this.getFeedback()
    },

    getFeedback() {
      let pms = '',
        status = this.status === 999 ? '' : this.status
      pms += '?hospitalIds=' + this.hospitalId
      pms += '&currentPage=' + this.page.currentPage
      pms += '&pageSize=' + this.page.pageSize
      pms += '&status=' + status
      this.$http.get('/listFeedbackByPage' + pms).then(res => {
        this.list = this.disgest(res.body.records)
        this.page = res.body.page
      })
    },

    disgest(list) {
      list.map(item => {
        let staClass = ''
        for (let i = 0; i < statusList.length; i++) {
          if (statusList[i].id === item.feedback.status) {
            staClass = statusList[i].cls
          }
        }
        item.staClass = staClass
        return item
      })
      return list
    },

    getHospitalList() {
      this.$http.post('/hospital/listHospital').then(
        response => {
          this.hosList = response.body
        },
        res => {
          this.$Message.error(res.text)
        }
      )
    }
  },

  computed: {},

  mounted() {
    this.getHospitalList()
    this.getFeedback()
  }
}
</script>
