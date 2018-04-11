  <template>
  <Modal v-model="show" title="设置欢迎消息" width="660" class-name="modal-no-padding">
    <div style="max-height: 500px; overflow-y:scroll;">
      <div v-if="formList.list.length">
        <Form class="p15 bdr-l"
          label-position="right" 
          ref="mfrm"
          :model="formList"
          :label-width="60">
          <div
            v-for="(item, index) in formList.list"
            :key="index">
            <!-- <Badge :count="index+1"></Badge> -->
            <div class="tc pb15 f14">-第 {{index+1}} 行-</div>
            <FormItem label="标题" :prop="'list.'+index+'.title'" :rules="{required: true, message: '请输入消息标题', trigger: 'blur'}">
              <Input placeholder="请输入标题" v-model="item.title"></Input>
            </FormItem>

            <div>
              <div class="dib" style="width: 527px;">
                <FormItem label="图片" :prop="'list.'+index+'.picUrl'" :rules="{type: 'url', message: '请输入正确的图片链接或上传图片', trigger: 'blur'}">
                  <Input placeholder="请输入图片链接" v-model="item.picUrl"></Input>
                </FormItem>
              </div>
              <div class="dib rel vm" style="top: -1px;">
                  <div class="ops-img-upload-wrap ovh">
                    <input type="file" name="image" class="ops-img-upload-ipt" accept=".jpg, .jpeg, .png" @change="uploadChange($event, index)" />
                    <Button type="ghost" class="ops-img-upload-btn" icon="ios-cloud-upload-outline">上传图片</Button>
                  </div>
              </div>
            </div>

            <FormItem label="链接" :prop="'list.'+index+'.url'">
              <Input type="text" placeholder="请输入链接地址，以http或htts开头" v-model="item.url"></Input>
            </FormItem>
            <FormItem label="详细" :prop="'list.'+index+'.description'" v-if="index === 0">
              <Input type="textarea" placeholder="请输入欢迎消息的摘要内容" :length="500" :rows="4" v-model="item.description"></Input>
            </FormItem>
            <div class="mb10 tr">
              <Button type="text"  @click.native="delMsg(index)" size="small"><span class="c-rd">删除此行图文消息</span></Button>
            </div>
          </div>
        </Form>
      </div>
    </div>
    <div class="tc bdr-t mt10 pt10 mb10 f14">
      <a href="#" @click.prevent="addNewMsg"><Icon type="android-add"></Icon> 添加一行消息</a>
    </div>
    <Spin size="large" fix v-if="spinShow"></Spin>
    <div slot="footer" class="tr">
      <div style="position:absolute; line-height: 2.5;">此条欢迎消息已包含 {{formList.list.length}} 条图文消息</div>
      <Button type="text" size="large" @click.native="onCancel">取消</Button>
      <Button type="primary" size="large" @click.native="onSave">保存</Button>
    </div>
  </Modal>
  </template>
  
  <script>
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
    data () {
      return {
        spinShow: false,
        formList: {
          list: [],
        },
        initItem: {},
        curr: {
          title: '',
          picUrl: '',
          url: '',
          description: '',
        },
        show: this.display,
      }
    },
    methods: {
      initList () {
        const hid = this.row.config.hid

        Api.getArticles({
          context: this,
          urlData: [hid],
          stateName: 'spinShow',
        }).then(res => {
          this.formList.list = res
          res.length && (this.curr = res[0])
        })
      },
      async onSave () {
        const valid = await this.$refs.mfrm.validate()
        if (!valid) return
  
        const hid = this.row.config.hid
        const list = this.formList.list.map((v, idx) => {
          v.sequence = idx
          return v
        })

        Api.updateArticles({
          context: this,
          data: { hid, articles: list },
          stateName: 'spinShow',
          options: { emulateJSON: false },
        }).then(res => {
          this.$Message.success('保存成功')
          this.initList()
        })
      },
      onCancel () {
        this.show = false
      },
      addNewMsg () {
        if (this.formList.list.length === 8) {
          return this.$Notice.warning({ desc: '超过数量限制，最多添加8条图文消息' })
        }
        this.formList.list.push({
          title: '',
          picUrl: '',
          url: '',
          description: '',
        })
      },
      async uploadChange (e, itemIdx) {
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
        /* global OssClient */
        this.spinShow = true
        const res = await OssClient.addOssObject(`/hospital/${hosId}/wx_imgs/`, file).catch(e => {
          console.warn(e)
          this.$Message.error('图片上传失败')
        })
        e.target.value = ''
        this.spinShow = false
        this.formList.list[itemIdx].picUrl = OssClient.endpoint + res.name
      },
      delMsg (index) {
        this.formList.list.splice(index, 1)
        this.$Message.success('操作成功，请保存操作')
        // this.$Modal.confirm({
        //   content: '确认删除这条消息吗？',
        //   onOk: () => {
        //     Api.updateArticles({
        //       context: this,
        //       data: { hid, articles: this.formList.list },
        //       stateName: 'spinShow',
        //     }).then(res => {
        //       this.$Message.success('删除成功')
        //     })
        //   },
        // })
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
