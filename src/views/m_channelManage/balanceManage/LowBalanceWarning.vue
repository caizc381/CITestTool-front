<template>
  <div>
    <div class="header-search">
      <Breadcrumb>
         <BreadcrumbItem href="/channelManage/balanceManage">余额管理</BreadcrumbItem>
         <BreadcrumbItem>低额预警</BreadcrumbItem>
      </Breadcrumb>
    </div>

    <div class="body-content" style="width: 700px">
      <Card>
        <p slot="title" style="height: 25px;">低额预警

          <Poptip v-if="disableSwitch" v-permission="'channelManage:balance:alarm'" class="fr" trigger="hover" content="未填写预警金额 和 联系方式，无法打开预警开关">
            <i-switch v-model="switchWarning" @on-change="handleSwitch" :disabled="disableSwitch" >
              <span slot="open">开</span>
              <span slot="close">关</span>
            </i-switch>
          </Poptip>

          <i-switch v-if="!disableSwitch" v-permission="'channelManage:balance:alarm'" class="fr" v-model="switchWarning" @on-change="handleSwitch" :disabled="disableSwitch" >
            <span slot="open">开</span>
            <span slot="close">关</span>
          </i-switch>

        </p>
        <div>
          <Form
           :model="switchForm"
           ref="switchForm"
           :label-width="100"
           class="demo-form-inline">

            <FormItem class="dib" label="渠道商:" style="width: 200px;">
              <span>{{switchForm.hosName}}</span>
            </FormItem>
            <FormItem class="dib" label="预警账号:">
              <span>{{switchForm.loginName}}</span>
              <span class="gray">(账户号)</span>
            </FormItem>

          </Form>
        </div>
      </Card>

      <Card class="mt15">
        <p slot="title">预警配置信息 <a class="fr" v-permission="'channelManage:balance:edit'" @click="handleEdit"><Icon type="edit"></Icon> {{editText}}</a></p>

        <div v-if="!editingForm">
          <Form
           :model="preConfigForm"
           :label-width="100"
           class="demo-form-inline">
            <div class="ml15 mb10">
              <h4>预警金额</h4>
              <div class="gray mt10">当账号余额低于以下设置的数值时，会发通知到通知邮箱</div>
            </div>
            <FormItem class="dib" label="最低金额:">
              <span>{{preConfigForm.deadline | money('￥')}}</span>
            </FormItem>

            <div class="parting-line"></div>

            <div class="ml15 mb10">
              <h4>通知方式</h4>
              <div class="gray mt10">目前可以通过邮件及短信来通知预警信息</div>
            </div>

            <FormItem class="dib" label="邮箱地址:"><div style="width: 200px;">{{preConfigForm.contact1.email}}</div></FormItem>
            <FormItem class="dib" label="手机号:"><div style="width: 200px;">{{preConfigForm.contact1.phone}}</div></FormItem>

            <FormItem class="dib"><div style="width: 200px;">{{preConfigForm.contact2.email}}</div></FormItem>
            <FormItem class="dib"><div style="width: 200px;">{{preConfigForm.contact2.phone}}</div></FormItem>

            <FormItem class="dib"><div style="width: 200px;">{{preConfigForm.contact3.email}}</div></FormItem>
            <FormItem class="dib"><div style="width: 200px;">{{preConfigForm.contact3.phone}}</div></FormItem>

            <FormItem class="dib"><div style="width: 200px;">{{preConfigForm.contact4.email}}</div></FormItem>
            <FormItem class="dib"><div style="width: 200px;">{{preConfigForm.contact4.phone}}</div></FormItem>

            <FormItem class="dib"><div style="width: 200px;">{{preConfigForm.contact5.email}}</div></FormItem>
            <FormItem class="dib"><div style="width: 200px;">{{preConfigForm.contact5.phone}}</div></FormItem>

          </Form>
        </div>

        <div v-show="editingForm">
          <Form
           :model="configForm"
           ref="configForm"
           :label-width="100"
           :rules="rules"
           class="demo-form-inline">
           <div class="ml15 mb10">
             <h4>预警金额</h4>
             <div class="gray mt10">当账号余额低于以下设置的数值时，会发通知到通知邮箱</div>
           </div>
            <FormItem class="dib" label="最低金额:" prop="deadline">
              <Input v-model.number="configForm.deadline" placeholder="输入金额" :maxlength="7"/>
            </FormItem>

            <div class="parting-line"></div>

            <div class="ml15 mb10">
              <h4>通知方式</h4>
              <div class="gray mt10">目前可以通过邮件及短信来通知预警信息</div>
            </div>

            <FormItem class="dib" label="邮箱地址:" prop="contact1.email"><div style="width: 200px;"><Input v-model="configForm.contact1.email" placeholder="输入邮箱" /></div></FormItem>
            <FormItem class="dib" label="手机号:" prop="contact1.phone"><div style="width: 200px;"><Input v-model="configForm.contact1.phone" placeholder="输入手机" /></div></FormItem>

            <FormItem class="dib" prop="contact2.email"><div style="width: 200px;"><Input v-model="configForm.contact2.email" placeholder="输入邮箱" /></div></FormItem>
            <FormItem class="dib" prop="contact2.phone2"><div style="width: 200px;"><Input v-model="configForm.contact2.phone" placeholder="输入手机" /></div></FormItem>

            <FormItem class="dib" prop="contact3.email"><div style="width: 200px;"><Input v-model="configForm.contact3.email" placeholder="输入邮箱" /></div></FormItem>
            <FormItem class="dib" prop="contact3.phone"><div style="width: 200px;"><Input v-model="configForm.contact3.phone" placeholder="输入手机" /></div></FormItem>

            <FormItem class="dib" prop="contact4.email"><div style="width: 200px;"><Input v-model="configForm.contact4.email" placeholder="输入邮箱" /></div></FormItem>
            <FormItem class="dib" prop="contact4.phone"><div style="width: 200px;"><Input v-model="configForm.contact4.phone" placeholder="输入手机" /></div></FormItem>

            <FormItem class="dib" prop="contact5.email"><div style="width: 200px;"><Input v-model="configForm.contact5.email" placeholder="输入邮箱" /></div></FormItem>
            <FormItem class="dib" prop="contact5.phone"><div style="width: 200px;"><Input v-model="configForm.contact5.phone" placeholder="输入手机" /></div></FormItem>

            <FormItem>
                <Button type="primary" @click="save()">保存</Button>
                <Button type="ghost" style="margin-left: 10px" @click="handleEdit">取消</Button>
            </FormItem>

          </Form>
        </div>

      </Card>

    </div>

  </div>
