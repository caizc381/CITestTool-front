import BasicInfo from './basic/BasicInfo'
import ManagerInfo from './basic/ManagerInfo'
import MoreInfo from './basic/MoreInfo'
import FunctionInfo from './function/FunctionInfo'
import BusinessInfo from './function/BusinessInfo'
import MedicalAppointment from './function/MedicalAppointment'
import DiscountInfo from './cooperation/DiscountInfo'
import OtherDiscountInfo from './cooperation/OtherDiscountInfo'
import MobileSite from './site/MobileSite'
import HosContactsInfo from './contract/HosContactsInfo'
import HosContractInfo from './contract/HosContractInfo'
import ManufacturersDockingInfo from './contract/ManufacturersDockingInfo'
import MessageInfo from './message/MessageInfo'
import Questionnaire from './questionnaire/Questionnaire'
import { mapState } from 'vuex'
import DropdownSelect from 'components/ui/DropdownSelect'


const editHospital = {
   name:'editHospital',
   components: {
    'basic-info': BasicInfo,
    'manager-info': ManagerInfo,
    'more-info': MoreInfo,
    'function-info': FunctionInfo,
    'business-info': BusinessInfo,
    'medical-appointment': MedicalAppointment,
    'discount-info': DiscountInfo,
    'other-discount-info': OtherDiscountInfo,
    'mobile-site': MobileSite,
    'hoscontacts-info': HosContactsInfo,
    'hoscontract-info': HosContractInfo,
    'manufacturersdocking-info': ManufacturersDockingInfo,
    'message-info': MessageInfo,
    'questionnaire': Questionnaire,
    'dropdown-select': DropdownSelect
   },
   data(){
     return {
       hospitalInfo: {},
       functionInfo: {},
       cooperationInfo: {},
       siteInfo: {},
       signInfo: {},
       messageInfo: {},
       queInfo: {},
       hospitalList: [],
       allHospitalList: [],
       currentHos: {
        id:'',
        name:''
       },
       query: '',
       currentTab: 'basic',
     }
   },

   watch:{
     currentHos: {
        handler :function(val){
          this.currentTab == 'basic' && this.getBasicDetail(val.id);
          this.currentTab == 'function' && this.getFunctionDetail(val.id);
          this.currentTab == 'cooperation' && this.getCooperationDetail(val.id);
          this.currentTab == 'site' && this.getSiteDetail(val.id);
          this.currentTab == 'sign' && this.getSignDetail(val.id);
          this.currentTab == 'message' && this.getMessageDetail(val.id);
          this.currentTab == 'questionnaire' && this.getQuestionDetail(val.id);
        },
        deep: true
     }
   },

   mounted(){
     this.currentTab = this.$route.params.tab;
     this.currentTab == 'basic' && this.getBasicDetail();
     this.currentTab == 'function' && this.getFunctionDetail();
     this.currentTab == 'cooperation' && this.getCooperationDetail();
     this.currentTab == 'site' && this.getSiteDetail();
     this.currentTab == 'sign' && this.getSignDetail();
     this.currentTab == 'message' && this.getMessageDetail();
     this.currentTab == 'questionnaire' && this.getQuestionDetail();
     this.getHospitalList();
   },

   methods: {
     //获取基本信息
     getBasicDetail(id=this.$route.params.hospitalId){
      this.$http.get('/hospitalDetail?hospitalId='+id).then((response) => {
          this.hospitalInfo = response.body;
          this.hospitalInfo.hospital.addressIds = this.hospitalInfo.addressIds;
          this.$refs.basic && this.$refs.basic.getBrandList();
       }, (res) => {
          this.$Message.error(res.text);
      });
     },

     //获取功能配置信息
     getFunctionDetail(id=this.$route.params.hospitalId){
      this.$http.get('/funSettingsInfo?hospitalId='+id).then((response) => {
          this.functionInfo = response.body;
       }, (res) => {
          this.$Message.error(res.text);
      });
     },

     //获取平台合作信息
     getCooperationDetail(id=this.$route.params.hospitalId){
      this.$http.get('/cooperationInfo?hospitalId='+id).then((response) => {
          this.cooperationInfo = response.body;
       }, (res) => {
          this.$Message.error(res.text);
      });
     },

     //获取站点设置信息
     getSiteDetail(id=this.$route.params.hospitalId){
      this.$http.get('/hospitalSiteInfo?hospitalId='+id).then((response) => {
          this.siteInfo = response.body;
       }, (res) => {
          this.$Message.error(res.text);
      });
     },

     //获取签约对接信息
     getSignDetail(id=this.$route.params.hospitalId){
      this.$http.get('/signDetail?hospitalId='+id).then((response) => {
          this.signInfo = response.body;
       }, (res) => {
          this.$Message.error(res.text);
      });
     },

     //获取消息设置信息
     getMessageDetail(id=this.$route.params.hospitalId){
      this.$http.get('/hospitalsms?hospitalId='+id).then((response) => {
          this.messageInfo = response.body;
       }, (res) => {
          this.$Message.error(res.text);
      });
     },

     //获取消息设置信息
     getQuestionDetail(id=this.$route.params.hospitalId){
      this.$http.get('/getAllSurvey?hospitalId='+id).then((response) => {
          this.queInfo = response.body;
       }, (res) => {
          this.$Message.error(res.text);
      });
     },

     //获取体检中心列表
      getHospitalList() {
        this.$http.get('/hospitalList').then((response) => {
            this.allHospitalList = response.body;
            this.hospitalList = response.body;
            this.currentHos = this.getHosName(this.$route.params.hospitalId);
        }, (res) => {
            this.$Message.error(res.text);
        });
      },

      handleCurrent(value){
        this.currentHos = this.getHosName(value);
      },

      getHosName(id){
        for(var i=0;i<this.allHospitalList.length;i++){
          if(this.allHospitalList[i].id == id){
             return this.allHospitalList[i];
          }
        }
      },

      clickCurrentTab(val){
        this.currentTab = val;
        val == 'basic' && this.getBasicDetail(this.currentHos.id);
        val == 'function' && this.getFunctionDetail(this.currentHos.id);
        val == 'cooperation' && this.getCooperationDetail(this.currentHos.id);
        val == 'site' && this.getSiteDetail(this.currentHos.id);
        val == 'sign' && this.getSignDetail(this.currentHos.id);
        val == 'message' && this.getMessageDetail(this.currentHos.id);
        val == 'questionnaire' && this.getQuestionDetail(this.currentHos.id);
      }

   },

}

export default editHospital
