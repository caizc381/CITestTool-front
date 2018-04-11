  <template>
  <Modal v-model="show" title="设置微信自动回复" width="660" class-name="modal-no-padding">
    <Row>
      <Col span="4">
        <div class="ops-modal-list__addbtn bdr-b">
          <a href="#" @click.prevent="createNew">
            <Icon type="android-add"></Icon>
            新增关键词
          </a>
        </div>
        <div v-if="list.length" style="max-height: 490px; overflow-y: scroll;">
          <ul class="ops-modal-list_ul bdr-b">
            <li class="ell ops-modal-list_li" 
            :class="{active: item.id == curr.id}" 
            v-for="item in list" :key="item.id" 
            @click="changeCurr(item)">{{item.request}}</li>
          </ul>
        </div>
      </Col>
      <Col span="20">
        <Form label-position="right" ref="autoreplayFrm" 
          :rules="ruleValidate"
          :label-width="80" 
          :model="curr" class="p15 bdr-l">
          <FormItem label="关键词" prop="title">
            <Input placeholder="请输入关键词" v-model.trim="curr.request"></Input>
          </FormItem>
          <FormItem label="回复内容" prop="description">
            <Input type="textarea" placeholder="请输入回复消息的摘要内容" :row="5" v-model.trim="curr.content"></Input>
          </FormItem>
          <FormItem label="预览" prop="description">
            <div class="bdr wxmsg-desc-preview">
              <div v-html="contentPreview"></div>
            </div>
          </FormItem>
          <div class="pt15 tc">
            <Button type="primary" @click.native="onSave">{{curr.id ? '保存修改' : '保存'}}</Button>
          </div>
        </Form>
      </Col>
      <Spin size="large" fix v-if="spinShow"></Spin>
    </Row>
    <div slot="footer" class="tr">
      <span>当用户发送的关键字，无法匹配时，是否自动转发到微信客服</span>
      <i-switch class="ml10" @on-change="onChangeSwitch" v-model="toWxService" :disabled="curr.request === '*'">
        <span slot="open">是</span>
        <span slot="close">否</span>
      </i-switch>
    </div>
  </Modal>
  </template>
  
  <script>
  import _ from 'lodash'
  import Api from '../../api'

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
    computed: {
      contentPreview () {
        return (this.curr.content || '').replace(/(\r\n)|(\n\r)|(\r)|(\n)/g, '<br/>')
      },
    },
    data () {
      return {
        spinShow: false,
        list: [],
        initItem: {},
        toWxService: false,
        curr: {
          request: '',
          content: '',
        },
        ruleValidate: {
          request: [{ required: true, message: '请输入关键字', trigger: 'blur' }],
        },
        show: this.display,
      }
    },
    methods: {
      // 加载 列表
      initList () {
        const hid = this.row.config.hid

        Api.listAutoReply({
          context: this,
          urlData: [hid],
          stateName: 'spinShow',
        }).then(res => {
          this.list = _.cloneDeep(res.sort((a, b) => b.id - a.id))
          this.curr = res[0] || {}
        })
      },
      // 保存
      onSave () {
        this.$refs.autoreplayFrm.validate((valid) => {
          if (!valid) return

          const { hospitalId } = this.row.config
          const { request, content, id = 0 } = _.cloneDeep(this.curr)
          const isCreate = !id

          if (isCreate) {
            Api.saveAutoReply({
              data: { hospitalId, request, content },
              stateName: 'spinShow',
              context: this,
            }).then(res => {
              this.$Message.success('保存成功')
              this.initList()
            })
          } else {
            Api.updateAutoReply({
              data: { id, request, content },
              stateName: 'spinShow',
              context: this,
            }).then(res => {
              this.$Message.success('修改成功')
              this.initList()
            })
          }
        })
      },
      // 取消
      onCancel () {
        this.show = false
      },
      // 添加
      createNew () {
        this.curr = {}
      },
      // 切换 选中
      changeCurr (item) {
        this.curr = _.cloneDeep(item)
      },
      // switch 切换
      onChangeSwitch (status) {
        const hid = this.row.config.hid
        Api.toggletransfercustomerservice({
          context: this,
          urlData: [hid],
          stateName: 'spinShow',
        }).then(res => {
          this.toWxService = res.transferCustomerService === 1
        })
      },
    },
    watch: {
      'display' (newV) {
        this.show = newV
      },
      'show' (newV) {
        this.$emit('update:display', newV)
        newV && this.initList()
      },
    },
  }
  </script>
