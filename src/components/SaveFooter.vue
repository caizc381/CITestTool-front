<template>
  <div class="save-footer ml5">
    <i-button type="info" size="large" @click="handleClick">保存</i-button>
  </div>
</template>

<script>
export default {
  computed: {
  },

  methods: {
    handleClick() {
      this.$emit('on-submit');
    }
  }
}
</script>

<style scoped lang="less">
.save-footer {
  width: 100%;
  padding: 10px;
  bottom: 0;
  left: 0;
  z-index: 9999;
  margin-top: 10px;
  border-top: 1px solid #eee;


  background-color: rgba(255,255,255, 0.7);
  button {
    width: 80px;
  }
}
</style>
