<template>
  <div>
    <div class="pb5">请先选择需要新建平台套餐的体检中心：</div>
    <div><Input icon="ios-search" v-model="keyword" @input="filterItem(keyword)" placeholder="搜索体检中心" /></div>
    <mt-group :show-border="false" class="hospital-list">
      <mt-cell v-for="hos in hosList" v-if="!hos.hide" :key="hos.id" class="select-hos" @click.native="toCreate(hos.id, hos.relatedStandardMeal)">
        <div class="pt5 pb5" :class="{'c-9': hos.relatedStandardMeal}">{{hos.name}}
          <span class="fr" v-if="hos.relatedStandardMeal">已关联</span>
        </div>
      </mt-cell>
    </mt-group>
  </div>
</template>

<script>
export default {
  name: 'customCreateModal',
  data () {
    return {
      keyword: '',
      hosList: []
    }
  },

  props: {
    standardMealId: [String, Number]
  },

  components: {
  },

  methods: {
    toCreate (hospitalId, isRelate) {
      if (!isRelate) {
        let path = '/mealManage/platformMeal/edit?hospitalId=' + hospitalId;
        if (this.standardMealId) path += ('&standardMealId=' + this.standardMealId);

        this.$router.push(path);
      }
    },

    filterItem (keyword) {
      this.hosList.map(hos => {
        if (MyUtil.contain(hos.name, keyword) || MyUtil.contain(hos.pinyin, keyword) || MyUtil.contain(hos.id, keyword)) {
          hos.hide = false
        } else {
          hos.hide = true
        }
        return hos;
      })
    },

    //获取医院列表
    getHosList () {
      this.$http.post('/hospital/queryOrg',JSON.stringify({orgType: 1})).then((response) => {
        this.hosList = response.body;
      }, (res) => {
        this.$Message.error(res.text);
      })
    },

    getHosListByMealId (id) {
      this.$http.get(`/meal/standard/listHospitalForAddPlatformMeal?standardMealId=${id}`).then((response) => {
        this.hosList = response.body;
      }, (res) => {
        this.$Message.error(res.text);
      })
    }
  },

  watch: {
  },

  mounted () {
    if (this.standardMealId) {
      this.getHosListByMealId(this.standardMealId);
    } else {
      this.getHosList()
    }
  }
}
</script>

<style lang="less" scoped>
@import '~assets/style/param.less';

.hospital-list {
  position: relative;
  max-height: 500px;
  overflow-y: auto;
  .select-hos {
    &:hover {
      background: @table-td-hover-bg;
      cursor: pointer;
    }
  }
}
</style>
