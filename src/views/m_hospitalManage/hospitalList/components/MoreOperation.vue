<template>
  <div>
    <div class="dlb">
      <Dropdown trigger="click">
          <a style="color:#20a0ff" href="javascript:void(0)">
              更多
              <Icon type="arrow-down-b"></Icon>
          </a>
          <DropdownMenu slot="list">
              <DropdownItem v-permission="'hospitalManage:list:resetPassword'" @click.native="showPassword = true;">重置密码</DropdownItem>
              <DropdownItem v-permission="'hospitalManage:list:examitemJob'" @click.native="updateItemJob(hospital.id);">执行单项同步</DropdownItem>
              <DropdownItem v-permission="'hospitalManage:list:showInList'" @click.native="showPlatform = true;">
                {{hospital.showInList ? '关闭':'开启'}}平台显示
              </DropdownItem>
              <DropdownItem v-permission="'hospitalManage:list:openSyncCompany'" v-if="hospital.settings.exportWithXls == 0 && !hospital.settings.openSyncCompany" @click.native="showCompany = true;">开启单位同步</DropdownItem>
              <DropdownItem v-permission="'hospitalManage:list:changeJoint'" @click.native="showDocking = true;">
                切换为{{hospital.settings.exportWithXls ? '深对接':'浅对接'}}
              </DropdownItem>
              <DropdownItem v-permission="'hospitalManage:list:initialization'" @click.native="toInitList">体检中心初始化</DropdownItem>
              <DropdownItem v-permission="'hospitalManage:list:openSettlement'" @click.native="handleShowSettlementOpen">
                {{hospital.settings.settlementOpen ? '停用':'启用'}}结算系统
              </DropdownItem>
          </DropdownMenu>
      </Dropdown>
    </div>

    <Modal v-model="showPassword">
      <p slot="header"><span>提示</span></p>
      <div style="font-size:14px;">
        <p class="mt10">您确定要重置当前体检中心管理员CRM账号密码？</p>
        <p class="mt10">体检中心：{{hospital.name}}</p>
        <p class="mt10">默认密码：11111111a</p>
      </div>
      <div slot="footer">
        <Button type="text" @click="showPassword = false">取消</Button>
        <Button type="primary"  @click="ResetPassword(hospital.id)">重置密码</Button>
      </div>
    </Modal>

    <Modal v-model="showItem">
      <p slot="header"><span>单项同步</span></p>
      <div style="font-size:14px;">
        {{executeState == 1 ? '正在执行任务,请稍后...':(executeState == 2 ? '确定要执行单项任务吗？':'执行失败,可再次点击执行任务')}}
      </div>
      <div slot="footer">
        <Button type="text" @click="showItem=false">取消</Button>
        <Button type="primary" :disabled="executeState == 1"  @click="executeItemJob(hospital.id)">执行任务</Button>
      </div>
    </Modal>

    <Modal v-model="showPlatform">
      <p slot="header"><span>提示</span></p>
      <div style="font-size:14px;">
        <p v-if="hospital.showInList">
          关闭平台显示后，该体检中心将不在渠道商平台展示，渠道无法为其导入订单，请再次确认是否需要关闭平台显示？
        </p>
        <p v-if="!hospital.showInList">
          开启平台显示后，该体检中心将在渠道商平台展示，渠道可为其导入订单，请确保该体检中心导流顺畅再开启
        </p>
      </div>
      <div slot="footer">
        <Button type="text" @click="showPlatform = false">取消</Button>
        <Button type="primary" @click="executePlatform(hospital.id,hospital.showInList)">确定</Button>
      </div>
    </Modal>

    <Modal v-model="showCompany">
      <p slot="header"><span>提示</span></p>
      <div style="font-size:14px;">
        <p>
          开启前需要确认该体检中心的对接程序已经支持单位同步功能，是否确认开启？
        </p>
      </div>
      <div slot="footer">
        <Button type="text" @click="showCompany = false">取消</Button>
        <Button type="primary" @click="synchroCompany(hospital.id)">确定</Button>
      </div>
    </Modal>

    <Modal v-model="showDocking">
      <p slot="header"><span>提示</span></p>
      <div style="font-size:14px;">
        <p v-if="!hospital.settings.exportWithXls">
          您确定要将该体检中心切换为浅对接？
        </p>
        <p v-if="hospital.settings.exportWithXls">
          请在体检中心的对接程序已经完成后做此操作，确定将该体检中心切换为深对接？
        </p>
      </div>
      <div slot="footer">
        <Button type="text" @click="showDocking = false">取消</Button>
        <Button type="primary" @click="switchDockingWay(hospital.id, hospital.settings.exportWithXls)">确定</Button>
      </div>
    </Modal>

    <Modal v-model="showSwitchSettlement">
      <p slot="header"><span>提示</span></p>
      <div v-if="!hospital.settings.settlementOpen">
        <div class="pt10 pb10">注：该时间点之后的订单会纳入新的结算系统！</div>
        结算起始时间：<DatePicker type="date" v-model="settlementTime" :clearable="false" placeholder="选择日期" style="width: 200px"></DatePicker>
      </div>
      <div v-else>
        <div class="pt10 pb10">注：关闭结算系统后，将采用老的结算方式结算订单，结算完订单后，请立即开启新的结算方式。</div>
      </div>
      <div slot="footer">
        <Button type="text" @click="showSwitchSettlement = false">取消</Button>
        <Button type="primary" @click="switchSettlement(hospital.id, hospital.settings.settlementOpen, settlementTime)">确定</Button>
      </div>
    </Modal>

  </div>
