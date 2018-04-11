<template>
  <div>
    <div class="form-term">
      <div class="form-header-title">
        <span class="fl">折扣信息</span>
        <a v-if="!isEdit" v-permission="'hospitalManage:list:discount'" class="fr" @click="clickEdit"><Icon type="edit"></Icon>编辑</a>
      </div>

      <Form :model="organizationVo" :label-width="140">
        <FormItem label="平台单位" style="font-weight: bold;">
        </FormItem>
        <FormItem label="平台散客折扣：" class="dlb" style="width:33%">
          <span v-if="!isEdit" class="detailfont">{{hospital.platformGuestDiscount}}</span>      
          <span v-if="isEdit">
            <InputNumber :max="1" :min="0" :step="0.01" v-model="organizationVo.platformGuestDiscount"></InputNumber>
          </span>
          <Tooltip content="指渠道的非P单位的订单，订单归属在体检中心的“每天健康”单位，平台与医院结算这部分订单，时即采用此折扣" placement="right">
            <Icon style="font-size:14px;"  class="primaryfont ml5" type="help-circled"></Icon>
          </Tooltip>
        </FormItem>
        <FormItem label="平台单位折扣：" class="dlb" style="width:33%">
           <span v-if="!isEdit" class="detailfont">{{hospital.platformCompDiscount}}</span>
           <span v-if="isEdit">
            <InputNumber :max="1" :min="0" :step="0.01" v-model="organizationVo.platformCompDiscount"></InputNumber>
          </span>
          <Tooltip content="指渠道P单位的订单，在平台与医院结算这部分订单时，即采用此折扣" placement="right">
              <Icon style="font-size:14px;" class="primaryfont ml5" type="help-circled"></Icon>
          </Tooltip>
        </FormItem>

        <div class="parting-line"></div>

        <FormItem label="医院单位" style="font-weight: bold;">
        </FormItem>
        <FormItem label="个人预约折扣：" class="dlb" style="width:33%">
          <span v-if="!isEdit" class="detailfont">{{hospital.guestOnlineCompDiscount}}</span>
          <span v-if="isEdit">
            <InputNumber :max="1" :min="0" :step="0.1" v-model="organizationVo.guestOnlineCompDiscount"></InputNumber>
          </span>
          <Tooltip content="指医院二级站点的散客订单，若平台参与这部分订单线上金额分成，则设置相应的结算折扣，否则，设置为“1.00”" placement="right">
              <Icon style="font-size:14px;" class="primaryfont ml5" type="help-circled"></Icon>
          </Tooltip>
        </FormItem>
        <FormItem label="现场散客折扣：" class="dlb" style="width:33%">
           <span v-if="!isEdit" class="detailfont">{{hospital.guestOfflineCompDiscount}}</span>
           <span v-if="isEdit">
            <InputNumber :max="1" :min="0" :step="0.1" v-model="organizationVo.guestOfflineCompDiscount"></InputNumber>
          </span>
          <Tooltip content="指医院CRM散客单位代预约及极速预约，若平台参与这部分订单的线上金额分成，则设置相应的结算折扣，否则，设置为“1.00”" placement="right">
              <Icon style="font-size:14px;" class="primaryfont ml5" type="help-circled"></Icon>
          </Tooltip>
        </FormItem>
        <FormItem label="普通单位折扣：" class="dlb" style="width:33%">
           <span v-if="!isEdit" class="detailfont">{{hospital.hospitalCompDiscount}}</span>
           <span v-if="isEdit">
            <InputNumber :max="1" :min="0" :step="0.1" v-model="organizationVo.hospitalCompDiscount"></InputNumber>
          </span>
          <Tooltip content="指医院自建体检单位，若平台参与这部分单位订单的线上金额分成，则设置相应的结算折扣，否则，设置为“1.00”" placement="right">
              <Icon  style="font-size:14px;" class="primaryfont ml5" type="help-circled"></Icon>
          </Tooltip>
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
            hospitalId:'',
            platformGuestDiscount: 0,
            platformCompDiscount: 0,
            lowestConsumption: 0,
            isPrepayInvoice: 0,
            isPlatformSuspense: 0,
            isIndividuationPlatformMeal: 0,
            hospitalCompDiscount: 0,
            guestOnlineCompDiscount: 0,
            guestOfflineCompDiscount: 0,
        },
        isEdit: false,
      }
  },

  props: ['hospital'],

  methods: {
    
    save(){      
      this.$http.post('/updateCooperationInfoDiscount',JSON.stringify(this.organizationVo)).then((response) => {
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