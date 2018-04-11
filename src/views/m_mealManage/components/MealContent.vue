<template>
  <div>
    <div>
      <Spin size="large" fix v-if="loading"></Spin>

      <Alert type="warning" show-icon v-if="meal.disable">当前套餐为不可用状态，请修改套餐，如果无权限编辑套餐，请联系管理员</Alert>

      <!-- 套餐详情 -->
      <Card dis-hover class="mb10 lh2">
           <p slot="title">套餐详情 [ ID:{{meal.id}} ]<a href="javascript:void(0)" class="fr fwn" @click="toggleEdit">编辑</a></p>
           <table>
             <col width="60"/>
             <col />
             <col width="60"/>
             <col />
             <tr>
               <td class="tr">套餐名称:</td>
               <td class="mt-form-text-content ell w300">
                 <div class="ell w300" :title="meal.name">{{meal.name}} </div>
               </td>
               <td class="tr">套餐性别:</td>
               <td class="mt-form-text-content">{{meal.gender | filterGender}}</td>
             </tr>
             <tr>
               <td class="tr">修改提示:</td>
               <td class="mt-form-text-content ell w300">
                 <div class="ell w300" :title="meal.modifyText">{{meal.modifyText}}</div>
               </td>
               <td class="tr">关键词:</td>
               <td>
                 <div class="ml10">
                   <span v-if="!meal.keyword">无</span>
                   <Tag v-for="(item, idx) in keywordList" :key="idx" color="blue">{{item}}</Tag>
                 </div>
               </td>
             </tr>
             <tr>
               <td class="tr vt">套餐描述:</td>
               <td colspan="3" class="mt-form-text-content">
                 <div style="line-height: 1.5; padding-top: 4px;" :title="meal.description">
                   {{meal.description || '暂无'}}
                 </div>
               </td>
             </tr>
           </table>
       </Card>

       <!-- 销售价格 -->
       <Row>
         <!-- 标准套餐 -->
         <i-col span="5" v-if="meal.type == 1">
             <Card dis-hover class="mb10">
               <p slot="title">销售价格信息</p>
               <Row>
                 <i-col span="8" class="mt-form-label-right">单项合计:</i-col>
                 <i-col span="16" class="mt-form-text-content">
                   ￥{{meal.initPrice | money}}
                   <Tooltip :transfer=true content="套餐项目合计价格" placement="top">
                     <Icon type="help-circled" color="#2d8cf0"></Icon>
                   </Tooltip>
                 </i-col>
               </Row>
               <Row type="flex" class="lh2">
                 <i-col span="8" class="mt-form-label-right">售价:</i-col>
                 <i-col span="16" class="mt-form-text-content">
                   ￥{{(meal.minDisplayPrice || 0) | money}} - {{(meal.maxDisplayPrice || 0) | money}}
                   <Tooltip :transfer=true content="显示关联的平台套餐最低至最高的价格区间" placement="top">
                     <Icon type="help-circled" color="#2d8cf0"></Icon>
                   </Tooltip>
                 </i-col>
               </Row>
           </Card>
         </i-col>
         <i-col span="5" v-else>
             <Card dis-hover class="mb10">
               <p slot="title">销售价格信息</p>
               <Row type="flex" class="lh2">
                 <i-col span="8" class="mt-form-label-right" v-if="meal.displayPrice">标价:</i-col>
                 <i-col span="16" class="mt-form-text-content" v-if="meal.displayPrice">
                   ￥{{meal.displayPrice}}
                 </i-col>
                 <i-col span="8" class="mt-form-label-right">单项合计:</i-col>
                 <i-col span="16" class="mt-form-text-content">
                   ￥{{meal.initPrice}}
                   <Tooltip :transfer=true content="单项原价之和" placement="top">
                     <Icon type="help-circled" color="#2d8cf0"></Icon>
                   </Tooltip>
                 </i-col>
                 <i-col span="8" class="mt-form-label-right">折扣:</i-col>
                 <i-col span="16" class="mt-form-text-content">{{meal.discount}}</i-col>
                 <i-col span="8" class="mt-form-label-right">调整金额:</i-col>
                 <i-col span="16" class="mt-form-text-content">
                   {{-meal.mealSetting.adjustPrice | money('￥')}}
                 </i-col>
                 <i-col span="8" class="mt-form-label-right">售价:</i-col>
                 <i-col span="16" class="mt-form-text-content">
                   <span class="warningfont">￥{{meal.salePrice}}</span>
                   <div v-if="meal.mealSetting.lockPrice">
                     <span class="gray"><Icon type="ios-locked"></Icon> 已锁定价格</span>
                     <Tooltip :transfer=true content="锁定后该套餐价格不会随单项价格变化而变化" placement="top">
                       <Icon type="help-circled" color="#2d8cf0"></Icon>
                     </Tooltip>
                   </div>
                 </i-col>
               </Row>
           </Card>

           <!-- 结算价格 -->
           <Card dis-hover class="mb10">
               <p slot="title">结算价格信息</p>
               <Row type="flex" class="lh2">
                 <i-col span="10">平台散客折扣:</i-col>
                 <i-col span="14" class="mt-form-text-content">
                   {{meal.platformGuestDiscount}}
                 </i-col>
                 </Row>
                 <Row type="flex" class="lh2">
                 <i-col span="10">医院进货价格:</i-col>
                 <i-col span="14" class="mt-form-text-content">
                   ￥{{meal.purchasePrice}}
                   <Tooltip :transfer=true content="指该套餐与医院的结算价格" placement="top">
                     <Icon type="help-circled" color="#2d8cf0"></Icon>
                   </Tooltip>
                 </i-col>
                 </Row>
                 <Row type="flex" class="lh2">
                 <i-col span="10">渠道散客折扣:</i-col>
                 <i-col span="14" class="mt-form-text-content">
                   {{meal.platformChannelGuestDiscount}}
                 </i-col>
                 </Row>
                 <Row type="flex" class="lh2">
                 <i-col span="10">渠道供货价格:</i-col>
                 <i-col span="14" class="mt-form-text-content">
                   ￥{{meal.supplyPrice}}
                   <Tooltip :transfer=true content="指默认给渠道的供货价格" placement="top">
                     <Icon type="help-circled" color="#2d8cf0"></Icon>
                   </Tooltip>
                 </i-col>
               </Row>
           </Card>
         </i-col>

         <!-- 体检项目 -->
         <i-col span="19">
           <Card dis-hover class="ml10" :padding="0">
             <p slot="title">体检项目({{mealItemCount}}项) <span v-if="!meal.allowChangeItem" class="fr errorfont" style="font-weight: normal">不允许下单改项</span></p>

             <Affix :offset-top="50">
               <Row class="list-item" style="background:#eef1f6;">
                 <i-col span="1">#</i-col>
                 <i-col span="8">项目名称</i-col>
                 <i-col span="3">价格</i-col>
                 <i-col span="12">描述</i-col>
               </Row>
             </Affix>
             <div v-if="!itemSpeciesInMeal.length" class="mt-list-empty-tip">暂无数据</div>
             <div v-for="item in itemSpeciesInMeal" :key="item.id">
               <p class="list-header">{{item.name}}</p>
               <div v-for="(tr, idx2) in item.examItemList" :key="tr.id" class="list-item">
                 <Row type="flex">
                   <i-col span="1">{{++idx2}}</i-col>
                   <i-col span="8">
                     <Tag color="yellow" v-if="isCanChangeAndBasic(tr)">可变</Tag>
                     <Tag color="blue"  v-else-if="tr.basic">必选</Tag>
                     <Tag color="green" v-else-if="!tr.basic">可选</Tag>
                     <span v-if="isHideItem(tr)" class="errorfont">[隐藏项]</span>
                     {{tr.name}}
                   </i-col>
                   <i-col span="3">{{tr.price | money('￥')}}</i-col>
                   <i-col span="12">
                     <div v-if="tr.description"><span >{{tr.description}}</span></div>
                     <div v-if="tr.fitPeople && tr.fitPeople!=='无'" class="successfont"><Icon type="checkmark-circled"></Icon> 适宜人群: <span>{{tr.fitPeople}}</span></div>
                     <div v-if="tr.unfitPeople && tr.unfitPeople!=='无'" class="errorfont"><Icon type="ios-minus"></Icon> 不适人群: <span>{{tr.unfitPeople}}</span></div>
                   </i-col>
                 </Row>
               </div>
             </div>
           </Card>
         </i-col>
       </Row>
    </div>

  </div>