</template>

<script>
export default {
  name: 'lowBalanceWarning',
  data() {
    const validateMobile = (rule, value, callback) => {
      var re = /^(1[0-9]{2})[0-9]{8}$/;
      if (value && !re.test(value)) {
        callback(new Error('请输入正确的手机号'));
      } else {
        callback();
      }
    }

    return {
      editingForm: false,
      hospitalId: this.$route.params.hosId,

      switchForm: {
        hosName: '',
        account: ''
      },
      switchWarning: false,

      preConfigForm: {
        contact1: {},
        contact2: {},
        contact3: {},
        contact4: {},
        contact5: {}
      },

      configForm: {
        contact1: {},
        contact2: {},
        contact3: {},
        contact4: {},
        contact5: {}
      },

      rules: {
        deadline: [
           { required: true, message: '金额不能为空' },
           { type: 'number', message: '金额必须为数字值' }
        ],
        'contact1.email': [{ type: 'email', message: '请输入正确的邮箱'}],
        'contact1.phone': [{ validator: validateMobile, trigger: 'blur' }],

        'contact2.email': [{ type: 'email', message: '请输入正确的邮箱'}],
        'contact2.phone': [{ validator: validateMobile, trigger: 'blur' }],

        'contact3.email': [{ type: 'email', message: '请输入正确的邮箱'}],
        'contact3.phone': [{ validator: validateMobile, trigger: 'blur' }],

        'contact4.email': [{ type: 'email', message: '请输入正确的邮箱'}],
        'contact4.phone': [{ validator: validateMobile, trigger: 'blur' }],

        'contact5.email': [{ type: 'email', message: '请输入正确的邮箱'}],
        'contact5.phone': [{ validator: validateMobile, trigger: 'blur' }],
      },

      hasContact: false,
      hasDeadline: false

    };
  },

  props: {
  },

  methods: {
    handleSwitch () {
      this.saveConfig().then(() => {
        let text = this.switchWarning ? '预警开关打开成功' : '预警开关关闭成功';
        this.$Notice.success({desc: text});
      })
    },

    save () {
      this.$refs['configForm'].validate((valid) => {
        if (valid) {
          this.saveConfig().then(() => {
            this.saveContact();
          })
        }
      })
    },

    saveContact () {
      let params = this.parseParam();
      if (params.contacts.length === 0) {
        this.$Message.warning('请至少填写一个联系方式');
        return;
      }
      this.$http.post('/amount/updateContact', JSON.stringify(params)).then((response) => {
        this.$Notice.success({desc: '保存成功'});
        this.getHosWaringConfig();
        this.editingForm = !this.editingForm;
      }, (res) => {
      });
    },

    saveConfig () {
      let params = {
        orgId: this.hospitalId,
        amount: this.configForm.deadline * 100,
        enable: this.switchWarning ? 1 : 0
      }
      return this.$http.get('/amount/config/update?orgId=' + params.orgId + '&amount=' + params.amount + '&enable=' + params.enable);
    },

    parseParam () {
      let params = {
        orgId: this.hospitalId
      }
      let contacts = [];
      this.pushContact(this.configForm.contact1, contacts);
      this.pushContact(this.configForm.contact2, contacts);
      this.pushContact(this.configForm.contact3, contacts);
      this.pushContact(this.configForm.contact4, contacts);
      this.pushContact(this.configForm.contact5, contacts);
      params.contacts = contacts;
      return params;
    },

    pushContact(cont, list) {
      if (cont.email || cont.phone) {
        list.push(cont);
      }
    },

    handleEdit () {
      this.editingForm = !this.editingForm;
      if (this.editingForm) {
        this.configForm = JSON.parse(JSON.stringify(this.preConfigForm));
        this.configForm.deadline = (this.configForm.deadline || 1000000) / 100;
        this.$refs['configForm'].resetFields();
      }
    },

    getHosWaringConfig () {

      this.$http.get('/amount/config?orgId=' + this.hospitalId).then((response) => {
        this.digest(response.body);
      }, (res) => {
      });
    },

    digest(config) {
      this.switchForm.hosName = config.org.name;
      this.switchForm.loginName = config.loginName;
      this.switchWarning  = (config.rule || {}).enable == 1 ? true : false;

      this.preConfigForm.deadline = (config.rule || {}).threshold;

      let contacts = (config.contacts || []);
      this.preConfigForm.contact1 = contacts[0] ? contacts[0] : {};
      this.preConfigForm.contact2 = contacts[1] ? contacts[1] : {};
      this.preConfigForm.contact3 = contacts[2] ? contacts[2] : {};
      this.preConfigForm.contact4 = contacts[3] ? contacts[3] : {};
      this.preConfigForm.contact5 = contacts[4] ? contacts[4] : {};

      this.hasContact = contacts.length > 0 ? true : false;  // 是否有联系人
      this.hasDeadline = this.preConfigForm.deadline ? true : false;  // 是否有预警金额

      this.configForm = JSON.parse(JSON.stringify(this.preConfigForm));
    }

  },

  computed: {
      editText () {
        return this.editingForm ? '取消设置' : '设置'
      },
      disableSwitch () {
        return (!this.hasContact || !this.hasDeadline)
      },
  },

  mounted () {
    this.getHosWaringConfig();
  }
};
</script>
