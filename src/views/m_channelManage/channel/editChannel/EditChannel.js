import BasicInfo from './components/BasicInfo'
import Message from './components/Message'
import Site from './components/Site'

const editChannel = {
   name:'editChannel',
   components: {
    'basic-info': BasicInfo,
    'message-info': Message,
    'site-info': Site,
   },
   data(){
     return {
       basicInfo: undefined,
       siteInfo: undefined,
       messageInfo: undefined,

       currentTab: 'basic',
       isNewChannel: true,
       channelName: undefined,
     }
   },

   watch:{
     currentHos: {
        handler :function(val){
          this.currentTab == 'basic' && this.getBasicDetail(val.id);
          this.currentTab == 'message' && this.getMessageDetail(val.id);
          this.currentTab == 'site' && this.getSiteDetail(val.id);
        },
        deep: true
     }
   },

   mounted(){
     if(this.$route.params.channelId == 'new'){
       this.isNewChannel = false;
       this.channel = undefined;
     }else{
       this.getBasicDetail();
     }
   },

   methods: {
     //获取基本信息
     getBasicDetail(id=this.$route.params.channelId){
      this.$http.get('/organization?hospitalId='+id).then((response) => {
          this.basicInfo = {
            addressIds: response.body.addressIds,
            organization: response.body.organizationVo,
            manager: response.body.managerVo
          }
          this.channelName = response.body.organizationVo.name;
       }, (res) => {
          this.$Message.error(res.text);
      });
     },
     
     //获取消息提醒
     getMessageDetail(id=this.$route.params.channelId){
      this.$http.get('/hospitalContact?hospitalId='+id).then((response) => {
          this.messageInfo = response.body;
       }, (res) => {
          this.$Message.error(res.text);
      });
     },
     
     //获取站点设置
     getSiteDetail(id=this.$route.params.channelId){
      this.$http.get('/siteResource?hospitalId='+id+'&orgType=2').then((response) => {
          this.siteInfo ={
            siteInfo: response.body,
            mobileTemplateList: response.body.mobileTemList,
            cssList: response.body.cssList,
          }
       }, (res) => {
          this.$Message.error(res.text);
      });
     },

      clickCurrentTab(val){
        this.currentTab = val;
        this.currentTab == 'basic' && this.getBasicDetail(val.id);
        this.currentTab == 'message' && this.getMessageDetail(val.id);
        this.currentTab == 'site' && this.getSiteDetail(val.id);
        this.currentTab == 'distribution' && this.getDistributionDetail(val.id);
      }
   },

}

export default editChannel