</template>

<script>
import _difference from 'lodash/difference'
import PlatformMealEditor from './mealEditor/PlatformMealEditor'

export default {
  name: 'mealContent',
  data () {
    return {
      mealItemCount: 0,
      itemSpeciesInMeal: []
    }
  },

  props: {
    itemSpecies: Array,   // 包含全部分类项目的分类
    totalItems: Array,    // 体检中心所有项目
    mealItems: Array,     // 包含套餐项目设置的全部项目
    meal: Object,         // 套餐信息
    loading: Boolean
  },

  components: {
    'platform-meal-editor': PlatformMealEditor
  },

  watch: {
    'loading' (val, oldValue) {
      if (!this.loading) {
        this.initDetail()
      }
    }
  },

  computed: {
    keywordList () {
      if(!this.meal.keyword) return []
      return this.meal.keyword.split('|')
    }
  },
  filters: {
  },

  beforeUpdate () {
    // this.initDetail()
  },

  mounted () {

  },
  methods: {
    toggleEdit () {
      if (this.meal.type == 1) {
        this.$router.push('/mealManage/standardMeal/edit?mealId=' + this.meal.id);
      } else {
        this.$router.push('/mealManage/platformMeal/edit?platformMealId=' + this.meal.id);
      }
    },

    initDetail () {
      let mealItemCount = 0
      let allItemIds = []
      let itemMap = MyUtil.toMap(this.totalItems, 'id');
      let itemSpecies = this.itemSpecies.map(v => {
        let itemIds = v.examItemList
          .map(v => {
            if(v.members){
              return v.members
            }
            return v.id
          })
          .reduce((p, n)=>{ return p.concat(n) },[])

        allItemIds = allItemIds.concat(itemIds)

        v.examItemList = this.copyAttrsByIds(itemIds, itemMap)
        return v
      })

      // 获取 mealItems 中所有套餐内的项
      const basiceItemIds = this.mealItems.filter(v => v.mealId).map(v => v.id)

      // 如果不在所有组里，则分组为 其它
      let unCategoryItems = _difference(basiceItemIds, allItemIds)

      // 过滤不显示的项
      unCategoryItems = this.copyAttrsByIds(unCategoryItems, itemMap)

      mealItemCount += unCategoryItems.length

      // 分组为其它
      if(unCategoryItems.length){
        itemSpecies.push({
          examItemList: unCategoryItems,
          id: 999,
          name: "其它"
        })
      }

      let itemSpeciesInMeal = JSON.parse(JSON.stringify(itemSpecies))

      this.itemSpeciesInMeal = itemSpeciesInMeal.map(v => {
        v.examItemList = v.examItemList.filter(it => it.mealId && it.show && it.selected)
        mealItemCount += v.examItemList.length
        return v;
      }).filter(v => v.examItemList.length);

      this.mealItemCount = mealItemCount
    },

    copyAttrsByIds (itemIds, itemMap) {
      itemIds = itemIds.map(v => {
        let item = JSON.parse(JSON.stringify(itemMap[v]));
        this.mealItems.forEach(mi => {
          if (mi.id == v && mi.mealId) {
            item.mealId = mi.mealId;
            item.selected = mi.selected;
            item.show = mi.show;
            item.basic = mi.basic;
            item.enableSelect = mi.enableSelect;
          }
        })
        return item;
      })
      return itemIds;
    },
    isCanChangeAndBasic (v) {
      return v.basic && v.enableSelect && v.groupId
    },
    isHideItem (v) {
      const t = this.totalItems.filter(x => x.id === v.id)[0];
      return t && (t.show === false)
    }
  }
}
</script>

<style scoped lang="less">
.list-header {
  border-bottom: 1px solid #eef1f6;
  padding: 10px 0 10px 15px;
  font-weight: bold;
}
.list-item {
  border-bottom: 1px solid #e9e9e9;
  .ivu-col {
    padding: 6px 10px;
  }
  .ivu-col:not(:last-child) {
    border-right: 1px solid #e9e9e9;
  }
}
.ivu-tag {
  padding: 0 2px;
}
.ivu-tag-border {
  height: 20px;
  line-height: 20px;
}
</style>
