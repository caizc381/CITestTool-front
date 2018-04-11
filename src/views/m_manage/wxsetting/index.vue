<template>
<div>
  <div class="header-search">
    <span>微信接入</span>
    <div class="dib ml20">
        <Input placeholder="输入关键字搜索体检中心" class="w260 dib mr15" v-model="keywords" on-change="onChangeKeywords" />
        <a href="http://wiki.mytijian.cn/doku.php?id=supportbusiness:siteaccessintroduce">如何操作?</a>
    </div>
  </div>
  <div class="body-content">
    <div>
      <table class="table">
        <colgroup>
        <col><col width="150">
        </colgroup>
       <thead>
         <tr>
            <th>体检中心</th>
            <th>
              <Dropdown @on-click="changeType">
                <a href="javascript:;">
                  状态
                  <i class="iconfont icon-guolvqi" style="font-size: 12px; color: #96a7be;"></i>
                </a>
                <DropdownMenu slot="list">
                    <DropdownItem name="" :selected="currType === ''" >全部</DropdownItem>
                    <DropdownItem name="needmove" :selected="currType === 'needmove'" >需迁移</DropdownItem>
                    <DropdownItem name="warn" :selected="currType === 'warn'" >有警告</DropdownItem>
                    <DropdownItem name="connected" :selected="currType === 'connected'" >已接入</DropdownItem>
                    <DropdownItem name="unconnected" :selected="currType === 'unconnected'" >未接入</DropdownItem>
                    <DropdownItem name="disabled" :selected="currType === 'disabled'" >已停用</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </th>
            <th>信息</th>
            <th>操作</th>
         </tr>
       </thead>
       <tbody>
         <tr v-for="item in currList" :key="item.id">
          <td> {{item.name}} </td>
          <td>
            <div v-html="getState(item)"></div>
          </td>
          <td>
            <div v-if="item.config" class="wxsetting-link-black">
              <span
                v-if="item.config.authType !== 2"
                class="ops-wx-move-link c-rd"
                @click="showModal('ModalConnectnewShow', item, {type: 'move'})">迁移 </span>
                <span v-if="item.config.authType !== 2"> - </span>

              <Poptip trigger="click" placement="top" title="微信接入配置" v-if="item.config.authType != 2">
                <a href="javascript:;" >查看接入地址和Token </a>
                <div style="width: 600px;" slot="content">
                  <table class="pct100 bdr-r bdr-b bdr-l">
                    <col width="150">
                    <tbody>
                      <tr><th><div class="tr">接入地址</div></th><td>{{item.config.siteUrl}}</td></tr>
                      <tr><th><div class="tr">当前 AccessToken</div></th><td>{{item.config.accessToken || '无'}}</td></tr>
                    </tbody>
                    <tfoot>
                      <tr><td colspan="2"><div class="tr"><a target="_blank" href="http://wiki.mytijian.cn/doku.php?id=supportbusiness:siteaccessintroduce">如何操作?</a></div></td></tr>
                    </tfoot>
                  </table>
                </div>
              </Poptip>
              <a href="#" @click.prevent="showModal('ModalConnectnewShow', item, {type: 'refresh'})" v-if="item.config.authType == 2">刷新refreshToken </a>
              <span> - </span>
              <Dropdown>
                <a href="javascript:void(0)">高级选项 <Icon type="arrow-down-b"></Icon></a>
                <DropdownMenu slot="list">
                    <DropdownItem @click.native="onAdvanceClick('tplmsg', item)">模板消息</DropdownItem>
                    <DropdownItem @click.native="onAdvanceClick('clearwarn', item)">清除警告</DropdownItem>
                    <DropdownItem @click.native="onAdvanceClick('del', item)">删除</DropdownItem>
                    <DropdownItem @click.native="onAdvanceClick('disable', item)" v-show="item.config.enable">停用</DropdownItem>
                    <DropdownItem @click.native="onAdvanceClick('enable', item)" v-show="!item.config.enable">启用</DropdownItem>
                    <DropdownItem @click.native="onAdvanceClick('uak', item)">UAK</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </td>
          <td>
            <div v-if="item.config">
              <div>
                <a href="#" @click.prevent="showModal('ModalSetmenusShow', item)">微信菜单</a> |
                <a href="#" @click.prevent="showModal('ModalWelcomeShow', item)">欢迎</a> |
                <a href="#" @click.prevent="showModal('ModalAutoreplayShow', item)">自动回复</a> |
                <a href="#" @click.prevent="showModal('ModalQrcodeShow', item)">推广</a> |
                <a href="#" @click.prevent="showModal('ModalMsgqrcodeShow', item)">定向消息</a>
              </div>

            </div>
            <div v-else>
              <a  href="#" @click.prevent="showModal('ModalConnectnewShow', item, {type: 'new'})">快速接入</a>
            </div>
          </td>
        </tr>
       </tbody>
     </table>
      <div class="p30 c-8 tc" v-show="!currList.length">
         未查询到相关数据
       </div>
    </div>
    <div class="tc mt15" v-show="!keywords && total > 0">
      <Page
      :total="total"
      :page-size="pageSize"
      @on-change="changePage"
      @on-page-size-change="changeSize"
      show-total
      show-sizer></Page>
    </div>
  </div>

  <!-- ========================= Dialogs ========================= -->

  <!-- 快速接入 -->
  <ModalConnectnew :display.sync="ModalConnectnewShow" :row="currRow" :options="modalOptions"></ModalConnectnew>

  <!-- 欢迎 -->
  <ModalWelcome :display.sync="ModalWelcomeShow" :row="currRow"/>

  <!-- 自动回复 -->
  <ModalAutoreplay :display.sync="ModalAutoreplayShow" :row="currRow"/>

  <!-- 推广 -->
  <ModalQrcode :display.sync="ModalQrcodeShow" :row="currRow"></ModalQrcode>

  <!-- 消息二维码 -->
  <Modal v-model="ModalMsgqrcodeShow" title="定向消息二维码" width="660" class-name="modal-no-padding" footer-hide>
      <ModalMsgqrcode :display="ModalMsgqrcodeShow" :row="currRow"></ModalMsgqrcode>
  </Modal>

  <!-- 微信菜单设置 -->
  <ModalSetmenus :display.sync="ModalSetmenusShow" :row="currRow" @on-close="loadConfig"></ModalSetmenus>
