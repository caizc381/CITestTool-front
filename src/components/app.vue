<template>
  <div id="app">
      <router-view></router-view>
  </div>
</template>

<script>
export default {

 }
</script>

<style lang="less">
body {
  margin: 0;
  color: #666;
  font-size: 14px!important;
  font-family: 'Helvetica','STHeiti';
}
.page-wrap {
  margin: 10px auto;
  text-align: center;
  min-height:200px;
}
.page {
  text-align: center;
  /* nesting for the need to test postcss */
  code {
    background-color: #f0f0f0;
    padding: 3px 5px;
    border-radius: 2px;
  }
}
</style>
