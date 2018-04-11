<template>
  <div>
    <Spin size="large" fix v-if="loading"></Spin>
    <!-- 面包屑 -->
    <div class="header-search pl15">
      <Breadcrumb>
        <BreadcrumbItem style="cursor: pointer;" @click.native="$router.go(-1)">返回</BreadcrumbItem>
        <BreadcrumbItem>{{meal.id ? '编辑' : '新建'}}标准套餐</BreadcrumbItem>
      </Breadcrumb>
    </div>

    <!-- 套餐编辑态 -->
    <standard-meal-editor v-if="!loading"
    class="p10"
    :meal="meal"
    :total-items="totalItems"
    :meal-items="mealItems"
    :item-species="itemSpecies"
    @on-confirm="$router.go(-1)"
    @on-close="$router.go(-1)" />

  </div>
</template>

<script>
import StandardMealEditor from '../components/mealEditor/StandardMealEditor'

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
    'standard-meal-editor': StandardMealEditor,
  },

  mounted () {
    const mealId = this.$route.query.mealId || ''

    if (mealId) {
      this.getStandarMeal(mealId)
    } else {
      this.getStandardItemList()
    }
  },

  methods: {
    getStandarMeal (mealId) {
      this.$http.get(`/meal/standard/${mealId}`).then(res => {
        this.meal = res.body;
        this.meal.mealSetting = {};
        this.mealItems = this.getMealItem(this.meal);
        this.getStandardItemList();

      },err => {
        this.loading = false;
        this.$Message.error(err.text)
      })
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

    getStandardItemList () {
      this.$http.get('/examItem/standardList').then(res => {

        res.body.list = res.body.list.map(item => {
          item.show = true
          return item;
        })
        this.assembleGroupItem(res.body.list).then((data) => {
          this.totalItems = data.allItems;
          this.itemSpecies = this.assembleSpecies(data.itemList);

          this.loading = false;
        });

      },err => {
        this.$Message.error(err.text)
      })
    },

    // 后端分别返回了单项列表，和组项目列表，需要在前端组装成合适的数据结构传入 单项选择组件
    // 把组项目数据组装到列表中，（组项目有groupId和members，把第一组的非第一个项在列表中去除）
    assembleGroupItem (allItems) {
      let itemMap = MyUtil.toMap(allItems, 'id');

      return this.$http.get('/examItem/sameGroupItems').then((res) => {
        let itemGroups = res.body;

        let allGroupItemIds = []
        let groupItems = {};          // 找出单项和组的映射
        let groupChildItemIds = [];   // 第个组中的非第一项

        itemGroups.forEach((group) => {
          group.items.forEach((item, idx) => {
            allGroupItemIds.push(item)
            groupItems[item] = group;
            if (idx !== 0) {
              groupChildItemIds.push(item);
            }
          })
        })

        allItems = allItems.map(item => {
          if (allGroupItemIds.indexOf(item.id) > -1) {
            item.groupId = groupItems[item.id].id;
          }
          return item;
        })

        if (this.mealItems.length > 0) {
          this.mealItems = this.mealItems.map(item => {
            if (allGroupItemIds.indexOf(item.id) > -1) {
              item.groupId = groupItems[item.id].id;
            }
            return item;
          })
        }

        let resList = allItems.filter(it => groupChildItemIds.indexOf(it.id) == -1).map((item) => {
          let g = groupItems[item.id];
          if (g) {
            item.groupId = g.id;
            item.members = g.items.map(it => {
              let itemWithAttrs = JSON.parse(JSON.stringify(itemMap[it]));
              itemWithAttrs.groupId = g.id;
              return itemWithAttrs;
            });
          }
          return item;
        })

        return {itemList: resList, allItems: allItems};

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
    }

  }
}
</script>
