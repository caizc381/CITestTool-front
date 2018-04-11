<template>
  <div>
    <!-- 套餐基本信息表单 -->
    <meal-editor-form1 ref="infoForm" :meal="meal" />

    <Row class="mt10 pb30">
      <i-col span="5">
        <Card dis-hover>
          <p slot="title">销售价格信息</p>
          <Form :model="salePriceInfo" :label-width="80" :inline="true">
            <FormItem label="单项合计">
              {{(meal.initPrice || 0) | money}}
              <Tooltip :transfer=true content="套餐项目合计价格" placement="top">
                <Icon type="help-circled" color="#2d8cf0"></Icon>
              </Tooltip>
            </FormItem>
            <br>
            <FormItem label="售价">
              {{(meal.minDisplayPrice || 0) | money}} - {{(meal.maxDisplayPrice || 0) | money}}
              <Tooltip :transfer=true content="显示关联的平台套餐最低至最高的价格区间" placement="top">
                <Icon type="help-circled" color="#2d8cf0"></Icon>
              </Tooltip>
            </FormItem>
          </Form>

        </Card>
      </i-col>
      <i-col span="19">
        <!-- 套餐单项选择表单 -->
        <item-select ref="itemForm" class="ml10"
        :item-species="itemSpecies"
        :total-items="totalItems"
        :meal-items="mealItems"
        @on-change="setMealItem"
        type="standardMeal" />
      </i-col>
    </Row>

    <Card dis-hover class="meal-footer">
      <Button type="primary" @click="save" :disabled="saving">保存</Button>
      <Button class="ml20" type="text" @click="cancel">取消</Button>
    </Card>
  </div>
</template>

<script>
import BaseInfoForm from './BaseInfoForm'
import ItemSelect from './ItemSelect'
import { resolveError } from './util'

export default {
  name: 'mealEditor',

  components: {
    'meal-editor-form1': BaseInfoForm,
    'item-select': ItemSelect
  },

  data () {
    return {
      saving: false,
      form1Data: {},
      mealItemList: [],
      salePriceInfo: {},

      errorList: []
    }
  },

  props: {
    itemSpecies: Array,   // 包含全部分类项目的分类
    totalItems: Array,    // 体检中心所有项目
    mealItems: Array,     // 包含套餐项目设置的全部项目
    meal: Object,         // 套餐信息
  },

  computed: {
    itemMap () {
      return MyUtil.toMap(this.totalItems, 'id');
    }
  },

  methods: {
    setMealItem (itemList) {
      this.mealItemList = itemList;
    },

    cancel () {
      this.$emit('on-close')
    },

    save () {
      this.saving = true;
      this.validateForm1();
    },

    hasInvalidGenderItem () {
      let validItemName = '';
      for (let i=0; i<this.mealItemList.length; i++) {
        let it = this.itemMap[this.mealItemList[i].id];
        if (this.form1Data.data.gender == 2 && (it.gender == 0 || it.gender == 1)) {
          return '通用套餐 不能选择有性别的项目'
        } else if (this.form1Data.data.gender != it.gender && it.gender != 2) {
          return it.name + ' 与套餐性别不一致'
        }
      }
      return validItemName;
    },

    submitMeal () {
      let pms = {
        id: this.meal.id,
        name: this.form1Data.data.name,
        gender: this.form1Data.data.gender,
        discount: 1,
        type: 1,
        modifyText: this.form1Data.data.modifyText,
        description: this.form1Data.data.description,
        keyword: this.form1Data.data.keyword,
        allowChangeItem: this.form1Data.data.allowChangeItem,
        standardMealItemList: this.mealItemList
      };
      let url = pms.id ? '/meal/standard/updateMeal' : '/meal/standard/addMeal';
      if (this.mealItemList.length > 0) {
        this.$http.post(url, JSON.stringify(pms)).then(() => {
          this.$Message.success('保存成功');
          this.saving = false;
          this.$emit('on-confirm')
        }, (error) => {
          if (error.exceptType) {
            this.errorList = resolveError(error.exceptItemList, error.conflictItemId, this.itemMap);
            let errorText = '';
            this.errorList.forEach((err) => {
              errorText += err.desc + err.relateItems.map(item => item.name).join(',');
              errorText += '<br>'
            })

            this.$Message.error(errorText);
          } else {
            this.$Message.error(error.text)
          }

          this.saving = false;
        })
      } else {
        this.saving = false;
        this.$Message.error('体检项目不能为空');
      }
    },

    validateForm1 () {
      let infoForm = this.$refs.infoForm;
      this.form1Data.data = infoForm.formValidate;
      infoForm.$refs.formValidate.validate((valid) => {
        if (valid) {
          let gi = this.hasInvalidGenderItem();
          if (gi) {
            this.$Message.error(gi);
            this.saving = false;
            valid = false
          }
        } else {
          this.saving = false;
        }

        if (valid) {
          this.submitMeal();
        }

      });
    }
  },

  mounted () {
    this.mealItemList = this.mealItems;
  }
}
</script>

<style scoped lang="less">
.meal-footer {
  position: fixed;
  bottom: 0;
  width: 100%;
}
</style>
