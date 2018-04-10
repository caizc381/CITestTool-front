<template>
<div class="main">
  <my-header></my-header>
  <router-view></router-view>

  <my-footer></my-footer>

</div>
</template>

<script type="text/ecmascript-6">
import Header from 'components/header'
import Footer from 'components/footer'

export default {
  components: {
    'my-header': Header,
    'my-footer': Footer
  },

  data() {
    return {
    };
  },

  methods: {
  },

  computed: {
  }
};
</script>

<style scoped lang="less">
</style>