</div>
</template>

<script>
import _ from 'lodash'
const siteBase = 'http://www.mytijian.com/main/action/dispathcer/'
import Api from '../api'
import ModalAutoreplay from './components/modal-autoreplay'
import ModalConnectnew from './components/modal-connectnew'
import ModalQrcode from './components/modal-qrcode'
import ModalMsgqrcode from './components/modal-msgqrcode'
import ModalWelcome from './components/modal-welcome'
import ModalSetmenus from './components/modal-setmenus'

export default {
  data () {
    return {
      currType: '',
      pageSize: 30,
      page: 1,
      total: 0,
      keywords: '',
      modalOptions: {},
      currList: [],
      hospitals: [],
      wxOauth2redirectUrl: '',
      currRow: {},

      // 弹出层
      ModalSetmenusShow: false,    // 菜单设置
      ModalConnectnewShow: false,  // 快速接入
      ModalWelcomeShow: false,     // 欢迎设置
      ModalAutoreplayShow: false,  // 自动回复
      ModalQrcodeShow: false,      // 推广二维码
      ModalMsgqrcodeShow: false,   // 消息二维码

      advancedShow: false, // 高级选项的显示隐藏
    }
  },
  components: {
    ModalAutoreplay, ModalConnectnew,
    ModalQrcode, ModalMsgqrcode, ModalWelcome, ModalSetmenus,
  },
  mounted () {
    this.loadConfig()
  },
  methods: {
    // 显示弹出层
    showModal (modalName, currRow, options) {
      console.log(modalName)
      this[modalName] = true
      this.modalOptions = options || {}
      this.currRow = _.cloneDeep(currRow)
    },
    // 加载配置列表
    loadConfig () {
      this.currType = ''
      this.pageSize = 30
      this.page = 1
      this.keywords = ''

      Api.getWxConfig().then(res => {
        const { hospitals, wxConfigs, wxOauth2redirectUrl } = res

        // 添加 siteUrl
        wxConfigs.forEach(v => (v.siteUrl = siteBase + v.hid))

        // 添加config对象
        const configs = _.groupBy(wxConfigs, 'hospitalId')
        hospitals.forEach(v => (v.config = (configs[v.id] && configs[v.id][0]) || ''))

        this.hospitals = hospitals
        this.wxOauth2redirectUrl = wxOauth2redirectUrl
        this.total = hospitals.length

        // 分页 设置当前页数据
        this.setCurrList()
      })
    },
    // 设置当前页面数据
    setCurrList () {
      // 如果有状态, 先过滤出相应状态的数据
      let currListByType = []
      switch (this.currType) {
        case 'unconnected':// 未接入
          currListByType = this.hospitals.filter(v => !v.config)
          break
        case 'connected':// 状态良好
          currListByType = this.hospitals.filter(v => v.config && v.config.enable)
          break
        case 'warn':// 警告
          currListByType = this.hospitals.filter(v => v.config && v.config.warn)
          break
        case 'needmove':// 警告
          currListByType = this.hospitals.filter(v => v.config && (v.config.authType !== 2))
          break
        default:
          currListByType = this.hospitals
          break
      }

      this.total = currListByType.length
      const start = (this.page - 1) * this.pageSize
      const end = start + this.pageSize
      this.currList = currListByType.slice(start, end)
    },
    // 分页事件
    changePage (p) {
      this.page = p
      this.setCurrList()
    },
    // 监听分页大小改变
    changeSize (size) {
      this.pageSize = size
      this.page = 1
      this.setCurrList()
    },
    // 关键字过滤
    filterHospitals (keywrods) {
      if (keywrods) {
        this.currList = this.hospitals.filter(v => {
          return v.name.indexOf(keywrods) > -1 || (v.pinYin || '').indexOf(keywrods) > -1
        })
      } else {
        this.setCurrList()
      }
    },
    // 获取 状态
    getState (item) {
      const config = item.config
      if (!config) return '<span class="c-8">未接入</span>'

      let t = ''
      if (config.enable) {
        t = (config.warn ? `<span class="c-or">${config.warn}</span>` : '<span class="c-gr">状态良好</span>')
      } else {
        t = '<span class="c-rd">停用</span>'
      }

      config.authType !== 2 && (t += ' <span class="c-rd">(需迁移)</span>')

      return t
    },
    // 改变过滤条件
    changeType (type) {
      this.currType = type
      this.page = 1
      this.setCurrList()
    },
    // 显示隐藏 高级选项
    toggleShowAdvanced () {
      this.advancedShow = !this.advancedShow
    },
    // 模板消息
    updateTemplate (hid) {
      Api.updateTemplate({ urlData: [hid] }).then(res => {
        this.$Message.success('操作成功')
      })
    },
    // 清除警告
    clearWran (hid) {
      this.$Modal.confirm({
        content: '警告中可能包含重要信息,请确认警告项目都已经处理',
        onOk: () => {
          Api.clearWarn({ urlData: [hid] }).then(res => {
            this.loadConfig()
          })
        },
      })
    },
    // 启用
    enable (hid, enable) {
      if (enable === true) {
        Api.enable({ urlData: [hid, enable] }).then(res => {
          this.$Message.success('启用成功')
          this.loadConfig()
        })
      } else {
        this.$Modal.confirm({
          content: '请注意, 停用微信公众号会导致以下功能失效: 【1】微信自动登录 【2】微信二维码扫 【3】模板消息推送，是否确定要停用?',
          onOk: () => {
            Api.enable({ urlData: [hid, enable] }).then(res => {
              this.loadConfig()
            })
          },
        })
      }
    },
    // 删除
    del (hospitalId) {
      this.$Modal.confirm({
        content: '医院接入开始正式使用后，请不要随意删除，删除会导致原先配置的所有微信功能失效，绑定关系也会丢失',
        onOk: () => {
          Api.delWxConfig({ urlData: [hospitalId] }).then(res => {
            this.loadConfig()
          })
        },
      })
    },
    // uak
    uak (hid) {
      this.$Modal.confirm({
        content: '确认要进行UAK操作吗? UAK操作每日不要大于10次！',
        onOk: () => {
          Api.uak({ urlData: [hid] }).then(res => {
            if (res.accessToken && res.hid && res.accessToken !== 'undefined' && res.hid !== 'undefined') {
              this.$Message.success('Token 刷新成功')
            } else {
              this.$Message.error('Token 刷新失败，请重试')
            }
          })
        },
      })
    },
    onAdvanceClick (type, item) {
      const hid = item.config.hid

      switch (type) {
        case 'tplmsg': return this.updateTemplate(hid)
        case 'clearwarn': return this.clearWran(hid)
        case 'del': return this.del(item.id)
        case 'disable': return this.enable(hid, false)
        case 'enable': return this.enable(hid, true)
        case 'uak': return this.uak(hid)
      }
    },
  },
  watch: {
    'keywords' (newVal) {
      _.debounce(this.filterHospitals.bind(this, newVal), 100)()
    },
  },
}
</script>

