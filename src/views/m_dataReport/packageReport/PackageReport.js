var Echart = require('echarts');

const packageReport = {
    name: 'packageReport',
    data() {
        return {
            hospitalList: [],
            companyList: [],
            daterange: [],
            datasolt: '昨日',
            queryList: {
                beginTime: '',
                endTime: '',
                hospitalId: '',
                examCompanyId: '',
                pageSize: 100,
                current: 1
            },
            totaldata: {},
            packageData: [],
            sortBy: undefined,
            currentSortValue: undefined,
        }
    },
    watch: {
        queryList: {
            handler: function() {
                this.getTotalData();
                this.getPackageData();
            },
            deep: true
        }
    },
    mounted() {
        this.queryList.beginTime = this.getBeforeDate(1);
        this.queryList.endTime = this.getBeforeDate(1);
        this.getTotalData();
        this.getPackageData();
        this.getHospitalList();
    },
    methods: {

        //获取总数据
        getTotalData() {
            this.$http.post('/report/meal/queryTotalMealInfo', JSON.stringify(this.queryList)).then((response) => {
                this.totaldata = response.body;
            }, (res) => {
                this.$message({
                    message: res.text,
                    type: 'warning'
                })
            })
        },

        //获取表数据
        getPackageData() {
            this.$http.post('/report/meal/queryCompanyMeal', JSON.stringify(this.queryList)).then((response) => {
                this.packageData = response.body;
            }, (res) => {
                this.$message({
                    message: res.text,
                    type: 'warning'
                })
            })
        },

        //加载机构列表
        getHospitalList() {
            var queryOrganizationAddressVal = {
                provinceId: this.queryList.provinceId,
                cityId: this.queryList.cityId,
                districtId: this.queryList.districtId
            }
            this.$http.post('/report/search/queryOrg', JSON.stringify(queryOrganizationAddressVal)).then((response) => {
                this.hospitalList = response.body;
                for(let i=0; i<this.hospitalList.length; i++){
                  this.hospitalList[i].id = this.hospitalList[i].hospitalId
                  this.hospitalList[i].name = this.hospitalList[i].hospitalName 
                }
            }, (res) => {
                this.$message({
                    message: res.text,
                    type: 'warning'
                })
            })
        },

        //加载单位列表
        getCompanyList() {
            var queryOrganizationAddressVal = {
                provinceId: this.queryList.provinceId,
                cityId: this.queryList.cityId,
                districtId: this.queryList.districtId,
                hospitalId: this.queryList.hospitalId
            }
            this.$http.post('/report/search/queryCompany', JSON.stringify(queryOrganizationAddressVal)).then((response) => {
                this.companyList = response.body;
                for(let i=0; i<this.companyList.length; i++){
                  this.companyList[i].id = this.companyList[i].examCompanyId
                  this.companyList[i].name = this.companyList[i].examCompanyName 
                }
            }, (res) => {
                this.$message({
                    message: res.text,
                    type: 'warning'
                })
            })
        },

        //当前页
        currentChange(val) {
            this.queryList.current = val;
        },

        //当前pageSize
        sizeChange(val) {
            this.queryList.pageSize = val;
        },
    
        //选择机构更新单位
        changeHospital()
        {
           if(!this.queryList.hospitalId){
             this.queryList.examCompanyId = '';
           }else{
            this.getCompanyList(); 
           }
        },

        //获取时间段
        getDataRange(val) {
          this.daterange = val;
            if (this.daterange.length > 0) {
              this.datasolt = '';
              this.datasolt = this.daterange.length > 0 ? '' : this.datasolt;
              this.queryList.beginTime = this.daterange[0];
              this.queryList.endTime = this.daterange[1];
              var day = this.datedifference(this.queryList.beginTime, this.queryList.endTime);
              if (day < 6) {
                  this.showWeek = true;
                  this.showMonth = true;
              } else if (day < 29) {
                  this.showWeek = false;
                  this.showMonth = true;
              } else {
                  this.showWeek = false;
                  this.showMonth = false;
            }
          }
        },

        //设置时间
        getData(val) {
          if (!!this.datasolt) {
            this.daterange = [];
            var date = new Date();
            if (val == '昨日') {
                this.queryList.beginTime = this.getBeforeDate(1);
                this.queryList.endTime = this.getBeforeDate(1);
                this.showWeek = true;
                this.showMonth = true;
            }
            if (val == '前日') {
                this.queryList.beginTime = this.getBeforeDate(2);
                this.queryList.endTime = this.getBeforeDate(2);
                this.showWeek = true;
                this.showMonth = true;
            }
            if (val == '最近7天') {
                this.queryList.beginTime = this.getBeforeDate(7);
                this.queryList.endTime = date;
                this.showWeek = false;
                this.showMonth = true;
            }
            if (val == '最近30天') {
                this.queryList.beginTime = this.getBeforeDate(30);
                this.queryList.endTime = date;
                this.showWeek = false;
                this.showMonth = false;
            }
          }
        },

         //获取日期间隔
        datedifference(sDate1, sDate2) {
            var dateSpan, tempDate, iDays;
            sDate1 = Date.parse(sDate1);
            sDate2 = Date.parse(sDate2);
            dateSpan = sDate2 - sDate1;
            dateSpan = Math.abs(dateSpan);
            iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
            return iDays;
        },

        //获取最近几天日期
        getBeforeDate(n) {
            var n = n;
            var d = new Date();
            d.setDate(d.getDate() - n);
            return d;
        },

        //对趋势统计排序
        sortList(value){
           if(value == 1){
             this.packageData.records = this.packageData.records.sort(this.compareField)
           }else{

             this.packageData.records = this.packageData.records.sort(this.reverseField)
           }
        },

        //正序
        compareField( obj1, obj2) {
          var val1 = parseFloat(obj1[this.sortBy]);
          var val2 = parseFloat(obj2[this.sortBy]);
          if (val1 < val2) {
              return 1;
          } else if (val1 > val2) {
              return -1;
          } else {
              return 0;
          }
        },

        //倒序
        reverseField( obj1, obj2) {  
          var val1 = parseFloat(obj1[this.sortBy]);
          var val2 = parseFloat(obj2[this.sortBy]);
          if (val1 > val2) {
              return 1;
          } else if (val1 < val2) {
              return -1;
          } else {
              return 0;
          }
        },
    },
}
export default packageReport