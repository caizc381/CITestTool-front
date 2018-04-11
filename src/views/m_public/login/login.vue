<template>
  <div class="loginbg">
    <div class="cover-sky">
      <img class="meteor" src="../../../assets/images/meteor.png" />

      <img class="star1 p1" src="../../../assets/images/cover_star1.png" />
      <img class="star1 p2" src="../../../assets/images/cover_star1.png" />
      <img class="star1 p3" src="../../../assets/images/cover_star1.png" />
      <img class="star1 p4" src="../../../assets/images/cover_star1.png" />
      <img class="star1 p5" src="../../../assets/images/cover_star1.png" />

      <img class="star2 p6" src="../../../assets/images/cover_star2.png" />
      <img class="star2 p7" src="../../../assets/images/cover_star2.png" />
      <img class="star2 p8" src="../../../assets/images/cover_star2.png" />
      <img class="star2 p9" src="../../../assets/images/cover_star2.png" />
      <img class="star2 p10" src="../../../assets/images/cover_star2.png" />
    </div>

    <div class="login-box">
      <div class="login-form">
        <div class="head">
          <img :src="ImgHomeBg" />
          <div class="title-cn">持续集成平台</div>
          <div class="title-en">Continuous integration platform</div>
        </div>
        <form>
          <Input class="mb10" v-model="loginName" placeholder="用户名" />
          <Input class="mb10" type="password" v-model="pwd" placeholder="密码" @keyup.native.enter="login" />

          <div class="error-msg" v-show="loginError">
            <i class="iconfont icon-jinjirenqun orange"></i> {{errorMsg}}</div>

          <div class="login-btn mt10">
            <Button type="primary" size="large" @click.prevent="login">登录</Button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ImgHomeBg } from 'common/img_src'

export default {
  data() {
    return {
      loginName: '',
      pwd: '',
      errorMsg: '',
      ImgHomeBg: ImgHomeBg
    }
  },

  methods: {
    login() {
      let param = {
        loginName: this.loginName,
        password: this.pwd,
        validationCode: 1111,
        rememberMe: false,
        rememberMeFive: false
      }
      this.$http.post('/user/login', param).then(
        response => {
          localStorage.loginName = response.body.loginName
          localStorage.CurrentUserId = response.body.id
          localStorage.employeeName = response.body.employeeName

          this.getPermissions()
        },
        res => {
          this.errorMsg = res.text
        }
      )
    },

    //获取权限
    getPermissions() {
      this.$http.get('/user/getUserPermissions').then(
        response => {
          localStorage.permissions = response.body

          this.$router.push('/companyManage/channelCompany')
        },
        () => {
          this.$message({
            message: res.text,
            type: 'warning'
          })
        }
      )
    }
  },

  computed: {
    loginError() {
      return this.errorMsg !== '' ? true : false
    },

    checkNull() {
      return this.loginName.length > 0 && this.pwd.length > 0
      // return true;
    }
  }
}
</script>

<style scoped lang="less">
/* 登录 */
.loginbg {
  background: url('http://mytijian-img.oss-cn-hangzhou.aliyuncs.com/ops/cover.png')
    no-repeat center 0;
  height: 1080px;
  text-align: center;
}
.login-box {
  position: relative;
  width: 320px;
  top: -70px;
  margin: 0 auto;
}
.login-form {
  padding-top: 200px;
}
.login-btn {
  text-align: center;
  button {
    width: 50%;
    border-radius: 30px;
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
.error-msg {
  color: #fff;
  font-size: 18px;
  margin-top: 15px;
  margin-bottom: 26px;
  & .iconfont {
    font-size: 18px;
  }
}

// 夜空动画
.cover-sky {
  position: absolute;
  width: 100%;
  height: 100%;
  .animate() {
    animation: myfirst 1s;
    -webkit-animation: myfirst 1s; /* Safari 与 Chrome */
    animation-iteration-count: infinite;
    animation-direction: alternate;
  }
  .animate1() {
    animation: myfirst1 1s;
    -webkit-animation: myfirst1 1s; /* Safari 与 Chrome */
    animation-iteration-count: infinite;
    animation-direction: alternate;
  }
  .animate2() {
    animation: myfirst2 5s;
    -webkit-animation: myfirst2 5s; /* Safari 与 Chrome */
    animation-iteration-count: infinite;
  }
  .meteor {
    position: absolute;
    width: 100px;
    .animate2();
  }
  .star1,
  .star2 {
    position: absolute;
  }
  .p1 {
    top: 15%;
    left: 20%;
  }
  .p2 {
    top: 40%;
    left: 30%;
    width: 50px;
    height: 50px;
  }
  .p3 {
    top: 20%;
    left: 80%;
    width: 50px;
    height: 50px;
  }
  .p4 {
    top: 25%;
    left: 55%;
    width: 40px;
    height: 40px;
    .animate();
  }
  .p5 {
    top: 30%;
    left: 60%;
    width: 80px;
    height: 80px;
  }

  .p6 {
    top: 10%;
    left: 30%;
  }
  .p7 {
    top: 30%;
    left: 60%;
  }
  .p8 {
    top: 35%;
    left: 70%;
  }
  .p9 {
    top: 25%;
    left: 40%;
  }
  .p10 {
    top: 30%;
    left: 10%;
    .animate1();
  }
}
@keyframes myfirst {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@-webkit-keyframes myfirst {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes myfirst1 {
  from {
    width: 38px;
  }
  to {
    width: 48px;
  }
}
@-webkit-keyframes myfirst1 {
  from {
    width: 38px;
  }
  to {
    width: 48px;
  }
}

@keyframes myfirst2 {
  from {
    top: 0%;
    left: 0%;
  }
  to {
    top: 80%;
    left: 90%;
  }
}
@-webkit-keyframes myfirst2 {
  from {
    top: 0%;
    left: 0%;
  }
  to {
    top: 80%;
    left: 90%;
  }
}
</style>
