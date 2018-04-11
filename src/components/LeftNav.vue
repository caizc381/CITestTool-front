<template>
<div>
  <div class="toggle-menu" @click="toggleMenu()" v-bind:style="{'top':top,'left':left}">
    <i style="font-size:16px;margin-left:2px;" :class="togleMenuIcon"></i>
  </div>
  <div class="leftNav" v-bind:style="{'height':height}">

    <Menu theme="dark" :active-name="activeMenu" :open-names="openeds" accordion width="190px" @on-select="routeJump" ref="mtmenu">
      <Submenu v-for="(parent, index) in menuList" :name="parent.menuUrl" :key="index">
        <template slot="title">
          <Icon style="margin-right: 8px;" :type="menuIcons[index%11]"></Icon>
          <span class="menu-text">{{parent.menuName}}</span>
        </template>
        <MenuItem class="child-menu" v-for="(child, idx) in parent.list" :name="parent.menuUrl + child.menuUrl" :key="idx">
           <Icon class="child-menu-icon" style="margin-right: 8px;" :type="menuIcons[idx%11]"></Icon>
           <span class="menu-text  pl5">{{child.menuName}}</span>
        </MenuItem>
      </Submenu>
    </Menu>
  </div>
</div>
</template>

<script>
export default {
  data(){
    return{
      height: '',
      top: '',
      openeds: [],
      activeMenu: '',
      menuIcons: [
        'social-windows',
        'pie-graph',
        'ios-analytics',
        'monitor',
        'podium',
        'planet',
        'cube',
        'ios-pulse-strong',
        'ios-speedometer',
        'ios-flower',
        'social-instagram-outline',
      ]
    }
  },

  computed: {
    left() {
      return this.$store.state.isOpenMenu ? '190px' : '30px';
    },

    togleMenuIcon() {
      return this.$store.state.isOpenMenu ? 'ivu-icon ivu-icon-ios-arrow-back' : 'ivu-icon ivu-icon-ios-arrow-forward';
    },

    menuList() {
      return this.$store.state.leftMenus;
    },
  },

  mounted(){
    this.height = window.innerHeight + 'px';
    this.top = window.innerHeight * 0.5 + 'px';

    //根据路由计算openeds、activeMenu
    this.openeds = this.$route.matched.length >= 2 ? [this.$route.matched[0].path] : []
    this.activeMenu = this.$route.matched.length >= 2 ? this.filterActiveMenu(this.$route.matched[1].path) : ''

    this.$nextTick(()=>{
       this.$refs.mtmenu.updateOpened()
       this.$refs.mtmenu.updateActiveName()
     })

  },

  methods: {

    toggleMenu() {
      this.$store.dispatch('toggle_menu');
    },

    updateCurMenu(route) {
      var route = route || this.$route;
      this.openeds = [];
      this.menuList.forEach((item) => {
        if(route.path.toLowerCase().includes(item.menuUrl.toLowerCase())) {
          this.openeds.push(item.menuUrl);
        }
      });
    },

    routeJump(name){
      this.$router.push(name);
    },

    filterActiveMenu(menuList){
      return menuList.split('/')[0]+'/'+menuList.split('/')[1]+'/'+menuList.split('/')[2];
    }

  },

  updated(){
    this.$nextTick(()=>{
      this.$refs.mtmenu.updateOpened()
      this.$refs.mtmenu.updateActiveName()
    })
  },

  watch:{
    menuList() {
      this.$nextTick(()=>{
        this.$refs.mtmenu.updateOpened()
        this.$refs.mtmenu.updateActiveName()
      })
    },

    $route (val, oldVal) {
      this.activeMenu = val.matched.length >= 2 ? this.filterActiveMenu(val.matched[1].path) : ''
      this.$nextTick(()=>{
        this.$refs.mtmenu.updateOpened()
        this.$refs.mtmenu.updateActiveName()
      })
    }
  }
}
</script>

<style lang="less">
.leftNav
{
  position: fixed;
  padding-top: 50px;
  top: 0;
  left: 0;
  width: 190px;
  background-color: #1f2d3d;
  z-index: 10;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 0px;
    height: 10px;
  }
  .ivu-menu-opened{
    border-left:2px solid #20a0ff;
    background-color: #1f2d3d;
  }
  .ivu-menu-opened > .ivu-menu{
     background-color: #314058!important;
  }
 .ivu-menu-submenu .ivu-menu-submenu-title{
    background-color: #1f2d3d!important;
    color: #bfcbd9!important;
  }
  .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu .ivu-menu-item-active, .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu .ivu-menu-item-active:hover{
    background: none!important;
    color: #20a0ff;
  }
  .ivu-menu-dark {
      background-color: #1f2d3d !important;
  }
}
</style>
