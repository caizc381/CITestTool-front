<template>
  <Layout>
    <div>
      <router-view></router-view>
    </div>
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
    handleSelect(key, keyPath) {
    }
  },

  computed: {
    menuStatus() {
      return this.$store.state.isOpenMenu ? '' : 'hideLeftMenu';
    }
  },
};
</script>

<style lang="less">
.ops-input {
  font-size: 12px;
  input { height: 32px };
}
</style>
