<template>
  <div id="app" class="app-main">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  components: {
  },

  mounted() {
    this.mappingRouteToMenu();
  },

  computed: {

  },

  methods: {

    //根据跳转的 route 设置菜单的 选中状态
    mappingRouteToMenu() {
      // let routeTree = this.$route.path.split('/') || [];
      // let moduleName = routeTree[1];
      // let pageName = routeTree[2];
      // this.$store.commit('CHOOSE_MODULE', moduleName);
      // this.$store.commit('CHOOSE_MODULE_CHILD', pageName);
    }

  },

  watch: {
    $route(to, from) {
      // this.mappingRouteToMenu();
    }
  }
}
</script>

<style>
body {
  margin: 0;
}
.app-main{
  width: 100%;
  height: 100%;
}
</style>
