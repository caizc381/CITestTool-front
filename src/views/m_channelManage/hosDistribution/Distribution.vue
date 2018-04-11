<template>
<div>
  <div class="header-search">
    <dropdown-select :options="channelList" placeholder="简拼搜索体检中心" :filters="['name','pinYin']" @on-change="handleCurrent" style="font-size:16px;">
    </dropdown-select>
  </div>

  <Row class="serach-top">
    <i-col :span="24">
      <span class="ml15">地区：</span>
      <Cascader class="dlb w200" :data="areaList" :clearable="true" :change-on-select="true" @on-change="getDetailId">
      </Cascader>

      <span class="pl-20">体检机构：</span>
      <div class="dlb w200">
        <mt-select v-model="queryList.hospitalId" placeholder="请选择体检机构" :filters="['name', 'pinyin']" :options="selectHosList" @on-change="handleChangeHospital">
        </mt-select>
      </div>
    </i-col>
  </Row>

  <div class="body-content">
    <div class="check-table-wrap">
      <div class="pb15 ovh">

        <Checkbox class="ml15" :indeterminate="indeterminateAll" :value="checkAll" @click.prevent.native="handleCheckAll" :disabled="loadingAll">全选
        </Checkbox>
        <span v-if="checkGroup && checkGroup.length > 0">选中
            <strong class="redfont">{{checkGroup.length}}</strong> 条</span>

        <!-- 查询条件 -->
        <div class="mt10 mb10 dlb">

          <span class="ops-query mr5" v-if="queryList.showInList">
              <span>平台显示：{{queryList.showInList == '1' ? '显示':'不显示'}}</span>
          <Icon type="close" @click.native="queryList.showInList = undefined;changeHospitalList()"></Icon>
          </span>

          <span class="ops-query mr5" v-if="queryList.guestDiscount">
              <span>散客折扣：{{queryList.guestDiscount == '1' ? '已设置':'未设置'}}</span>
          <Icon type="close" @click.native="queryList.guestDiscount = undefined;changeHospitalList()"></Icon>
          </span>

          <span class="ops-query mr5" v-if="queryList.companyDiscount">
              <span>单位折扣：{{queryList.companyDiscount == '1' ? '已设置':'未设置'}}</span>
          <Icon type="close" @click.native="queryList.companyDiscount = undefined;changeHospitalList()"></Icon>
          </span>

          <span class="ops-query mr5" v-if="queryList.isCancel">
              <span>分配给渠道：{{queryList.isCancel == '1' ? '未分配':'已分配'}}</span>
          <Icon type="close" @click.native="queryList.isCancel = undefined;changeHospitalList()"></Icon>
          </span>

          <span class="ops-query mr5" v-if="queryList.status">
              <span>是否可用：{{queryList.status == '1' ? '可用':'不可用'}}</span>
          <Icon type="close" @click.native="queryList.status = undefined;changeHospitalList()"></Icon>
          </span>

          <a v-if="queryList.showInList || queryList.guestDiscount || queryList.companyDiscount || queryList.isCancel || queryList.status" @click="clearQuery()">清空</a>
        </div>

        <span class="fr" v-permission="'channelManage:distribution:reset'">
            <Button type="error" @click="showModel('reset')">重置折扣</Button>
          </span>
        <span class="fr mr10">
            <Button type="primary" @click="showModel('excel')">导出Excel</Button>
          </span>
        <span class="fr mr10" v-permission="'channelManage:distribution:cancel'">
            <Button type="primary" @click="showModel('cancel')">取消分配</Button>
          </span>
        <span class="fr mr10" v-permission="'channelManage:distribution:assign'">
            <Button type="primary" @click="showModel('distribution')">分配给渠道</Button>
          </span>
      </div>

      <Checkbox class="check-pages" :indeterminate="indeterminatePage" v-model="checkPage" @click.prevent.native="handlecheckPage"></Checkbox>
      <CheckboxGroup v-model="checkGroup" @on-change="checkGroupChange">
        <table class="table">
          <col width="50">
          <col width="50">
          <colgroup span="7"></colgroup>
          <thead>
            <tr>
              <th style="width: 40px;"></th>
              <th>ID</th>
              <th>体检中心</th>
              <th>
                <Dropdown trigger="click">
                  <span class="ivu-dropdown hoverblue">
                      平台显示
                      <i style="font-size:12px;" class="iconfont icon-guolvqi"></i>
                    </span>
                  <Dropdown-menu slot="list">
                    <Dropdown-item @click.native="queryList.showInList = undefined;changeHospitalList()">不限</Dropdown-item>
                    <Dropdown-item @click.native="queryList.showInList = '1';changeHospitalList()">显示</Dropdown-item>
                    <Dropdown-item @click.native="queryList.showInList = '0';changeHospitalList()">不显示</Dropdown-item>
                  </Dropdown-menu>
                </Dropdown>
              </th>
              <th>
                <Dropdown trigger="click">
                  <span class="ivu-dropdown hoverblue">
                      散客折扣
                      <i style="font-size:12px;" class="iconfont icon-guolvqi"></i>
                    </span>
                  <Dropdown-menu slot="list">
                    <Dropdown-item @click.native="queryList.guestDiscount = undefined;changeHospitalList()">不限</Dropdown-item>
                    <Dropdown-item @click.native="queryList.guestDiscount = '1';changeHospitalList()">已设置</Dropdown-item>
                    <Dropdown-item @click.native="queryList.guestDiscount = '0';changeHospitalList()">未设置</Dropdown-item>
                  </Dropdown-menu>
                </Dropdown>
              </th>
              <th>
                <Dropdown trigger="click">
                  <span class="ivu-dropdown hoverblue">
                      单位折扣
                      <i style="font-size:12px;" class="iconfont icon-guolvqi"></i>
                    </span>
                  <Dropdown-menu slot="list">
                    <Dropdown-item @click.native="queryList.companyDiscount = undefined;changeHospitalList()">不限</Dropdown-item>
                    <Dropdown-item @click.native="queryList.companyDiscount = '1';changeHospitalList()">已设置</Dropdown-item>
                    <Dropdown-item @click.native="queryList.companyDiscount = '0';changeHospitalList()">未设置</Dropdown-item>
                  </Dropdown-menu>
                </Dropdown>
              </th>
              <th>
                <Dropdown trigger="click">
                  <span class="ivu-dropdown hoverblue">
                      分配给渠道
                      <i style="font-size:12px;" class="iconfont icon-guolvqi"></i>
                    </span>
                  <Dropdown-menu slot="list">
                    <Dropdown-item @click.native="queryList.isCancel = undefined;changeHospitalList()">不限</Dropdown-item>
                    <Dropdown-item @click.native="queryList.isCancel = '1';changeHospitalList()">未分配</Dropdown-item>
                    <Dropdown-item @click.native="queryList.isCancel = '0';changeHospitalList()">已分配</Dropdown-item>
                  </Dropdown-menu>
                </Dropdown>
              </th>
              <th>
                <Dropdown trigger="click">
                  <span class="ivu-dropdown hoverblue">
                      是否可用
                      <i style="font-size:12px;" class="iconfont icon-guolvqi"></i>
                    </span>
                  <Dropdown-menu slot="list">
                    <Dropdown-item @click.native="queryList.status = undefined;changeHospitalList()">不限</Dropdown-item>
                    <Dropdown-item @click.native="queryList.status = '1';changeHospitalList()">可用</Dropdown-item>
                    <Dropdown-item @click.native="queryList.status = '2';changeHospitalList()">不可用</Dropdown-item>
                  </Dropdown-menu>
                </Dropdown>
              </th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="hos in hospitalList" :key="hos.hospital.id">
              <td style="text-align: center;">
                <Checkbox :key="hos.hospital.id" :label="hos.hospital.id" class="hidden-label"></Checkbox>
              </td>
              <td>
                {{hos.hospital.id}}
              </td>
              <td>
                <div>
                  <span v-if="!hos.hospital.enable" class="mt-tag">停用</span>{{hos.hospital.name}}</div>
                <div>{{hos.hospital.address.province}}{{hos.hospital.address.city}}</div>
              </td>
              <td>
                <div :class="{'redfont':hos.hospital.showInList == 0,'successfont':hos.hospital.showInList == 1}">{{hos.hospital.showInList == 1 ? '显示':'不显示'}}</div>
              </td>
              <td>
                <div v-if="hos.organizationHospitalRelation && hos.organizationHospitalRelation.platformChannelGuestDiscount">渠道散客折扣：{{hos.organizationHospitalRelation.platformChannelGuestDiscount}}</div>
                <div v-else>渠道散客折扣：
                  <span class="orange">未设置</span>
                </div>
                <div>默认散客折扣：{{hos.hospital.settings.platformChannelGuestDiscount}}</div>
                <div>平台散客折扣：{{hos.hospital.settings.platformGuestDiscount}}</div>
              </td>
              <td>
                <div v-if="hos.organizationHospitalRelation && hos.organizationHospitalRelation.platformChannelCompDiscount">渠道单位折扣：{{hos.organizationHospitalRelation.platformChannelCompDiscount}}</div>
                <div v-else>渠道单位折扣：
                  <span class="orange">未设置</span>
                </div>
                <div>默认单位折扣：{{hos.hospital.settings.platformChannelCompDiscount}}</div>
                <div>平台单位折扣：{{hos.hospital.settings.platformCompDiscount}}</div>
              </td>
              <td>
                <div v-if="hos.organizationHospitalRelation" :class="{'redfont':hos.organizationHospitalRelation.isCancel == 1,'successfont':hos.organizationHospitalRelation.isCancel == 0}">{{hos.organizationHospitalRelation.isCancel == 1 ? '未分配':'已分配'}}</div>
                <div v-else class="redfont">未分配</div>
              </td>
              <td>
                <span v-if="hos.organizationHospitalRelation" :class="{'redfont':hos.organizationHospitalRelation.status == 2,'successfont':hos.organizationHospitalRelation.status == 1}">{{hos.organizationHospitalRelation.status == 1 ? '可用':'不可用'}}</span>
                <span v-else class="redfont">不可用</span>
                <Poptip trigger="hover" placement="top-end" v-if="!hos.organizationHospitalRelation || hos.organizationHospitalRelation.status==2">
                  <Icon type="information-circled hoverblue"></Icon>
                  <div slot="title">
                    <i>不可用原因</i>
                  </div>
                  <div slot="content">
                    <div class="ops-poptip-content" v-if="hos.hospital.showInList == 0">平台不显示</div>
                    <div class="ops-poptip-content" v-if="!hos.organizationHospitalRelation || !hos.organizationHospitalRelation.platformChannelGuestDiscount">渠道散客折扣未设置</div>
                    <div class="ops-poptip-content" v-if="!hos.organizationHospitalRelation || !hos.organizationHospitalRelation.platformChannelCompDiscount">渠道单位折扣未设置</div>
                    <div class="ops-poptip-content" v-if="!hos.organizationHospitalRelation || hos.organizationHospitalRelation.isCancel">医院未分配</div>
                    <div class="ops-poptip-content" v-if="!hos.hospital.enable">医院不可用</div>
                  </div>
                </Poptip>
              </td>
              <td>
                <a v-permission="'channelManage:distribution:edit'" @click="showEditModel(hos)">编辑折扣</a>
              </td>
            </tr>
          </tbody>
        </table>
      </CheckboxGroup>

      <Spin size="large" fix v-if="loading"></Spin>

      <mt-none style="padding: 20px;" :show="hospitalList.length == 0" size="large" />

      <div class="page-wrap">
        <Page :total="page.rowCount" show-total :page-size-opts="[20,50,100]" show-sizer :page-size="page.pageSize" :current="page.currentPage" @on-change="handleCurrentChange" @on-page-size-change="handlePageSizeChange">
        </Page>
      </div>
    </div>
  </div>

  <!-- 编辑 -->
  <Modal title="编辑折扣" v-model="model.modify" :mask-closable="false">
    <Form :model="discountInfo" :label-width="140">
      <FormItem label="渠道商：">
        <span class="b">{{currentChannelName}}</span>
      </FormItem>
      <FormItem label="体检中心：">
        <span class="b">{{discountInfo.hospitalName}}</span>
      </FormItem>
      <FormItem label="渠道散客折扣：" class="ivu-form-item-required">
        <Input v-model.number="discountInfo.channelPlatformChannelGuestDiscount" @on-blur="verifyLenDecimal('channelPlatformChannelGuestDiscount', $event)" class="dlb pct50" />
        <div class="discount">默认散客折扣：{{discountInfo.platformChannelGuestDiscount}}</div>
        <div class="discount">平台散客折扣：{{discountInfo.platformGuestDiscount}}</div>
      </FormItem>
      <FormItem label="渠道单位折扣：" class="ivu-form-item-required">
        <Input v-model.number="discountInfo.channelPlatformChannelCompDiscount" @on-blur="verifyLenDecimal('channelPlatformChannelCompDiscount', $event)" class="dlb pct50" />
        <div class="discount">默认单位折扣：{{discountInfo.platformChannelCompDiscount}}</div>
        <div class="discount">平台单位折扣：{{discountInfo.platformCompDiscount}}</div>
      </FormItem>
    </Form>
    <div class="error tc" v-if="errorInfo">{{errorInfo}}</div>
    <div slot="footer">
      <Button type="text" @click="model.modify = false;errorInfo = undefined">取消</Button>
      <Button :disabled="!discountInfo.channelPlatformChannelGuestDiscount || !discountInfo.channelPlatformChannelCompDiscount" type="primary" @click="edit()">确定</Button>
    </div>
  </Modal>

  <!-- 导出excel -->
  <Modal title="导出" v-model="model.excel" :mask-closable="false">
    <div class="dialog-header pl20">
      <div>您确定要导出当前筛选体检中心的渠道默认折扣？</div>
      <div class="pt10">
        <span class="pr10">渠道商</span>
        <span>{{currentChannelName}}</span>
      </div>
    </div>
    <div slot="footer">
      <Button type="text" @click="model.excel = false">取消</Button>
      <Button type="primary" @click="exportExcel()">确定</Button>
    </div>
  </Modal>

  <!-- 分配给渠道 -->
  <Modal title="分配给渠道" v-model="model.distribution" :mask-closable="false">
    <div class="dialog-header pl20">
      <div>您确定要将当前所选体检中心分配给当前渠道吗？</div>
      <div class="pt10">
        <span class="pr10">渠道商</span>
        <span>{{currentChannelName}}</span>
      </div>
    </div>
    <div slot="footer">
      <Button type="text" @click="model.distribution = false">取消</Button>
      <Button type="primary" @click="distribution()">确定</Button>
    </div>
  </Modal>

  <!-- 取消分配 -->
  <Modal title="取消分配" v-model="model.cancel" :mask-closable="false">
    <div class="dialog-header pl20">
      <div>您确定要将当前所选体检中心取消分配给当前渠道吗？</div>
      <div class="pt10">
        <span class="pr10">渠道商</span>
        <span>{{currentChannelName}}</span>
      </div>
    </div>
    <div slot="footer">
      <Button type="text" @click="model.cancel = false">取消</Button>
      <Button type="primary" @click="cancel()">确定</Button>
    </div>
  </Modal>

  <!-- 重置折扣 -->
  <Modal title="重置折扣" v-model="model.reset" :mask-closable="false">
    <div class="dialog-header pl20">
      <div>此操作将会把所选体检中心在当前渠道折扣重置为渠道默认折扣，您确定要重置吗？</div>
      <div class="pt10">
        <span class="pr10">渠道商</span>
        <span>{{currentChannelName}}</span>
      </div>
    </div>
    <div slot="footer">
      <Button type="text" @click="model.reset = false">取消</Button>
      <Button type="primary" @click="resetDiscount()">确定</Button>
    </div>
  </Modal>

