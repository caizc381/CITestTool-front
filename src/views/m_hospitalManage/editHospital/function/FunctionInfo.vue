<template>
  <div>
    <div class="form-term">
      <div class="form-header-title">
        <span class="fl">功能开通设置</span>
        <a v-if="!isEdit" v-permission="'hospitalManage:list:functionSetting'" class="fr" @click="clickEdit"><Icon type="edit"></Icon>编辑</a>
      </div>
      <Form :model="organizationVo" :label-width="120">
        <FormItem label="体检软件功能支持" style="font-weight: bold;" :label-width="150"></FormItem>
        <FormItem label="调整价格：" class="dlb" style="width:33%">
          <span v-if="!isEdit" class="detailfont">{{hospital.funSettings.allowAdjustPrice ? '开通':'未开通'}}</span>
          <RadioGroup v-if="isEdit" v-model="organizationVo.funSettings.allowAdjustPrice">
              <Radio label="1">开通</Radio>
              <Radio label="0">不开通</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="无体检日期订单：" class="dlb" style="width:33%" :label-width="140">
          <span v-if="!isEdit" class="detailfont">{{hospital.funSettings.exportWithNoExamDate ? '支持':'不支持'}}</span>
          <RadioGroup v-if="isEdit" v-model="organizationVo.funSettings.exportWithNoExamDate">
              <Radio label="1">支持</Radio>
              <Radio label="0">不支持</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="最大下单数：" class="dlb" style="width:33%">
          <span v-if="!isEdit" class="detailfont">{{hospital.funSettings.sameDayOrderMaximum}}</span>
          <div v-if="isEdit">
            <InputNumber :max="5" :min="1" v-model="organizationVo.funSettings.sameDayOrderMaximum"></InputNumber>
            <div class="prompt">指同一用户同一天最大下单数</div>
          </div>
        </FormItem>

        <div class="parting-line"></div>

        <FormItem label="其他设置" style="font-weight: bold;"></FormItem>
        <FormItem label="团检报告：" class="dlb" style="width:33%">
          <span v-if="!isEdit" class="detailfont">{{hospital.funSettings.openGroupExamReport ? '开通':'未开通'}}</span>
          <RadioGroup v-if="isEdit" v-model="organizationVo.funSettings.openGroupExamReport">
              <Radio label="1">开通</Radio>
              <Radio label="0">不开通</Radio>
          </RadioGroup>
          <div class="prompt" style="line-height: 20px;">首次开通团检报告请发送邮件给产品组，发送后才可以使用</div>
        </FormItem>
        <FormItem label="智能推荐：" class="dlb" style="width:33%">
          <span v-if="!isEdit" class="detailfont">{{hospital.funSettings.isSmartRecommend ? '开通':'未开通'}}</span>
          <RadioGroup v-if="isEdit" v-model="organizationVo.funSettings.isSmartRecommend">
              <Radio label="1">开通</Radio>
              <Radio label="0">不开通</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="手动退款：" class="dlb" style="width:33%">
          <span v-if="!isEdit" class="detailfont">{{hospital.funSettings.supportManualRefund ? '支持':'未支持'}}</span>
          <RadioGroup v-if="isEdit" v-model="organizationVo.funSettings.supportManualRefund">
              <Radio label="1">支持</Radio>
              <Radio label="0">不支持</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="非平台报告C端展示：" class="dlb" style="width:33%">
          <span v-if="!isEdit" class="detailfont">{{hospital.funSettings.showNonPlatformExamReport ? '展示':'不展示'}}</span>
          <RadioGroup v-if="isEdit" v-model="organizationVo.funSettings.showNonPlatformExamReport">
              <Radio label="1">展示</Radio>
              <Radio label="0">不展示</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="体检报告查看情况：" class="dlb" style="width:33%">
          <span v-if="!isEdit" class="detailfont">{{hospital.funSettings.showExamReportInspectTab ? '开通':'不开通'}}</span>
          <RadioGroup v-if="isEdit" v-model="organizationVo.funSettings.showExamReportInspectTab">
              <Radio label="1">开通</Radio>
              <Radio label="0">不开通</Radio>
          </RadioGroup>
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
        organizationVo : {
          funSettings: {
            hospitalId:'',
            allowAdjustPrice: '',
            exportWithNoExamDate: '',
            isSmartRecommend: '',
            supportManualRefund: '',
            openGroupExamReport: '',
            sameDayOrderMaximum: 1,
          },
        },
        isEdit: false,
      }
  },

  props: ['hospital'],

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
    padding-right:5px;
  }
</style>
