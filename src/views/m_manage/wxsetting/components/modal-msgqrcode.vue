  <template>
    <div>
      <Row>
        <Col span="4">
          <div class="ops-modal-list__addbtn bdr-b">
            <a href="#" @click.prevent="createNew">
              <Icon type="android-add"></Icon>
              新增消息
            </a>
          </div>
          <div v-if="copyList.length">
            <ul class="ops-modal-list_ul bdr-b">
              <li class="ell ops-modal-list_li" 
              :class="{active: item.id == currItem.id}" 
              v-for="item in copyList" :key="item.id" 
              @click="changeCurr(item)">{{item.title}}</li>
            </ul>
          </div>
        </Col>
        <Col span="20">
          <Form label-position="right" ref="mfrm" 
            :rules="ruleValidate"
            :label-width="60"
            :model="curr" class="p15 bdr-l">

            <RadioGroup v-model="codeAction" class="mb20 ml10" v-if="isCreate">
              <Radio :label="3"><span>图文</span></Radio>
              <Radio :label="4"><span>图片</span></Radio>
              <Radio :label="2"><span>文字</span></Radio>
            </RadioGroup>

            <FormItem label="类型" prop="title" v-if="!isCreate">
              <span>{{codeAction | getMsgType}}</span>
            </FormItem>

            <FormItem label="标题" prop="title">
              <Input placeholder="请输入标题" v-model="curr.title" :disabled="!isCreate && codeAction === 4"></Input>
            </FormItem>

            <div v-if="[3, 4].indexOf(codeAction)>-1 && !(!isCreate && codeAction === 4)">
              <div class="dib" style="width: 307px;">
                <FormItem label="图片" prop="picUrl">
                  <Input v-model="curr.picUrl" :disabled="isCreate && codeAction === 4"></Input>
                </FormItem>
              </div>
              <div class="dib rel vm" style="top: -1px;">
                  <div class="ops-img-upload-wrap ovh">
                    <input type="file" name="image" class="ops-img-upload-ipt" accept=".jpg, .jpeg, .png" @change="uploadChange"/>
                    <Button type="ghost" class="ops-img-upload-btn" icon="ios-cloud-upload-outline">上传图片</Button>
                  </div>
              </div>
            </div>

            <FormItem label="链接" prop="url" v-if="codeAction === 3">
              <Input placeholder="请输入链接地址，以http或htts开头" v-model="curr.url"></Input>
            </FormItem>

            <FormItem :label="typeLabelCon" prop="description" v-if="[3, 2].indexOf(codeAction)>-1">
              <Input type="textarea" placeholder="请输入欢迎消息的摘要内容" v-model="curr.msg"></Input>
            </FormItem>

            <FormItem label="预览" prop="description" v-if="codeAction === 2">
              <div class="bdr wxmsg-desc-preview">
                <div v-html="contentPreview"></div>
              </div>
            </FormItem>

            <div class="tc">
              <div v-show="ticket" class="tc mb5"><a :href="`https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=${ticket}`" target="_blank">查看二维码</a></div>
              <div class="qrcode-placeholder-box bdr mb10" :style="{'background-image': `url(https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=${ticket})`}" />
              <div>
                <Button type="primary" @click.native="onSave">{{ isCreate ? '保存并生成二维码' : '保存修改'}}</Button>
              </div>
            </div>
          </Form>
        </Col>
      </Row>
      <Spin size="large" fix v-if="spinShow"></Spin>
    </div>
  </template>
  
  <script>
  /* global FormData  */
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
    filters: {
      getMsgType (t) {
        return { '3': '图文', '4': '图片', '2': '文字' }[t] || ''
      },
    },
    computed: {
      typeLabelCon () {
        return this.codeAction === 2 ? '内容' : '摘要'
      },
      contentPreview () {
        return (this.curr.msg || '').replace(/(\r\n)|(\n\r)|(\r)|(\n)/g, '<br/>')
      },
    },
    data () {
      return {
        spinShow: false,
        list: [],
        copyList: [],
        currItem: {},
        codeAction: 3,
        isCreate: true,
        initItem: {
          title: '',
          picUrl: '',
          url: '',
          msg: '',
        },
        curr: {
          title: '',
          picUrl: '',
          url: '',
          msg: '',
        },
        ruleValidate: {
          title: [{ required: true, message: '请输入消息标题', trigger: 'blur' }],
          url: [{ type: 'url', message: '请输入正确的地址链接', trigger: 'blur' }],
        },
        show: this.display,
        ticket: '',
        formData: {},
      }
    },
    methods: {
      // 加载 列表
      initList () {
        const hid = this.row.config.hid
        this.curr = _.cloneDeep(this.initItem)
        this.formData = new FormData()
        this.ticket = ''
        this.currItem = {}
        this.isCreate = true
        this.codeAction = 3
  
        Api.listmsgqrcodes({
          context: this,
          urlData: [hid],
          stateName: 'spinShow',
        }).then(res => {
          this.list = res
          this.copyList = _.cloneDeep(res)
          if (res.length) {
            const first = res[0]
            this.currItem = first
            this.ticket = first.ticket
            this.isCreate = false
            this.getMsgByScene(first.sceneStr)
          }
        })
      },
      // 获取 详情
      getMsgByScene (sceneStr) {
        const hid = this.row.config.hid
        Api.getmsgqrcode({
          urlData: [hid, sceneStr],
          context: this,
          stateName: 'spinShow',
        }).then(data => {
          const isImgTxt = data.codeAction === 3
          this.curr = isImgTxt ? (data.articles[0] || {}) : data
          this.curr.msg = (this.curr.description || this.curr.msg) || ''
          this.codeAction = data.codeAction
        })
      },
      // 保存
      onSave () {
        this.$refs.mfrm.validate((valid) => {
          if (valid) {
            const hid = this.row.config.hid
            const isCreate = this.isCreate
            const codeAction = this.codeAction
            const sceneStr = this.currItem.sceneStr
            const title = this.curr.title
  
            this.curr.description = this.curr.msg
  
            const data = codeAction === 3 ? { articles: [this.curr], sceneStr, title } : { ...this.curr }
            data.codeAction = codeAction
            data.scene = sceneStr
  
            if (codeAction === 4) {
              if (!this.formData.get('image')) {
                return this.$Message.warning('请上传图片')
              }
              Api.createMsgCodeByImg({
                urlData: [hid, title],
                data: this.formData,
                context: this,
                stateName: 'spinShow',
                options: {},
              }).then(res => {
                this.$Message.success('成功生成二维码')
                this.ticket = res.ticket
              })
            } else {
              Api[isCreate ? 'saveMsgQrcode' : 'updatemsgqrcode']({
                urlData: [hid],
                data,
                context: this,
                stateName: 'spinShow',
              }).then(res => {
                this.$Message.success('成功生成二维码')
                this.initList()
              })
            }
          }
        })
      },
      // 上传 图片
      async uploadChange (e) {
        const hosId = this.row.id
        const file = e.target.files[0]

        // 文件大小和名称验证
        if (file.size > 10 * 1024 * 1024) {
          e.target.value = ''
          return this.$Message.error('图片过大，请上传小于10M的图片')
        }
        if (/[\u4e00-\u9fa5]/.test(file.name)) {
          e.target.value = ''
          return this.$Message.error('图片名称不能含有中文字符，请修改图片名称')
        }

        if (this.codeAction === 4) {
          this.curr.picUrl = file.name
          return this.formData.append('image', file)
        }

        /* global OssClient */
        this.spinShow = true
        const res = await OssClient.addOssObject(`/hospital/${hosId}/wx_imgs/`, file).catch(e => {
          console.warn(e)
          this.$Message.error('图片上传失败')
        })
        e.target.value = ''
        this.spinShow = false
        this.curr.picUrl = OssClient.endpoint + res.name
      },
      // 创建
      createNew () {
        this.curr = _.cloneDeep(this.initItem)
        this.ticket = ''
        this.isCreate = true
      },
      // 切换 当前消息
      changeCurr (item) {
        this.currItem = item
        this.ticket = item.ticket
        this.isCreate = false
        this.getMsgByScene(item.sceneStr)
      },
    },
    watch: {
      'display' (newV) {
        newV && this.initList()
      },
    },
  }
  </script>

  <style lang="less">
  .msgqrcode-img {
    width: 140px;
    height: 140px;
    border-radius: 3px;
    margin: 20px auto;
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
  </style>