</div>
</template>

<script>
import DropdownSelect from 'components/ui/DropdownSelect'
export default {
  name: 'distribution',
  data() {
    return {
      queryList: {
        hospitalId: undefined,
        addressId: undefined,
        channelId: undefined,
        hospitalIds: undefined,
        showInList: undefined,
        guestDiscount: undefined,
        companyDiscount: undefined,
        isCancel: undefined,
        status: undefined
      },
      hospitalList: [],
      allHospitalIdList: [],
      channelList: [],
      areaList: [],
      areaIds: [],
      selectHosList: [],
      checkGroup: [],
      checkPage: false,
      checkAll: false,
      loadingAll: false,
      indeterminatePage: false,
      indeterminateAll: false,
      loading: false,
      page: {
        rowCount: 0,
        pageSize: 20,
        currentPage: 1
      },
      model: {
        modify: false,
        excel: false,
        distribution: false,
        cancel: false,
        reset: false
      },
      discountInfo: {
        hospitalId: undefined,
        hospitalName: undefined,
        platformGuestDiscount: undefined,
        platformChannelGuestDiscount: undefined,
        platformCompDiscount: undefined,
        platformChannelCompDiscount: undefined
      },
      currentChannelName: undefined,
      errorInfo: undefined
    }
  },

  components: {
    'dropdown-select': DropdownSelect
  },

  computed: {
    idList() {
      return this.hospitalList.map(item => {
        return item.hospital.id
      })
    }
  },

  mounted() {
    this.getChannelList()
    this.getSelectHosList()
    this.getAreaList()
    this.getAllHospitalIdsList()
  },

  methods: {
    //获取渠道列表
    getChannelList() {
      this.$http.get('/listChannel').then(
        response => {
          this.channelList = response.body
          this.queryList.channelId = this.channelList[0].id
          this.currentChannelName = this.channelList[0].name
        },
        res => {
          this.$Message.error(res.text)
        }
      )
    },

    //获取匹配列表
    getHospitalList() {
      this.loading = true
      var qureyValue = JSON.parse(JSON.stringify(this.queryList))
      qureyValue.guestDiscount = parseInt(qureyValue.guestDiscount)
      qureyValue.companyDiscount = parseInt(qureyValue.companyDiscount)
      qureyValue.isCancel = parseInt(qureyValue.isCancel)
      qureyValue.page = this.page
      this.$http.post('/listChannelHospitals', JSON.stringify(qureyValue)).then(
        response => {
          this.hospitalList = response.body.records
          this.page = response.body.page
          this.loading = false
        },
        res => {
          this.$Message.error(res.text)
        }
      )
    },

    //获取体检中心列表
    getAllHospitalIdsList() {
      var qureyValue = JSON.parse(JSON.stringify(this.queryList))
      qureyValue.guestDiscount = parseInt(qureyValue.guestDiscount)
      qureyValue.companyDiscount = parseInt(qureyValue.companyDiscount)
      qureyValue.isCancel = parseInt(qureyValue.isCancel)
      this.$http.post('/listChannelHospitals', JSON.stringify(qureyValue)).then(
        response => {
          this.allHospitalIdList = response.body.records.map(item => {
            return item.hospital.id
          })
        },
        res => {
          this.$Message.error(res.text)
        }
      )
    },

    handleChangeHospital() {
      this.changeHospitalList()
    },

    //筛选条件改变时清空page
    changeHospitalList(currentPage) {
      this.page = {
        rowCount: 0,
        pageSize: 20,
        currentPage: currentPage || 1
      }
      this.resetCheck()
      this.getHospitalList()
      this.getAllHospitalIdsList()
    },

    handleCurrentChange(val) {
      this.page.currentPage = val
      this.getHospitalList()
    },

    handlePageSizeChange(val) {
      this.page.pageSize = val
      this.getHospitalList()
    },

    //获取下拉医院列表
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

    handleCurrent(id) {
      if (!id) {
        this.queryList.channelId = undefined
      } else {
        this.queryList.channelId = id
        this.changeHospitalList()
        var obj = this.channelList.filter(item => {
          return item.id == id
        })
        this.currentChannelName = obj[0].name
      }
    },

    //清空筛选
    clearQuery() {
      this.queryList.showInList = undefined
      this.queryList.guestDiscount = undefined
      this.queryList.companyDiscount = undefined
      this.queryList.isCancel = undefined
      this.queryList.status = undefined
      this.changeHospitalList()
    },

    //获取省市区id
    getDetailId(val, data) {
      this.queryList.addressId = val[val.length - 1]
      this.areaIds = val
      this.getSelectHosList()
      this.changeHospitalList()
    },

    showEditModel(hos) {
      this.model.modify = true
      this.discountInfo = {
        id: hos.organizationHospitalRelation ?
          hos.organizationHospitalRelation.id : undefined,
        hospitalId: hos.hospital.id,
        hospitalName: hos.hospital.name,
        channelPlatformChannelGuestDiscount: (
          hos.organizationHospitalRelation || {}
        ).platformChannelGuestDiscount,
        platformGuestDiscount: hos.hospital.settings.platformGuestDiscount,
        platformChannelGuestDiscount: hos.hospital.settings.platformChannelGuestDiscount,
        channelPlatformChannelCompDiscount: (
          hos.organizationHospitalRelation || {}
        ).platformChannelCompDiscount,
        platformCompDiscount: hos.hospital.settings.platformCompDiscount,
        platformChannelCompDiscount: hos.hospital.settings.platformChannelCompDiscount
      }
    },

    //编辑
    edit() {
      var reg = /^\d+(\.\d{1,2})?$/
      if (!reg.test(this.discountInfo.channelPlatformChannelGuestDiscount)) {
        this.errorInfo = '请输入0.10 ~ 2.00且最多两位小数的数值'
        return
      }
      if (
        this.discountInfo.channelPlatformChannelGuestDiscount < 0.1 ||
        this.discountInfo.channelPlatformChannelGuestDiscount > 2
      ) {
        this.errorInfo = '请输入0.10 ~ 2.00且最多两位小数的数值'
        return
      }
      if (!reg.test(this.discountInfo.channelPlatformChannelCompDiscount)) {
        this.errorInfo = '请输入0.10 ~ 2.00且最多两位小数的数值'
        return
      }
      if (
        this.discountInfo.channelPlatformChannelCompDiscount < 0.1 ||
        this.discountInfo.channelPlatformChannelCompDiscount > 2
      ) {
        this.errorInfo = '请输入0.10 ~ 2.00且最多两位小数的数值'
        return
      }

      var obj = {
        id: this.discountInfo.id,
        hospitalId: this.discountInfo.hospitalId,
        organizationId: this.queryList.channelId,
        platformChannelGuestDiscount: this.discountInfo
          .channelPlatformChannelGuestDiscount,
        platformChannelCompDiscount: this.discountInfo
          .channelPlatformChannelCompDiscount
      }
      this.$http.post('/editPlatformChannelDisCount', JSON.stringify(obj)).then(
        response => {
          this.$Message.success('编辑成功！')
          this.model.modify = false
          this.changeHospitalList(this.page.currentPage)
        },
        res => {
          this.$Message.error(res.text)
        }
      )
    },

    showModel(tab) {
      if (this.checkGroup.length == 0) {
        this.$Message.error('请至少选择一个体检中心')
        return
      }
      this.model[tab] = true
    },

    //导出
    exportExcel() {
      var queryObj = {
        channelId: this.queryList.channelId,
        hospitalIds: this.checkGroup
      }
      this.$http
        .get(
          '/exportChannelHospitals?channelId=' +
          this.queryList.channelId +
          '&hospitalIds=' +
          this.checkGroup
        )
        .then(
          response => {
            this.$Message.success('正在导出,请稍等....')
            window.location.href = response.url
            this.model.excel = false
          },
          res => {
            this.$Message.error(res.text)
          }
        )
    },

    //重置折扣
    resetDiscount() {
      var obj = {
        channelId: this.queryList.channelId,
        hospitalIds: this.checkGroup
      }
      this.$http
        .post('/resetPlatformChannelDisCount', JSON.stringify(obj))
        .then(
          response => {
            this.$Message.success('重置折扣成功！')
            this.model.reset = false
            this.changeHospitalList()
          },
          res => {
            this.$Message.error(res.text)
          }
        )
    },

    //分配医院
    distribution() {
      var obj = {
        channelId: this.queryList.channelId,
        hospitalIds: this.checkGroup
      }
      this.$http.post('/allocateHospitals', JSON.stringify(obj)).then(
        response => {
          this.$Message.success('分配医院成功！')
          this.model.distribution = false
          this.changeHospitalList()
        },
        res => {
          this.$Message.error(res.text)
        }
      )
    },

    //取消分配医院
    cancel() {
      var obj = {
        channelId: this.queryList.channelId,
        hospitalIds: this.checkGroup
      }
      this.$http.post('/cancelAllocateHospitals', JSON.stringify(obj)).then(
        response => {
          this.$Message.success('取消分配医院成功！')
          this.model.cancel = false
          this.changeHospitalList()
        },
        res => {
          this.$Message.error(res.text)
        }
      )
    },

    // checkbox 选择逻辑 start
    handlecheckPage() {
      if (this.indeterminatePage) {
        this.checkPage = false
      } else {
        this.checkPage = !this.checkPage
      }
      this.indeterminatePage = false
      if (this.checkPage) {
        this.checkGroup = MyUtil.merge(this.checkGroup, this.idList)
      } else {
        this.checkGroup = MyUtil.split(this.checkGroup, this.idList)
      }
      this.checkGroupChange(this.checkGroup)
    },
    handleCheckAll() {
      if (this.indeterminateAll) {
        this.checkAll = false
      } else {
        this.checkAll = !this.checkAll
      }
      this.indeterminateAll = false

      if (this.checkAll) {
        this.checkGroup = this.allHospitalIdList
      } else {
        this.checkGroup = []
      }
      this.checkGroupChange(this.checkGroup)
    },
    checkGroupChange(data) {
      // 本页全选
      if (MyUtil.allIn(this.idList, data)) {
        this.indeterminatePage = false
        this.checkPage = true
      } else if (MyUtil.someIn(this.idList, data)) {
        this.indeterminatePage = true
        this.checkPage = false
      } else {
        this.indeterminatePage = false
        this.checkPage = false
      }

      // 所有页全选
      if (data.length === this.allHospitalIdList.length) {
        this.indeterminateAll = false
        this.checkAll = true
      } else if (data.length > 0) {
        this.indeterminateAll = true
        this.checkAll = false
      } else {
        this.indeterminateAll = false
        this.checkAll = false
      }
    },

    resetCheck() {
      this.checkGroup = []
      this.checkAll = false
      this.checkPage = false
      this.indeterminateAll = false
      this.indeterminatePage = false
    },

    // checkbox 选择逻辑 end

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

<style scoped lang="less">
.serach-top {
  padding: 15px 0;
  border-bottom: 1px solid #eaeefb;
}

.check-pages {
  position: absolute;
  top: 58px;
  left: 15px;
}
</style>
