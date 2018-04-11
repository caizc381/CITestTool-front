const createHospital = {
   name:'createHospital',
   data(){
     let defaultNotice = `尊敬的贵宾: 您好！欢迎您来我院健康检查，为了您顺利进行体检，请在体检前注意以下事项：

体检前一天晚餐宜清淡饮食，少饮或不饮酒，晚10时后禁食，请保持良好睡眠。避免使用对肝肾功能有影响的药物，避免剧烈运动。
体检时请您向医务人员准确提供病史及近期服药情况；糖尿病、高血压、心脏病、脑动脉硬化等慢性病患者，请将平时服用的药物携带备用。
体检当天应禁食禁水，先做空腹项目（抽血、b超、胃幽门螺杆菌检测等） 后进早餐，再做其余项目。
做前列腺膀胱b超或子宫附件b超者，需憋尿至膀胱完全充盈后进行。
尿常规检查需尿量约15ml（小杯），尿液基检查需尿量约50ml（大杯），请留取中段尿。
体检当天请勿穿有金属扣的内衣裤，勿戴金属饰品。
女士需避开月经期进行体检， 请勿穿长筒袜、连衣裙。做妇科检查者，应在排空膀胱后进行。
怀孕或可能怀孕女士，请预先通知工作人员，避免x光、妇科检查、经阴道妇科彩超、电子肛肠镜及c13、c14呼气检测幽门螺旋杆菌。未婚女士原则上不做妇科检查及阴道b超检查。
体检完成后，请将体检导引单交前台护士。
体检中您有其它需求，请您与导检护士联系。
祝您健康，愉快 !`

     return {
       currentStep: 0,
       //工作日中间变量
       workDayArr:[2, 3, 4, 5, 6],
       organizationManageVo: {
         hospital: {
           briefIntro: '',
           detailIntro: '',
           examNotice: defaultNotice,
           id: '',
           keywords: '',
           level: '三甲',
           name: '',
           opsManagerId: '',
           organizationType: '1',
           phone: '',
           type: '公立医院',
           trafficInfo: '',
         },
         address: {
           address: '',
           briefAddress: '',
           province: '',
           city: '',
           district: '',
           id: '',
           latitude: '',
           longitude: '',
         },
         manager: {
           gender: '0',
           id: '',
           mobile: '',
           managerName: '',
           username: '',
         },
         mediatorInfo: {
           name: '',
           mobile: '',
           mail: '',
         },
         settings: {
           acceptOfflinePay: '',
           accountPay: true,
           aliPay: true,
           allowAdjustPrice: 'true',
           businessAmount: 0,
           drawBloodEnd: '',
           drawBloodStart: '',
           examEndTime: '',
           examStartTime: '',
           calculatorService: 3,
           exportWithNoExamDate: 'true',
           groupExamTel: '',
           isBreakfast: 'true',
           isSmartRecommend: 'true',
           needLocalPay: 'false',
           openGroupExamReport: 'true',
           opsRemark: '',
           previousBookDays: '1',
           previousBookTime: '18:00',
           previousExportDays: 1,
           sameDayOrderMaximum: 1,
           serviceTel: '',
           settleCycle: 10,
           technicalTel: '',
           weiXinPay: true,
           workDay: ''
         },
         siteVo:{
           cssId: '',
           mobileTemplateId: 2, // 默认第二个模板
           url: '',
         },
         periodSettingList: [],
         addressIds: [],
       },
       typeList: ['公立医院','专业体检中心','民营连锁'],
       areaList: [],
       managerList: [],
       mobileTemplateList: [],
       settleCycleList: [],
       previousExportDaysList: [],
       cssIdList: [],
       examTime: ['07:00', '11:00'], //体检时间段
       drawBloodTime: ['07:00', '11:00'], //抽血时间段
       time: {
         internalUsePeriod: true,
         name: '上午',
         limitNum: 10
       },
       showMoreTime: false, //是否添加更多时段
       otherTime: {
         internalUsePeriod: false,
         name: '下午',
         limitNum: 10
       }, //更多时刻
       showMap: false,
       isRepeatManagerName: false,//是否重复管理员名称
       isRepeatUrl: false,//是否重复c端网址
       errorInfo: '',
       stepOne: false,
       stepSe:false,
       stepTwo: false,
       currentId:'',
       url:'',
     }
   },

   mounted(){
     //获取天数列表
     this.settleCycleList =  MyUtil.getDaysList(28,'日');
     this.settleCycleList.push({'id':'0','name':'-'});
     this.previousExportDaysList =  MyUtil.getDaysList(100,'天');
     this.previousExportDaysList.unshift({'id':'0','name':'0天'});
     this.getAreaList();
     this.getManagerList();
     this.url = location.href.split('#')[0] + '#/preview';
   },

   methods:{

    //获取地址信息
    getAreaList(){
      this.$http.get('/areaAddress').then((response) => {
        this.areaList = response.body.provinces;
      }, (res) => {
          this.$Message.error(res.text);
      });
    },

    //获取平台运营经理列表
    getManagerList(){
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
           this.organizationManageVo.hospital.opsManagerId = '';
         }else{
          this.getManagerList();
         }
      },

    //获取css/Template列表
    getCssAndTemplateList(){
      this.$http.get('/siteTemplateAndCss?orgType='+this.organizationManageVo.hospital.organizationType).then((response) => {
          this.cssIdList = response.body.cssList
          this.mobileTemplateList = response.body.mobileTemplateList
          this.organizationManageVo.siteVo.cssId = this.organizationManageVo.siteVo.cssId || this.cssIdList[0].id
          this.organizationManageVo.siteVo.mobileTemplateId =  this.organizationManageVo.siteVo.mobileTemplateId || this.mobileTemplateList[0].id
      }, (res) => {
          this.$Message.error(res.text);
      });
    },

    //验证管理员名称是否重复
    verifyManagerName(){
      if(!this.organizationManageVo.manager.username){
        return false;
      }
      this.$http.get('/validateUserName?organizationType='+this.organizationManageVo.hospital.organizationType+'&userName='+this.organizationManageVo.manager.username).then((response) => {
          this.isRepeatManagerName = false;
      }, (res) => {
          this.isRepeatManagerName = true;
      });
    },

    //验证地址是否重复
    verifyUrl(){
      if(!this.organizationManageVo.siteVo.url){
        return false;
      }
      this.$http.get('/validateUrl?url='+this.organizationManageVo.siteVo.url).then((response) => {
          this.isRepeatUrl = false;
      }, (res) => {
          this.isRepeatUrl = true;
      });
    },

    //新增
    createHospital(){
      if(!this.organizationManageVo.siteVo.url){
        this.errorInfo = '网址不能为空！';
        this.stepTwo = true;
        return false;
      }
      if(this.organizationManageVo.siteVo.url && !MyUtil.isUrl(this.organizationManageVo.siteVo.url)){
        this.errorInfo = '格式不正确,请输入16位以内的字母或数字!';
        this.stepTwo = true;
        return false;
      }
      //加上体检时间、抽血时间
      this.organizationManageVo.settings.examStartTime = this.examTime[0];
      this.organizationManageVo.settings.examEndTime = this.examTime[1];
      this.organizationManageVo.settings.drawBloodStart = this.drawBloodTime[0];
      this.organizationManageVo.settings.drawBloodEnd = this.drawBloodTime[1];

      //支付设置
      this.organizationManageVo.settings.acceptOfflinePay = this.organizationManageVo.settings.acceptOfflinePay ? true : false;
      this.organizationManageVo.settings.accountPay = this.organizationManageVo.settings.accountPay ? true : false;
      this.organizationManageVo.settings.aliPay = this.organizationManageVo.settings.aliPay ? true : false;
      this.organizationManageVo.settings.weiXinPay = this.organizationManageVo.settings.weiXinPay ?  true : false;


      //加上时刻
      this.organizationManageVo.periodSettingList.push(this.time);
      if(this.showMoreTime){
       this.organizationManageVo.periodSettingList.push(this.otherTime);
      }
      //地址id处理
      this.organizationManageVo.address.id = this.organizationManageVo.addressIds[this.organizationManageVo.addressIds.length - 1];
      //工作日字符串处理
      this.organizationManageVo.settings.workDay = this.workDayArr.join(",");
      this.organizationManageVo.addressIds = undefined;
      this.$http.post('/organization',JSON.stringify(this.organizationManageVo)).then((response) => {
          this.currentId = response.body;
          this.$Message.success('操作成功！');
          this.currentStep = 3;
      }, (res) => {
          this.$Message.error(res.text);
      });
    },

    verifyStepOne(){
      if(!this.organizationManageVo.hospital.name){
        this.errorInfo = '机构名称不能为空！';
        this.stepOne = true;
        return false;
      }
      if(this.organizationManageVo.hospital.name && this.organizationManageVo.hospital.name.length > 30){
        this.errorInfo = '机构名称长度不能超过30位！';
        this.stepOne = true;
        return false;
      }
      if(!this.organizationManageVo.hospital.type){
        this.errorInfo = '机构类型不能为空！';
        this.stepOne = true;
        return false;
      }
      if(!this.organizationManageVo.hospital.level){
        this.errorInfo = '机构等级不能为空！';
        this.stepOne = true;
        return false;
      }
      if(this.organizationManageVo.addressIds.length == 0){
        this.errorInfo = '地址不能为空！';
        this.stepOne = true;
        return false;
      }
      if(!this.organizationManageVo.address.address){
        this.errorInfo = '详细地址不能为空！';
        this.stepOne = true;
        return false;
      }
      if(this.organizationManageVo.address.address && this.organizationManageVo.address.address.length > 50){
        this.errorInfo = '详细地址不能超过50字！';
        this.stepOne = true;
        return false;
      }
      if(!this.organizationManageVo.address.longitude || !this.organizationManageVo.address.latitude){
        this.errorInfo = '经纬度不能为空！';
        this.stepOne = true;
        return false;
      }
      if(this.organizationManageVo.hospital.trafficInfo && this.organizationManageVo.hospital.trafficInfo.length > 500){
        this.errorInfo = '交通路线不能超过500字！';
        this.stepOne = true;
        return false;
      }
      if(!this.organizationManageVo.manager.managerName){
        this.errorInfo = '管理员姓名不能为空！';
        this.stepOne = true;
        return false;
      }
      if(!this.organizationManageVo.manager.mobile){
        this.errorInfo = '管理员手机号不能为空！';
        this.stepOne = true;
        return false;
      }
      if(this.organizationManageVo.manager.mobile && !MyUtil.isPhone(this.organizationManageVo.manager.mobile)){
        this.errorInfo = '管理员手机号不正确,只能输入30位以内数字及“-”！';
        this.stepOne = true;
        return false;
      }
      if(!this.organizationManageVo.manager.username){
        this.errorInfo = 'crm账号名不能为空！';
        this.stepOne = true;
        return false;
      }
      if(this.organizationManageVo.manager.username && !MyUtil.isCrmName(this.organizationManageVo.manager.username)){
        this.errorInfo = 'crm账号名输入数字及字母！';
        this.stepOne = true;
        return false;
      }
      if(this.organizationManageVo.mediatorInfo.mobile && !MyUtil.isPhone(this.organizationManageVo.mediatorInfo.mobile)){
        this.errorInfo = '业务联系人手机号不正确,只能输入30位以内数字及“-”！';
        this.stepOne = true;
        return false;
      }
      if(this.organizationManageVo.mediatorInfo.mail && !MyUtil.isEmail(this.organizationManageVo.mediatorInfo.mail)){
        this.errorInfo = '业务联系人邮箱不正确';
        this.stepOne = true;
        return false;
      }
      if(!this.organizationManageVo.hospital.phone){
        this.errorInfo = '体检电话不能为空！';
        this.stepOne = true;
        return false;
      }
      if(this.organizationManageVo.hospital.phone && !MyUtil.isPhone(this.organizationManageVo.hospital.phone)){
        this.errorInfo = '体检电话格式不正确,只能输入30位以内数字及“-”！';
        this.stepOne = true;
        return false;
      }
      if(!this.organizationManageVo.settings.groupExamTel){
        this.errorInfo = '团检电话不能为空！';
        this.stepOne = true;
        return false;
      }
      if(this.organizationManageVo.settings.groupExamTel && !MyUtil.isPhone(this.organizationManageVo.settings.groupExamTel)){
        this.errorInfo = '团检电话格式不正确,只能输入30位以内数字及“-”！';
        this.stepOne = true;
        return false;
      }
      if(!this.organizationManageVo.settings.serviceTel){
        this.errorInfo = '客服电话不能为空！';
        this.stepOne = true;
        return false;
      }
      if(this.organizationManageVo.settings.serviceTel && !MyUtil.isPhone(this.organizationManageVo.settings.serviceTel)){
        this.errorInfo = '客服电话格式不正确,只能输入30位以内数字及“-”！';
        this.stepOne = true;
        return false;
      }
      if(!this.organizationManageVo.settings.technicalTel){
        this.errorInfo = '技术支持电话不能为空！';
        this.stepOne = true;
        return false;
      }
      if(this.organizationManageVo.settings.technicalTel && !MyUtil.isPhone(this.organizationManageVo.settings.technicalTel)){
        this.errorInfo = '技术支持电话格式不正确,只能输入30位以内数字及“-”！';
        this.stepOne = true;
        return false;
      }
      if(!this.organizationManageVo.hospital.keywords){
        this.errorInfo = '医院标签不能为空！';
        this.stepOne = true;
        return false;
      }
      if(this.organizationManageVo.hospital.keywords && this.organizationManageVo.hospital.keywords.length > 50){
        this.errorInfo = '医院标签长度最大为50字！';
        this.stepOne = true;
        return false;
      }
      if(!this.organizationManageVo.hospital.examNotice){
        this.errorInfo = '体检须知不能为空！';
        this.stepOne = true;
        return false;
      }
      if(this.organizationManageVo.hospital.examNotice && this.organizationManageVo.hospital.examNotice.length > 5000){
        this.errorInfo = '体检须知长度不能超过5000字！';
        this.stepOne = true;
        return false;
      }
      this.nextStep();
    },

    verifyStepTwo(){
      if(this.examTime.length == 0){
          this.errorInfo = '体检时间不能为空！';
          this.stepSe = true;
          return false;
        }
        if(this.drawBloodTime.length == 0){
          this.errorInfo = '抽血时间不能为空！';
          this.stepSe = true;
          return false;
        }
        if (this.workDayArr.length == 0) {
          this.errorInfo = '工作时间及人数设置，请至少选择一个工作日';
          this.stepSe = true;
          return false;
        }
        if(this.time && !this.time.name){
          this.errorInfo = '预约时间段名称不能为空！';
          this.stepSe = true;
          return false;
        }
        if(this.time && this.time.name.length > 15){
          this.errorInfo = '预约时间段名称不能超过15个字！';
          this.stepSe = true;
          return false;
        }
        if(this.otherTime && !this.otherTime.name){
          this.errorInfo = '预约时间段名称不能为空！';
          this.stepSe = true;
          return false;
        }
        if(this.otherTime&& this.otherTime.name.length > 15){
          this.errorInfo = '预约时间段名称不能超过15个字！';
          this.stepSe = true;
          return false;
        }
        this.nextStep();
    },

    changeExamTime (time) {
      this.examTime = time;
    },

    changeDrawBlood (time) {
      this.drawBloodTime = time;
    },

    //上一步
    prevStep() {
      if(this.currentStep == 1){
        this.getManagerList()
      }
      this.currentStep -= 1;
    },

    //下一步
    nextStep() {
      this.stepOne = false;
      this.stepSe = false;
      this.stepTwo = false;
      if(this.currentStep == 3) {
          this.currentStep = 0;
      } else {
          this.currentStep += 1;
      }
      if(this.currentStep == 1){
        this.getCssAndTemplateList();
      }
    },

    //获取经纬度
    openMap(){
      this.showMap = true;
      let _this = this;

      var map = new AMap.Map("mapContainer", {
              resizeEnable: true,
              zoom: 13,//地图显示的缩放级别
              keyboardEnable: false
      });
      AMap.plugin(['AMap.Autocomplete','AMap.PlaceSearch','AMap.Geocoder'],function(){
        var autoOptions = {
          input: "keyword"//使用联想输入的input的id
        }
        var autocomplete= new AMap.Autocomplete(autoOptions);

        var placeSearch = new AMap.PlaceSearch({
              map:map
        })

        var marker = new AMap.Marker({
           map:map
        });

        var geocoder = new AMap.Geocoder();

        var address =  _this.getProvinceName(_this.organizationManageVo.addressIds) +  _this.organizationManageVo.address.address;

        geocoder.getLocation(address, function(status, result) {
          if (status === 'complete' && result.info === 'OK') {
              marker.setPosition(result.geocodes[0].location)
              map.setCenter(marker.getPosition())

              _this.organizationManageVo.address.longitude = result.geocodes[0].location.lng;
              _this.organizationManageVo.address.latitude = result.geocodes[0].location.lat;

          }else{
              //获取经纬度失败
          }
        });

        AMap.event.addListener(autocomplete, "select", function(e){
           //TODO 针对选中的poi实现自己的功能
           placeSearch.setCity( e.poi.adcode );
           placeSearch.search( e.poi.name); //关键字查询查询
        })

        AMap.event.addListener(placeSearch, "markerClick", function(e){
           _this.organizationManageVo.address.longitude = e.data.location.lng;
           _this.organizationManageVo.address.latitude = e.data.location.lat;
        })

        //为地图注册click事件获取鼠标点击出的经纬度坐标
        var clickEventListener = map.on('click', function(e) {
            _this.organizationManageVo.address.longitude = e.lnglat.getLng();
            _this.organizationManageVo.address.latitude = e.lnglat.getLat();
            marker.setPosition(e.lnglat);
            map.setCenter(marker.getPosition())
        });

      })
    },

    cancelMap(){
      document.getElementById("keyword").value = '请输入关键字：(选定后搜索)';
      this.organizationManageVo.address.longitude = '';
      this.organizationManageVo.address.latitude = '';
      this.showMap = false;
    },

    //获取省名称
    getProvinceName(id){
      if(id.length == 0){
        return '';
      }
      for(var i=0; i<this.areaList.length; i++){
          if(this.areaList[i].value == id[0]){
            return  this.areaList[i].label;
          }
       }
    },

  }
}
export default createHospital
