<template>
  <div>
    <div class="form-term">
      <div class="form-header-title">
        <span class="fl">更多信息</span>
        <a v-if="!isEdit" v-permission="'hospitalManage:list:basicMoreEdit'" class="fr" @click="clickEdit"><Icon type="edit"></Icon>编辑</a>
      </div>
      <Form :model="organizationVo" :label-width="120">
        <FormItem label="体检中心信息" style="font-weight: bold;">
        </FormItem>
        <FormItem label="体检电话：" class="dlb" :class="{'ivu-form-item-required':isEdit}" style="width:33%">
          <span v-if="!isEdit" class="detailfont">{{hospital.hospital.phone}}</span>
          <Input v-if="isEdit" type="text" v-model="organizationVo.hospital.phone" placeholder="体检电话" style="width:90%" />
        </FormItem>
        <FormItem label="团检电话：" class="dlb" :class="{'ivu-form-item-required':isEdit}" style="width:33%">
          <span v-if="!isEdit" class="detailfont">{{hospital.basicSettings.groupExamTel}}</span>
          <Input v-if="isEdit" type="text" v-model="organizationVo.basicSettings.groupExamTel" placeholder="团检电话" style="width:90%" />
        </FormItem>
        <br/>
        <FormItem label="客服电话：" class="dlb" :class="{'ivu-form-item-required':isEdit}" style="width:33%">
          <span v-if="!isEdit" class="detailfont">{{hospital.basicSettings.serviceTel}}</span>
          <Input v-if="isEdit" type="text" v-model="organizationVo.basicSettings.serviceTel" placeholder="客服电话" style="width:90%" />
        </FormItem>
        <FormItem label="技术支持：" class="dlb" :class="{'ivu-form-item-required':isEdit}" style="width:33%">
          <span v-if="!isEdit" class="detailfont">{{hospital.basicSettings.technicalTel}}</span>
          <Input v-if="isEdit" type="text" v-model="organizationVo.basicSettings.technicalTel" placeholder="技术支持" style="width:90%" />
        </FormItem>
        <FormItem label="医院标签：" :class="{'ivu-form-item-required':isEdit}">
          <span v-if="!isEdit" class="detailfont">{{hospital.hospital.keywords}}</span>
          <Input v-if="isEdit"  type="text"  v-model="organizationVo.hospital.keywords" placeholder="请输入关键词，关键词用‘|’隔开，如‘健康管理|专业体检中心’" style="width:90%" />
        </FormItem>
        <FormItem label="体检须知：" :class="{'ivu-form-item-required':isEdit}">
          <span v-if="!isEdit" class="detailfont">{{hospital.hospital.examNotice}}</span>
          <Input v-if="isEdit" type="textarea" v-model="organizationVo.hospital.examNotice" placeholder="最多500字" style="width:90%" />
        </FormItem>
        <FormItem label="提供早餐：">
          <span v-if="!isEdit" class="detailfont">{{hospital.basicSettings.isBreakfast ? '提供':'不提供'}}</span>
          <RadioGroup v-if="isEdit" v-model="organizationVo.basicSettings.isBreakfast">
            <Radio label="1">提供</Radio>
            <Radio label="0">不提供</Radio>
          </RadioGroup>
        </FormItem>

        <div class="parting-line"></div>

        <FormItem label="体检中心信息" style="font-weight: bold;">
        </FormItem>
        <FormItem label="简介：">
          <span v-if="!isEdit" class="detailfont">{{hospital.hospital.briefIntro}}</span>
          <Input v-if="isEdit" type="textarea" v-model="organizationVo.hospital.briefIntro" :maxlength="500" placeholder="最多500字" style="width:90%" />
        </FormItem>
        <FormItem label="详细介绍：">
          <span v-if="!isEdit" class="detailfont">{{hospital.hospital.detailIntro}}</span>
          <Input v-if="isEdit" type="textarea" v-model="organizationVo.hospital.detailIntro" :maxlength="500" placeholder="最多500字" style="width:90%" />
        </FormItem>
        <FormItem>
          <div v-if="errorInfoStatus" class="error">{{errorInfo}}</div>
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
import { mapState } from 'vuex'

