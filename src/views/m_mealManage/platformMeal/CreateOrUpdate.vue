<template>
  <div>
    <Spin size="large" fix v-if="loading"></Spin>
    <!-- 面包屑 -->
    <div class="header-search pl15">
      <Breadcrumb>
        <BreadcrumbItem style="cursor: pointer;" @click.native="$router.go(-1)">返回</BreadcrumbItem>
        <BreadcrumbItem>{{meal.id ? '编辑' : '新建'}}平台套餐</BreadcrumbItem>
      </Breadcrumb>
    </div>

    <!-- 套餐编辑态 -->
    <platform-meal-editor v-if="!loading" class="p10"
    :meal="meal"
    :total-items="totalItems"
    :meal-items="mealItems"
    :item-species="itemSpecies"
    @on-confirm="toNextPage"
    @on-close="$router.go(-1)" />

  </div>
</template>

<script>
import PlatformMealEditor from '../components/mealEditor/PlatformMealEditor'

export default {
  name: 'createStandardMeal',
  data () {
    return {
      itemSpecies: [],
      totalItems: [],
      mealItems: [],
      meal: {
        platformDiscount: 1,  // 平台折扣
        mealSetting: {}
      },
      loading: true
    }
  },

  components: {
    'platform-meal-editor': PlatformMealEditor,
  },

  mounted () {
    const platformMealId = this.$route.query.platformMealId || ''
    const standardMealId = this.$route.query.standardMealId || ''
    const hospitalId = this.$route.query.hospitalId || ''

    if (platformMealId) {     // 编辑平台套餐
      this.getPlatformMeal(platformMealId);
    } else if (hospitalId) {
      if (standardMealId) {   // 根据标准套餐新建平台套餐
        this.initPlatformMealByStandard(hospitalId, standardMealId)
      } else {                // 自定义新建平台套餐
        this.getBasicMeal(hospitalId);
      }
    }
  },

  methods: {
    toNextPage () {
      if (this.meal.id) {
        this.$router.push('/mealManage/platformMeal/detail?mealId=' + this.meal.id);
      } else {
        this.$router.push('/mealManage/platformMeal');
      }
    },

    initPlatformMealByStandard (hospitalId, standardMealId) {
      this.$http.get(`/meal/platform/getByStandardMeal?hospitalId=${hospitalId}&standardMealId=${standardMealId}`).then(res => {
        let { itemSpecies, meal, mealExamitem, hospitalExamitem, platformGuestDiscount, platformChannelGuestDiscount } = res.body

        this.copyItemAttrs(hospitalExamitem, itemSpecies);
        this.itemSpecies = itemSpecies;
        this.mealItems = mealExamitem.map(item => {
          if (item.mealId === 0) {
            item.mealId = 999999;
          }
          return item;
        });
        this.totalItems = hospitalExamitem;
        this.meal = {
          hospitalId: hospitalId,
          platformGuestDiscount: platformGuestDiscount,
          platformChannelGuestDiscount: platformChannelGuestDiscount,
          standardMealId: standardMealId
        };

        this.loading = false;
      })
    },

    getBasicMeal (hospitalId) {
      this.$http.get(`/meal/platform/hospitalBasicMeal?hospitalId=${hospitalId}`).then(res => {
        let { itemSpecies, meal, mealExamitem, hospitalExamitem, platformGuestDiscount, platformChannelGuestDiscount } = res.body;

        this.copyItemAttrs(hospitalExamitem, itemSpecies);
        this.itemSpecies = itemSpecies;
        this.mealItems = mealExamitem.map(item => {
          if (item.mealId === 0) {
            item.mealId = 999999;
          }
          if (item.mealId) {
            item.selected = true;
            item.show = true;
          }
          return item;
        });
        this.totalItems = hospitalExamitem;
        this.meal = {
          hospitalId: hospitalId,
          platformGuestDiscount: platformGuestDiscount,
          platformChannelGuestDiscount: platformChannelGuestDiscount
        };

        this.loading = false;
      })
    },

    getPlatformMeal (mealId) {
      this.$http.get(`/meal/platform/getMealById?mealId=${mealId}`).then(res => {
        let { itemSpecies, meal, mealExamitem, hospitalExamitem, platformGuestDiscount, platformChannelGuestDiscount } = res.body

        meal.platformGuestDiscount = platformGuestDiscount;
        meal.platformChannelGuestDiscount = platformChannelGuestDiscount;

        this.copyItemAttrs(hospitalExamitem, itemSpecies);
        this.itemSpecies = itemSpecies;          // 包含全部分类项目的分类
        this.totalItems = hospitalExamitem;        // 体检中心所有项目
        this.mealItems = mealExamitem;                  // 包含套餐项目设置的全部项目
        this.resolveMealAttr(meal)
        this.meal = meal;                        // 套餐信息

        this.loading = false;
      },err => {
        this.loading = false;
        this.$Message.error(err.text)
      })
    },

    copyItemAttrs (allItem, speciesList) {
      let itemMap = MyUtil.toMap(allItem, 'id');

      speciesList = speciesList.map(s => {
        s.examItemList = s.examItemList.map(it => {
          if (it.groupId) {
            it.members = it.members.map(m => itemMap[m])
            return it;
          } else {
            return itemMap[it.id];
          }
        })
        return s;
      })
    },

    resolveMealAttr (meal) {
      let t = ''
      try{ t = JSON.parse(meal.ext).mdTipText }
      catch(e){ t = meal.ext }
      meal.modifyText = t;
    }

  }
}
</script>
