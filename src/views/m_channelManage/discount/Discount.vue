<template>
  <div>
    <Row>
      <i-col :span="24" class="header-search">
        <span class="ml15">地区：</span>
        <Cascader class="dlb w200" :data="areaList" :clearable="true" :change-on-select="true" @on-change="getDetailId">
        </Cascader>

        <span class="pl-20">体检机构：</span>
        <div class="dlb w200">
          <mt-select v-model="queryList.hospitalId" placeholder="请选择体检机构" :filters="['name', 'pinyin']" :options="selectHosList" @on-change="changeHospitalInfo()">
          </mt-select>
        </div>

        <span class="fr mr15">
          <Button type="primary" @click="showExcelModel()">导出Excel</Button>
        </span>
      </i-col>
    </Row>

    <Row class="body-content">

      <table class="table">
        <col width="80" />
        <colgroup span="5"></colgroup>
        <thead>
          <tr>
            <th>ID</th>
            <th>体检中心</th>
            <th>平台显示</th>
            <th>散客折扣</th>
            <th>单位折扣</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="hos in hosList" :key="hos.id">
            <td>{{hos.id}}</td>
            <td>{{hos.name}}</td>
            <td>
              <div :class="{'redfont':hos.showInList == 0,'successfont':hos.showInList == 1}">
                {{hos.showInList == 1 ? '显示':'不显示'}}
              </div>
            </td>
            <td>
              <div v-if="hos.settings.platformChannelGuestDiscount">默认散客折扣：{{hos.settings.platformChannelGuestDiscount}}</div>
              <div v-else>默认散客折扣：
                <span class="orange">未设定</span>
              </div>
              <div>平台散客折扣：{{hos.settings.platformGuestDiscount}}</div>
            </td>
            <td>
              <div v-if="hos.settings.platformChannelCompDiscount">默认单位折扣：{{hos.settings.platformChannelCompDiscount}}</div>
              <div v-else>默认散客折扣：
                <span class="orange">未设定</span>
              </div>
              <div>平台单位折扣：{{hos.settings.platformCompDiscount}}</div>
            </td>
            <td>
              <a v-permission="'channelManage:discount:edit'" @click="showEditModel(hos)">编辑</a>
            </td>
          </tr>
        </tbody>
      </table>

      <Spin size="large" fix v-if="loading"></Spin>

      <mt-none style="padding: 20px;" :show="hosList.length == 0" size="large" />

      <div class="page-wrap">
        <Page :total="page.rowCount" show-total :page-size="page.pageSize" :page-size-opts="[20,50,100]" show-sizer :current="page.currentPage" @on-change="handleCurrentChange" @on-page-size-change="handlePageSizeChange">
        </Page>
      </div>

    </Row>

    <!-- 编辑 -->
    <Modal title="编辑折扣" v-model="model.edit" :mask-closable="false">
      <Form :model="discountInfo" :label-width="140">
        <FormItem label="体检中心：">
          <span class="b">{{discountInfo.hospitalName}}</span>
        </FormItem>
        <FormItem label="默认散客折扣：" class="ivu-form-item-required">
          <Input v-model="discountInfo.platformChannelGuestDiscount" @on-blur="verifyLenDecimal('platformChannelGuestDiscount', $event)" class="dlb pct50" />
          <div class="discount">平台散客折扣：{{discountInfo.platformGuestDiscount}}</div>
        </FormItem>
        <FormItem label="默认单位折扣：" class="ivu-form-item-required">
          <Input v-model="discountInfo.platformChannelCompDiscount" @on-blur="verifyLenDecimal('platformChannelCompDiscount', $event)" class="dlb pct50" />
          <div class="discount">平台单位折扣：{{discountInfo.platformCompDiscount}}</div>
        </FormItem>
      </Form>
      <div class="error tc" v-if="errorInfo">{{errorInfo}}</div>
      <div slot="footer">
        <Button type="text" @click="model.edit = false;errorInfo = undefined">取消</Button>
        <Button :disabled="!discountInfo.platformChannelGuestDiscount || !discountInfo.platformChannelCompDiscount" type="primary" @click="edit()">确定</Button>
      </div>
    </Modal>

    <!-- 导出excel -->
    <Modal title="导出" v-model="model.excel" :mask-closable="false">
      <Form :model="exportInfo" :label-width="60">
        <div class="dialog-header pl20">您确定要导出当前筛选体检中心的渠道默认折扣？</div>
        <FormItem label="地区">
          <span>{{exportInfo.area}}</span>
        </FormItem>
        <FormItem label="机构">
          <span>{{exportInfo.hospitalName}}</span>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="model.excel = false">取消</Button>
        <Button type="primary" @click="exportExcel()">确定</Button>
      </div>
    </Modal>

  </div>
