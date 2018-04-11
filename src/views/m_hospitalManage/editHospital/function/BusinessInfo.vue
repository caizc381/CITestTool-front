<template>
  <div>
    <div class="form-term">
      <div class="form-header-title">
        <span class="fl">交易设置</span>
        <a v-if="!isEdit" v-permission="'hospitalManage:list:tradeSetting'" class="fr" @click="clickEdit"><Icon type="edit"></Icon>编辑</a>
      </div>

      <Form :model="organizationVo" :label-width="120">
        <FormItem label="财务" style="font-weight: bold;">
        </FormItem>
        <FormItem label="结算精度：" class="dlb" style="width:33%">
          <span v-if="!isEdit && hospital.funSettings.calculatorService == 1" class="detailfont">元</span>
          <span v-if="!isEdit && hospital.funSettings.calculatorService == 2" class="detailfont">角</span>
          <span v-if="!isEdit && hospital.funSettings.calculatorService == 3" class="detailfont">分</span>
          <div v-if="isEdit">
            <RadioGroup v-model="organizationVo.funSettings.calculatorService">
                <Radio label="1">元</Radio>
                <Radio label="2">角</Radio>
                <Radio label="3">分</Radio>
            </RadioGroup>
            <div class="prompt">指单项价格、套餐以及订单总价的精度</div>
          </div>
        </FormItem>
        <FormItem label="结算日期：" class="dlb" style="width:33%">
           <span v-if="!isEdit && hospital.funSettings.settleCycle" class="detailfont">每月{{hospital.funSettings.settleCycle}}日</span>
           <span v-if="!isEdit && !hospital.funSettings.settleCycle" class="detailfont">未设置</span>
           <div v-if="isEdit">
             <span>每月</span>
             <Select v-model="organizationVo.funSettings.settleCycle" style="width:400px">
               <Option
                 v-for="settleCycle in settleCycleList"
                 :label="settleCycle.name"
                 :value="settleCycle.id">
               </Option>
             </Select>
           </div>
        </FormItem>

        <div class="parting-line"></div>

        <FormItem label="支付设置" style="font-weight: bold;">
        </FormItem>
        <FormItem label="C端支付：">
           <div class="payway detailfont" v-if="!isEdit">
             <span v-if="hospital.funSettings.accountPay">余额支付</span>
             <span v-if="hospital.funSettings.aliPay">支付宝支付</span>
             <span v-if="hospital.funSettings.weiXinPay">微信支付</span>
             <span v-if="hospital.funSettings.acceptOfflinePay">现场支付</span>
           </div>
           <div v-if="isEdit">
             <Checkbox v-model="organizationVo.funSettings.accountPay">余额支付</Checkbox>
             <Checkbox v-model="organizationVo.funSettings.aliPay">支付宝支付</Checkbox>
             <Checkbox v-model="organizationVo.funSettings.weiXinPay">微信支付</Checkbox>
             <Checkbox v-model="organizationVo.funSettings.acceptOfflinePay">现场支付</Checkbox>
           </div>
        </FormItem>
        <FormItem label="现场支付订单：" :label-width="140">
          <span v-if="!isEdit" class="detailfont">{{hospital.funSettings.needLocalPay ? '需要收款确认':'不需要收款确认'}}</span>
          <div v-if="isEdit">
            <RadioGroup v-model="organizationVo.funSettings.needLocalPay">
                <Radio label="1">需要收款确认</Radio>
                <Radio label="0">不需要收款确认</Radio>
            </RadioGroup>
            <div class="prompt">如果开通了'现场支付',如果体检软件本身无法很好的区分需不需要确认现场收款，强烈建议选择'需要收款确认'</div>
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
          funSettings: {
            acceptOfflinePay: '',
            accountPay: '',
            aliPay: '',
            hospitalId: '',
            calculatorService: '',
            needLocalPay: '',
            settleCycle: '',
            weiXinPay: '',
          },
        },
        settleCycleList: [],
        isEdit: false,
      }
  },

  props: ['hospital'],

  mounted() {
    this.settleCycleList =  MyUtil.getDaysList(28,'日');
    this.settleCycleList.push({'id':'0','name':'-'});
  },

  methods: {
    save(){
      //清空地址选择
      this.organizationVo.addressIds = undefined;

      this.$http.post('/funSetting',JSON.stringify(this.organizationVo.funSettings)).then((response) => {
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
      this.organizationVo.funSettings.acceptOfflinePay = this.organizationVo.funSettings.acceptOfflinePay ? true : false;
      this.organizationVo.funSettings.accountPay = this.organizationVo.funSettings.accountPay ? true : false;
      this.organizationVo.funSettings.aliPay = this.organizationVo.funSettings.aliPay ? true : false;
      this.organizationVo.funSettings.weiXinPay = this.organizationVo.funSettings.weiXinPay ?  true : false;
    },

    cancelValidate(){
      this.isEdit = false;
      this.organizationVo = JSON.parse(JSON.stringify(this.hospital));
      this.organizationVo.funSettings.acceptOfflinePay = this.organizationVo.funSettings.acceptOfflinePay ? true : false;
      this.organizationVo.funSettings.accountPay = this.organizationVo.funSettings.accountPay ? true : false;
      this.organizationVo.funSettings.aliPay = this.organizationVo.funSettings.aliPay ? true : false;
      this.organizationVo.funSettings.weiXinPay = this.organizationVo.funSettings.weiXinPay ?  true : false;
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
