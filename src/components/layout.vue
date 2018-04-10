<template>
  <div class="layout" :class="{'layout-hide-text': spanLeft < 5}">
    <Row type="flex">
      <Col :span="spanLeft" class="layout-menu-left">
        <Menu ref="left_menu"
        :active-name="activeMenu.name"
        theme="dark"
        width="auto"
        :open-names="openNames"
        :update-opened="changeOpens"
        :accordion="true">
          <div class="layout-logo-left">
            <img :src="imgHomeBg" />
          </div>
          <div v-for="menu in menus">
            <Submenu v-if="menu.type == 'submenu'" :name="menu.name" >
              <template slot="title">
                <Icon :type="menu.icon" :size="iconSize"></Icon>
                <span class="layout-text">{{menu.text}}</span>
              </template>
              <MenuItem v-for="child in menu.children" :name="child.name" @click.native="toUrl(child.url, child.text)">
                <!-- <Icon :type="child.icon" :size="iconSize"></Icon> -->
                <span>{{child.text}}</span>
              </MenuItem>
            </Submenu>
            <MenuItem v-else :name="menu.name" @click.native="toUrl(menu.url, menu.text)">
              <Icon :type="menu.icon" :size="iconSize"></Icon>
              <span class="layout-text">{{menu.text}}</span>
            </MenuItem>
          </div>
        </Menu>
      </Col>
      <Col :span="spanRight">
        <div class="layout-header">
          <my-header :shamed="toggleClick"></my-header>
        </div>
        <!-- <div class="layout-breadcrumb">
          <Breadcrumb>
            <BreadcrumbItem href="#">Index</BreadcrumbItem>
            <BreadcrumbItem href="#">Apps</BreadcrumbItem>
            <BreadcrumbItem>App</BreadcrumbItem>
          </Breadcrumb>
        </div> -->
        <div class="layout-content" v-bind:style="{'min-height': height}">
          <div class="layout-content-main">
            <router-view></router-view>
          </div>
        </div>
        <!-- <div class="layout-copy">
          2011-2016 &copy; TalkingData
        </div> -->
      </Col>
    </Row>
  </div>
</template>
<script>
import Header from 'components/header'
import { ImgHomeBg } from 'common/img_src'

  export default {
    data () {
      return {
        height: '',
        spanLeft: 5,
        spanRight: 19,
        imgHomeBg: ImgHomeBg,

        openNames: [],
        menus: [
          {
            type: 'submenu',
            name: 'cardmanage',
            text: '体检卡管理',
            icon: 'images',
            children: [
              {name: 'entitycard', text: '实体卡管理', url: '/m/entitycard'}
            ]
          },
          {name: 'ordermanage', text: '订单管理', url: '/m/order/manage', icon: 'android-clipboard'},
          {
            type: 'submenu',
            name: 'usercenter',
            text: '个人中心',
            icon: 'person',
            children: [
              {name: 'updatepassword', text: '修改密码', url: '/m/public/usercenter/updatepassword'}
            ]
          }
        ]
      }
    },

    components: {
      'my-header': Header
    },

    computed: {
      iconSize () {
        return this.spanLeft === 5 ? 14 : 24;
      },

      activeMenu () {
        let path = this.$route.path || ''
        let activeMenu = {}
        let openNames = []
        this.menus.forEach(item => {
          if (item.type == 'submenu') {
            item.children.forEach(chil => {
              if (chil.url == path) {
                activeMenu = chil
                openNames.push(item.name)
              }
            })
          } else {
            if (item.url == path) {
              activeMenu = item
            }
          }
        })
        this.openNames = openNames
        this.changeOpens()
        this.$store.commit('CHOOSE_MODULE', activeMenu.text);
        return activeMenu
      }
    },

    watch: {
      $route(to, from) {
        let openNames = []
        this.menus.forEach(item => {
          if (item.type == 'submenu') {
            item.children.forEach(chil => {
              if (chil.url == to.path) {
                openNames.push(item.name)
              }
            })
          }
        })
        this.openNames = openNames
        this.changeOpens()
      }
    },

    mounted () {
      this.height = (window.innerHeight - 100) + 'px'
      if (this.activeMenu.name) {
        this.$store.commit('CHOOSE_MODULE', this.activeMenu.text);
      }
    },

    methods: {
      changeOpens () {
        this.$nextTick(() => { this.$refs['left_menu'].updateOpened();});
      },

      toUrl (path, name) {
        this.$router.push({path: path})
        this.$store.commit('CHOOSE_MODULE', name);
      },

      toggleClick () {
        if (this.spanLeft === 5) {
          this.spanLeft = 2;
          this.spanRight = 22;
        } else {
          this.spanLeft = 5;
          this.spanRight = 19;
        }
      }
    }
  }
</script>
<style scoped>
  .layout{
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
  }
  .layout-breadcrumb{
    padding: 10px 15px 0;
  }
  .layout-content{
    min-height: 200px;
    margin-top: 1px;
    overflow: hidden;
    background: #fff;
    border-radius: 4px;
  }
  .layout-content-main{
    /*padding: 10px;*/
  }
  .layout-copy{
    text-align: center;
    padding: 10px 0 20px;
    color: #9ea7b4;
  }
  .layout-menu-left{
    background: #464c5b;
  }
  .layout-header{
    height: 60px;
    background: #fff;
    box-shadow: 0 1px 1px rgba(0,0,0,.1);
  }
  .layout-logo-left{
    width: 90%;
    height: 30px;
    background: #5b6270;
    border-radius: 3px;
    margin: 15px auto;
    padding: 5px 20px 0px 10px;
    text-align: center;
    img {
      width: 25px;
      height: 25px;
    }
  }
  .layout-ceiling-main a{
    color: #9ba7b5;
  }
  .layout-hide-text .layout-text{
    display: none;
  }
  .ivu-col{
    transition: width .2s ease-in-out;
  }
</style>
