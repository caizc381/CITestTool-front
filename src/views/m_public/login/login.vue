<template>
<div class="loginbg">
  <div class="login-box">
    <div class="login-form">
      <div class="head">
        <img :src="imgHomeBg" />
        <div class="title-cn">体检预约管理系统</div>
        <div class="title-en">medical booking management system</div>
      </div>
      <form>
        <el-input class="mb10" v-model="username" name="username" placeholder="用户名"></el-input>
        <el-input type="password" v-model="password" name="password" placeholder="密码" @keyup.enter="submit"></el-input>
        <div class="validate-code" v-show="showVerifyCode">
          <el-input class="validate-code-input" v-model="validationCode" placeholder="请输入验证码"></el-input>
          <img class="validate-code-img" @click="changeVerifyCode" width="110" :src="validationCodePath"/>
        </div>
        <div class="error-msg" v-show="loginError"><i class="iconfont icon-jinjirenqun orange"></i> {{errorMsg}}
          <router-link v-if="showModifyPwd" to="/public/updatepassword">修改密码</router-link>
        </div>
        <div class="login-btn"><button class="el-button el-button--primary el-button--large" type="submit" @click.prevent="login">登 录</button></div>
      </form>
    </div>
  </div>
</div>

</template>

<script type="text/ecmascript-6">
import {
  Input,
  Button,
  Alert
} from 'element-ui'

import { ImgHomeBg } from 'common/img_src'

export default {
  data() {
    return {
      username: '',
      password: '',
      validationCode: '',
      showVerifyCode: false,
      validationCodePath: '/channel/action/validationCode',
      errorMsg: '',
      showModifyPwd: false,
      imgHomeBg: ImgHomeBg
    };
  },

  methods: {
    login() {
      this.username = $('input[name="username"]').val();
      this.password = $('input[name="password"]').val();
      let param = {
        username: this.username,
        password: this.password,
        validationCode: this.validationCode,
        callbackurl: '',
        rememberMe: false
      }
      this.$http.post('login', param).then((response) => {
        this.$router.push({path: '/m/order/manage'});
      }, (res) => {
        if (res.code == 5) {
          this.showVerifyCode = true;
          this.changeVerifyCode();
        }
        if (res.code == 12) {
          this.showModifyPwd = true;
        }
        this.errorMsg = res.text;
      });
    },

    changeVerifyCode() {
      let timestamp = (new Date()).valueOf();
      this.validationCodePath = '/channel/action/validationCode?time=' + timestamp;
    }

  },

  computed: {
    loginError() {
      return this.errorMsg !== '' ? true : false;
    }
  },

  components: {
    'el-input': Input,
    'el-button': Button,
    Alert
  }
};
</script>

<style scoped lang="less">
/* 登录 */
.loginbg {
    background: url("../../../assets/images/home_page.jpg") no-repeat center 0;
    height: 768px;
    text-align: center;
}
.login-box{
  position:relative;
  width: 400px;
  top : -70px;
  margin: 0 auto;
}
.login-form{
  padding-top: 200px;
  form {
    padding: 0px 40px;
  }
}
.login-btn {
  text-align: center;
  button {
    width: 50%;
    border-radius: 30px;
    margin-top: 26px;
  }
}
.head {
  .title-cn {
    margin-top: 10px;
    color: #ddd;
    font-size: 23px;
    letter-spacing: 14px;
    padding-left: 12px;
  }
  .title-en {
    color: #777;
    font-size: 15px;
    letter-spacing: 3px;
    margin-bottom: 50px;
    margin-top: 5px;
  }
}
.error-msg{
  color: #fff;
  font-size: 18px;
  margin-top: 15px;
  & .iconfont {
    font-size: 18px;
  }
}
.validate-code {
  margin-top: 10px;
  text-align: left;
  .validate-code-input {
    width: 50%;
  }
  .validate-code-img {
    float: right;
    border-radius: 4px;
  }
}
</style>
