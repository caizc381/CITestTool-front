<template>
  <div>
    <div class="form-term">
      <div class="form-header-title">
        <span class="fl">业务运营人员</span>
        <a v-if="!isEdit" v-permission="'hospitalManage:list:businessEdit'" class="fr" @click="clickEdit"><Icon type="edit"></Icon>编辑</a>
      </div>
      <Form :model="organizationVo" :label-width="120">
        <FormItem label="管理员" style="font-weight: bold;">
        </FormItem>
        <FormItem label="姓名：" class="dlb" :class="{'ivu-form-item-required':isEdit}" style="width:33%">
          <span v-if="!isEdit" class="detailfont">{{hospital.manager.managerName}}</span>
          <Input v-if="isEdit" type="text" v-model="organizationVo.manager.managerName" placeholder="姓名" style="width: 200px"></Input>
        </FormItem>
        <FormItem label="性别：" class="dlb" style="width:33%">
           <span v-if="!isEdit" class="detailfont">{{hospital.manager.gender ? '女':'男'}}</span>
           <RadioGroup v-if="isEdit" v-model="organizationVo.manager.gender">
              <Radio label="0">男</Radio>
              <Radio label="1">女</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="手机号：" class="dlb" :class="{'ivu-form-item-required':isEdit}" style="width:33%">
          <span v-if="!isEdit" class="detailfont">{{hospital.manager.mobile}}</span>
          <Input v-if="isEdit" type="text" v-model="organizationVo.manager.mobile" placeholder="手机号" style="width: 200px">
          </Input>
        </FormItem>
        <FormItem label="crm账号：" :class="{'ivu-form-item-required':isEdit}">
          <span v-if="!isEdit" class="detailfont">{{hospital.manager.username}}</span>
          <div v-if="isEdit">
            <span v-if="!editCrm">{{organizationVo.manager.username}}
              <Button v-permission="'hospitalManage:list:crmUserNameEdit'" type="text" @click="editCrm=true">更改</Button>
            </span>
            <Input v-if="editCrm" type="text" v-model="organizationVo.manager.username" placeholder="crm账号" style="width: 200px" @on-blur="verifyManagerName">
          </Input>
          </div>

        </FormItem>

        <div class="parting-line"></div>

        <FormItem label="业务联系人" style="font-weight: bold;">
        </FormItem>
        <FormItem  label="姓名：" class="dlb" style="width:33%">
          <span v-if="!isEdit" class="detailfont">{{hospital.mediatorInfo.name}}</span>
          <Input v-if="isEdit" type="text" :maxlength="10" v-model="organizationVo.mediatorInfo.name" placeholder="姓名" style="width: 200px">
          </Input>
        </FormItem>
        <FormItem  label="手机号：" class="dlb" style="width:33%">
          <span v-if="!isEdit" class="detailfont">{{hospital.mediatorInfo.mobile}}</span>
          <Input v-if="isEdit" type="text" v-model="organizationVo.mediatorInfo.mobile" placeholder="手机号" style="width: 200px">
          </Input>
        </FormItem>
         <FormItem label="邮箱：" class="dlb" style="width:33%">
          <span v-if="!isEdit" class="detailfont">{{hospital.mediatorInfo.mail}}</span>
          <Input v-if="isEdit" type="text" v-model="organizationVo.mediatorInfo.mail" placeholder="邮箱" style="width: 200px">
          </Input>
        </FormItem>

        <div class="parting-line"></div>

        <FormItem label="平台运营经理" style="font-weight: bold;">
        </FormItem>
        <FormItem  label="姓名：">
          <span v-if="!isEdit" class="detailfont">{{hospital.opsManager.employeeName}}</span>
          <div v-if="isEdit">
            <mt-select
             style="width: 200px"
             v-model="organizationVo.opsManager.id"
             placeholder="请选择运营经理"
             @on-change="changeManager"
             :filters="['name', 'pinYin']"
             :options="managerList" />
          </div>
        </FormItem>
        <FormItem label="年业务量：">
          <span v-if="!isEdit" class="detailfont">{{hospital.basicSettings.businessAmount}}</span>
          <InputNumber v-if="isEdit" placeholder="上一年业务量" :max="9999999999" :min="0" v-model="organizationVo.basicSettings.businessAmount" style="width: 200px"></InputNumber>
          <span class="detailfont">万</span>
        </FormItem>
        <FormItem label="运营备注：">
          <span v-if="!isEdit" class="detailfont">{{hospital.basicSettings.opsRemark}}</span>
          <Input v-if="isEdit" type="textarea" :maxlength="500" v-model="organizationVo.basicSettings.opsRemark" placeholder="最多500字" style="width: 200px">
          </Input>
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
  name: 'managerInfo',
  data() {
      return {
        organizationVo: {
          hospital: {
            id: '',

          },
          basicSettings: {
            businessAmount: 0,
            opsRemark: '',
          },
          manager: {
            gender: '',
            id: '',
            managerName: '',
            mobile: '',
            username: '',
          },
          mediatorInfo: {
            mail: '',
            mobile: '',
            name: '',
            organizationId: '',
          },
          opsManager: {
            departName: '',
            departmentId: '',
            employeeName: '',
            id: '',
            mobile: '',
          },
        },
        managerList: [],
        isEdit: false,
        isRepeatManagerName: false,
        errorInfo: '',
        errorInfoStatus: false,
        editCrm: false
      }
  },

  props: ['hospital'],

  mounted() {
  },

  methods: {

    save(){
      if(!this.organizationVo.manager.managerName){
        this.errorInfo = '管理员姓名不能为空！';
        this.errorInfoStatus = true;
        return false;
      }
      if(!this.organizationVo.manager.mobile){
        this.errorInfo = '管理员手机用于关键信息接收及密码找回，不能为空！';
        this.errorInfoStatus = true;
        return false;
      }
      if(this.organizationVo.manager.mobile && !MyUtil.isPhone(this.organizationVo.manager.mobile)){
        this.errorInfo = '管理员手机号不正确,只能输入30位以内数字及“-”！';
        this.errorInfoStatus = true;
        return false;
      }
      if(!this.organizationVo.manager.username){
        this.errorInfo = 'crm账号名不能为空！';
        this.errorInfoStatus = true;
        return false;
      }
      if(this.organizationVo.manager.username && !MyUtil.isCrmName(this.organizationVo.manager.username)){
        this.errorInfo = 'crm账号名输入数字及字母！';
        this.errorInfoStatus = true;
        return false;
      }
      if(this.organizationVo.mediatorInfo.name && this.organizationVo.mediatorInfo.name.length > 10){
        this.errorInfo = '业务联系人姓名长度不能超过10个字！';
        this.errorInfoStatus = true;
        return false;
      }
      if(this.organizationVo.mediatorInfo.mobile && !MyUtil.isPhone(this.organizationVo.mediatorInfo.mobile)){
        this.errorInfo = '业务联系人手机号不正确,只能输入30位以内数字及“-”！';
        this.errorInfoStatus = true;
        return false;
      }
      if(this.organizationVo.mediatorInfo.mail && !MyUtil.isEmail(this.organizationVo.mediatorInfo.mail)){
        this.errorInfo = '业务联系人邮箱不正确';
        this.errorInfoStatus = true;
        return false;
      }
      if(this.organizationVo.basicSettings.businessAmount && !MyUtil.isBusinessAmount(this.organizationVo.basicSettings.businessAmount)){
        this.errorInfo = '年业务量格式不正确，只能填入数字，最长10个数字！';
        this.errorInfoStatus = true;
        return false;
      }
      if(this.organizationVo.basicSettings.opsRemark && this.organizationVo.basicSettings.opsRemark.length > 5000){
        this.errorInfo = '运营备注最多5000字！';
        this.errorInfoStatus = true;
        return false;
      }
     //清空地址选择
     this.organizationVo.addressIds = undefined;

     if(!this.organizationVo.manager.userId){
       this.organizationVo.manager.userId = undefined;
     }

     this.$http.post('/businessManager',JSON.stringify(this.organizationVo)).then((response) => {
          this.$Message.success('操作成功');
          this.isEdit = false;
          this.errorInfoStatus = false;
          this.$emit('reload');
      }, (res) => {
          this.$Message.error(res.text);
      });
    },

    //获取平台运营经理列表
    getManagerList() {
      this.$http.get('/user/getOperationInfo').then((response) => {
          this.managerList = response.body;
          for(let i = 0; i<this.managerList.length; i++){
            this.managerList[i].name = this.managerList[i].employeeName;
          }
      }, (res) => {
          this.$Message.error(res.text);
      });
    },

    changeManager(id){
        if(!id){
           this.organizationVo.opsManager.id = '';
         }else{
          this.getManagerList();
         }
      },

    clickEdit(){
      this.getManagerList();
      this.isEdit = true;
      this.organizationVo = JSON.parse(JSON.stringify(this.hospital));
      this.organizationVo.basicSettings.businessAmount = parseInt(this.hospital.basicSettings.businessAmount);
    },

    //验证管理员名称是否重复
    verifyManagerName(){
      if(!this.organizationVo.manager.username){
        return false;
      }

      var url = '/validateUserName?organizationType=1&userName='+this.organizationVo.manager.username;
      if(this.organizationVo.manager.userId){
        url += '&userId=' + this.organizationVo.manager.userId
      }

      this.$http.get(url).then((response) => {
      }, (res) => {
          this.$Message.error(res.text);
      });
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
