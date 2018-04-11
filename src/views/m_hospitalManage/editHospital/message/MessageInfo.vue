<template>
  <div>
    <div class="form-term">
      <div class="form-header-title">
        <span class="fl">消息设置</span>
        <a v-if="!isEdit" v-permission="'hospitalManage:list:msgSettingEdit'" class="fr" @click="handleClick"><Icon type="edit"></Icon>编辑</a>
      </div>

      <div class="form-body">
        <div class="form-body-title">部分消息类型没有微信形式，所以也没有微信配置</div>
        <table class="table">
           <thead>
             <tr>
               <th>消息类型</th>
               <th>短信</th>
               <th>微信</th>
               <th>说明</th>
             </tr>
           </thead>           
           <tbody>
             <tr v-for="(sms,pindex) in hospital">
               <td style="width:240px">
                 {{sms.name}}
               </td>
               <td style="width:180px">
                 <div v-if="!isEdit">
                   <span class="successfont" v-if="sms.priority == 1 || sms.priority == 3">开启</span>
                   <span class="redfont" v-else>关闭</span>
                 </div>
                 <div v-if="isEdit">
                   <Checkbox v-model="sms.openMsg" @on-change="openMessage(sms)">开启</Checkbox>
                 </div>
               </td>
               <td style="width:180px">
                 <div v-if="!isEdit">
                   <span class="successfont" v-if="sms.weixinMsgId && (sms.priority == 2 || sms.priority == 3)">开启</span>
                   <span class="redfont" v-if="sms.weixinMsgId && (sms.priority == 1|| sms.priority == 0)">关闭</span>
                   <span v-if="!sms.weixinMsgId">-</span>
                 </div>
                 <div v-if="isEdit">
                   <Checkbox v-if="sms.weixinMsgId" v-model="sms.openWx" @on-change="openWexin(sms)">开启</Checkbox>
                 </div>
               </td>
               <td>
                 <span v-for="(explain,cindex) in explainList" v-if="pindex == cindex">{{explain}}</span>
               </td>
             </tr>
           </tbody>
        </table>
      </div>
    </div>

    <div class="mt20" v-if="isEdit">
      <Button type="primary" @click="save()">保存</Button>
      <Button type="ghost" style="margin-left: 8px" @click="cancel()">取消</Button>
    </div>

  </div>
</template>

<script>
export default {
  name: 'message',
  data() {
    return {
      isEdit: false,
      explainList: [
        '控制CRM和C端',
        '控制C端，CRM根据勾选情况发送',
        '控制C端，CRM根据勾选情况发送',
        '控制C端，CRM根据勾选情况发送',
        '控制C端，CRM根据勾选情况发送',
        '一定发送',
        '一定发送',
        '控制体检中心是否发送',
        '控制C端，CRM根据勾选情况发送',
        '控制体检中心是否发送，勾选短信请保证客户都有登录账户',
        '控制体检中心是否发送，勾选短信请保证客户都有登录账户',
        ''
      ]
    }
   },

  props: ['hospital'],

  methods: {

    save(){
      this.$http.post('/hospitalsms',JSON.stringify(this.hospital)).then((response) => {
          this.$Message.success('操作成功');
          this.isEdit = false;
          this.$emit('reload');
      }, (res) => {
          this.$Message.error(res.text);
      });
    },

   handleClick(){
     this.isEdit = true;
     this.addDefultProp();
   },

   addDefultProp(){
     for(let i=0; i<this.hospital.length; i++){
       if(this.hospital[i].priority == 1 || this.hospital[i].priority == 3){
           this.hospital[i].openMsg = true;
       }else{
          this.hospital[i].openMsg = false;
       }
       if(this.hospital[i].weixinMsgId && (this.hospital[i].priority == 2 || this.hospital[i].priority == 3)){
           this.hospital[i].openWx = true;
       }else if(this.hospital[i].weixinMsgId && this.hospital[i].priority == 1){
          this.hospital[i].openWx = false;
       }
     }
   },

   openMessage(message){
      if(message.openMsg){
        if(message.priority == 2){
          message.priority = 3
        }else{
          message.priority = 1
        }
      }else{
        if(message.priority == 3){
          message.priority = 2
        }else{
          message.priority = 0
        }
      }
    },

    openWexin(message){
      if(message.openWx){
        if(message.priority == 1){
          message.priority = 3
        }else{
          message.priority = 2
        }
      }else{
        if(message.priority == 3){
          message.priority = 1
        }else{
          message.priority = 0
        }
      }
    },

    cancel(){
      this.isEdit = false;
      this.$emit('reload');
      this.addDefultProp();
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
  .form-body-title {
    padding:10px 15px;
  }
  .form-header-title{
    margin-bottom: 0;
  }
</style>