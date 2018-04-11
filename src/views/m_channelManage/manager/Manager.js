const manager = {
	name: 'manager',
	data(){
      return {
        managerList: [],
        searchWord: '',
      	dialog: {
      		new: false,
          newCard: false,
          reset: false,
          remove: false,
      	},
      	channelList: [],
        cardNum: 0,
        managerObject: {
      		channelId: '',
          managerId: undefined,
          username: '',
          name: '',
          mobile: '',
          identity: '',
      	},
        rules: {
            channelId: [{
                required: true,
                message: '请选择部门',
                trigger: 'change'
            }],
            username: [{
                required: true,
                message: '请输入账号',
                trigger: 'blur'
            }],
            name: [{
                required: true,
                message: '请输入客户经理',
                trigger: 'blur'
            }],
            mobile: [{
                required: true,
                message: '请输入手机号',
                trigger: 'blur'
            }],
        },
        errorInfo: undefined,
        editFlag: false,
        showDepErrorInfo: false,
        isEditChannel: false,
        currentManageId: undefined,
      }
	},
    
  mounted(){
    this.getManagerList();
    this.getChannelList();
  },

	methods: {
		getManagerList(){
			this.$http.post('/manager/list', {searchWord: this.searchWord}).then((response) => {
           this.managerList = response.body;
        }, (res) => {
            this.$Message.error(res.text);
       })
		},
    
    //获取渠道列表
		getChannelList(){
      this.$http.get('/channelList').then((response) => {
           this.channelList = response.body;
        }, (res) => {
            this.$Message.error(res.text);
       })
		},
    
    //获取单个客户经理的信息
    getSingleManager(managerId){
       this.$http.get('/manager/gain?managerId='+managerId).then((response) => {
           this.managerObject = response.body;
           this.managerObject.id = managerId;
           if(response.body.channelId == null){
             this.managerObject.channelId = '';
           }else{
             this.managerObject.channelId = this.managerObject.channelId+'';
           }
           this.isEditChannel = this.editFlag && this.managerObject.channelId !== '';  
        }, (res) => {
            this.$Message.error(res.text);
       })
    },
    
    //新增
		openNewModal(flag, managerId){   
      this.$refs['editManage'].resetFields();
      if(flag == 'edit'){
        this.editFlag = true;
        this.getSingleManager(managerId); 
      }else{
        this.editFlag = false;
        this.isEditChannel = false;
        this.managerObject = {
            channelId: '',
            managerId: undefined,
            username: '',
            name: '',
            mobile: '',
            identity: '',
        };
      }

      this.dialog.new = true; 
		},

		newManager(form){
      this.$refs[form].validate((valid) => {
        if (valid) {

          if(!this.managerObject.channelId){
            this.showDepErrorInfo = true
          }

          var namere = /^\w{1,20}$/;
          if (!namere.test(this.managerObject.username)) {
            this.errorInfo = '账号支持20位以内的字母或者数字';
            return false;
          }

          var express = /^[a-zA-Z0-9\u4e00-\u9fa5]{1,20}$/;
          if (!express.test(this.managerObject.name)) {
            this.errorInfo = '客户经理支持20位以内的中文、字母或者数字';
            return false;
          }

          if (!MyUtil.isPhone(this.managerObject.mobile)) {
            this.errorInfo = '手机号不正确';
            return false;
          }

          if (this.managerObject.identity != '' && !namere.test(this.managerObject.identity)) {
            this.errorInfo = '专属网址支持长度为20以内的字母或者数字';
            return false;
          }

          this.$http.post('/manager/save', JSON.stringify(this.managerObject)).then((response) => {
              this.$Message.success('操作成功!');
              this.dialog.new = false;
              this.getManagerList();
          }, (res) => {
              this.$Message.error(res.text);
          });

        } else {
            return false;
        }
     });

		},

    openReModal(managerId,flag){
      this.currentManageId = managerId;
      if(flag == 'remove'){
        this.dialog.remove = true;
      }else if(flag == 'reset'){
        this.dialog.reset = true;
      }
    },
    
    //删除客户经理
    removeManager(){
      this.$http.delete('/manager/remove/'+ this.currentManageId).then((response) => {
        this.$Message.success('操作成功!');
        this.dialog.remove = false
        this.getManagerList();
      }, (res) => {
          this.$Message.error(res.text);
      });
    },

    //重置平台客户经理密码
    resetPwd() {
      this.$http.post('/manager/resetPwd', {accountId: this.currentManageId}).then((response) => {
        this.$Message.success('重置成功!');
        this.dialog.reset = false
      }, (res) => {
          this.$Message.error(res.text);
      });
    },
    
    //生成实体卡
    newCard(){
      if(this.cardNum <= 0){
        this.$Message.error('发卡数量必须大于0');
      }
      this.$http.get('/generCardNum?increment=' + this.cardNum).then((response) => {
           this.$Message.success('正在生成,请稍等....');
           this.dialog.newCard = false;
           window.location.href = response.url;
        }, (res) => {
            this.$Message.error(res.text);
       })
    },

	}
}

export default manager