const Message = {
   name:'message',
   data(){
    return{
      messageList:[],
      keywords:''
    }
   },

   methods:{
    getMessageList(){
      if (!this.keywords) {
        return;
      }
      this.$http.get('/manage/listSMSSendRecords?mobile='+ this.keywords).then((response) => {
          this.messageList = response.body;
      }, (res) => {
          this.$Message.error(res.text);
      });
    },

    handleCurrentChange(val) {
      this.page.currentPage = val;
    },

    reSend(message){
      this.$Modal.confirm({
        title:'提示',
        content:'是否重新发送该条短息?',
        onOk:()=>{
          this.$http.get('/manage/reSendSmsMessage?recordId=' + message.id).then((response) => {
              this.$Message.success('发送成功!');
              this.getMessageList();
          }, (res) => {
              this.$Message.error(res.text);
          });
        }
      });
    }

  },
}

export default Message