</template>

<script>
export default {
  name: 'discount',
  data() {
    return {
      queryList: {
        hospitalId: undefined,
        addressId: undefined
      },
      areaList: [],
      hosList: [],
      selectHosList: [],
      loading: false,
      areaIds: [],
      timeRange: [],
      openPicker: false,
      page: {
        rowCount: 0,
        pageSize: 20,
        currentPage: 1
      },
      discountInfo: {
        hospitalId: undefined,
        hospitalName: undefined,
        platformGuestDiscount: undefined,
        platformChannelGuestDiscount: undefined,
        platformCompDiscount: undefined,
        platformChannelCompDiscount: undefined
      },
      exportInfo: {
        area: undefined,
        hospitalName: undefined
      },
      errorInfo: undefined,
      model: {
        edit: false,
        excel: false
      }
    }
  },

  mounted() {
    this.getSelectHosList()
    this.getAreaList()
    this.getHospitalInfo()
  },

  methods: {
    //获取折扣信息
    getHospitalInfo() {
      let query = {
        hospitalId: this.queryList.hospitalId,
        addressId: this.queryList.addressId,
        page: this.page
      }
      this.loading = true
      this.$http
        .post('/listPlatformChannelDiscountHospitals', JSON.stringify(query))
        .then(
          response => {
            this.hosList = response.body.records
            this.page = response.body.page
            this.loading = false
          },
          res => {
            this.$Message.error(res.text)
          }
        )
    },

    //筛选条件改变时清空page
    changeHospitalInfo(currentPage) {
      this.page = {
        rowCount: 0,
        pageSize: 20,
        currentPage: currentPage || 1
      }
      this.getHospitalInfo()
    },

    //分页
    handleCurrentChange(val) {
      this.page.currentPage = val
      this.getHospitalInfo()
    },
    handlePageSizeChange(val) {
      this.page.pageSize = val
      this.getHospitalInfo()
    },

    //获取医院列表
    getSelectHosList() {
      var qureyValue = {
        provinceId: this.areaIds[0],
        cityId: this.areaIds[1],
        districtId: this.areaIds[2],
        orgType: 1
      }
      this.$http.post('/hospital/queryOrg', JSON.stringify(qureyValue)).then(
        response => {
          this.selectHosList = response.body
        },
        res => {
          this.$Message.error(res.text)
        }
      )
    },

    //获取地址列表
    getAreaList() {
      this.$http.get('/hospital/queryArea').then(
        response => {
          this.areaList = response.body.provinces
        },
        res => {
          this.$Message.error(res.text)
        }
      )
    },

    //获取省市区id
    getDetailId(val, data) {
      this.queryList.addressId = val[val.length - 1]
      this.areaIds = val
      this.exportInfo.area = ''
      data.forEach(item => {
        this.exportInfo.area += item.label
      })
      this.getSelectHosList()
      this.changeHospitalInfo()
    },

    showExcelModel() {
      this.model.excel = true
      this.exportInfo.area = this.exportInfo.area
        ? this.exportInfo.area
        : '不限'
      this.exportInfo.hospitalName = this.getHospitalName(
        this.queryList.hospitalId
      )
    },

    getHospitalName(id) {
      var area = ''
      if (this.selectHosList.length > 0 && id) {
        this.selectHosList.forEach(item => {
          if (item.id == id) {
            area += item.name
          }
        })
        return area
      } else {
        return '不限'
      }
    },

    //导出
    exportExcel() {
      if (this.hosList.length <= 0) {
        this.$Message.error('当前数据为空,不可导出')
        return
      }

      var url = '/exportPlatformChannelDiscount'
      if (this.queryList.hospitalId && !this.queryList.addressId) {
        url += '?hospitalId=' + this.queryList.hospitalId
      }
      if (this.queryList.addressId && !this.queryList.hospitalId) {
        url += '?addressId=' + this.queryList.addressId
      }
      if (this.queryList.addressId && this.queryList.hospitalId) {
        url +=
          '?hospitalId=' +
          this.queryList.hospitalId +
          '&addressId=' +
          this.queryList.addressId
      }

      this.$http.get(url).then(
        response => {
          //导出
          this.$Message.success('正在导出,请稍等....')
          window.location.href = response.url
          this.model.excel = false
        },
        res => {
          this.$Message.error(res.text)
        }
      )
    },

    showEditModel(hos) {
      this.model.edit = true
      this.discountInfo = {
        hospitalId: hos.id,
        hospitalName: hos.name,
        platformGuestDiscount: hos.settings.platformGuestDiscount,
        platformChannelGuestDiscount: hos.settings.platformChannelGuestDiscount,
        platformCompDiscount: hos.settings.platformCompDiscount,
        platformChannelCompDiscount: hos.settings.platformChannelCompDiscount
      }
    },

    //编辑
    edit() {
      var reg = /^\d+(\.\d{1,2})?$/
      if (!reg.test(this.discountInfo.platformChannelGuestDiscount)) {
        this.errorInfo = '请输入0.10 ~ 2.00且最多两位小数的数值'
        return
      }
      if (
        this.discountInfo.platformChannelGuestDiscount < 0.1 ||
        this.discountInfo.platformChannelGuestDiscount > 2
      ) {
        this.errorInfo = '请输入0.10 ~ 2.00且最多两位小数的数值'
        return
      }
      if (!reg.test(this.discountInfo.platformChannelGuestDiscount)) {
        this.errorInfo = '请输入0.10 ~ 2.00且最多两位小数的数值'
        return
      }
      if (
        this.discountInfo.platformChannelCompDiscount < 0.1 ||
        this.discountInfo.platformChannelCompDiscount > 2
      ) {
        this.errorInfo = '请输入0.10 ~ 2.00且最多两位小数的数值'
        return
      }

      var obj = {
        hospitalId: this.discountInfo.hospitalId,
        platformChannelGuestDiscount: this.discountInfo
          .platformChannelGuestDiscount,
        platformChannelCompDiscount: this.discountInfo
          .platformChannelCompDiscount
      }
      this.$http
        .post('/savePlatformChannelTradeSetting', JSON.stringify(obj))
        .then(
          response => {
            this.$Message.success('编辑成功！')
            this.model.edit = false
            this.changeHospitalInfo(this.page.currentPage)
          },
          res => {
            this.$Message.error(res.text)
          }
        )
    },

    //只能输入两位小数
    verifyLenDecimal(number, event) {
      if (event.relatedTarget && event.relatedTarget.innerText === '取消') {
        this.errorInfo = undefined
        return
      }
      var reg = /^\d+(\.\d{1,2})?$/
      if (this.discountInfo[number] && !reg.test(this.discountInfo[number])) {
        this.errorInfo = '请输入0.10 ~ 2.00且最多两位小数的数值'
      } else if (
        this.discountInfo[number] &&
        (this.discountInfo[number] < 0.1 || this.discountInfo[number] > 2)
      ) {
        this.errorInfo = '请输入0.10 ~ 2.00且最多两位小数的数值'
      } else {
        this.errorInfo = undefined
      }
    }
  }
}
</script>

<style lang="less">

</style>
