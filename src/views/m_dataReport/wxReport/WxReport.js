var Echart = require('echarts');

const wxReport = {
    name: 'wxReport',
    data() {
        return {
            areaList: [],
            hospitalList: [],
            activeName: 'trend',
            dimension: 'newUser',
            selectList: [{
                value: 'cumulateUser',
                label: '总关注'
            }, {
                value: 'newUser',
                label: '新关注'
            }, {
                value: 'cancelUser',
                label: '取消关注'
            }, {
                value: 'countBindUser',
                label: '总绑定'
            }, {
                value: 'newBindUser',
                label: '新绑定'
            }, {
                value: 'fromSearch',
                label: '搜索'
            }, {
                value: 'fromCardShare',
                label: '分享'
            }, {
                value: 'fromScan',
                label: '扫码'
            }, {
                value: 'fromPay',
                label: '支付'
            }, {
                value: 'fromOther',
                label: '其他'
            }],
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
                pageSize: 100,
                current: 1,
                countCycle: 'daily'
            },
            allData: [],
            trendData: [],
            hospitalData: [],
            regionData: [],
            pieData: {
                newUser: '',
                cumulateUser: '',
                cancelUser: '',
                countBindUser: '',
                newBindUser: '',
                fromSearch: '',
                fromCardShare: '',
                fromScan: '',
                fromPay: '',
                fromOther: '',
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
            showWeek: true,
            showMonth: true,
            styleObject: {
                width: '',
                height: '400px'
            },
            loading_pie: true,
            loading_trend: true,
            loading_hospital: true,
            loading_region: true,
            sortBy: undefined,
            currentSortValue: undefined,
        }
    },
    watch: {
        queryList: {
            handler: function() {
                this.activeName == 'trend' && this.loadTrendData();
                this.activeName == 'hospital' && this.loadHospitalData();
                this.activeName == 'region' && this.loadRegionData();
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
        loadPieData(){
            this.$http.post('/report/wechat/queryCollectData', JSON.stringify(this.queryList)).then((response) => {
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
            this.$http.post('/report/wechat/queryTimeDimensionalityData', JSON.stringify(this.queryList)).then((response) => {
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
            this.$http.post('/report/wechat/queryOrgaDimensionalityDate', JSON.stringify(this.queryList)).then((response) => {
                this.loading_hospital = false;
                this.allData = response.body;
                this.hospitalData = response.body.records;
            }, (res) => {
                this.$message({
                    message: res.text,
                    type: 'warning'
                })
            }).then(() => {
                this.getHospitalMapMapByDimension();
            })
        },
        //加载地区数据
        loadRegionData() {
            this.$http.post('/report/wechat/queryAreaDimensionalityDate', JSON.stringify(this.queryList)).then((response) => {
                this.loading_region = false;
                this.allData = response.body;
                this.regionData = response.body.records;
            }, (res) => {
                this.$message({
                    message: res.text,
                    type: 'warning'
                })
            }).then(() => {
                this.getRegionMapMapByDimension();
            })
        },
        //切换tab
        handleClick(tab, event) {
            this.sortBy = undefined
            tab == 'trend' && this.loadTrendData();
            tab == 'hospital' && this.loadHospitalData();
            tab == 'region' && this.loadRegionData();
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
        pageSizeChange(val) {
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
                districtId: this.queryList.districtId,
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

        //加载pie图
        loadPie() {
            var myChart = Echart.init(document.getElementById('pieData'));
            var option = {
                title: {
                    text: '关注来源统计',
                    x: 'right',
                    textStyle: {
                        fontSize: '14',
                        fontWeight: 'normal'
                    }
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    left: 'right',
                    top: '20%',
                    data: ['搜索', '分享', '扫码', '支付', '其他']
                },
                series: [{
                    name: '访问来源',
                    type: 'pie',
                    radius: '80%',
                    center: ['50%', '50%'],
                    data: [{
                        value: this.pieData.fromSearch,
                        name: '搜索'
                    }, {
                        value: this.pieData.fromCardShare,
                        name: '分享'
                    }, {
                        value: this.pieData.fromScan,
                        name: '扫码'
                    }, {
                        value: this.pieData.fromPay,
                        name: '支付'
                    }, {
                        value: this.pieData.fromOther,
                        name: '其他'
                    }],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }]
            };
            myChart.setOption(option);
        },
        //根据维度筛选趋势数据
        getTrendMapByDimension() {  
            this.trendMap={xAxis:[],serise:[]};
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
        getHospitalMapMapByDimension() {
            var yAxis=[],serise=[];
            this.hospitalData = this.hospitalData && this.hospitalData.sort(this.compare);
            this.hospitalData && this.hospitalData.forEach(item => {
                yAxis.push(item.organizationName)
                serise.push(item[this.dimension])
            });
            //取前10条数据
            this.hospitalMap={yAxis:[],serise:[]};
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
        getRegionMapMapByDimension() {
            var yAxis=[],serise=[];
            this.regionData = this.regionData && this.regionData.sort(this.compare);
            this.regionData && this.regionData.forEach(item => {
                yAxis.push(item.areaName)
                serise.push(item[this.dimension])
            });
            //取前10条数据
            this.regionMap={yAxis:[],serise:[]};
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
            var val1 = obj1[this.dimension];
            var val2 = obj2[this.dimension];
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
           for(var i=0;i<list.length;i++){
             if(value == list[i].value){
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
export default wxReport