export default {
  name: 'moreInfo',
  data() {
      return {
        organizationVo: {
          hospital: {
            briefIntro: '',
            detailIntro: '',
            examNotice: '',
            id: '',
            keywords: '',
            phone: '',
          },
          basicSettings: {
            groupExamTel: '',
            isBreakfast: '',
            serviceTel: '',
            technicalTel: ''
          }
        },
        isEdit: false,
        errorInfo: '',
        errorInfoStatus: false,
      }
  },

  props: ['hospital'],

  mounted() {
  },

  methods: {

    save(){
      if(!this.organizationVo.hospital.phone){
        this.errorInfo = '体检电话不能为空！';
        this.errorInfoStatus = true;
        return false;
      }
      if(this.organizationVo.hospital.phone && !MyUtil.isPhone(this.organizationVo.hospital.phone)){
        this.errorInfo = '体检电话格式不正确,只能输入30位以内数字及“-”！';
        this.errorInfoStatus = true;
        return false;
      }
      if(!this.organizationVo.basicSettings.groupExamTel){
        this.errorInfo = '团检电话不能为空！';
        this.errorInfoStatus = true;
        return false;
      }
      if(this.organizationVo.basicSettings.groupExamTel && !MyUtil.isPhone(this.organizationVo.basicSettings.groupExamTel)){
        this.errorInfo = '团检电话格式不正确,只能输入30位以内数字及“-”！';
        this.errorInfoStatus = true;
        return false;
      }
      if(!this.organizationVo.basicSettings.serviceTel){
        this.errorInfo = '客服电话不能为空！';
        this.errorInfoStatus = true;
        return false;
      }
      if(this.organizationVo.basicSettings.serviceTel && !MyUtil.isPhone(this.organizationVo.basicSettings.serviceTel)){
        this.errorInfo = '客服电话格式不正确,只能输入30位以内数字及“-”！';
        this.errorInfoStatus = true;
        return false;
      }
      if(!this.organizationVo.basicSettings.technicalTel){
        this.errorInfo = '技术支持电话不能为空！';
        this.errorInfoStatus = true;
        return false;
      }
      if(this.organizationVo.basicSettings.technicalTel && !MyUtil.isPhone(this.organizationVo.basicSettings.technicalTel)){
        this.errorInfo = '技术支持电话格式不正确,只能输入30位以内数字及“-”！';
        this.errorInfoStatus = true;
        return false;
      }
      if(!this.organizationVo.hospital.keywords){
        this.errorInfo = '医院标签不能为空！';
        this.errorInfoStatus = true;
        return false;
      }
      if(this.organizationVo.hospital.keywords && this.organizationVo.hospital.keywords.length > 50){
        this.errorInfo = '医院标签长度最大为50字！';
        this.errorInfoStatus = true;
        return false;
      }
      if(!this.organizationVo.hospital.examNotice){
        this.errorInfo = '体检须知不能为空！';
        this.errorInfoStatus = true;
        return false;
      }
      if(this.organizationVo.hospital.examNotice && this.organizationVo.hospital.examNotice.length > 5000){
        this.errorInfo = '体检须知长度不能超过5000字！';
        this.errorInfoStatus = true;
        return false;
      }
     if(this.organizationVo.hospital.briefIntro && this.organizationVo.hospital.briefIntro.length > 5000){
        this.errorInfo = '简介最多5000字！';
        this.errorInfoStatus = true;
        return false;
      }
      if(this.organizationVo.hospital.detailIntro && this.organizationVo.hospital.detailIntro.length > 5000){
        this.errorInfo = '详细介绍最多5000字！';
        this.errorInfoStatus = true;
        return false;
      }


     //清空地址选择
     this.organizationVo.addressIds = undefined;

     this.$http.post('/hospitalMoreInfo',JSON.stringify(this.organizationVo)).then((response) => {
          this.$Message.success('操作成功');
          this.isEdit = false;
          this.errorInfoStatus = false;
          this.$emit('reload');
      }, (res) => {
          this.$Message.error(res.text);
          this.errorInfoStatus = false;
      });
    },

    clickEdit(){
      this.isEdit = true;
      this.organizationVo = JSON.parse(JSON.stringify(this.hospital));
    },

    cancelValidate(){
      this.isEdit = false;
      this.errorInfoStatus = false;
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