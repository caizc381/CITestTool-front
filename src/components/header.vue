<template>
  <header>
    <Row>

      <Col :span="17">
        <div class="head-title">
          <Button type="text" @click="handleClick">
            <Icon type="navicon" size="32"></Icon>
          </Button>
          <strong>{{$store.state.m_public.selectMenuName}}</strong>
        </div>
      </Col>

      <Col :span="7">
        <div class="login-info fr">
            <Dropdown trigger="click">
              <div href="javascript:void(0)" class="account-info">
                <span class="account-info-desc">{{accountInfo.name}}<br>
                  <span class="grayfont">{{channel.name}}</span>
                </span>
                <span class="account-info-icon"><Icon type="android-person"></Icon></span>
              </div>
              <DropdownMenu slot="list">
                <DropdownItem @click.native="goUserCenter"><div>个人中心</div></DropdownItem>
                <DropdownItem @click.native="logout"><div>退出</div></DropdownItem>
              </DropdownMenu>
            </Dropdown>
        </div>
      </Col>

    </Row>
  </header>
</template>
<script>
import { mapState } from 'vuex';

export default {
  components: {
  },

  data() {
    return {
    }
  },

  props: {
    shamed: Function,
  },

  beforeMount() {
  },

  computed: {
    // 登录用户信息
    accountInfo() {
      return this.$store.state.m_public.accountInfo || '';
    },

    channel() {
      return this.$store.state.m_public.channel || {};
    },
  },

  methods: {
    handleClick () {
      this.shamed();
    },

    logout () {
      this.$store.dispatch('logout', this.$router);
    },

    goUserCenter () {
      this.$router.push({path: '/m/public/usercenter/updatepassword'});
    }

  }
}
</script>

<style scoped lang="less">
.head-title { line-height: 60px; }
.login-info {
  line-height: 60px;
  padding-right: 20px;
}
.account-info {
  display: inline-block;
  &-desc {
    line-height: 20px;
    display: inline-block;
    vertical-align: middle;
    text-align: right;
    cursor: pointer;
  }
  &-icon {
    display: inline-block;
    padding: 5px;
    width: 40px;
    font-size: 18px;
    background: #eee;
    line-height: 30px;
    border-radius: 50%;
    text-align: center;
  }
}
</style>
