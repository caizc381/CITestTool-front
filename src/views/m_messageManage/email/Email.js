const Email = {
   name:'email',
   data(){
    return {
        emailList: [],
        keywords: '',
        imgUrl: '',
        query: {
          sendTime: '',
          hospitalName: '',
          receiver: '',
          notifyType: '',
        },
        notifyTypeList: [
         { value: 'EXPORT_ORDER_MESSAGE', label: '浅对接邮件通知'},
         { value: 'BOTTLENECK_EXAMITEM', label: '瓶颈项目通知'},
         { value: 'GROUP_APPLICATION_MAILL', label: '团检申请邮件'},
         { value: 'MEAL_CHANGE_NOTIFY', label: '套餐修改通知'}
       ],
       page:{
        rowCount: 0,
        currentPage: 1,
        pageSize: 20,
       }
     }
   },

   filters: {
     sendStatusFileter: function (value) {
       if (value == 4) {
         return '发送成功'
       } else if (value == 5) {
         return '发送失败'
       }
       return '';
     }
   },

   methods:{

    getEmailList(isPage){
      if(!isPage){
        this.page = {
          currentPage: 1,
          pageSize: 20
        }
      }
      let url = '/manage/listEmailSendRecords';
      url += '?hospitalName=' + this.query.hospitalName;
      // url += '&receiver=' + this.query.receiver;
      url += '&notifyType=' + this.query.notifyType;
      url += '&currentPage=' + this.page.currentPage + '&pageSize=' +  this.page.pageSize;

      if (this.query.sendTime) {
        url += '&sendTime=' + new Date(this.query.sendTime).getTime();
      }
    
      this.$http.get(url).then((response) => {
          this.emailList = response.body.emailSendRecordList;
          this.page = response.body.page;
      }, (res) => {
          this.$Message.error(res.text);
      });
    },

    getSendTime(val){
      this.query.sendTime = val
      this.getEmailList()
    },

    reSend(email){
      this.$Modal.confirm({
        title:'提示',
        content:'是否重新发送该邮件?',
        onOk:()=>{
          this.$http.get('/manage/email/resend?recordId=' + email.id).then((response) => {
              this.$Message.success('发送成功!');
          }, (res) => {
              this.$Message.error(res.text);
          });
        }
      });
    },

    changePage(page){
      this.page.currentPage = page
      this.getEmailList(true);
    },
    changeSize(size){
      this.page.currentPage = 1
      this.page.pageSize = size
      this.getEmailList(true);
    }

  },
}

export default Email
