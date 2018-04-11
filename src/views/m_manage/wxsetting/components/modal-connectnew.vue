  <template>
    <Modal v-model="show" width="660" title="微信授权" footer-hide>
    <Steps :current="step">
      <Step title="微信授权"></Step>
      <Step title="公众号测试"></Step>
    </Steps>

    <div class="mt20">
      <!-- Step1 -->
      <div v-show="step===0" class="f14">
        <!-- <div><span class="dib b mr10">体检中心:</span>{{hosName}}</div> -->
        <div class="mb15 mt15">
          <div class="b mb10">注意事项</div>
          <div v-show="options.type === 'new'">
            <div>一、进入OPS平台的时候，使用 <span class="c-rd">www.mytijian.com/ops/</span> 域名，不要偷懒少写 www 会导致授权失败</div>
            <div>二、公众号未授权其他体检中心或其他第三方应用</div>
            <div>三、服务号，并且已完成认证、认证未过期</div>
            <div>四、我们希望公能拥有公众号的管理员权限，但是认证时，使用体检中心作为认证单位</div>
            <div>五、如果无法获得公众号管理员权限，至少获得一个长期运营者资格</div>
          </div>

          <div v-show="options.type === 'refresh'">
            <div>一、公众号refreshToken刷新是指：当以第三方平台授权方式接入平台的公众号出现异常情况无法使用的时候，如长期停用导致token丢失且无法恢复、或者管理员曾经尝试使用同一个公众号对其他体检中心进行接入等导致的公众号无法使用问题</div>
            <div>二、公众号管理员可通过刷新操作重新启用公众号</div>
          </div>

           <div v-show="options.type === 'move'">
             <div>一、请确认迁移授权时使用的公众号于原先对接的公众号一致</div>
             <div>二、请确认迁移授权时使用的公众号于原先对接的公众号一致</div>
             <div>三、请确认迁移授权时使用的公众号于原先对接的公众号一致</div>
             <div>四、请确认上面三点</div>
             <div>五、请确认上面四点</div>
             <div>六、请确认上面五点</div>
             <div>七、如果前面六点出现问题后续处理很麻烦，请仔细一点。</div>
          </div>
        </div>

        <div v-show="!authing">
          <div class="mb15">如以上信息确认无误，请点击下方的 <span class="b">授权按钮</span>，并在打开的新窗口中使用管理员、或者运营者微信号扫描二维码<br/></div>
          <div>
            <Checkbox v-model="agrea">
              <span>
                我已经仔细阅读上文，确定为 <span class="b c-rd">{{hosName}}</span>
                <span v-show="options.type === 'new'">接入公众号，并确保使用的是已认证的服务号</span>
                <span v-show="options.type === 'refresh'">刷新公众号，并保证本次刷新使用的公众号与接入时相同</span>
                <span v-show="options.type === 'move'">进行接入迁移</span>
              </span>
            </Checkbox>
          </div>
          <div class="tc pt25">
            <Button type="primary" @click.native="toAuth" :disabled="!agrea">点击授权</Button>
          </div>
        </div>

        <div class="tc pt25">
          <Button type="primary" @click.native="toNext" v-show="authing">我已完成授 下一步</Button>
        </div>
      </div>

      <!-- Step2 -->
      <div v-show="step===1" class="f14">
        <Alert show-icon>请使用任意微信号(无论是否管理员)扫描二维码，或向公众号发送文字消息 'bug'，测试是否接入成功（此步骤可跳过直接点击完成）</Alert>
        <div class="mb15">
          一、原先未关注公众号的，扫描二维码可关注公众号，并且收到一条文字消息，提示配置成功。<br />
          二、原先已经关注公众号的，扫描二维码会接收到一条文字消息，提示配置成功。<br />
          三、原先已关注公众号的，发送bug，会收到文字消息，提示配置成功。<br />
        </div>
        <div class="tc">
          <img class="qrcode-placeholder-box bdr" :style="{'background-image': `url(${qrcodeUrl})`}" />
          <div class="mt10">二维码有效期为5分钟，请及时扫描</div>
        </div>
        <div class="tc mt20">
          <Button type="primary" @click.native="show = false">完成</Button>
        </div>
      </div>

      <Spin size="large" fix v-if="spinShow"></Spin>
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
      options: {
        type: Object,
        default: { type: 'new' },
      },
    },
    data () {
      return {
        agrea: false,
        authing: false,
        spinShow: false,
        qrcodeUrl: '',
        step: 0,
        authUrl: '',
        show: this.display,
        hosName: '',
      }
    },
    methods: {
      initList () {
        this.step = 0
        this.agrea = false
        this.authing = false
        this.hosName = this.row.name
        this.hospitalId = this.row.id
        this.initUrl(this.row.id)
      },
      initUrl (hospitalId) {
        const isMove = this.options.type === 'move'

        Api[isMove ? 'getWxAuthUrlByMove' : 'getWxAuthUrl']({
          context: this,
          data: { hospitalId },
          stateName: 'spinShow',
          options: { emulateJSON: false },
        }).then(res => {
          this.authUrl = isMove ? res.transferAuthUrl : res.url
        })
      },
      toAuth () {
        window.open(this.authUrl)
        this.authing = true
      },
      initQrcode () {
        const hospitalId = this.hospitalId
        Api.scanCompletion({
          data: { hospitalId },
          context: this,
          stateName: 'spinShow',
          options: { emulateJSON: false },
        }).then(res => {
          this.qrcodeUrl = 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' + res.ticket
        })
      },
      toNext () {
        this.step = 1
        this.initQrcode()
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

