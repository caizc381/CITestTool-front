<template>
  <div>
    <!-- 面包屑 -->
    <div class="header-search pl15">
      <Breadcrumb>
          <BreadcrumbItem :href="backUrl">返回</BreadcrumbItem>
          <BreadcrumbItem>套餐详情</BreadcrumbItem>
      </Breadcrumb>
    </div>

    <div class="body-content">
      <meal-content
      :meal="meal"
      :total-items="totalItems"
      :meal-items="mealItems"
      :item-species="itemSpecies"
      :loading="loading" />

    </div>
  </div>
</template>

<script>
import MealContent from './components/MealContent'

export default {
  name: 'mealDetail',
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
    'meal-content': MealContent,
  },

  mounted () {
    this.initDetail()
  },

  computed: {
    backUrl () {
      return this.meal.type == 1 ? '/mealManage/standardMeal/list' : '/mealManage/platformMeal/list'
    }
  },

  methods: {
    initDetail () {
      const mealId = this.$route.query.mealId || ''
      const type = this.$route.query.type || ''
      if(!mealId) return

      this.loading = true

      if (type == 1) {
        this.getStandarMeal(mealId);
      } else {
        this.getPlatformMeal(mealId);
      }

    },

    getStandarItem () {
      this.$http.get('/examItem/standardList').then(res => {
        this.itemSpecies = this.assembleSpecies(res.body.list);
        this.totalItems = res.body.list;

        this.getGroupItems();
      },err => {
        this.$Message.error(err.text)
      })
    },

    getGroupItems () {
      this.$http.get('/examItem/sameGroupItems').then((res) => {
        let itemGroups = res.body;

        let allGroupItemIds = []
        let groupItems = {};          // 找出单项和组的映射

        itemGroups.forEach((group) => {
          group.items.forEach((item, idx) => {
            allGroupItemIds.push(item)
            groupItems[item] = group;
          })
        })

        this.totalItems = this.totalItems.map(item => {
          if (allGroupItemIds.indexOf(item.id) > -1) {
            item.groupId = 'hasGroupId'
          }
          return item;
        })
        this.mealItems = this.mealItems.map(item => {
          if (allGroupItemIds.indexOf(item.id) > -1) {
            item.groupId = 'hasGroupId'
          }
          return item;
        })

        this.loading = false;
      })
    },

    assembleSpecies (list) {
      let speciesMap = MyUtil.groupBy(list, 'clientClassify');
      let speciesList = [];
      for (let key in speciesMap) {
        let spe = {};
        spe.id = key;
        spe.name = speciesMap[key][0].clientClassifyName;
        spe.examItemList = speciesMap[key];
        speciesList.push(spe);
      }
      return speciesList;
    },

    getMealItem (meal) {
      let standardMealItemList = meal.standardMealItemList;
      standardMealItemList.map(v => {
        v.mealId = meal.id;
        v.selected = true;
        v.show = true;
        return v;
      })
      return standardMealItemList;
    },

    getStandarMeal (mealId) {
      this.$http.get(`/meal/standard/${mealId}`).then(res => {

        this.meal = res.body;
        this.meal.mealSetting = {};
        this.mealItems = this.getMealItem(this.meal);
        this.getStandarItem();

      },err => {
        this.loading = false;
        this.$Message.error(err.text)
      })
    },

    getPlatformMeal (mealId) {
      this.$http.get(`/meal/platform/getMealById?mealId=${mealId}`).then(res => {
        let { itemSpecies, meal, mealExamitem, hospitalExamitem, platformGuestDiscount, platformChannelGuestDiscount } = res.body

        meal.platformGuestDiscount = platformGuestDiscount;
        meal.platformChannelGuestDiscount = platformChannelGuestDiscount;

        this.itemSpecies = itemSpecies;          // 包含全部分类项目的分类
        this.totalItems = hospitalExamitem;          // 体检中心所有项目
        this.mealItems = mealExamitem;                  // 包含套餐项目设置的全部项目
        this.resolveMealAttr(meal)
        this.meal = meal;                        // 套餐信息


        this.loading = false;
      },err => {
        this.loading = false;
        this.$Message.error(err.text)
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
