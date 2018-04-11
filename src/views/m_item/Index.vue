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
      
    }
  },

  methods: {
  },

  computed: {
    menuStatus() {
      return this.$store.state.isOpenMenu ? '' : 'hideLeftMenu';
    }
  },

}
</script>

<style lang="less">
</style>
