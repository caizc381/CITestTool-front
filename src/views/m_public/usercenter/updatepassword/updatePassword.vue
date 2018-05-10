<template>
<div>

  <div class="update-pwd">
    <el-alert class="mb10"
      v-show="errorMsg"
      :title="errorMsg"
      type="error"
      show-icon>
    </el-alert>

    <el-form ref="form" :rules="rules" :model="form" label-width="120px">
      <el-form-item label="当前密码" prop="oldPwd">
        <el-input type="password" v-model="form.oldPwd"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPwd">
        <el-input type="password" v-model="form.newPwd"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="newPwd2">
        <el-input type="password" v-model="form.newPwd2"></el-input>
      </el-form-item>
      <el-form-item>
        <i-button class="mr10" type="primary" @click="submitForm('form')">确定修改</i-button>
        <i-button @click="resetForm('form')">重置</i-button>
      </el-form-item>
    </el-form>

  </div>
</div>
</template>

<script type="text/ecmascript-6">
import Footer from 'components/footer'

export default {
  data() {
    var validatePwd = (rule, value, callback) => {
      if (!myUtil.isPassword(value)) {
        callback(new Error('密码必须8位以上的英文 + 数字!'));
      } else {
        callback();
      }
    };
    var validateNewPwd2 = (rule, value, callback) => {
      if (value !== this.form.newPwd) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      errorMsg: '',

      form: {
        oldPwd: '',
        newPwd: '',
        newPwd2: ''
      },
      rules: {
         oldPwd: [
           { required: true, message: '请输入当前密码', trigger: 'blur' },
           { max: 100, message: '长度必须小于 100 个字符', trigger: 'blur' }
         ],
         newPwd: [
           { required: true, message: '请输入新密码', trigger: 'blur' },
           { validator: validatePwd, trigger: 'blur' }
         ],
         newPwd2: [
           { required: true, message: '请再次输入新密码', trigger: 'blur' },
           { validator: validateNewPwd2, trigger: 'blur' }
         ]
       }
    }

  },

  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.save();
        } else {
          return false;
        }
      });
    },

    save() {
      this.errorMsg = '';

      this.$http.post('account/updatePwd', {oldPwd: this.form.oldPwd, newPwd: this.form.newPwd}).then((response) => {
        this.$router.push({path: '/m/order/manage'});
      }, (res) => {
        this.errorMsg = res.text;
      });
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.errorMsg = '';
    }
  },

  computed: {
  },

  components: {
    'my-footer': Footer
  }
};
</script>

<style scoped lang="less">
.update-pwd {
  padding: 30px;
  width: 500px;
}
</style>