</template>

<script>

export default {
  name: 'moreOperation',
  data() {
    return {

      showPassword: false,  // 重置密码
      showItem: false,      // 执行单项同步
      showPlatform: false,  // 关闭平台显示
      showCompany: false,   // 开启单位同步
      showDocking: false,   // 切换为（深/浅）对接

      settlementTime: '',
      showSwitchSettlement: false,  // 开启结算系统

      executeState: undefined,

    }
  },

  props: {
    hospital: Object
  },

  methods: {
    handleShowSettlementOpen () {
      this.showSwitchSettlement = true;
      this.settlementTime = new Date(this.hospital.settings.settlementTime);
    },

    // 体检中心初始化
    toInitList () {
      this.$Modal.confirm({
        title:'重要提示',
        content: `<div>
          <strong>请确定您已经了解以下内容</strong>
          <br>
          <div>
            1. 若之前有录入内容，初始化后会被覆盖，但是您可以选择需要初始化的内容<br>
            2. 请在单项映射完成后执行初始化操作
          </div>
        </div>`,
        onOk:()=>{
          this.$router.push(`/hospitalManage/list/initializeList?hospitalId=${this.hospital.id}&hospitalName=${this.hospital.name}`)
        }
      });

    },

    //重置密码
    ResetPassword(id){
      this.$http.post('/resetPwd', {hospitalId:id}).then((response) => {
         this.$Message.success('操作成功！')
         this.showPassword = false
         this.$emit('on-success');
       }, (res) => {
         this.$Message.error(res.text);
       });
    },

    //获取单项任务状态
    updateItemJob(id){
      this.showItem = true
      this.$http.post('/updateitemstatus', {hospitalId:id}).then((response) => {
           if(response.body.status == 2){
              this.executeState = 1
           }else if(response.body.status == 1 || response.body.status == 3){
              this.executeState = 2;
              this.$emit('on-success');
           }else{
              this.executeState = 3;
           }
       }, (res) => {
         this.$Message.error(res.text);
      });
    },

    //执行单项任务
    executeItemJob(id){
      this.showItem = false
      this.$http.post('/updateitemjob', {hospitalId:id}).then((response) => {
         //无需操作
       }, (res) => {
         this.$Message.error(res.text);
      });
    },

    //平台显示
    executePlatform(id, showInList){
      showInList = showInList ? 0:1;
      this.$http.post('/showInList', {hospitalId:id, showInList:showInList}).then((response) => {
         this.$Message.success('操作成功！')
         this.showPlatform = false
         this.$emit('on-success');
       }, (res) => {
         this.$Message.error(res.text);
      });
    },

    //单位同步
    synchroCompany(id){
      this.$http.post('/openSyncCompany', {hospitalId:id}).then((response) => {
         this.$Message.success('操作成功！')
         this.showCompany = false
         this.$emit('on-success');
       }, (res) => {
         this.$Message.error(res.text);
      });
    },

    //切换深浅对接
    switchDockingWay(id, exportWithXls){
      exportWithXls = exportWithXls ? false:true;
      this.$http.post('/exportWithXls', {hospitalId:id, exportWithXls:exportWithXls}).then((response) => {
         this.$Message.success('操作成功！')
         this.showDocking = false
         this.$emit('on-success');
       }, (res) => {
         this.$Message.error(res.text);
      });
    },

    switchSettlement(id, settlementOpen, settlementTime) {
      if (!settlementOpen && !settlementTime) {
        this.$Message.error('请设置结算起始时间');
        return;
      }

      let pms = {
        hospitalId: id,
        settlementOpen: !settlementOpen ? 1 : 0,
        settlementTime: settlementTime ? MyUtil.formatDate(new Date(settlementTime), 'yyyy-MM-dd') : ''
      }
      this.$http.post('/settlemantOpen', pms).then((response) => {
         this.$Message.success('操作成功！')
         this.showSwitchSettlement = false
         this.$emit('on-success');
       }, (res) => {
         this.$Message.error(res.text);
      });
    }

  },

  mounted () {
    let d = JSON.parse(JSON.stringify(this.hospital.settings.settlementTime));

    this.settlementTime = new Date(d);
  }
}
</script>

<style lang="less" scoped>
</style>
