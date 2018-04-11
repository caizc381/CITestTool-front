<template>
  <div>
    <div class="header-search">
      <Breadcrumb>
        <BreadcrumbItem to="/hospitalManage/list">体检中心管理</BreadcrumbItem>
        <BreadcrumbItem>初始化体检中心</BreadcrumbItem>
      </Breadcrumb>
    </div>

    <div class="body-content">
      <strong>{{hospitalName}}（ID: {{hospitalId}}）</strong>
      <Alert class="mt10" type="warning">
        注意：<br>
        1. 若之前有录入内容，初始化后会被覆盖，但是您可以选择需要初始化的内容<br>
        2. 请在单项映射完成后执行初始化操作
      </Alert>

      <Card dis-hover class="mb10" :padding="0">
        <p slot="title">请选择需要初始化的内容</p>
        <table class="table bdr0">
          <tr>
            <th>选择</th>
            <th>初始化条目</th>
            <th>描述</th>
            <th>最近执行初始化时间</th>
          </tr>
          <tr v-for="item in taskList" :key="item.id">
            <td :colspan="4" v-if="item.header">{{item.name}}</td>

            <td v-if="!item.header"><mt-checkbox :checked="executeList.indexOf(item.id) > -1" @on-check="handleCheck(item)">&nbsp;</mt-checkbox></td>
            <td v-if="!item.header">{{item.name}}</td>
            <td v-if="!item.header">{{item.description}}</td>
            <td v-if="!item.header">{{item.gmtCreated | date('yyyy-MM-dd hh:mm:ss')}}</td>
          </tr>
        </table>
      </Card>

      <div class="mt20">
        <Button type="text" @click="$router.push('/hospitalManage/list')">取消</Button>
        <Button class="ml20" type="primary" @click="execute">执行初始化</Button>
      </div>

    </div>

    <Modal v-model="showInitializeModal">
      <p slot="header"><span>提示</span></p>
      <div class="tc" v-if="executing"><Span><Icon type="load-c" size="18" class="demo-spin-icon-load"></Icon><div>正在执行初始化任务，请稍候...</div></Span></div>
      <div v-if="!executing"><Alert type="success" class="tc">初始化成功</Alert></div>
      <div slot="footer">
        <Button type="primary" @click="showInitializeModal = false">我知道了</Button>
      </div>
    </Modal>

    <Modal v-model="showConfirmModal" :width="400">
      <p slot="header"><span>提示</span></p>
      <div>当前选项已经执行过初始化任务，若再次执行，将会覆盖已有数据，您确定要继续选择吗？</div>
      <div slot="footer">
        <Button type="text" @click="showConfirmModal = false">取消</Button>
        <Button type="error" @click="addTask">确定</Button>
      </div>
    </Modal>

  </div>
</template>

<script>
export default {
  data() {
    return {
      hospitalId: '',
      hospitalName: '',

      taskList: [],
      executeList: [],

      executing: true,
      showInitializeModal: false,
      showConfirmModal: false,
      selectTask: ''
    }
  },

  mounted(){
    this.hospitalId =  this.$route.query.hospitalId || '';
    this.hospitalName =  this.$route.query.hospitalName || '';

    this.getTaskList();

  },

  methods: {
    handleCheck (item) {
      this.selectTask = item;
      if (this.executeList.indexOf(item.id) > -1) {
        this.executeList = this.executeList.filter(v => v != item.id)
      } else {
        if (item.gmtCreated) {
          this.showConfirmModal = true;
        } else {
          this.executeList.push(item.id);
        }
      }
    },

    addTask () {
      this.executeList.push(this.selectTask.id);
      this.showConfirmModal = false;
    },

    getTaskList () {
      this.$http.get('/listHospitalInitialization?hospitalId=' + this.hospitalId).then((response) => {
        let taskGroup = {};
        let taskList = [];

        response.body.forEach(item => {
          if (taskGroup[item.type]) {
            taskGroup[item.type].push(item);
          } else {
            taskGroup[item.type] = [ item ];
          }
        })

        for (let t in taskGroup) {
          const typeEnum = {1: '单项', 2: '套餐', 3: '加项包'};
          taskList.push( {name: typeEnum[t], header: true} );

          let taskListOfType = taskGroup[t];
          taskListOfType.forEach(ite => {
            taskList.push(ite);
          })
        }

        this.taskList = taskList;
        this.executeList = taskList.filter(item => !item.header && !item.gmtCreated).map(it => it.id);
      }, (res) => {
        this.$Message.error(res.text);
      });
    },

    execute () {
      if (this.executeList.length == 0) {
        this.$Message.warning('请先选择要初始化的内容');
        return;
      }

      let taskList = JSON.parse(JSON.stringify(this.taskList));
      this.$Modal.confirm({
        title:'提示',
        content: `确定执行初始化操作吗？`,
        onOk:()=>{
          this.showInitializeModal = true;
          this.executing = true;
          let pms = taskList.filter(item => this.executeList.indexOf(item.id) > -1)
          this.$http.post('/initializeHospitalProject', JSON.stringify(pms)).then(() => {
            this.executing = false;
            this.$Message.success('初始化成功！');
            this.getTaskList()
          }, (res) => {
            this.$Message.error(res.text);
          })
        }
      });

    }
  }
}
</script>

<style lang="less" scoped>
.demo-spin-icon-load {
  animation: ani-demo-spin 1s linear infinite;
}
@keyframes ani-demo-spin {
  from { transform: rotate(0deg);}
  50%  { transform: rotate(180deg);}
  to   { transform: rotate(360deg);}
}
</style>
