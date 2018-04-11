<template>
  <div>
    <!-- 套餐基本信息表单 -->
    <meal-editor-form1 ref="infoForm" :meal="meal" />

    <Row class="mt10 pb30">
      <i-col span="5">
        <!-- 套餐价格信息表单 -->
        <Form ref="priceForm" :model="priceForm" :rules="ruleForPrice" :label-width="100" :inline="true">
          <Card dis-hover>
            <p slot="title">销售价格信息</p>

            <FormItem label="标价" prop="displayPrice">
              <Input v-model.trim="priceForm.displayPrice" />
            </FormItem>
            <FormItem label="单项合计">
              {{priceForm.initPrice}}
              <Tooltip :transfer=true content="套餐项目合计价格" placement="top">
                <Icon type="help-circled" color="#2d8cf0"></Icon>
              </Tooltip>
            </FormItem>
            <FormItem label="折扣" prop="discount">
              <Input v-model.trim="priceForm.discount" @input="handleDiscountChange" />
            </FormItem>
            <FormItem label="调整金额" prop="mealSetting.adjustPrice">
              <Input v-model.trim="priceForm.mealSetting.adjustPrice" @input="handleAdjuctPriceChange" />
            </FormItem>
            <FormItem label="售价">
              {{priceForm.salePrice}}
            </FormItem>
            <FormItem label="" prop="mealSetting.lockPrice">
              <Checkbox v-model="priceForm.mealSetting.lockPrice">锁定价格</Checkbox>
              <Tooltip :transfer=true content="锁定后该套餐价格不会随单项价格变化而变化" placement="top">
                <Icon type="help-circled" color="#2d8cf0"></Icon>
              </Tooltip>
            </FormItem>

          </Card>

          <!-- 套餐结算信息表单 -->
          <Card dis-hover class="mt10">
            <p slot="title">结算价格信息</p>
            <FormItem label="平台散客折扣">
              {{priceForm.platformGuestDiscount}}
            </FormItem>
            <FormItem label="医院进货价" prop="purchasePrice">
              <Input v-model.trim="priceForm.purchasePrice" style="width: 80%" />
              <Tooltip :transfer=true content="指该套餐与医院的结算价格" placement="top">
                <Icon type="help-circled" color="#2d8cf0"></Icon>
              </Tooltip>
            </FormItem>
            <FormItem label="渠道散客折扣">
              {{priceForm.platformChannelGuestDiscount}}
            </FormItem>
            <FormItem label="渠道供货价" prop="supplyPrice">
              <Input v-model.trim="priceForm.supplyPrice" style="width: 80%" />
              <Tooltip :transfer=true content="指默认给渠道的供货价格" placement="top">
                <Icon type="help-circled" color="#2d8cf0"></Icon>
              </Tooltip>
            </FormItem>

          </Card>
        </Form>

      </i-col>
      <i-col span="19">
        <!-- 套餐单项选择表单 -->
        <item-select ref="itemForm" class="ml10"
        :item-species="itemSpecies"
        :total-items="totalItems"
        @on-change="setMealItem"
        :meal-items="mealItems" />
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
import  _cloneDeep from 'lodash/cloneDeep'
import { accMul, accDiv } from 'common/number-ext'
import { resolveError } from './util'

