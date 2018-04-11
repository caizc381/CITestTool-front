<template>
  <div class="hosManage">
    <Layout>
      <router-view></router-view>
    </Layout>
  </div>
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

  mounted () {
    this.$Message.config({
      top: 50,
      duration: 3
    });
  }
}
</script>

<style lang="less">
.hosManage{
    .ivu-form .ivu-form-item-label {
      text-align: left !important;
      font-size: 14px !important;
      padding-left: 15px !important;
      color: #333 !important;
    }
    .check-table-wrap {
      position: relative;
      .check-page {
        position: absolute;
        top: 13px;
        left: 15px;
      }
    }
 }
</style>
