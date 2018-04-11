<template>
  <div class="pl10">
    <span class="red">导入失败！具体原因如下:</span>
    <div class="pl10 mt10" v-for="(error,index) in errorList">
        <div class="f18 b">{{error.orgName}}</div>
        <div v-for="list in error.errorAttrs">
          <div>{{list.name}},{{list.errorDesc}}</div>
        </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'template',
  data() {
    return {
      errorList: {},
    }
  },

  mounted(){
    this.errorList = JSON.parse(localStorage.errorHospital);
  },

}
</script>

<style scoped>

</style>