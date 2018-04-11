  <template>
  <Modal v-model="show" title="微信菜单配置" width="660">
    <Alert show-icon>添加二级菜单后，一级菜单的链接将自动失效</Alert>
      <Row class="modal-menus-tree f14">
        <Col span="8">
          <div>
            <div v-if="list[0]">
              <div @click="onClickMenu(list[0])" class="modal-menus-tree__item" :class='{ active: list[0]._id === curr._id}'>
                <a href="javascript:;" class="f16" v-show="list[0].name !== '' || list[0]._id === curr._id">{{list[0].name}}</a>
                <span class="c-rd" v-show="list[0]._id !== curr._id && list[0].name === ''">空白菜单</span>
                <Icon type="close-circled" class="c-rd" v-show="list[0].sub_button.length===0"></Icon>
              </div>
              <div v-if="list[0].sub_button && list[0].sub_button.length">
                <div class="modal-menus-tree__item mt5"
                  v-for="(item, idx) in list[0].sub_button" 
                  :key="idx" 
                  :class='{ active: item._id === curr._id}'
                  @click="onClickMenu(item)" >
                  <a href="javascript:;" v-show="item.name !== '' || item._id === curr._id">{{item.name}}</a>
                  <span class="c-rd" v-show="item._id !== curr._id && item.name === ''">空白菜单</span>
                  <Icon type="close-circled" class="c-rd" @click.native="delMenu(0, idx)"></Icon>
                </div>
              </div>
            </div>
            <a href="#"
              @click.prevent="addMenu(0)"
              v-show="!list[0] || list[0].sub_button.length < 5" class="modal-menus-tree__item-add">+子菜单</a>
          </div>
        </Col>
        <Col span="8">
          <div>
              <div v-if="list[1]">
                <div @click="onClickMenu(list[1])" class="modal-menus-tree__item" :class='{ active: list[1]._id === curr._id}'>
                  <a href="javascript:;" class="f16" v-show="list[1].name !== '' || list[1]._id === curr._id">{{list[1].name}}</a>
                  <span class="c-rd" v-show="list[1]._id !== curr._id && list[1].name === ''">空白菜单</span>
                  <Icon type="close-circled" class="c-rd" v-show="list[1].sub_button.length===0"></Icon>
                </div>
                <div v-if="list[1].sub_button.length">
                  <div class="modal-menus-tree__item mt5"
                    v-for="(item, idx) in list[1].sub_button" 
                    :class='{ active: item._id === curr._id}'
                    :key="idx" @click="onClickMenu(item)">
                    <a href="javascript:;" v-show="item.name !== '' || item._id === curr._id">{{item.name}}</a>
                    <span class="c-rd" v-show="item._id !== curr._id && item.name === ''">空白菜单</span>
                    <Icon type="close-circled" class="c-rd" @click.native="delMenu(1, idx)"></Icon>
                  </div>
                </div>
              </div>
              <a href="#" class="modal-menus-tree__item-add"
                @click.prevent="addMenu(1)" 
                v-show="!list[1] || list[1].sub_button.length < 5">+子菜单</a>
          </div>
        </Col>
        <Col span="8">
           <div>
              <div v-if="list[2]">
                <div @click="onClickMenu(list[2])" class="modal-menus-tree__item" :class='{ active: list[2]._id === curr._id}'>
                  <a href="javascript:;" class="f16" v-show="list[2].name !== '' || list[2]._id === curr._id">{{list[2].name}}</a>
                  <span class="c-rd" v-show="list[2]._id !== curr._id && list[2].name === ''">空白菜单</span>
                  <Icon type="close-circled" class="c-rd" v-show="list[2].sub_button.length===0"></Icon>
                </div>
                <div v-if="list[2].sub_button.length">
                  <div 
                    v-for="(item, idx) in list[2].sub_button" 
                    :key="idx" @click="onClickMenu(item)" 
                    :class='{ active: item._id === curr._id}'
                    class="modal-menus-tree__item mt5">
                    <a href="javascript:;" v-show="item.name !== '' || item._id === curr._id">{{item.name}}</a>
                    <span class="c-rd" v-show="item._id !== curr._id && item.name === ''">空白菜单</span>
                    <Icon type="close-circled" class="c-rd" @click.native="delMenu(2, idx)"></Icon>
                  </div>
                </div>
              </div>
              <a href="#" class="modal-menus-tree__item-add"
                @click.prevent="addMenu(2)"  
                v-show="!list[2] || list[2].sub_button.length < 5">+子菜单</a>
          </div>
        </Col>
      </Row>
      <div class="mt20" v-if="curr._id">
        <Form label-position="right" ref="wxMenusFrm" 
          :rules="ruleValidate"
          :label-width="80" 
          :model="curr">
          <div class="dib" style="width: 310px;">
            <FormItem label="菜单名称" prop="name">
              <Input placeholder="请输入最多5个字的标题" v-model.trim="curr.name"></Input>
            </FormItem>
          </div>
          <div class="dib" style="width: 70px;">
            <Dropdown @on-click="onDropdowClick">
              <a href="javascript:;" class="f14">常用名称<Icon type="arrow-down-b"></Icon></a>
              <DropdownMenu slot="list">
                <DropdownItem 
                  :selected="item.key === currTag"
                  :name="item.key"
                  v-for="(item, idx) in taglist" :key="item.key">{{ item.tag }}</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
          <FormItem label="菜单链接" prop="url">
            <Input placeholder="请输入链接地址，以http或htts开头" v-model.trim="curr.url"></Input>
          </FormItem>
          <FormItem label="参数设置" prop="description">
            <Checkbox v-model="requireWxLogin" @on-change="onAutoLoginChange">自动登录</Checkbox>
          </FormItem>
        </Form>
      </div>
    <Spin size="large" fix v-if="spinShow"></Spin>
    <div slot="footer" class="tr">
      <Button type="text" size="large" @click.native="show = false">取消</Button>
      <Button type="primary" size="large" @click.native="onSave">保存</Button>
    </div>
  </Modal>
  </template>
  
  <script>
  /* global MyUtil */
  import _ from 'lodash'
  import Api from '../../api'

  const AUTO_LOGIN = 'requireWxLogin=1'
  
  export default {
    props: {
      row: {
        type: Object,
        default: {},
      },
      display: {
        type: Boolean,
        default: false,
      },
    },
    data () {
      return {
        spinShow: false,
        list: [],
        initItem: {
          name: '',
          url: '',
          type: 'view',
        },
        toWxService: false,
        siteInfo: {},
        currTag: '',
        curr: {},
        ruleValidate: {
          name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
          url: [{ required: true, pattern: /^((https|http))\:\/\/\w+/, message: '请输入正确的菜单地址链接', trigger: 'blur' }],
        },
        show: this.display,
        taglist: [
          { tag: '个人预约', key: 'transfer' },
          { tag: '团体预约', key: 'welcome' },
          { tag: '检前评估', key: 'intelligent' },
          { tag: '我的订单', key: 'orderlist' },
          { tag: '个人中心', key: 'usercenter' },
          { tag: '体检报告', key: 'myreport' },
        ],
        requireWxLogin: false,
      }
    },
    methods: {
      // 加载 列表
      init () {
        let menus = this.row.config.menus
        const hospitalId = this.row.id
        this.curr = _.cloneDeep(this.initItem)

        try {
          menus = JSON.parse(menus).button
        } catch (e) {
          menus = []
        }

        this.list = menus.map(v => {
          v._id = MyUtil.guid('m', 10)
          if (!v.sub_button) {
            v.sub_button = []
          } else {
            v.sub_button.forEach(b => {
              if(b.name){
                b._id = MyUtil.guid('m', 10)
              }
            })
          }
          return v
        })
        console.log(this.list)

        Api.getSiteInfo({
          data: { hospitalId },
          stateName: 'spinShow',
          options: { emulateJSON: false },
          context: this,
        }).then(res => {
          this.siteInfo = res
        })
      },
      // 菜单点击
      onClickMenu (item) {
        this.curr = item
      },
      // 选择标签
      onDropdowClick (key) {
        this.currTag = key
        const tagInfo = this.taglist.filter(v => v.key === key)[0]

        this.curr.name = tagInfo.tag
        this.curr.url = this.siteInfo.url + tagInfo.key + '?' + AUTO_LOGIN
        this.requireWxLogin = true
      },
      // 添加
      addMenu (index) {
        console.log(index)
        const menu = this.list[index]
        const newMenu = {
          name: '新建菜单',
          url: '',
          type: 'view',
          sub_button: [],
          _id: MyUtil.guid('m', 10),
        }

        if (menu) {
          menu.sub_button.push(newMenu)
        } else {
          this.list.push(newMenu)
        }
        this.curr = newMenu
      },
      // 删除
      delMenu (parentIdx, subIndex) {
        if (typeof subIndex === 'undefined') {
          const currItem = this.list[parentIdx]
          this.$Modal.confirm({
            content: `确认要删除菜单 【${currItem.name}】 吗?`,
            onOk: () => {
              this.list.splice(subIndex, 1)
              if (currItem._id === this.curr._id) this.curr = {}
            },
          })
        } else {
          const currItem = this.list[parentIdx].sub_button[subIndex]
          this.$Modal.confirm({
            content: `确认要删除菜单 【${currItem.name}】 吗?`,
            onOk: () => {
              this.list[parentIdx].sub_button.splice(subIndex, 1)
              if (currItem._id === this.curr._id) this.curr = {}
            },
          })
        }
      },
      // 保存
      async onSave () {
        if (this.curr._id) {
          const valid = await this.$refs.wxMenusFrm.validate()
          if (!valid) return
        }
        const hospitalId = this.row.id
        const buttons = this.list

        // 递归验证菜单名称是否为空
        let hasEmptyMenu = false
        function validEmptyMenu (list) {
          for (let i = 0; i<list.length; i++) {
            if (list[i].name === '') {
              hasEmptyMenu = true
              return
            } else if (list[i].sub_button && list[i].sub_button.length){
              validEmptyMenu(list[i].sub_button)
            }
          }
        }
        validEmptyMenu(buttons)

        if (hasEmptyMenu) {
          return this.$Message.error('不能使用空白菜单')
        }

        Api.updateMenus({
          data: { hospitalId, buttons },
          stateName: 'spinShow',
          context: this,
        }).then(res => {
          this.$Message.success('菜单更新成功')

          setTimeout(() => {
            this.show = false
            this.$emit('on-close')
          }, 2500)
        })
      },
      // 选择自动登录
      onAutoLoginChange (checked) {
        const url = this.curr.url
        const baseUrl = url.split('?')[0]
        const urlPms = url.split('?')[1]

        const res = {}
        if (urlPms) {
          const pms = urlPms.split('&')
          pms.forEach(function (v) {
            var t = v.split('=')
            res[t[0]] = t[1]
          })
        }

        checked ? (res['requireWxLogin'] = 1) : (delete res.requireWxLogin)
        this.curr.url = baseUrl + '?' + MyUtil.obj2UrlPms(res)
      },
    },
    watch: {
      'display' (newV) {
        this.show = newV
      },
      'show' (newV) {
        this.$emit('update:display', newV)
        newV && this.init()
      },
      'curr.url' (newV) {
        console.log(newV)
        this.requireWxLogin = (newV + '').indexOf(AUTO_LOGIN) > -1
      },
    },
  }
</script>

<style lang="less">
.modal-menus-tree {
  min-height: 100px;
  &__item {
    min-height: 1.5em;
    a { color: #333}
    .ivu-icon-close-circled {
      display:none;
    }
    &:hover .ivu-icon-close-circled{
      display: inline-block;
    }
    &:hover span {
      color: #57a3f3;
    }
    &-add {
      padding-left: 5px;
    }
    &.active a{
      background-color: #6eadfd;
      border-radius: 3px;
      color: #fff;
      padding: 2px 4px;
    }
  }
}
</style>
