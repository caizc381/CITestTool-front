import BasicList from './basic/basicList'
import CooperationList from './cooperation/cooperationList'
import FunctionList from './function/functionList'
import SignList from './sign/signList'
import SiteList from './site/siteList'

const hospitalList = {
  name: 'hospitalList',
  components: {
    'basic-list': BasicList,
    'cooperation-list': CooperationList,
    'function-list': FunctionList,
    'sign-list': SignList,
    'site-list': SiteList
  },
  data () {
    return {
      hospitalList: [],
      areaList: [],
      managerList: [],
      organizationQuery: {
        hospitalId: undefined,
        addressId: undefined,
        needLocalPay: undefined, // 现场付款是否需要确认
        enable: undefined, // 是否可用
        exportWithXls: undefined, // 对接
        isBindWX: undefined, // 是否绑定微信
        level: undefined, // 医院等级
        searchWords: undefined, // 体检中心关键词
        opsManagerId: undefined, // 运营经理id
        paymentType: undefined, // 支付方式
        platformDiscount: undefined, // 平台折扣
        showInList: undefined, // 是否展示
        type: undefined // 医院类型
      },
      addressIds: [],
      showMoreOption: false,
      typeList: ['公立医院', '专业体检中心', '民营连锁'],
      currentTab: 'basic',
      isHandler: false,
      handlerText: '批操作',
      model: {
        export: false,
        exportResult: false
      },
      exportInfo: {
        type: undefined,
        brandId: undefined,
        file: null
      },
      exportStatus: 0, // 0 导入form,1 正在导出,2 导出成功,3 导出失败
      brandList: [],
      errorHospitals: {},
      successHospitalNumber: 0,
      getResult: undefined,
    }
  },

  mounted () {
    this.getHospitalList()
    this.getAreaList()
    this.getManagerList()
    this.getBrandList()
    
    // 导入错误医院的页面地址
    this.url = location.href.split('#')[0] + '#/showErrorHos';
  },

  watch: {
    organizationQuery: {
      handler: function () {
        this.currentTab == 'basic' && this.$refs.basic.getHospitalsBasicList()
        this.currentTab == 'function' && this.$refs.fun.getHospitalFunList()
        this.currentTab == 'cooperation' && this.$refs.coop.getHospitalCoopList()
        this.currentTab == 'sign' && this.$refs.sign.getHospitalSignList()
        this.currentTab == 'site' && this.$refs.site.getHospitalSiteList()
      },
      deep: true
    }
  },

  computed: {
    allHospitalIdList () {
      return this.hospitalList.map(item => { return item.id })
    }
  },

  methods: {

      // 当前点击tab
    clickCurrentTab () {
      this.currentTab == 'basic' && this.$refs.basic.getHospitalsBasicList()
      this.currentTab == 'function' && this.$refs.fun.getHospitalFunList()
      this.currentTab == 'cooperation' && this.$refs.coop.getHospitalCoopList()
      this.currentTab == 'sign' && this.$refs.sign.getHospitalSignList()
      this.currentTab == 'site' && this.$refs.site.getHospitalSiteList()
    },

      // 获取体检中心列表
    getHospitalList () {
      this.$http.get('/hospitalList').then((response) => {
        this.hospitalList = response.body
      }, (res) => {
        this.$Message.error(res.text)
      })
    },

    changeHospital (id) {
      if (!id) {
        this.organizationQuery.hospitalId = ''
      } else {
        this.getHospitalList()
      }
    },

      // 获取地址信息
    getAreaList () {
      this.$http.get('/areaAddress').then((response) => {
        this.areaList = response.body.provinces
      }, (res) => {
        this.$Message.error(res.text)
      })
    },

    getBrandList () {
      this.$http.get('/listAllOrgBrand').then((response) => {
        this.brandList = response.body
      }, (res) => {
        this.$Message.error(res.text)
      })
    },

      // 获取平台运营经理列表
    getManagerList () {
      this.$http.get('/user/getOperationInfo').then((response) => {
        this.managerList = response.body
        for (let i = 0; i < this.managerList.length; i++) {
          this.managerList[i].name = this.managerList[i].employeeName
        }
      }, (res) => {
        this.$Message.error(res.text)
      })
    },

    changeManager (id) {
      if (!id) {
        this.organizationQuery.opsManagerId = ''
      } else {
        this.getManagerList()
      }
    },

     // 获取省市区id
    getDetailId (val) {
      this.organizationQuery.addressId = val[val.length - 1]
    },

    batchOperation () {
      if (this.isHandler) {
        this.isHandler = false
        this.handlerText = '批操作'
      } else {
        this.isHandler = true
        this.handlerText = '取消批操作'
      }
    },

    showExport(flag){
      if(!flag){
        this.exportInfo = {
          brandId: '',
          type: '公立医院',
          file: null,
        }
      }else{
        this.exportInfo.file = null
      }
      this.model.export = true;
      this.exportStatus = 0; 
      // 清空错误医院列表
      localStorage.removeItem('errorHospital');
    },

    handleUpload(file) {
      this.exportInfo.file = file;
      return false;
    },

    confirmExport () {
       // 验证文件格式.xls/.xlsx
      var reg = /\.xls|\.xlsx$/;

      var formData = new FormData();
      formData.append('file', this.exportInfo.file);

      if(!this.exportInfo.file) {
        this.$Message.error('文件必选！');
        return;
      }
      if(!reg.test(this.exportInfo.file.name)) {
        this.$Message.error('文件格式不正确！');
        return;
      }
      if(!this.exportInfo.type) {
        this.$Message.error('机构类型必选');
        return;
      }
      if(this.exportInfo.type == '民营连锁' && !this.exportInfo.brandId) {
        this.$Message.error('机构品牌必选');
        return;
      }

      this.exportInfo.brandId = this.exportInfo.type == '民营连锁' ? this.exportInfo.brandId:'';
      formData.append('brandId', this.exportInfo.brandId)
      formData.append('type', this.exportInfo.type)
      this.exportStatus = 1
      this.$http.post('/orgImport', formData).then((response) => {   
        if (response.body.isSuccess) {
          let _this = this; 
          // 请求导入结果 
          this.getResult = setInterval(function(){
            _this.exportFileResult(response.body.importSerial)
          },3000)

        } else {
          this.model.export = false
          this.model.exportResult = true
          this.exportStatus = 3
          this.errorHospitals = response.body.errorHospitals;
          localStorage.setItem('errorHospital',JSON.stringify(response.body.errorHospitals));
        }
      }, (res) => {
        this.model.export = false
        this.exportStatus = 0
        this.exportInfo.file = null
        this.$Message.error(res.text)
      })
    },
   
    // 导入结果判断
    exportFileResult(importId){
      this.$http.get('/orgImportResult?importId='+importId).then((response) => {
        if(response && response.body.isSuccess){
          this.model.export = false
          this.model.exportResult = true
          this.exportStatus = 2
          this.successHospitalNumber = response.body.successHospitalNumber;
          clearInterval(this.getResult)
          this.getHospitalList();
        } 
      },(res) => {
        this.$Message.error(res.text)
      })
    },
    
    // 下载模板
    downTemplate(){
      this.$http.get('/getOrgImportFile').then((response) => {
        this.$Message.success('正在下载中....');
        window.location.href = response.url;
      }, (res) => {
          this.$Message.error(res.text);
      });
    },

  }
}
export default hospitalList
