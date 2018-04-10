<template>
  <div v-if="order">
    <div class="order-info">
      <el-row :gutter="20" class="mb10">
        <el-col :span="8"><div class="tl">套餐: {{order.mealName}}</div></el-col>
        <el-col :span="8"><div class="tl">订单价格: <span class="redfont">{{order.orderPrice | money('¥')}}</span></div></el-col>
      </el-row>

      <el-row :gutter="20" class="mb10">
        <el-col :span="8"><div class="tl">单位: {{order.examCompany}}</div></el-col>
        <el-col :span="16"><div class="tl">体检日期: {{order.examDate | date('yyyy-MM-dd')}} {{order.examTimeIntervalName}}</div></el-col>
      </el-row>

      <el-row :gutter="20" class="mb10">
        <el-col :span="8"><div class="tl">地点: {{order.hospital ? order.hospital.name : ''}}</div></el-col>
      </el-row>

      <el-row :gutter="20" class="mb10">
        <el-col :span="8"><div class="tl">姓名: {{order.account ? order.account.name : ''}}</div></el-col>
        <el-col :span="8"><div class="tl">年龄: {{order.accountRelation.age}}</div></el-col>
        <el-col :span="8"><div class="tl">婚否: {{order.marriageStatusLabel}}</div></el-col>
      </el-row>

      <el-row :gutter="20" class="mb10">
        <el-col :span="12"><div class="tl">联系电话: {{order.accountRelation.initialMobile ? order.accountRelation.initialMobile : order.accountRelation.mobile}}</div></el-col>
      </el-row>

      <el-row :gutter="20" class="mb10">
        <el-col :span="8"><div class="tl">导引单备注: {{order.remark ? order.remark.remarks : ''}}</div></el-col>
        <el-col :span="8"><div class="tl">时间备注: {{order.remark ? order.remark.timeRemarks : ''}}</div></el-col>
        <el-col :span="8"><div class="tl">预约人: {{order.operator}}</div></el-col>
      </el-row>
    </div>

    <div class="order-item">

      <!-- 未检项目 -->
      <div v-if="unExamItems.length > 0">
        <div class="mb10">
          <strong>未检项目金额：</strong><strong class="redfont">({{unExamItemsPrice | money('¥')}})</strong>
        </div>
        <div>
          <el-table
            :data="unExamItems"
            stripe
            style="width: 100%">
            <el-table-column
              prop="index"
              label="序号"
              width="180">
            </el-table-column>
            <el-table-column
              prop="name"
              label="名称"
              width="180">
            </el-table-column>
            <el-table-column
              label="价格" inline-template>
              <span>{{row.price | money('¥')}}</span>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <!-- 未检项目 -->
      <div v-if="refusedItems.length > 0">
        <div class="mb10">
          <strong>拒检项目金额：</strong><strong class="redfont">({{refusedItemsPrice | money('¥')}})</strong>
        </div>
        <div>
          <el-table
            :data="refusedItems"
            stripe
            style="width: 100%">
            <el-table-column
              prop="index"
              label="序号"
              width="180">
            </el-table-column>
            <el-table-column
              prop="name"
              label="名称"
              width="180">
            </el-table-column>
            <el-table-column
              label="价格" inline-template>
              <span>{{row.price | money('¥')}}</span>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <!-- 套餐外增加项目 -->
      <div v-if="addItems.length > 0">
        <div class="mb10">
          <strong>套餐外项目</strong>
        </div>
        <div>
          <el-table
            :data="addItems"
            stripe
            style="width: 100%">
            <el-table-column
              prop="index"
              label="序号"
              width="180">
            </el-table-column>
            <el-table-column
              prop="name"
              label="名称"
              width="180">
            </el-table-column>
            <el-table-column
              label="价格" inline-template>
              <span>{{row.originalPrice | money('¥')}}</span>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <!-- 套餐内减少项目 -->
      <div v-if="delItems.length > 0">
        <div class="mb10">
          <strong>套餐已减项目</strong>
        </div>
        <div>
          <el-table
            :data="delItems"
            stripe
            style="width: 100%">
            <el-table-column
              prop="index"
              label="序号"
              width="180">
            </el-table-column>
            <el-table-column
              prop="name"
              label="名称"
              width="180">
            </el-table-column>
            <el-table-column
              label="价格" inline-template>
              <span>{{row.originalPrice | money('¥')}}</span>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <!-- 套餐内项目 -->
      <div v-if="mealItems.length > 0">
        <div class="mb10">
          <strong>套餐内项目</strong>
        </div>
        <div>
          <el-table
            :data="mealItems"
            stripe
            style="width: 100%">
            <el-table-column
              prop="index"
              label="序号"
              width="180">
            </el-table-column>
            <el-table-column
              prop="name"
              label="名称"
              width="180">
            </el-table-column>
            <el-table-column
              label="价格" inline-template>
              <span>{{row.originalPrice | money('¥')}}</span>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <!-- end 套餐内项目 -->

    </div>

  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'orderDetail',

  data() {
    return {

      unExamItems: [],
      unExamItemsPrice: 0,
      refusedItems: [],
      refusedItemsPrice: 0,
      mealItems: [],
      addItems: [],
      delItems: []
    };
  },

  props: {
    // 检测类型 + 其他验证
    showOrderSnap: {
      type: Object,
      required: true
    },
    order: {
      type: Object,
      required: true
    }
  },

  methods: {

    assemble(itemSnap, unExamItems, refusedItems) {
      this.mealItems = [];
      this.addItems = [];
      this.delItems = [];

      let mealItemsCount = 1;
      let addItemsCount = 1;
      let delItemsCount = 1;

      for (let itemId in itemSnap) {
        let item = itemSnap[itemId];
        if (item.typeToMeal == 1) {
          item.index = mealItemsCount++;
          this.mealItems.push(item);
        } else if (item.typeToMeal == 2) {
          item.index = delItemsCount++;
          this.delItems.push(item);
        } else if (item.typeToMeal == 3) {
          item.index = addItemsCount++;
          this.addItems.push(item);
        }
      }

      this.unExamItems = [];
      let unExamItemsCount = 1;
      if (unExamItems && unExamItems.length > 0) {
        for (let idx in unExamItems) {
          let item = unExamItems[idx];
          item.index = unExamItemsCount++;
          this.unExamItems.push(item);
        }
      }

      if (refusedItems && refusedItems.length > 0) {
        this.refusedItems = [];
        let refusedItemsCount = 1;
        for (let idx in refusedItems) {
          let item = refusedItems[idx];
          item.index = refusedItemsCount++;
          this.refusedItems.push(item);
        }
      }


    }

  },

  computed: {

  },

  watch: {
    showOrderSnap: {
      handler: function(val, oldVal) {
        if (val.itemSnapMap) {
          this.assemble(val.itemSnapMap, val.unExamItems, val.refusedItems);
          this.refusedItemsPrice = val.refusedItemsPrice;
          this.unExamItemsPrice = val.unExamItemsPrice;
        }
      }
    }

  },

  components: {
  },

  filters: {
  }

};
</script>

<style scoped lang="less">
</style>
