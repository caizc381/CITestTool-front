<template>
  <div>
    <div class="form-term">
      <div class="form-header-title">
        <span class="fl">其他</span>
        <a v-if="!isEdit" v-permission="'hospitalManage:list:cooperationOther'" class="fr" @click="clickEdit"><Icon type="edit"></Icon>编辑</a>
      </div>

      <Form :model="organizationVo" :label-width="140">
        <FormItem label="财务" style="font-weight: bold;">
        </FormItem>
        <FormItem label="平台挂账：" class="dlb" style="width:33%">
          <span v-if="!isEdit" class="detailfont">{{hospital.isPlatformSuspense ? '支持':'不支持'}}</span>
          <span v-if="isEdit">
             <RadioGroup v-model="organizationVo.isPlatformSuspense">
                <Radio label="1">支持</Radio>
                <Radio label="0">不支持</Radio>
             </RadioGroup>
          </span>
          <Tooltip content="指体检中心允许平台订单相关体检用户不需要单独支付体检费用给体检中心，定期与每天健康结算即可" placement="right"> 
              <Icon style="font-size:14px;" class="primaryfont ml5" type="help-circled"></Icon>
          </Tooltip>
        </FormItem>
        <FormItem label="预付开票：" class="dlb" style="width:33%">
           <span v-if="!isEdit" class="detailfont">{{hospital.isPrepayInvoice ? '支持':'不支持'}}</span>
           <span v-if="isEdit">
             <RadioGroup v-model="organizationVo.isPrepayInvoice">
                <Radio label="1">支持</Radio>
                <Radio label="0">不支持</Radio>
            </RadioGroup>
          </span>
          <Tooltip content="指体检中心允许平台订单提前单独支付费用，以便给个人或单位开票，同时保留相应折扣消费额度" placement="right">
              <Icon style="font-size:14px;" class="primaryfont ml5" type="help-circled"></Icon>
          </Tooltip>
        </FormItem>

        <div class="parting-line"></div>

        <FormItem label="平台套餐" style="font-weight: bold;">
        </FormItem>
        <FormItem label="平台定制套餐：">
          <span v-if="!isEdit" class="detailfont">{{hospital.isIndividuationPlatformMeal ? '支持':'不支持'}}</span>
          <div v-if="isEdit">
            <RadioGroup v-model="organizationVo.isIndividuationPlatformMeal">
                <Radio label="1">支持</Radio>
                <Radio label="0">不支持</Radio>
            </RadioGroup>
          </div>
        </FormItem>
        <FormItem label="最低消费：">
           <span v-if="!isEdit" class="detailfont">{{hospital.lowestConsumption}}元</span>
           <div v-if="isEdit">
            <InputNumber  :max="9999999999" :min="0" :step="1" v-model="organizationVo.lowestConsumption"></InputNumber>元
          </div>
        </FormItem>

        <div class="parting-line"></div>

        <FormItem label="平台用户导入" style="font-weight: bold;">
        </FormItem>
        <FormItem label="员工号导入：" class="dlb">
          <span v-if="!isEdit" class="detailfont">{{hospital.isPlatformEmployeeImport ? '支持':'不支持'}}</span>
          <div v-if="isEdit">
            <RadioGroup v-model="organizationVo.isPlatformEmployeeImport">
               <Radio label="1">支持</Radio>
               <Radio label="0">不支持</Radio>
            </RadioGroup>
          </div>
        </FormItem>

        <FormItem v-if="isEdit">
            <Button type="primary" @click="save()">保存</Button>
            <Button type="ghost" style="margin-left: 8px" @click="cancelValidate()">取消</Button>
        </FormItem>
      </Form>

    </div>
  </div>
</template>

<script>
export default {
  data() {
      return {
        organizationVo: {
            hospitalId: '',
            isPlatformSuspense: '',
            isPrepayInvoice: '',
            isIndividuationPlatformMeal: '',
            lowestConsumption: '',
            isEmployeeImportForPlatform: '',
        },
        isEdit: false,
      }
  },

  props: ['hospital'],

  methods: {
    save(){
      
      this.$http.post('/updateCooperationMoreInfo',JSON.stringify(this.organizationVo)).then((response) => {
          this.$Message.success('操作成功');
          this.isEdit = false;
          this.$emit('reload');
      }, (res) => {
          this.$Message.error(res.text);
      });
    },

    clickEdit(){
      this.isEdit = true;
      this.organizationVo = JSON.parse(JSON.stringify(this.hospital));
      this.organizationVo.isPlatformEmployeeImport = '' + this.organizationVo.isPlatformEmployeeImport;
      this.organizationVo.isIndividuationPlatformMeal = '' + this.organizationVo.isIndividuationPlatformMeal;
      this.organizationVo.isPrepayInvoice = '' + this.organizationVo.isPrepayInvoice;
      this.organizationVo.isPlatformSuspense = '' + this.organizationVo.isPlatformSuspense;
    },

    cancelValidate(){
      this.isEdit = false;
      this.organizationVo = JSON.parse(JSON.stringify(this.hospital));
    },

  }
}  
</script>

<style scoped>
  .form-header-title {
    clear: both;
    overflow: hidden;
  }
  .ivu-icon-edit:before {
    padding-right: 5px;
  }
  .payway span{
    padding-right: 5px;
    border-right: 2px solid #999;
  }
  .payway span:last-child{
    border-right: none;
  }
</style>