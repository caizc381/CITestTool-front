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
    'Layout': Layout
  },

  mounted () {
    this.$Message.config({
      top: 50,
      duration: 3
    });
  }
}
</script>