export default {
  name: 'mealEditor',
  components: {
    'meal-editor-form1': BaseInfoForm,
    'item-select': ItemSelect
  },

  data () {
    const validateMoney = (rule, value, callback) => {
      if (MyUtil.isMoney(value)) {
        callback();
      } else {
        callback(new Error('金额不正确'));
      }
    };

    const validateMoneyMinus = (rule, value, callback) => {
      if (MyUtil.isMoney(value, true)) {
        callback();
      } else {
        callback(new Error('金额不正确'));
      }
    };

    const validateDiscount = (rule, value, callback) => {
      if (MyUtil.isDiscount(value)) {
        callback();
      } else {
        callback(new Error('0.01 - 2.00之间'));
      }
    };

    return {
      saving: false,
      baseForm: {},
      mealItemList: [],
      priceForm: {
        platformGuestDiscount: 1,
        platformChannelGuestDiscount: 1,
        priceAfterDiscount: 0,
        salePrice: 0,
        displayPrice: 0,
        purchasePrice: 0,
        supplyPrice: 0,
        type: 5,
        mealSetting: {
          lockPrice: true
        }
      },
      ruleForPrice: {
        displayPrice: [
          { validator: validateMoney, trigger: 'blur' }
        ],
        salePrice: [
          { validator: validateMoney, trigger: 'blur' }
        ],
        discount: [
          { validator: validateDiscount, trigger: 'blur' }
        ],
        purchasePrice: [
          { validator: validateMoney, trigger: 'blur' }
        ],
        supplyPrice: [
          { validator: validateMoney, trigger: 'blur' }
        ],
        'mealSetting.adjustPrice': [
          { validator: validateMoneyMinus, trigger: 'blur' }
        ]
      },

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
    handleDiscountChange () {
      if (MyUtil.isDiscount(this.priceForm.discount)) {
        this.calculatePrice()
      }
    },

    handleAdjuctPriceChange () {
      if (MyUtil.isMoney(this.priceForm.mealSetting.adjustPrice, true)) {
        this.resetPrice()
      }
    },

    setMealItem (itemList) {
      this.mealItemList = itemList;
      this.calculatePrice();
    },

    calculatePrice (initPage) {
      if (this.mealItemList.length == 0) {
        this.priceForm.initPrice = 0;
        this.priceForm.priceAfterDiscount = 0;
        this.resetPrice();
        return;
      }

      let pms = {
        discount: this.priceForm.discount || 1,
        hospitalId: this.priceForm.hospitalId,
        choosedIds: this.mealItemList.map(it => it.id)
      }

      this.$http.post('/meal/platform/calculatePrice', pms).then((res) => {
        this.priceForm.initPrice = accDiv(res.body.originalPrice, 100);
        this.priceForm.priceAfterDiscount = accDiv(res.body.price, 100);
        this.priceForm.salePrice = (this.priceForm.priceAfterDiscount + +(this.priceForm.mealSetting.adjustPrice || 0)).toFixed(2);

        !initPage && this.resetPrice();
      }, (error) => {
        this.$Message.error(error.text)
      })
    },

    resetPrice () {
      this.priceForm.salePrice = (this.priceForm.priceAfterDiscount + +(this.priceForm.mealSetting.adjustPrice || 0)).toFixed(2);
      this.priceForm.displayPrice = (this.priceForm.salePrice > this.priceForm.initPrice ? this.priceForm.salePrice : this.priceForm.initPrice);
      this.priceForm.purchasePrice = accMul((this.priceForm.platformGuestDiscount || 1), this.priceForm.salePrice).toFixed()
      this.priceForm.supplyPrice = accMul((this.priceForm.platformChannelGuestDiscount || 1), this.priceForm.salePrice).toFixed();
    },

    cancel () {
      this.$emit('on-close')
    },

    save () {
      this.saving = true;
      let validateBaseForm = this.validateBaseForm();
      let validatePriceForm = this.validatePriceForm();
      Promise.all([validateBaseForm, validatePriceForm]).then(() => {
        if (this.baseForm.valid && this.priceForm.valid) {
          this.submitMeal();
        } else {
          this.saving = false;
        }
      })
    },

    validateBaseForm () {
      let infoForm = this.$refs.infoForm;
      return infoForm.$refs['formValidate'].validate((valid) => {
        Object.assign(this.baseForm, infoForm.formValidate);
        this.baseForm.valid = valid;

        if (this.baseForm.valid) {
          let gi = this.hasInvalidGenderItem();
          if (gi) {
            this.$Message.error(gi);
            this.baseForm.valid = false
          }
        }

      });
    },

    validatePriceForm () {
      return this.$refs['priceForm'].validate((valid) => {
        this.priceForm.valid = valid;
      });
    },

    hasInvalidGenderItem () {
      let validItemName = '';
      for (let i=0; i<this.mealItemList.length; i++) {
        let it = this.itemMap[this.mealItemList[i].id];
        if (this.baseForm.gender == 2 && (it.gender == 0 || it.gender == 1)) {
          return '通用套餐 不能选择有性别的项目'
        } else if (this.baseForm.gender != it.gender && it.gender !=2) {
          return it.name + ' 与套餐性别不一致'
        }
      }
      return validItemName;
    },

    submitMeal () {
      let pms = {};
      let meal = Object.assign(this.priceForm, this.baseForm)
      meal.ext = JSON.stringify({mdTipText: meal.modifyText});
      pms.meal = this.digestMeal(_cloneDeep(meal));
      pms.mealItemList = this.mealItemList;
      this.$http.post('/meal/platform/saveMeal', JSON.stringify(pms)).then(() => {
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
    },

    // 处理价格
    digestMeal (meal) {
      meal.discount = parseFloat(meal.discount || 1);

      if (meal.displayPrice === '') {
        meal.displayPrice = meal.salePrice > meal.initPrice ? meal.salePrice : meal.initPrice
      }
      if (meal.purchasePrice === '') {
        meal.purchasePrice = accMul((meal.platformGuestDiscount || 1), meal.salePrice).toFixed()
      }
      if (meal.supplyPrice === '') {
        meal.supplyPrice = accMul((meal.platformChannelGuestDiscount || 1), meal.salePrice).toFixed()
      }

      meal.displayPrice = accMul(meal.displayPrice, 100);
      meal.initPrice = accMul(meal.initPrice, 100);
      meal.salePrice = accMul(meal.salePrice, 100);
      meal.purchasePrice = accMul(meal.purchasePrice, 100);
      meal.supplyPrice = accMul(meal.supplyPrice, 100);
      meal.mealSetting.adjustPrice = accMul((meal.mealSetting.adjustPrice || 0), -100);

      return meal;
    }

  },

  mounted () {
    this.mealItemList = this.mealItems.filter(it => it.mealId);
    if (!this.meal.id) {
      this.priceForm.type = 5;
      this.priceForm.discount = 1;
      this.priceForm.hospitalId = this.meal.hospitalId;
      this.priceForm.platformGuestDiscount = this.meal.platformGuestDiscount;
      this.priceForm.platformChannelGuestDiscount = this.meal.platformChannelGuestDiscount;
      this.priceForm.mealSetting = { lockPrice: true, adjustPrice: 0 }
      this.calculatePrice()
    } else {
      this.priceForm = this.meal;
      this.priceForm.mealSetting.adjustPrice = -(accDiv((this.meal.mealSetting.adjustPrice || 0), 100));
      this.calculatePrice(true)
    }


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
