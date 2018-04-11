<template>
  <div style="text-align: center;">
    <img :src="data" />
  </div>
</template>

<script>

export default {
  name: 'template',
  data() {
    return {
      data: [],
    }
  },

  mounted(){
    this.$http.get('/templageImage').then((response) => {
      this.data = response.bodyText;
    }, (res) => {
        this.$Message.error(res.text);
    });
  },

}
</script>

<style scoped>
  img {
    padding:10px;
  }
</style>