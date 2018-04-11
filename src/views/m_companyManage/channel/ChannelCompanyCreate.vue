<template>
  <div>
    <div class="header-search">
      <Breadcrumb>
         <BreadcrumbItem href="/companyManage/channelCompany">渠道单位列表</BreadcrumbItem>
         <BreadcrumbItem>新建渠道单位</BreadcrumbItem>
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

      <div class="mt20 pt20" style="width: 50%;padding-left: 19px;">
        <div>
          <label style="font-size: 12px;">选择渠道机构：</label>
          <i-input class="fr" style="width: 200px;" placeholder="简拼或名称搜索渠道机构" icon="search"
          v-model="query.keyword"></i-input>
        </div>

        <div class="mt20" v-bind:style="{'height': height, 'overflow-y': 'auto'}">
          <table class="mt-table mt-table-tc">
            <tr>
              <th>选择</th>
              <th>ID</th>
              <th>渠道名称</th>
            </tr>
            <tr v-for="chn in filterChannel" :key="chn.id">
              <td><input type="radio" :value="chn.id" v-model="organizationId" /></td>
              <td>{{chn.id}}</td>
              <td>{{chn.name}}</td>
            </tr>
          </table>
        </div>

      </div>

    </div>

    <save-footer @on-submit="save"></save-footer>

  </div>
</template>

<script>
import SaveFooter from 'components/SaveFooter'

export default {
  name: 'ChannelCompanyCreate',
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
        query: {
          keyword: '',
        },



        channelCompany: { name: '' },
        organizationId: '',

        channels: [
        ],

        rule: {
            name: [
                { required: true, message: '请填入单位名称', trigger: 'blur' },
                { validator: validateName, trigger: 'blur' }
            ],
        }

      }
  },

  computed: {
      filterChannel() {
        return this.channels.filter(item => { return item.name.indexOf(this.query.keyword) > -1 || item.pinyin.indexOf(this.query.keyword) > -1; });
      },
  },

  mounted() {
    this.height = (window.innerHeight -300) + 'px';

    this.channelList();
  },

  methods: {
    save() {
      if (this.channelCompany.name.trim() == '') {
        this.$Notice.warning({desc: '请填入单位名称'});
        return;
      }
      if(!MyUtil.isValidCompanyName(this.channelCompany.name)){
        this.$Notice.warning({desc: '名称只能是汉字、英文、数字和英文小括号'});
        return;
      }
      if (this.organizationId == '') {
        this.$Notice.warning({desc: '请选择渠道机构'});
        return;
      }
      this.$http.post('/company/channel/addCompany', {companyName: this.channelCompany.name, organizationId: this.organizationId}).then((response) => {
        this.$Notice.success({desc: '保存成功'});
        this.$router.push('/companyManage/channelCompany');
      }, (error) => {
        this.$Notice.error({desc: error.text});
      });
    },

    channelList() {
      this.$http.get('/company/channel/channelList').then((response) => {
        this.channels = response.body;
      });
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