<style lang="less">
  .ops-modal-list{
    &_li {
      line-height: 2;
      font-size: 14px;
      padding: 5px 10px;
      &:hover, &.active {
        cursor: pointer;
        background-color: #2D8CF0;
        color: #fff;
      }
    }
    &_li:not(:last-child) {
      border-bottom: 1px solid #DDDEE1;
    }
  }
  .ops-modal-list__addbtn {
    font-size: 14px;
    padding: 5px 10px;
    text-align: center;
    line-height: 1.6;
  }

  .modal-no-padding .ivu-modal-body {
    padding: 0;
  }
  .wxsetting-link-black a{
    color: #333;
  }

  .ops-img-upload {
    &-warp { position: relative; }
    &-ipt { opacity: 0; position:absolute;  }
  }
  .ops-wx-move-link:hover {
    cursor: pointer;
  }
  .qrcode-placeholder-box {
    width: 140px;
    height: 140px;
    border-radius: 4px;
    background-color: #f5f5f5;
    display: inline-block;
    background-size: 100%;
    background-repeat: no-repeat;
  }
  .wxmsg-desc-preview {
    min-height: 50px;
    padding: 6px;
    border-radius: 4px;
    line-height: 1.5;
  }
  .icon-guolvqi:hover {
    color: #333;
  }
  .ivu-spin-fix{
    background-color: rgba(255,255,255, .3);
  }
</style>
