<template>
  <div>
    <div class="header-search">
      <Breadcrumb>
         <Breadcrumb-item href="/companyManage/channelCompany">渠道单位列表</Breadcrumb-item>
         <Breadcrumb-item>编辑渠道单位</Breadcrumb-item>
      </Breadcrumb>
    </div>

    <div class="pt20">

      <div style="width: 50%;">
        <Form ref="channelCompany" :model="channelCompany" :rules="rule" :label-width="100">
          <FormItem prop="name" label="单位名称：">
            <Row>
              <i-col span="20">
                <Input v-model="channelCompany.name" placeholder="请输入" />
              </i-col>
              <i-col span="4">
                <label> [M]单位</label>
              </i-col>
            </Row>
          </FormItem>
        </Form>

      </div>

      <div class="pt20" style="padding-left: 19px;">所属渠道：{{channelCompany.organizationName}} （ID: {{channelCompany.organizationId}}）</div>

      <div class="mt20 pt20" style="width: 60%;padding-left: 19px;">
        <div>
          <label>分配客户经理：</label>
        </div>

        <Row>
          <i-col span="12" style="padding-right: 20px;">
            <div class="assign-table">
              <div class="assign-table-head">
                <Icon type="ios-checkmark-outline"></Icon> 已关联客户经理
              </div>
              <div class="assign-table-body">
                <div><Input v-model="searchSelectManager" icon="ios-search" placeholder="请输入姓名搜索..." style="width: 100%" /></div>
                <div class="assign-table-body-table" v-bind:style="{'height': height}">
                  <table class="mt-table mt-table-tc">
                    <tr v-show="companyManagerList.length == 0"><td colspan="2"><Icon type="ios-folder-outline"></Icon> 未关联客户经理</td></tr>
                    <tr v-for="man in filterCompanyManagerList" :key="man.managerId">
                      <td>{{man.managerName}}</td>
                      <td><span class="hoverblue" @click="unbindRelaton(man)">解除关联</span></td>
                    </tr>
                  </table>
                </div>
              </div>
            </div>
          </i-col>

          <i-col span="12">
            <div class="assign-table">
              <div class="assign-table-head">
                所有客户经理
              </div>
              <div class="assign-table-body">
                <div><Input v-model="searchChannelManager" icon="ios-search" placeholder="请输入姓名搜索..." style="width: 100%" /></div>
                <div class="assign-table-body-table" v-bind:style="{'height': height}">
                  <table class="mt-table mt-table-tc">
                    <tr v-show="channelManagerList.length == 0"><td colspan="2"><Icon type="ios-folder-outline"></Icon> 无客户经理</td></tr>
                    <tr v-for="man in filterChannelManagerList" :key="man.managerId">
                      <td>{{man.name}}</td>
                      <td><span class="hoverblue" @click="bindRelaton(man)" v-show="isSelected(man)">关联</span></td>
                    </tr>
                  </table>
                </div>
              </div>
            </div>
          </i-col>
        </Row>

      </div>

    </div>

    <save-footer @on-submit="save"></save-footer>

  </div>
</template>

<script>
import SaveFooter from 'components/SaveFooter'

export default {
  name: 'ChannelCompanyEdit',
  components: {
    'save-footer': SaveFooter,
  },
  data() {
    var validateName = (rule, value, callback) => {
      if (!MyUtil.isValidCompanyName(value)) {
        callback(new Error('名称只能是汉字、英文、数字和英文小括号'));
      } else {
        callback();
      }
    };
      return {
        height: '',
        searchSelectManager: '',
        searchChannelManager: '',

        channelManagerList: [],
        companyManagerList: [],

        channelCompany: {},

        rule: {
            name: [
                { required: true, message: '请填入单位名称', trigger: 'blur' },
                { validator: validateName, trigger: 'blur' }
            ],
        },
      }
  },

  computed: {
    filterChannelManagerList() {
      return this.channelManagerList.filter(item => {
        return item.name && item.name.indexOf(this.searchChannelManager) > -1;
      });
    },

    filterCompanyManagerList() {
      return this.companyManagerList.filter(item => {
        return item.managerName && item.managerName.indexOf(this.searchSelectManager) > -1;
      });
    },
  },

  mounted() {
    this.height = (window.innerHeight - 440) + 'px';

    this.getChannelCompanyById(this.$route.params.channelCompanyId);
  },

  methods: {
    handleChange(newTargetKeys) {
      this.selectedManagers = newTargetKeys;
    },

    save() {
      if (this.channelCompany.name.trim() == '') {
        this.$Notice.warning({desc: '请填入单位名称'});
        return;
      }
      if(!MyUtil.isValidCompanyName(this.channelCompany.name)){
        this.$Notice.warning({desc: '名称只能是汉字、英文、数字和英文小括号'});
        return;
      }

      let managerList = this.companyManagerList.map(item => {
        return {managerId: item.managerId};
      })
      let channelCompany = {
        channelCompany: this.channelCompany,
        companyManagerList: (managerList || [])
      }
      this.$http.post('/company/channel/update', JSON.stringify(channelCompany)).then((response) => {
        this.$Notice.success({desc: '保存成功'});
        this.$router.push('/companyManage/channelCompany');
      }, (error) => {
        this.$Notice.error({desc: error.text});
      });
    },

    getChannelCompanyById(id) {
      this.$http.get('/company/channel/companyInfo?companyId=' + id).then((response) => {
        this.channelCompany = response.body.channelCompany;
        this.channelManagerList = this.parseAssignManager(response.body.channelManagerList || []);
        this.companyManagerList = response.body.companyManagerList;
      });
    },

    parseAssignManager(manageList) {
      // 转化一下数据结构，方便之后操作
      manageList = manageList.map(item => {
        item.managerId = item.id;
        item.managerName = item.name;
        return item;
      })
      return manageList;
    },

    bindRelaton(mana) {
      mana.managerId = mana.id;
      mana.managerName = mana.name;
      this.companyManagerList.unshift(mana);
    },

    unbindRelaton(mana) {
      this.companyManagerList = this.companyManagerList.filter(item => {
        return item.managerId != mana.managerId;
      })
    },

    isSelected(mana) {
      return !this.companyManagerList.some(item => {
        return item.managerId == mana.id;
      })
    },

  }
};
</script>

<style scoped lang="less">
.pt20 {
  padding-top: 20px;
}
.mt20 {
  margin-top: 20px;
}

.breadcrumb {
  padding: 10px 0px;
  border-bottom: 1px solid #eee;
}
</style>
