<template>
  <Layout>
    <router-view></router-view>
  </Layout>
</template>

<script>
import Layout from 'components/Layout'
export default {
  components: {
    'Layout': Layout,
  },

  data() {
    return {
       height:''
    };
  },

  methods: {
    handleSelect(key, keyPath) {
    }
  },

  computed: {
    menuStatus() {
      return this.$store.state.isOpenMenu ? '' : 'hideLeftMenu';
    }
  },

  mounted(){
    this.height=(window.innerHeight -60)+"px";
  }
};
</script>

<style lang="less">
</style>
