<template>
  <div>
    <div class="form-term">
      <div class="form-header-title">
        <span class="fl">医院合作联系人信息</span>
        <a v-if="!isEdit" v-permission="'hospitalManage:list:hospitalContact'" class="fr" @click="clickEdit"><Icon type="edit"></Icon>编辑</a>
      </div>
      <Form :model="organizationVo" :label-width="120" ref="newHos">

        <div v-if="!isEdit">
          <FormItem label="主任" style="font-weight: bold;">
          </FormItem>
          <FormItem label="姓名：" class="dlb" style="width:33.33%">
            <span v-if="hospital.examMediator" class="detailfont">{{hospital.examMediator.name}}</span>
          </FormItem>
          <FormItem label="性别：" class="dlb" style="width:33.33%">
             <span v-if="hospital.examMediator" class="detailfont">{{hospital.examMediator.gender ? '女':'男'}}</span>
          </FormItem>
          <FormItem label="手机号：" class="dlb" style="width:33.33%">
             <span v-if="hospital.examMediator" class="detailfont">{{hospital.examMediator.mobile}}</span>
          </FormItem>
          <FormItem label="固定电话：" class="dlb" style="width:33.33%">
             <span v-if="hospital.examMediator" class="detailfont">{{hospital.examMediator.telephone}}</span>
          </FormItem>
          <FormItem label="备注：">
            <span v-if="hospital.examMediator" class="detailfont">{{hospital.examMediator.remark}}</span>
          </FormItem>

          <div class="parting-line"></div>

          <FormItem label="信息科联系人" style="font-weight: bold;">
          </FormItem>
          <FormItem label="姓名：" class="dlb" style="width:33.33%">
            <span v-if="hospital.infoMediator" class="detailfont">{{hospital.infoMediator.name}}</span>
          </FormItem>
          <FormItem label="性别：" class="dlb" style="width:33.33%">
             <span v-if="hospital.infoMediator" class="detailfont">{{hospital.infoMediator.gender ? '女':'男'}}</span>
          </FormItem>
          <FormItem label="手机号：" class="dlb" style="width:33.33%">
             <span v-if="hospital.infoMediator" class="detailfont">{{hospital.infoMediator.mobile}}</span>
          </FormItem>
          <FormItem label="固定电话：" class="dlb" style="width:33.33%">
             <span v-if="hospital.infoMediator" class="detailfont">{{hospital.infoMediator.telephone}}</span>
          </FormItem>
          <FormItem label="备注：">
            <span v-if="hospital.infoMediator" class="detailfont">{{hospital.infoMediator.remark}}</span>
          </FormItem>
        </div>

        <div v-if="isEdit">
          <FormItem label="主任" style="font-weight: bold;">
          </FormItem>
          <FormItem label="姓名：" class="dlb" style="width:33.33%">
            <Input  type="text" :maxlength="10" v-model="organizationVo.examMediator.name" placeholder="请输入姓名" style="width:90%">
            </Input>
          </FormItem>
          <FormItem label="性别：" class="dlb" style="width:33.33%">
             <RadioGroup v-model="organizationVo.examMediator.gender">
                <Radio label="0">男</Radio>
                <Radio label="1">女</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="手机号：" class="dlb" style="width:33.33%">
             <Input type="text" :maxlength="30" v-model="organizationVo.examMediator.mobile" placeholder="手机号" style="width:90%">
            </Input>
          </FormItem>
          <FormItem label="固定电话：" class="dlb" style="width:33.33%">
            <Input type="text" :maxlength="30" v-model="organizationVo.examMediator.telephone" placeholder="固定电话" style="width:90%">
            </Input>
          </FormItem>
          <FormItem label="备注：">
            <Input type="textarea" :maxlength="500" v-model="organizationVo.examMediator.remark" placeholder="建议填此联系人的兴趣爱好、禁忌等注意内容，最多500字" style="width:90%">
            </Input>
          </FormItem>

          <div class="parting-line"></div>

          <FormItem label="信息科联系人" style="font-weight: bold;">
          </FormItem>
          <FormItem label="姓名：" class="dlb" style="width:33.33%">
            <Input  type="text" :maxlength="10" v-model="organizationVo.infoMediator.name" placeholder="请输入姓名" style="width:90%">
            </Input>
          </FormItem>
          <FormItem label="性别：" class="dlb" style="width:33.33%">
             <RadioGroup v-model="organizationVo.infoMediator.gender">
                <Radio label="0">男</Radio>
                <Radio label="1">女</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="手机号：" class="dlb" style="width:33.33%">
             <Input type="text" :maxlength="30" v-model="organizationVo.infoMediator.mobile" placeholder="手机号" style="width:90%">
            </Input>
          </FormItem>
          <FormItem label="固定电话：" class="dlb" style="width:33.33%">
            <Input type="text" :maxlength="30" v-model="organizationVo.infoMediator.telephone" placeholder="固定电话" style="width:90%">
            </Input>
          </FormItem>
          <FormItem label="备注：">
            <Input type="textarea" :maxlength="500" v-model="organizationVo.infoMediator.remark" placeholder="建议填此联系人的兴趣爱好、禁忌等注意内容，最多500字" style="width:90%">
            </Input>
          </FormItem>
        </div>

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
export default {
  name: 'HosContactsInfo',
  data() {
    return {
      organizationVo: {
        infoMediator: {
          gender: '',
          id: '',
          mobile: '',
          name: '',
          remark: '',
          telephone: '',
          type: '',     
        },
        examMediator: {
          gender: '',
          id: '',
          mobile: '',
          name: '',
          remark: '',
          telephone: '',
          type: '',     
        }    
      },
      isEdit: false,
      errorInfoStatus: false,
      errorInfo: '',
    }
  },

  props: ['hospital','hospitalId'],

  mounted() {
  },

  methods: {

    save(){
      var contract = [];
      this.organizationVo.examMediator.organizationId = this.hospitalId;
      this.organizationVo.examMediator.type = 2;
      this.organizationVo.infoMediator.organizationId = this.hospitalId;
      this.organizationVo.infoMediator.type = 3;
      contract.push(this.organizationVo.examMediator);
      contract.push(this.organizationVo.infoMediator);

      if(this.organizationVo.examMediator.mobile && !MyUtil.isPhone(this.organizationVo.examMediator.mobile)){
        this.errorInfo = '主任手机号不正确,只能输入30位以内数字及“-”！';
        this.errorInfoStatus = true;
        return false;
      }

      if(this.organizationVo.examMediator.telephone && !MyUtil.isPhone(this.organizationVo.examMediator.telephone)){
        this.errorInfo = '主任固定电话不正确,只能输入30位以内数字及“-”！';
        this.errorInfoStatus = true;
        return false;
      }

      if(this.organizationVo.infoMediator.mobile && !MyUtil.isPhone(this.organizationVo.infoMediator.mobile)){
        this.errorInfo = '信息科联系人手机号不正确,只能输入30位以内数字及“-”！';
        this.errorInfoStatus = true;
        return false;
      }

      if(this.organizationVo.infoMediator.telephone && !MyUtil.isPhone(this.organizationVo.infoMediator.telephone)){
        this.errorInfo = '信息科联系人固定电话不正确,只能输入30位以内数字及“-”！';
        this.errorInfoStatus = true;
        return false;
      }
      
      this.$http.post('/editMediatorInfo',JSON.stringify(contract)).then((response) => {
          this.$Message.success('操作成功');
          this.isEdit = false;
          this.errorInfoStatus = false;
          this.$emit('reload');
      }, (res) => {
          this.$Message.error(res.text);
      });
    },

    clickEdit(){
      this.isEdit = true;
      
      if(this.hospital.infoMediator){
        this.organizationVo.infoMediator = JSON.parse(JSON.stringify(this.hospital.infoMediator))
      }

      if(this.hospital.examMediator){
        this.organizationVo.examMediator = JSON.parse(JSON.stringify(this.hospital.examMediator))
      }
    },

    cancelValidate(){
      this.isEdit = false;
      this.$emit('reload');
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
  #main {
  width: 480px;
  height: 480px; 
 }
</style>