<template>
  <Row style="width: 420px;">
    <Col :span="24">
      <div class="info-item" v-if="isNotEmpty(this.info.mobile)">手机号：{{this.info.mobile}}</div>
      <div class="info-item" v-if="isNotEmpty(this.info.age)">年龄：{{this.info.age}}</div>
      <div class="info-item" v-if="isNotEmpty(this.info.position)">职级：{{this.info.position}}</div>
      <div class="info-item" v-if="isNotEmpty(this.info.isRetire)">退休：{{this.info.isRetire | accountInfo('retire')}}</div>

      <div class="info-item" v-if="isNotEmpty(this.info.gender)">性别：{{this.info.gender | accountInfo('gender')}}</div>
      <div class="info-item" v-if="isNotEmpty(this.info.marriageStatus)">婚否：{{this.info.marriageStatus | accountInfo('marriageStatus')}}</div>
      <div class="info-item" v-if="isNotEmpty(this.info.department)">部门：{{this.info.department}}</div>
    </Col>
  </Row>
</template>

<script type="text/ecmascript-6">
export default {
  data() {
    return {

    };
  },

  props: {
    info: Object,
  },

  methods: {
    isNotEmpty (val) {
      return !myUtil.isEmpty(val)
    }
  },

  computed: {
  }
};
</script>

<style scoped lang="less">
.info-item {
  width: 200px;
  display: inline-block;
  vertical-align: top;
  line-height: 30px;
}
</style>
