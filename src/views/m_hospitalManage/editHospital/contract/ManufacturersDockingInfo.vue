<template>
  <div>
    <div class="form-term">
      <div class="form-header-title">
        <span class="fl">体检软件厂商对接信息</span>
        <a v-if="!isEdit" v-permission="'hospitalManage:list:hisInfo'" class="fr" @click="clickEdit"><Icon type="edit"></Icon>编辑</a>
      </div>
      <Form :model="organizationVo" :label-width="120" ref="newHos">
     
        <div v-if="!isEdit">
          <FormItem label="厂商联系人" style="font-weight: bold;">
          </FormItem>
          <FormItem label="姓名：" class="dlb" style="width:33%">
            <span v-if="hospital.hisMediator" class="detailfont">{{hospital.hisMediator.name}}</span>
          </FormItem>
          <FormItem label="手机号：" class="dlb" style="width:33%">
             <span v-if="hospital.hisMediator" class="detailfont">{{hospital.hisMediator.mobile}}</span>
          </FormItem>
          <FormItem label="座机号：" class="dlb" style="width:33%">
             <span v-if="hospital.hisMediator" class="detailfont">{{hospital.hisMediator.telephone}}</span>
          </FormItem>

          <div class="parting-line"></div>

          <FormItem label="其他对接信息" style="font-weight: bold;">
          </FormItem>
          <FormItem label="厂商品牌：" class="dlb" style="width:33%">
            <span v-if="hospital" class="detailfont">{{hospital.cooperateCompany}}</span>
          </FormItem>
          <FormItem label="对接方式：" class="dlb" style="width:33%">
             <span v-if="hospital" class="detailfont">{{hospital.cooperateType == 1 ? '厂商对接': (hospital.cooperateType == 0 ? '自对接':'')}}</span>
          </FormItem>
          <FormItem label="对接费用：" class="dlb" style="width:33%">
             <span v-if="hospital" class="detailfont">{{hospital.mediatorPrice}}元</span>
          </FormItem>
          <FormItem label="备注：">
            <span v-if="hospital" class="detailfont">{{hospital.coopCompanyRemark}}</span>
          </FormItem>

        </div>

        <div v-if="isEdit">
          <FormItem label="厂商联系人" style="font-weight: bold;">
          </FormItem>
          <FormItem label="姓名：" class="dlb" style="width:33%">
            <Input type="text" :maxlength="10" v-model="organizationVo.hisMediator.name" placeholder="姓名">
            </Input>
          </FormItem>
          <FormItem label="手机号：" class="dlb" style="width:33%">
             <Input type="text" :maxlength="30" v-model="organizationVo.hisMediator.mobile" placeholder="手机号">
            </Input>
          </FormItem>
          <FormItem label="座机号：" class="dlb" style="width:33%">
            <Input  type="text" :maxlength="30" v-model="organizationVo.hisMediator.telephone" placeholder="座机号">
            </Input>
          </FormItem>

          <div class="parting-line"></div>

          <FormItem label="其他对接信息" style="font-weight: bold;">
          </FormItem>
          <FormItem label="厂商品牌：" class="dlb" style="width:33%">
            <Dropdown trigger="click" placement="bottom-start" @on-click="handleCurrent" style="width: 100%">
              <Input class="ml5" v-model="organizationVo.cooperateCompany" placeholder="请选择"></Input>
              <Dropdown-menu slot="list" >
                <div style="max-height:500px;overflow-y: scroll;">
                  <DropdownItem v-for="com in companyList" :name="com">{{ com }}</DropdownItem>
                </div>
              </Dropdown-menu>
            </Dropdown>
          </FormItem>
          <FormItem label="对接方式：" class="dlb" style="width:33%">
              <Select v-if="isEdit" v-model="organizationVo.cooperateType" >
               <Option value="0" label="自对接"></Option>
               <Option value="1" label="厂商对接"></Option>
             </Select>
          </FormItem>
          <FormItem label="对接费用：" class="dlb" style="width:33%">
             <InputNumber  :max="99999999" :min="0" :step="1" v-model="organizationVo.mediatorPrice"></InputNumber>元
          </FormItem>
          <FormItem label="备注：">
            <Input type="textarea"  :maxlength="5000" v-model="organizationVo.coopCompanyRemark" placeholder="建议输入对接相关注意事项等内容，最多5000字" style="width:90%">
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
import { mapState } from 'vuex'

export default {
  name: 'ManufacturersDockingInfo',
  data() {
    return {
      organizationVo: {
        hisMediator: {
          gender: '',
          id: '',
          mobile: '',
          name: '',
          remark: '',
          telephone: '',
          type: '',     
        },
        cooperateCompany: '',
        cooperateRemark: '',
        cooperateType: '',
        mediatorPrice: 0,
        hospital: {
          id: '',
          name: '',
        }  
      },
      isEdit: false,
      companyList: [],
      errorInfoStatus: false,
      errorInfo: '',
    }
  },

  props: ['hospital','hospitalId'],

  mounted() {
    this.getCompany();
    this.query = this.organizationVo.cooperateCompany
  },

  watch:{
     'organizationVo.cooperateCompany': function(val){
        this.companyList = this.allCompanyList.filter(item =>{
          return item.indexOf(val)>= 0 ;
        })
     }
   },

  methods: {

    getCompany(){
      this.$http.post('/getCooperateCompany').then((response) => {
         this.companyList = response.body;
         this.allCompanyList = response.body;
      }, (res) => {
          this.$Message.error(res.text);
      });
    },

    save(){
      this.organizationVo.hospital = {
        id: this.hospitalId
      }

      if(this.organizationVo.hisMediator.mobile && !MyUtil.isPhone(this.organizationVo.hisMediator.mobile)){
        this.errorInfo = '手机号不正确,只能输入30位以内数字及“-”！';
        this.errorInfoStatus = true;
        return false;
      }

      if(this.organizationVo.hisMediator.telephone && !MyUtil.isPhone(this.organizationVo.hisMediator.telephone)){
        this.errorInfo = '固定电话不正确,只能输入30位以内数字及“-”！';
        this.errorInfoStatus = true;
        return false;
      }

      this.$http.post('/editHisMediatorInfo',JSON.stringify(this.organizationVo)).then((response) => {
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

      if(this.hospital.hisMediator){
        this.organizationVo.hisMediator = JSON.parse(JSON.stringify(this.hospital.hisMediator))
      }

      if(this.hospital.cooperateCompany){
        this.organizationVo.cooperateCompany = this.hospital.cooperateCompany
      }

      if(this.hospital.coopCompanyRemark){
        this.organizationVo.coopCompanyRemark = this.hospital.coopCompanyRemark
      }

      if(this.hospital.cooperateType != null){
        this.organizationVo.cooperateType = this.hospital.cooperateType +''
      }

      if(this.hospital.mediatorPrice){
        this.organizationVo.mediatorPrice = this.hospital.mediatorPrice
      }

      if(this.hospital.hospital){
        this.organizationVo.hospital = JSON.parse(JSON.stringify(this.hospital.hisMediator))
      }      
    },

    handleCurrent(value){
      this.organizationVo.cooperateCompany = value
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
 .newCom {
   text-align: center;
   padding: 0 5px;
   border-top:1px solid #ccc;
   cursor: pointer;
 }
</style>