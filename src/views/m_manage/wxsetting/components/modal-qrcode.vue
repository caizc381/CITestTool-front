  <template>
  <Modal v-model="show" title="设置推广二维码" width="660">
    <div class="ovh">
      <div class="modal-qrcode__item-frm bdr fl">
        <Form label-position="right" ref="autoreplayFrm" 
        :rules="ruleValidate"
        :model="curr" class="p15">
          <FormItem prop="title">
            <Input placeholder="客户经理登录名" v-model.trim="curr.newSceneStr"></Input>
          </FormItem>
        </Form>
        <div class="tc">
          <Button type="primary" @click.native="createQrcode">生成二维码</Button>
        </div>
      </div>

      <div class="fl" v-for="item in list" :key="item.id">
        <div class="modal-qrcode__item bdr">
          <img :src="`https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=${item.ticket}`" height="148" class="pct100"></img>
          <Button type="warning" size="small" class="modal-qrcode__item-del" @click.native="del(item.hid, item.sceneStr)">删 除</Button>
        </div>
        <div class="modal-qrcode__item-name tc">{{item.account.name}} <a target="_bank" :href="`https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=${item.ticket}`">查看二维码</a></div>
      </div>
    </div>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </Modal>
  </template>
  
  <script>
  import Api from '../../api'

  // let mockData = {"qrcodes":[{"id":89,"hospitalId":51,"hid":"5e4e242dd8bd4490be29823763e65b3d","sceneStr":"WXQ,action_spread,spread_280273","ticket":"gQGe8TwAAAAAAAAAAS5odHRwOi8vd2VpeGluLnFxLmNvbS9xLzAybGdYOTl6YlZlYTAxMDAwME0wN3IAAgQJkb1YAwQAAAAA","codeAction":1},{"id":109,"hospitalId":51,"hid":"5e4e242dd8bd4490be29823763e65b3d","sceneStr":"WXQ,action_spread,spread_417663","ticket":"gQFz8TwAAAAAAAAAAS5odHRwOi8vd2VpeGluLnFxLmNvbS9xLzAyOUxVTzhVYlZlYTAxMDAwMDAwN0YAAgTpDTVZAwQAAAAA","codeAction":1},{"id":517,"hospitalId":51,"hid":"5e4e242dd8bd4490be29823763e65b3d","sceneStr":"WXQ,action_spread,spread_886738","ticket":"gQG-7zwAAAAAAAAAAS5odHRwOi8vd2VpeGluLnFxLmNvbS9xLzAydFRYTzhZYlZlYTAxMDAwMHcwN2YAAgRsYl9aAwQAAAAA","codeAction":1}],"accounts":[{"createTime":1488817747000,"updateTime":1488818372000,"id":280273,"name":"容均","mobile":"13924006981","status":0,"type":5,"system":2},{"createTime":1496630612000,"updateTime":1496630612000,"id":417663,"name":"大官微","mobile":"13924006981","status":0,"type":5,"system":2},{"createTime":1516199913000,"updateTime":1516199913000,"id":886738,"name":"高玉霞","mobile":"18927589258","status":0,"type":5,"system":2}]}

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
        initItem: {},
        toWxService: false,
        curr: {
          newSceneStr: '',
        },
        ruleValidate: {
          newSceneStr: [{ required: true, message: '请输入关键字', trigger: 'blur' }],
        },
        show: this.display,
      }
    },
    methods: {
      // 加载 列表
      initList () {
        this.curr.newSceneStr = ''
        const hid = this.row.config.hid

        Api.getQrcodeList({
          urlData: [hid],
          stateName: 'spinShow',
          context: this,
        }).then(res => {
          const { accounts = [], qrcodes = [] } = res
          let accountId = 0
          qrcodes.forEach(v => {
            accountId = parseInt(/\d+/.exec(v.sceneStr)[0])
            v.account = accounts.filter(a => a.id === accountId)[0] || {}
          })

          this.list = qrcodes
        })
      },

      // 取消
      onCancel () {
        this.show = false
      },

      // 删除
      del (hid, sceneStr) {
        this.$Modal.confirm({
          title: '提示',
          content: '请确认是否删除二维码, 删除二维码后原先建立的关系保持不变',
          onOk: () => {
            Api.delQrcode({
              stateName: 'spinShow',
              context: this,
              urlData: [hid, sceneStr],
            }).then(res => {
              this.$Message.success('二维码删除成功')
              this.initList()
            })
          },
        })
      },

      // 添加
      createQrcode () {
        const hid = this.row.config.hid
        const scene = this.curr.newSceneStr
        if (!scene) return this.$Message.warning('请输入客户经理名称')
        console.log(Api.getAccountByUsername)
        Api.getAccountByUsername({
          stateName: 'spinShow',
          context: this,
          urlData: [hid, scene],
        }).then(res => {
          if (!res.success) return this.$Modal.warning({ title: '警告', content: res.errmsg })

          Api.createQrcode({
            stateName: 'spinShow',
            context: this,
            urlData: [hid, `WXQ,action_spread,spread_${res.accountId}`],
          }).then(() => {
            this.curr.newSceneSt = ''
            this.initList()
          })
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

<style lang="less">
.modal-qrcode__item {
  border-radius: 3px;
  overflow: hidden;
  position: relative;
  width: 150px;
  height: 150px;
  margin: 5px;
  &-del {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 2;
    opacity: 0;
    transition: .25s;
    pointer-events: none;
    transform: translate3d(-50%, -50%, 0);
  }
  &:hover:after {
    opacity: 1;
  }
  &:after {
    content: ' ';
    display: block;
    position: absolute;
    transition: .25s;
    background-color: rgba(0,0,0,.3);
    top: 0;left: 0;bottom: 0;right: 0;
    z-index: 1;
    opacity: 0;
  }
  &:hover{
    cursor: pointer;
    .modal-qrcode__item-del{
      opacity: 1;
      pointer-events: initial;
    }
  }
}

.modal-qrcode__item-frm {
  border-radius: 3px;
  position: relative;
  width: 150px;
  height: 150px;
  margin: 5px;
}
</style>
