<template>
  <span class="search-keyword">
    <span>{{item.label}}</span>：{{item | parseShowVal(hospitals, companies)}} <i class="iconfont icon-cha hoverblue" @click="handelDelete"></i>
  </span>
</template>

<script type="text/ecmascript-6">
import filters from '../../../filters'
import service from '../service'

export default {
  name: 'queryCondition',

  data() {
    return {
    };
  },

  props: {
    // 检测类型 + 其他验证
    item: {
      type: Object,
      required: true
    },
    hospitals: {
      type: Array,
      required: true
    },
    companies: {
      type: Array,
      required: true
    },
  },

  methods: {
    handelDelete() {
      this.$emit('delete', this.item);
    }
  },

  computed: {
  },

  components: {
  },

  filters: {
    parseShowVal: function(item, hospitals, companies) {
      return service.parseShowVal(item, hospitals, companies);
    }
  }

};
</script>

<style scoped lang="less">
@import '../../../assets/style/common.less';

.search-keyword {
  display: inline-block;
  color: @blue-light;
  border: 1px solid @blue-light;
  border-radius: 3px;
  padding: 2px 5px;
  margin-left: 5px;
  margin-top: 5px;
}
</style>
