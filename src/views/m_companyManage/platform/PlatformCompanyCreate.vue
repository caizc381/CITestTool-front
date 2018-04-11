<template>
  <div>
    <div class="header-search">
      <Breadcrumb>
         <Breadcrumb-item href="/companyManage/platformCompany">平台单位列表</Breadcrumb-item>
         <Breadcrumb-item>编辑平台单位</Breadcrumb-item>
      </Breadcrumb>
    </div>

    <div class="pt20">
      <div style="width: 50%;">
        <Form ref="platformCompany" :model="platformCompany" :rules="rule" :label-width="100">
          <FormItem prop="name" label="单位名称：">
            <Row>
              <i-col span="20">
                <Input v-model="platformCompany.name" placeholder="请输入" />
              </i-col>
              <i-col span="4">
                <label> [P]单位</label>
              </i-col>
            </Row>
          </FormItem>
          <FormItem>
              <i-button type="info" size="large" @click="save">保存</i-button>
          </FormItem>
        </Form>

      </div>

    </div>

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
        query: {
          keyword: '',
        },

        platformCompany: { name: '' },
        rule: {
            name: [
                { required: true, message: '请填入单位名称', trigger: 'blur' },
                { validator: validateName, trigger: 'blur' }
            ],
        },
      }
  },

  mounted() {
  },

  methods: {
    save() {
      if (this.platformCompany.name.trim() == '') {
        this.$Notice.warning({desc: '请填入单位名称'});
        return;
      }
      if(!MyUtil.isValidCompanyName(this.platformCompany.name)){
        this.$Notice.warning({desc: '名称只能是汉字、英文、数字和英文小括号'});
        return;
      }
      this.$http.post('/company/platform/addCompany', {companyName: this.platformCompany.name}).then((response) => {
        this.$Notice.success({desc: '保存成功'});
        this.$router.push('/companyManage/platformCompany');
      }, (error) => {
        this.$Notice.error({desc: error.text});
      });
    },
  }
};
</script>

<style scoped lang="less">
.form-attr-title {
  display: inline-block;
  width: 80px;
}
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
