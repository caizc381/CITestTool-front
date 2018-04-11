var Echart = require('echarts');

const orderIncrementReport = {
    name: 'orderIncrementReport',
    data() {
        return {
            areaList: [],
            hospitalList: [],
            companyList:[],
            activeName: 'trend',
            dimension: 'orderPrice',
            incrementSelected:'additemOrdersRate',
            selectList: [{
                value: 'orderTimes',
                label: '订单数'
            }, {
                value: 'additemOrdersRate',
                label: '加项数占比'
            }, {
                value: 'platformHISRate',
                label: '平台/HIS订单比'
            },{
                value: 'orderPrice',
                label: '订单金额'
            }, {
                value: 'onlinePrice',
                label: '网付金额'
            }, {
                value: 'offlinePrice',
                label: '现付金额'
            }, {
                value: 'onlinePayOrders',
                label: '网付订单数'
            }, {
                value: 'onlinePayOrdersRate',
                label: '网付订单数占比'
            }, {
                value: 'additemOrders',
                label: '加项订单数'
            }, {
                value: 'backInputOrdersRate',
                label: '反导流占比'
            }, {
                value: 'managerBalancePayRate',
                label: '客户经理金额占比'
            }, {
                value: 'cardBalancePayRate',
                label: '体检卡金额占比'
            }, {
                value: 'onlinePriceRate',
                label: '网付金额占比'
            }, {
                value: 'offlinePriceRate',
                label: '现付金额占比'
            }],
            incrementSelection:[{
                value: 'orderTimes',
                label: '订单数'
            }, {
                value: 'additemOrders',
                label: '加项订单数'
            },{
                value: 'additemOrdersRate',
                label: '加项数占比'
            },{
                value: 'orderPrice',
                label: '订单金额'
            },{
                value: 'onlinePrice',
                label: '网付金额'
            },{
                value: 'averageOrderPrice',
                label: '平均订单金额'
            },{
                value: 'averageOnlinePrice',
                label: '平均网付金额'
            }],
            selection:[],
            tabSelectList:{
                orderTimes: true,
                additemOrdersRate: true,
                platformHISRate: true,
                orderPrice: true,
                onlinePrice: true,
                offlinePrice: true,
                onlinePayOrders: false,
                onlinePayOrdersRate: false,
                additemOrders: false,
                backInputOrdersRate: false,
                managerBalancePayRate: false,
                cardBalancePayRate: false,
                onlinePriceRate: false,
                offlinePriceRate: false
            },
            sortBy: undefined,
            currentSortValue: undefined,
            daterange: [],
            datasolt: '昨日',
            addressIds: [],
            queryList: {
                beginTime: '',
                endTime: '',
                provinceId: '',
                cityId: '',
                districtId: '',
                hospitalId: '',
                examCompanyId:'',
                typeOfOrder:'0',
                pageSize: 100,
                current: 1,
                dynamicAttr: {
                    countCycle: 'daily'
                }
            },
            allData: [],
            trendData: [],
            hospitalData: [],
            regionData: [],
            sourceData:[],
            incrementData:[],
            pieData: {
            	orderPrice:'',
            	onlinePrice:'',
            	backInputOrderPrice:'',
                orderTimes:'',
                additemOrdersRate: '',
                onlinePayOrdersRate: '',
                platformHISRate: '',
                managerBalancePay: '',
                cardBalancePay: '',
                offlinePrice: ''
            },
            trendMap: {
                xAxis: [],
                serise: [],
            },
            hospitalMap: {
                yAxis: [],
                serise: [],
            },
            regionMap: {
                yAxis: [],
                serise: [],
            },
            incrementMap: {
                xAxis: [],
                serise: [],
            },
            showWeek: true,
            showMonth: true,
            styleObject: {
                width: '',
                height: '400px'
            },
            loading_pie:true,
            loading_trend:true,
            loading_hospital:true,
            loading_region:true,
            loading_increment:true
        }
    },
    watch: {
        queryList: {
            handler: function() {
                this.activeName == 'trend' && this.loadTrendData();
                this.activeName == 'hospital' && this.loadHospitalData();
                this.activeName == 'region' && this.loadRegionData();
                this.activeName == 'source' && this.loadSourceData();
                this.activeName == 'increment' && this.loadIncrementData();
                this.loadPieData();
            },
            deep: true
        }
    },
    mounted() {
        this.queryList.beginTime = this.getBeforeDate(1);
        this.queryList.endTime = this.getBeforeDate(1);
        this.loadTrendData();
        this.loadPieData();
        this.getAreaList();
        this.getHospitalList();
        this.styleObject.width = (window.innerWidth - 220) + "px";
    },
    methods: {
        //加载饼图
        loadPieData() {
            this.$http.post('/report/examOrder/queryTotalExamOrder', JSON.stringify(this.queryList)).then((response) => {
                this.loading_pie = false;
                this.pieData = response.body;
            }, (res) => {
                this.$message({
                    message: res.text,
                    type: 'warning'
                })
            }).then(() => {
                this.loadPie();
            })
        },

        //加载趋势数据
        loadTrendData() {
            this.$http.post('/report/examOrder/queryExamOrderByTimeDimensionalityData', JSON.stringify(this.queryList)).then((response) => {
                this.loading_trend = false;
                this.allData = response.body;
                this.trendData = response.body.records;
            }, (res) => {
                this.$message({
                    message: res.text,
                    type: 'warning'
                })
            }).then(() => {
                this.getTrendMapByDimension();
            })
        },

        //加载机构数据
        loadHospitalData() {
            this.$http.post('/report/examOrder/queryExamOrderDateByOragDimensionality', JSON.stringify(this.queryList)).then((response) => {
                this.loading_hospital = false;
                this.allData = response.body;
                this.hospitalData = response.body.records;
            }, (res) => {
                this.$message({
                    message: res.text,
                    type: 'warning'
                })
            }).then(() => {
                this.getHospitalMapByDimension();
            })
        },

        //加载地区数据
        loadRegionData() {
            this.$http.post('/report/examOrder/queryExamOrderDateByAreaDimensionality', JSON.stringify(this.queryList)).then((response) => {
                this.loading_region = false;
                this.allData = response.body;
                this.regionData = response.body.records;
            }, (res) => {
                this.$message({
                    message: res.text,
                    type: 'warning'
                })
            }).then(() => {
                this.getRegionMapByDimension();
            })
        },

        //加载来源数据
        loadSourceData() {
            this.$http.post('/report/examOrder/queryExamOrderByTypeOfOrderDimensionality', JSON.stringify(this.queryList)).then((response) => {
                this.sourceData = response.body;
            }, (res) => {
                this.$message({
                    message: res.text,
                    type: 'warning'
                })
            })
        },

        //加载增量数据
        loadIncrementData() {
            this.$http.post('/report/examOrder/queryExamOrderByOrderModeDimensionality', JSON.stringify(this.queryList)).then((response) => {
                this.loading_increment = false;
                this.incrementData = response.body;
            }, (res) => {
                this.$message({
                    message: res.text,
                    type: 'warning'
                })
            }).then(() => {
                this.getIncrementMapByDimension();
            })
        },

        //切换tab
        handleClick(tab) {
            this.sortBy = undefined;
            tab == 'trend' && this.loadTrendData();
            tab == 'hospital' && this.loadHospitalData();
            tab == 'region' && this.loadRegionData();
            tab == 'source' && this.loadSourceData();
            tab == 'increment' && this.loadIncrementData();
        },

        //获取省市区id
        getDetailId(val) {
            this.queryList.hospitalId = '';
            this.queryList.provinceId = val[0];
            this.queryList.cityId = val[1];
            this.queryList.districtId = val[2];
            this.getHospitalList();
        },

        //当前页
        currentChange(val) {
            this.queryList.current = val;
        },

        //当前pageSize
        sizeChange(val) {
            this.queryList.pageSize = val;
        },

        //加载地区列表
        getAreaList() {
            this.$http.get('/report/wechat/queryArea').then((response) => {
                this.areaList = response.body.provinces;
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

        //选择机构更新单位
        changeHospital()
        {
           if(!this.queryList.hospitalId){
             this.queryList.examCompanyId = '';
           }else{
           	this.getCompanyList();
           }
        },

        //加载pie图
        loadPie() {
            var myChart = Echart.init(document.getElementById('pieData'));
            var option = {
                title: {
                    text: '支付方式',
                    x: 'right',
                    textStyle: {
                        fontSize: '14',
                        fontWeight: 'normal'
                    },
                    left:'70%'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    left: '70%',
                    top: '20%',
                    data: ['客户经理挂账', '体检卡支付', '线上付款','现场付款']
                },
                series: [ {
                    name: '支付方式',
                    type: 'pie',
                    center:['40%','55%'],
                    data: [{
                        value: this.pieData.managerBalancePay,
                        name: '客户经理挂账'
                    },  {
                        value: this.pieData.cardBalancePay,
                        name: '体检卡支付'
                    },{
                        value: this.pieData.onlinePrice,
                        name: '线上付款'
                    }, {
                        value: this.pieData.offlinePrice,
                        name: '现场付款'
                    }]
                }]
            };
            myChart.setOption(option);
        },
        //根据维度筛选趋势数据
        getTrendMapByDimension() {
            this.trendMap = {
                xAxis: [],
                serise: []
            };
            this.trendData && this.trendData.forEach(item => {
                this.trendMap.xAxis.push(item.refDate);
                this.trendMap.serise.push(item[this.dimension]);
            });
            this.loadTrend();
        },
        //加载趋势统计
        loadTrend() {
            var myChart = Echart.init(document.getElementById('trend'));
            var option = {
                tooltip: {
                    trigger: 'axis'
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: this.trendMap.xAxis.reverse()
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    name: this.filterWord(this.dimension,this.selectList),
                    type: 'line',
                    smooth: true,
                    data: this.trendMap.serise.reverse()
                }]
            };
            myChart.setOption(option);
        },
        //根据维度筛选机构数据
        getHospitalMapByDimension() {
            var yAxis = [],serise = [];
            this.hospitalData = this.hospitalData && this.hospitalData.sort(this.compare);
            this.hospitalData && this.hospitalData.forEach(item => {
                if(item.hospitalName.length>15){
                   let name = item.hospitalName.substring(0,10)
                   yAxis.push(name+'...')
                }else{
                    yAxis.push(item.hospitalName)
                }
                serise.push(item[this.dimension])
            });
            //取前10条数据
            this.hospitalMap = {
                yAxis: [],
                serise: []
            };
            this.hospitalMap.yAxis = yAxis ? (yAxis.length > 10 ? yAxis.slice(0, 10) : yAxis) : null;
            this.hospitalMap.serise = serise ? (serise.length > 10 ? serise.slice(0, 10) : serise) : null;
            this.loadHospital();
        },
        //加载机构统计
        loadHospital() {
            var myChart = Echart.init(document.getElementById('hospital'));
            var option = {
                tooltip: {
                    trigger: 'axis'
                },
                grid: {
                    left: '15%'
                },
                xAxis: {
                    type: 'value'
                },
                yAxis: {
                    type: 'category',
                    data: this.hospitalMap.yAxis
                },
                series: [{
                    name: this.filterWord(this.dimension,this.selectList),
                    type: 'bar',
                    smooth: true,
                    barMinHeight: '30px',
                    data: this.hospitalMap.serise
                }]
            };
            myChart.setOption(option);
        },
        //根据维度筛选地区数据
        getRegionMapByDimension() {
            var yAxis = [],
                serise = [];
            this.regionData = this.regionData && this.regionData.sort(this.compare);
            this.regionData && this.regionData.forEach(item => {
                yAxis.push(item.areaName)
                serise.push(item[this.dimension])
            });
            //取前10条数据
            this.regionMap = {
                yAxis: [],
                serise: []
            };
            this.regionMap.yAxis = yAxis ? (yAxis.length > 10 ? yAxis.slice(0, 10) : yAxis) : null;
            this.regionMap.serise = serise ? (serise.length > 10 ? serise.slice(0, 10) : serise) : null;
            this.loadRegion();
        },
        //加载地区统计
        loadRegion() {
            var myChart = Echart.init(document.getElementById('region'));
            var option = {
                tooltip: {
                    trigger: 'axis'
                },
                xAxis: {
                    type: 'value'
                },
                yAxis: {
                    type: 'category',
                    data: this.regionMap.yAxis
                },
                series: [{
                    name: this.filterWord(this.dimension,this.selectList),
                    type: 'bar',
                    smooth: true,
                    barMinHeight: '30px',
                    data: this.regionMap.serise
                }]
            };
            myChart.setOption(option);
        },
        //根据维度筛选增量分析
        getIncrementMapByDimension() {

            this.incrementData = this.incrementData && this.incrementData.sort(this.compare);
            this.incrementMap = {
                xAxis: [],
                serise: []
            };
            this.incrementData && this.incrementData.forEach(item => {
                this.incrementMap.xAxis.push(item.orderMode)
                this.incrementMap.serise.push(item[this.incrementSelected])
            });

            this.loadIncrement();
        },
        //加载增量分析
        loadIncrement(){
          var myChart = Echart.init(document.getElementById('increment'));
          var option = {
				    color: ['#3398DB'],
				    tooltip : {
				        trigger: 'axis',
				        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
				            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
				        }
				    },
				    grid: {
				        left: '3%',
				        right: '4%',
				        bottom: '3%',
				        containLabel: true
				    },
				    xAxis : [{
				            type : 'category',
				            data : this.incrementMap.xAxis,
				            axisTick: {alignWithLabel: true}
				        }],
				    yAxis : [{type : 'value'}],
				    series : [{
				            name:this.filterWord(this.incrementSelected,this.incrementSelection),
				            type:'bar',
				            barWidth: '50px',
				            data:this.incrementMap.serise
				        }]
				 }
			  myChart.setOption(option);
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
        //获取最近几天日期
        getBeforeDate(n) {
            var n = n;
            var d = new Date();
            d.setDate(d.getDate() - n);
            return d;
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
        //排序
        compare(obj1, obj2) {
            var val1 = parseFloat(obj1[this.dimension]);
            var val2 = parseFloat(obj2[this.dimension]);
            if (val1 < val2) {
                return 1;
            } else if (val1 > val2) {
                return -1;
            } else {
                return 0;
            }
        },

        filterWord(value,list)
        {
           var word;
           for(var i=0;i<list.length;i++)
           {
             if(value == list[i].value)
             {
                 word = list[i].label;
             }
           }
           return word;
        },

        //对趋势统计排序
        sortList( list, value){
           if(value == 1){
             this[list] = this[list].sort(this.compareField)
           }else{

             this[list] = this[list].sort(this.reverseField)
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
export default orderIncrementReport
