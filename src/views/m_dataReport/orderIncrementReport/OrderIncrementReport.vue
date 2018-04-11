<template>
  <div class="orderSourceReport">
    <Row>
      <Col :span="24" class="header-search">
    		 <div class="serach-line">
  		  	  <span>时间：</span>
    		  	<RadioGroup v-model="datasolt" type="button" @on-change="getData">
      			  <Radio label="昨日"></Radio>
					    <Radio label="前日"></Radio>
					    <Radio label="最近7天"></Radio>
					    <Radio label="最近30天"></Radio>
				   </RadioGroup>
           <DatePicker 
              type="daterange" 
              placeholder="选择日期" 
              v-model="daterange"
              :clearable="false"
              :editable="false"
              @on-change="getDataRange">
            </DatePicker>
    		  </div>

    		  <div>
    		  	 <span>地区：</span>
             <Cascader 
               class="dlb"
               :data="areaList" 
               v-model="addressIds"
               :clearable="true"
               :change-on-select="true"
               @on-change="getDetailId"
               style="width:200px">
             </Cascader>

  				   <span class="query-margin">机构单位：</span>
             <mt-select
               style="width:200px"
               v-model="queryList.hospitalId"
               placeholder="请选择机构"
               @on-change="changeHospital"
               :filters="['hospitalName', 'hospitalPinyin']"
               :options="hospitalList">
              </mt-select>

              <mt-select
               style="width:200px"
               v-model="queryList.examCompanyId"
               placeholder="请选择单位"
               @on-change="changeHospital"
               :filters="['examCompanyName','examCompanyPinyin']"
               :disabled="!queryList.hospitalId"
               :options="companyList">
              </mt-select>

				     <span class="query-margin">订单来源：</span>
             <RadioGroup v-model="queryList.typeOfOrder" type="button">
        			  <Radio label="0">全部订单</Radio>
    				    <Radio label="1">医院订单</Radio>
    				    <Radio label="2">渠道订单</Radio>
  				   </RadioGroup>
    	   </div>
    	</Col>
    </Row>

    <div class="body-content">
    	<Row class="result">
    	 <div class="ops-title">体检中心订单统计</div>
    	 <Col :md="12" :sm="12">
    	    <div class="result-ul">
    	    	 <Col :lg="8" :md="12" :sm="12" class="result-ul-li">
    	    	 	  <div class="wx-total-title">订单金额</div>
    	 	  	    <div class="wx-total-val fontbg" v-if="pieData.orderPrice">￥{{pieData.orderPrice}}</div>
    	 	  	    <div class="wx-total-val fontbg" v-else>￥0</div>
    	    	 </Col>
    	    	 <Col :lg="8"  :md="12" :sm="12" class="result-ul-li">
    	    	 	  <div class="wx-total-title">网付金额</div>
    	 	  	    <div class="wx-total-val fontbg" v-if="pieData.onlinePrice">￥{{pieData.onlinePrice}}</div>
    	 	  	    <div class="wx-total-val fontbg" v-else>￥0</div>
    	    	 </Col>
    	    	 <Col :lg="8" :md="12" :sm="12">
    	    	 	  <div class="wx-total-title">反倒流金额</div>
    	 	  	    <div class="wx-total-val fontbg" v-if="pieData.onlinePrice">￥{{pieData.backInputOrderPrice}}</div>
    	 	  	    <div class="wx-total-val fontbg" v-else>￥0</div>
    	    	 </Col>
    	    </div>
    	    <div class="result-ul">
    	    	 <Col :md="6" :sm="12" class="result-ul-li">
    	    	 	  <div class="wx-total-title">订单数</div>
    	 	  	    <div class="wx-total-val" v-if="pieData.orderPrice">{{pieData.orderTimes}}</div>
    	 	  	    <div class="wx-total-val" v-else>0</div>
    	    	 </Col>
    	    	 <Col :md="6" :sm="12"  class="result-ul-li">
    	    	 	  <div class="wx-total-title">加项订单占比</div>
    	 	  	    <div class="wx-total-val" >{{pieData.additemOrdersRate | toPercentage}}</div>
    	    	 </Col>
    	    	 <Col :md="6" :sm="12" class="result-ul-li">
    	    	 	  <div class="wx-total-title">网付订单数占比</div>
    	 	  	    <div class="wx-total-val">{{pieData.onlinePayOrdersRate | toPercentage}}</div>
    	    	 </Col>
    	    	 <Col :md="6" :sm="12" >
    	    	 	  <div class="wx-total-title">平台/HIS订单比</div>
    	 	  	    <div class="wx-total-val">{{pieData.platformHISRate | toPercentage}}</div>
    	    	 </Col>
    	    </div>
    	 </Col>
    	 <Col :md="8" :sm="12" v-loading="loading_pie"  element-loading-text="拼命加载中...">
    	 	 	<div id="pieData" style="width: 800px;height:300px;"></div>
    	 </Col>
      </Row>

      <Row>
        <Tabs v-model="activeName" @on-click="handleClick">
          <TabPane label="趋势统计" name="trend">
             <div class="wxReport-charts">
                <div class="wxReport-charts-fl">
                  <div id="trend" v-bind:style="styleObject" v-loading="loading_trend" element-loading-text="拼命加载中..."></div>
                </div>

                <div class="wxReport-charts-fr">
                  <RadioGroup v-model="queryList.dynamicAttr.countCycle" type="button" @change="loadTrendData" style="margin-right:20px;">
                    <Radio label="daily">按日</Radio>
                    <Radio label="week" :disabled="showWeek">按周</Radio>
                    <Radio label="month" :disabled="showMonth">按月</Radio>
                 </RadioGroup>
                  
                  <Select 
                    v-model="dimension"
                    placeholder="请选择"
                    style="width: 200px;text-align: left;"
                    @on-change='getTrendMapByDimension'>
                      <Option  v-for="item in selectList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                   </Select>
                </div>
             </div>
            <div class="wxReport-tab">
              <div class="clear">
                <div class="wxReport-charts-fl ops-title">详细数据</div>
                <div class="wxReport-charts-fr">
                   <Select 
                    v-model="selection"
                    placeholder="自定义指标"
                    style="width: 200px;margin-top: 0.44em;text-align: left;">
                      <Option  v-for="item in selectList" :value="item.value" :key="item.value">
                        <Checkbox v-model="tabSelectList[item.value]">{{item.label}}</Checkbox>
                      </Option>
                   </Select>
                 </div>
              </div>

              <table class="table">
                <thead>
                  <tr>
                    <th>时间</th>
                    <th v-if="tabSelectList.orderTimes">订单数
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'orderTimes';currentSortValue = 1;sortList('trendData', 1)" :class="{'isOrderby':sortBy == 'orderTimes' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'orderTimes';currentSortValue = -1;sortList('trendData', -1)" :class="{'isOrderby':sortBy == 'orderTimes' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th v-if="tabSelectList.additemOrdersRate">加项数占比
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'additemOrdersRate';currentSortValue = 1;sortList('trendData', 1)" :class="{'isOrderby':sortBy == 'additemOrdersRate' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'additemOrdersRate';currentSortValue = -1;sortList('trendData', -1)" :class="{'isOrderby':sortBy == 'additemOrdersRate' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th v-if="tabSelectList.platformHISRate">平台/HIS订单比
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'platformHISRate';currentSortValue = 1;sortList('trendData', 1)" :class="{'isOrderby':sortBy == 'platformHISRate' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'platformHISRate';currentSortValue = -1;sortList('trendData', -1)" :class="{'isOrderby':sortBy == 'platformHISRate' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th v-if="tabSelectList.orderPrice">订单金额
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'orderPrice';currentSortValue = 1;sortList('trendData', 1)" :class="{'isOrderby':sortBy == 'orderPrice' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'orderPrice';currentSortValue = -1;sortList('trendData', -1)" :class="{'isOrderby':sortBy == 'orderPrice' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th v-if="tabSelectList.onlinePrice">网付金额
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'onlinePrice';currentSortValue = 1;sortList('trendData', 1)" :class="{'isOrderby':sortBy == 'onlinePrice' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'onlinePrice';currentSortValue = -1;sortList('trendData', -1)" :class="{'isOrderby':sortBy == 'onlinePrice' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th v-if="tabSelectList.offlinePrice">现付金额
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'offlinePrice';currentSortValue = 1;sortList('trendData', 1)" :class="{'isOrderby':sortBy == 'offlinePrice' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'offlinePrice';currentSortValue = -1;sortList('trendData', -1)" :class="{'isOrderby':sortBy == 'offlinePrice' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th v-if="tabSelectList.onlinePayOrders">网付订单数
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'onlinePayOrders';currentSortValue = 1;sortList('trendData', 1)" :class="{'isOrderby':sortBy == 'onlinePayOrders' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'onlinePayOrders';currentSortValue = -1;sortList('trendData', -1)" :class="{'isOrderby':sortBy == 'onlinePayOrders' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th v-if="tabSelectList.onlinePayOrdersRate">网付订单数占比
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'onlinePayOrdersRate';currentSortValue = 1;sortList('trendData', 1)" :class="{'isOrderby':sortBy == 'onlinePayOrdersRate' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'onlinePayOrdersRate';currentSortValue = -1;sortList('trendData', -1)" :class="{'isOrderby':sortBy == 'onlinePayOrdersRate' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th v-if="tabSelectList.additemOrders">加项订单数
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'additemOrders';currentSortValue = 1;sortList('trendData', 1)" :class="{'isOrderby':sortBy == 'additemOrders' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'additemOrders';currentSortValue = -1;sortList('trendData', -1)" :class="{'isOrderby':sortBy == 'additemOrders' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th v-if="tabSelectList.backInputOrdersRate">反导流占比
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'backInputOrdersRate';currentSortValue = 1;sortList('trendData', 1)" :class="{'isOrderby':sortBy == 'backInputOrdersRate' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'backInputOrdersRate';currentSortValue = -1;sortList('trendData', -1)" :class="{'isOrderby':sortBy == 'backInputOrdersRate' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th v-if="tabSelectList.managerBalancePayRate">客户经理金额占比
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'managerBalancePayRate';currentSortValue = 1;sortList('trendData', 1)" :class="{'isOrderby':sortBy == 'managerBalancePayRate' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'managerBalancePayRate';currentSortValue = -1;sortList('trendData', -1)" :class="{'isOrderby':sortBy == 'managerBalancePayRate' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th v-if="tabSelectList.cardBalancePayRate">体检卡金额占比
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'cardBalancePayRate';currentSortValue = 1;sortList('trendData', 1)" :class="{'isOrderby':sortBy == 'cardBalancePayRate' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'cardBalancePayRate';currentSortValue = -1;sortList('trendData', -1)" :class="{'isOrderby':sortBy == 'cardBalancePayRate' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th v-if="tabSelectList.onlinePriceRate">网付金额占比
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'onlinePriceRate';currentSortValue = 1;sortList('trendData', 1)" :class="{'isOrderby':sortBy == 'onlinePriceRate' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'onlinePriceRate';currentSortValue = -1;sortList('trendData', -1)" :class="{'isOrderby':sortBy == 'onlinePriceRate' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th v-if="tabSelectList.offlinePriceRate">现付金额占比
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'offlinePriceRate';currentSortValue = 1;sortList('trendData', 1)" :class="{'isOrderby':sortBy == 'offlinePriceRate' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'offlinePriceRate';currentSortValue = -1;sortList('trendData', -1)" :class="{'isOrderby':sortBy == 'offlinePriceRate' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="trend in trendData">
                    <td>{{trend.refDate}}</td>
                    <td v-if="tabSelectList.orderTimes">{{trend.orderTimes}}</td>
                    <td v-if="tabSelectList.additemOrdersRate">{{trend.additemOrdersRate | toPercentage}}</td>
                    <td v-if="tabSelectList.platformHISRate">{{trend.platformHISRate | toPercentage}}</td>
                    <td v-if="tabSelectList.orderPrice">{{trend.orderPrice}}</td>
                    <td v-if="tabSelectList.onlinePrice">{{trend.onlinePrice}}</td>
                    <td v-if="tabSelectList.offlinePrice">{{trend.offlinePrice}}</td>
                    <td v-if="tabSelectList.onlinePayOrders">{{trend.onlinePayOrders}}</td>
                    <td v-if="tabSelectList.onlinePayOrdersRate">{{trend.onlinePayOrdersRate | toPercentage}}</td>
                    <td v-if="tabSelectList.additemOrders">{{trend.additemOrders}}</td>
                    <td v-if="tabSelectList.backInputOrdersRate">{{trend.backInputOrdersRate | toPercentage}}</td>
                    <td v-if="tabSelectList.managerBalancePayRate">{{trend.managerBalancePayRate | toPercentage}}</td>
                    <td v-if="tabSelectList.cardBalancePayRate">{{trend.cardBalancePayRate | toPercentage}}</td>
                    <td v-if="tabSelectList.onlinePriceRate">{{trend.onlinePriceRate | toPercentage}}</td>
                    <td v-if="tabSelectList.offlinePriceRate">{{trend.offlinePriceRate | toPercentage}}</td>
                  </tr>
                </tbody>
              </table>

              <!-- 分页 -->
              <div class="page-wrap">
                <Page 
                 :total="allData.total" 
                 show-total
                 show-sizer
                 :page-size="allData.size" 
                 :current-page="allData.current" 
                 @on-change="currentChange"
                 @on-page-size-change="sizeChange"
                 :page-size-opts="[100,200,500]">
                </Page>
              </div>

            </div>
          </TabPane>
          <TabPane label="机构对比" name="hospital">
            <div class="wxReport-charts">
               <div class="wxReport-charts-fl">
                  <div id="hospital" v-bind:style="styleObject" v-loading="loading_hospital" element-loading-text="拼命加载中..."></div>
               </div>

              <div class="wxReport-charts-fr">
                <Select 
                  v-model="dimension"
                  placeholder="请选择"
                  style="width: 200px;text-align: left;"
                  @on-change='getHospitalMapByDimension'>
                  <Option  v-for="item in selectList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                 </Select>
              </div>
            </div>

            <div class="wxReport-tab">
                <div class="clear">
                  <div class="wxReport-charts-fl ops-title">详细数据</div>
                  <div class="wxReport-charts-fr">
                    <Select 
                      v-model="selection"
                      placeholder="自定义指标"
                      style="width: 200px;margin-top: 0.44em;text-align: left;">
                      <Option  v-for="item in selectList" :value="item.value" :key="item.value">
                        <Checkbox v-model="tabSelectList[item.value]">{{item.label}}</Checkbox>
                      </Option>
                    </Select>
                  </div>
                </div>

                <table class="table">
                  <thead>
                    <tr>
                      <th>机构ID</th>
                      <th>机构名称</th>
                      <th v-if="tabSelectList.orderTimes">订单数
                        <span class="basic-sort">
                          <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'orderTimes';currentSortValue = 1;sortList('hospitalData', 1)" :class="{'isOrderby':sortBy == 'orderTimes' && currentSortValue == 1}"></Icon>
                          <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'orderTimes';currentSortValue = -1;sortList('hospitalData', -1)" :class="{'isOrderby':sortBy == 'orderTimes' && currentSortValue == -1}"></Icon>
                        </span>
                      </th>
                      <th v-if="tabSelectList.additemOrdersRate">加项数占比
                        <span class="basic-sort">
                          <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'additemOrdersRate';currentSortValue = 1;sortList('hospitalData', 1)" :class="{'isOrderby':sortBy == 'additemOrdersRate' && currentSortValue == 1}"></Icon>
                          <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'additemOrdersRate';currentSortValue = -1;sortList('hospitalData', -1)" :class="{'isOrderby':sortBy == 'additemOrdersRate' && currentSortValue == -1}"></Icon>
                        </span>
                      </th>
                      <th v-if="tabSelectList.platformHISRate">平台/HIS订单比
                        <span class="basic-sort">
                          <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'platformHISRate';currentSortValue = 1;sortList('hospitalData', 1)" :class="{'isOrderby':sortBy == 'platformHISRate' && currentSortValue == 1}"></Icon>
                          <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'platformHISRate';currentSortValue = -1;sortList('hospitalData', -1)" :class="{'isOrderby':sortBy == 'platformHISRate' && currentSortValue == -1}"></Icon>
                        </span>
                      </th>
                      <th v-if="tabSelectList.orderPrice">订单金额
                        <span class="basic-sort">
                          <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'orderPrice';currentSortValue = 1;sortList('hospitalData', 1)" :class="{'isOrderby':sortBy == 'orderPrice' && currentSortValue == 1}"></Icon>
                          <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'orderPrice';currentSortValue = -1;sortList('hospitalData', -1)" :class="{'isOrderby':sortBy == 'orderPrice' && currentSortValue == -1}"></Icon>
                        </span>
                      </th>
                      <th v-if="tabSelectList.onlinePrice">网付金额
                        <span class="basic-sort">
                          <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'onlinePrice';currentSortValue = 1;sortList('hospitalData', 1)" :class="{'isOrderby':sortBy == 'onlinePrice' && currentSortValue == 1}"></Icon>
                          <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'onlinePrice';currentSortValue = -1;sortList('hospitalData', -1)" :class="{'isOrderby':sortBy == 'onlinePrice' && currentSortValue == -1}"></Icon>
                        </span>
                      </th>
                      <th v-if="tabSelectList.offlinePrice">现付金额
                        <span class="basic-sort">
                          <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'offlinePrice';currentSortValue = 1;sortList('hospitalData', 1)" :class="{'isOrderby':sortBy == 'offlinePrice' && currentSortValue == 1}"></Icon>
                          <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'offlinePrice';currentSortValue = -1;sortList('hospitalData', -1)" :class="{'isOrderby':sortBy == 'offlinePrice' && currentSortValue == -1}"></Icon>
                        </span>
                      </th>
                      <th v-if="tabSelectList.onlinePayOrders">网付订单数
                        <span class="basic-sort">
                          <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'onlinePayOrders';currentSortValue = 1;sortList('hospitalData', 1)" :class="{'isOrderby':sortBy == 'onlinePayOrders' && currentSortValue == 1}"></Icon>
                          <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'onlinePayOrders';currentSortValue = -1;sortList('hospitalData', -1)" :class="{'isOrderby':sortBy == 'onlinePayOrders' && currentSortValue == -1}"></Icon>
                        </span>
                      </th>
                      <th v-if="tabSelectList.onlinePayOrdersRate">网付订单数占比
                        <span class="basic-sort">
                          <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'onlinePayOrdersRate';currentSortValue = 1;sortList('hospitalData', 1)" :class="{'isOrderby':sortBy == 'onlinePayOrdersRate' && currentSortValue == 1}"></Icon>
                          <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'onlinePayOrdersRate';currentSortValue = -1;sortList('hospitalData', -1)" :class="{'isOrderby':sortBy == 'onlinePayOrdersRate' && currentSortValue == -1}"></Icon>
                        </span>
                      </th>
                      <th v-if="tabSelectList.additemOrders">加项订单数
                        <span class="basic-sort">
                          <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'additemOrders';currentSortValue = 1;sortList('hospitalData', 1)" :class="{'isOrderby':sortBy == 'additemOrders' && currentSortValue == 1}"></Icon>
                          <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'additemOrders';currentSortValue = -1;sortList('hospitalData', -1)" :class="{'isOrderby':sortBy == 'additemOrders' && currentSortValue == -1}"></Icon>
                        </span>
                      </th>
                      <th v-if="tabSelectList.backInputOrdersRate">反导流占比
                        <span class="basic-sort">
                          <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'backInputOrdersRate';currentSortValue = 1;sortList('hospitalData', 1)" :class="{'isOrderby':sortBy == 'backInputOrdersRate' && currentSortValue == 1}"></Icon>
                          <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'backInputOrdersRate';currentSortValue = -1;sortList('hospitalData', -1)" :class="{'isOrderby':sortBy == 'backInputOrdersRate' && currentSortValue == -1}"></Icon>
                        </span>
                      </th>
                      <th v-if="tabSelectList.managerBalancePayRate">客户经理金额占比
                        <span class="basic-sort">
                          <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'managerBalancePayRate';currentSortValue = 1;sortList('hospitalData', 1)" :class="{'isOrderby':sortBy == 'managerBalancePayRate' && currentSortValue == 1}"></Icon>
                          <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'managerBalancePayRate';currentSortValue = -1;sortList('hospitalData', -1)" :class="{'isOrderby':sortBy == 'managerBalancePayRate' && currentSortValue == -1}"></Icon>
                        </span>
                      </th>
                      <th v-if="tabSelectList.cardBalancePayRate">体检卡金额占比
                        <span class="basic-sort">
                          <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'cardBalancePayRate';currentSortValue = 1;sortList('hospitalData', 1)" :class="{'isOrderby':sortBy == 'cardBalancePayRate' && currentSortValue == 1}"></Icon>
                          <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'cardBalancePayRate';currentSortValue = -1;sortList('hospitalData', -1)" :class="{'isOrderby':sortBy == 'cardBalancePayRate' && currentSortValue == -1}"></Icon>
                        </span>
                      </th>
                      <th v-if="tabSelectList.onlinePriceRate">网付金额占比
                        <span class="basic-sort">
                          <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'onlinePriceRate';currentSortValue = 1;sortList('hospitalData', 1)" :class="{'isOrderby':sortBy == 'onlinePriceRate' && currentSortValue == 1}"></Icon>
                          <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'onlinePriceRate';currentSortValue = -1;sortList('hospitalData', -1)" :class="{'isOrderby':sortBy == 'onlinePriceRate' && currentSortValue == -1}"></Icon>
                        </span>
                      </th>
                      <th v-if="tabSelectList.offlinePriceRate">现付金额占比
                        <span class="basic-sort">
                          <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'offlinePriceRate';currentSortValue = 1;sortList('hospitalData', 1)" :class="{'isOrderby':sortBy == 'offlinePriceRate' && currentSortValue == 1}"></Icon>
                          <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'offlinePriceRate';currentSortValue = -1;sortList('hospitalData', -1)" :class="{'isOrderby':sortBy == 'offlinePriceRate' && currentSortValue == -1}"></Icon>
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="hos in hospitalData">
                      <td>{{hos.hospitalId}}</td>
                      <td>{{hos.hospitalName}}</td>
                      <td v-if="tabSelectList.orderTimes">{{hos.orderTimes}}</td>
                      <td v-if="tabSelectList.additemOrdersRate">{{hos.additemOrdersRate | toPercentage}}</td>
                      <td v-if="tabSelectList.platformHISRate">{{hos.platformHISRate | toPercentage}}</td>
                      <td v-if="tabSelectList.orderPrice">{{hos.orderPrice}}</td>
                      <td v-if="tabSelectList.onlinePrice">{{hos.onlinePrice}}</td>
                      <td v-if="tabSelectList.offlinePrice">{{hos.offlinePrice}}</td>
                      <td v-if="tabSelectList.onlinePayOrders">{{hos.onlinePayOrders}}</td>
                      <td v-if="tabSelectList.onlinePayOrdersRate">{{hos.onlinePayOrdersRate | toPercentage}}</td>
                      <td v-if="tabSelectList.additemOrders">{{hos.additemOrders}}</td>
                      <td v-if="tabSelectList.backInputOrdersRate">{{hos.backInputOrdersRate | toPercentage}}</td>
                      <td v-if="tabSelectList.managerBalancePayRate">{{hos.managerBalancePayRate | toPercentage}}</td>
                      <td v-if="tabSelectList.cardBalancePayRate">{{hos.cardBalancePayRate | toPercentage}}</td>
                      <td v-if="tabSelectList.onlinePriceRate">{{hos.onlinePriceRate | toPercentage}}</td>
                      <td v-if="tabSelectList.offlinePriceRate">{{hos.offlinePriceRate | toPercentage}}</td>
                    </tr>
                  </tbody>
                </table>

                <!-- 分页 -->
                <div class="page-wrap">
                  <Page 
                   :total="allData.total" 
                   show-total
                   show-sizer
                   :page-size="allData.size" 
                   :current-page="allData.current" 
                   @on-change="currentChange"
                   @on-page-size-change="sizeChange"
                   :page-size-opts="[100,200,500]">
                  </Page>
                </div>
             </div>
          </TabPane>
          <TabPane label="地区对比" name="region">
            <div class="wxReport-charts">
               <div class="wxReport-charts-fl">
                 <div id="region" v-bind:style="styleObject" v-loading="loading_region" element-loading-text="拼命加载中..."></div>
               </div>
              <div class="wxReport-charts-fr">
                <Select 
                  v-model="dimension"
                  placeholder="请选择"
                  style="width: 200px;text-align: left;"
                  @on-change='getRegionMapByDimension'>
                  <Option  v-for="item in selectList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
              </div>
            </div>
            <div class="wxReport-tab">
              <div class="clear">
                  <div class="wxReport-charts-fl ops-title">详细数据</div>
                  <div class="wxReport-charts-fr">
                    <Select 
                      v-model="selection"
                      placeholder="自定义指标"
                      style="width: 200px;margin-top: 0.44em;text-align: left;">
                      <Option  v-for="item in selectList" :value="item.value" :key="item.value">
                        <Checkbox v-model="tabSelectList[item.value]">{{item.label}}</Checkbox>
                      </Option>
                    </Select>
                  </div>
              </div>

              <table class="table">
                <thead>
                  <tr>
                    <th>地区</th>
                    <th v-if="tabSelectList.orderTimes">订单数
                        <span class="basic-sort">
                          <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'orderTimes';currentSortValue = 1;sortList('regionData', 1)" :class="{'isOrderby':sortBy == 'orderTimes' && currentSortValue == 1}"></Icon>
                          <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'orderTimes';currentSortValue = -1;sortList('regionData', -1)" :class="{'isOrderby':sortBy == 'orderTimes' && currentSortValue == -1}"></Icon>
                        </span>
                    </th>
                    <th v-if="tabSelectList.additemOrdersRate">加项数占比
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'additemOrdersRate';currentSortValue = 1;sortList('regionData', 1)" :class="{'isOrderby':sortBy == 'additemOrdersRate' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'additemOrdersRate';currentSortValue = -1;sortList('regionData', -1)" :class="{'isOrderby':sortBy == 'additemOrdersRate' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th v-if="tabSelectList.platformHISRate">平台/HIS订单比
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'platformHISRate';currentSortValue = 1;sortList('regionData', 1)" :class="{'isOrderby':sortBy == 'platformHISRate' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'platformHISRate';currentSortValue = -1;sortList('regionData', -1)" :class="{'isOrderby':sortBy == 'platformHISRate' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th v-if="tabSelectList.orderPrice">订单金额
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'orderPrice';currentSortValue = 1;sortList('regionData', 1)" :class="{'isOrderby':sortBy == 'orderPrice' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'orderPrice';currentSortValue = -1;sortList('regionData', -1)" :class="{'isOrderby':sortBy == 'orderPrice' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th v-if="tabSelectList.onlinePrice">网付金额
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'onlinePrice';currentSortValue = 1;sortList('regionData', 1)" :class="{'isOrderby':sortBy == 'onlinePrice' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'onlinePrice';currentSortValue = -1;sortList('regionData', -1)" :class="{'isOrderby':sortBy == 'onlinePrice' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th v-if="tabSelectList.offlinePrice">现付金额
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'offlinePrice';currentSortValue = 1;sortList('regionData', 1)" :class="{'isOrderby':sortBy == 'offlinePrice' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'offlinePrice';currentSortValue = -1;sortList('regionData', -1)" :class="{'isOrderby':sortBy == 'offlinePrice' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th v-if="tabSelectList.onlinePayOrders">网付订单数
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'onlinePayOrders';currentSortValue = 1;sortList('regionData', 1)" :class="{'isOrderby':sortBy == 'onlinePayOrders' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'onlinePayOrders';currentSortValue = -1;sortList('regionData', -1)" :class="{'isOrderby':sortBy == 'onlinePayOrders' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th v-if="tabSelectList.onlinePayOrdersRate">网付订单数占比
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'onlinePayOrdersRate';currentSortValue = 1;sortList('regionData', 1)" :class="{'isOrderby':sortBy == 'onlinePayOrdersRate' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'onlinePayOrdersRate';currentSortValue = -1;sortList('regionData', -1)" :class="{'isOrderby':sortBy == 'onlinePayOrdersRate' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th v-if="tabSelectList.additemOrders">加项订单数
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'additemOrders';currentSortValue = 1;sortList('regionData', 1)" :class="{'isOrderby':sortBy == 'additemOrders' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'additemOrders';currentSortValue = -1;sortList('regionData', -1)" :class="{'isOrderby':sortBy == 'additemOrders' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th v-if="tabSelectList.backInputOrdersRate">反导流占比
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'backInputOrdersRate';currentSortValue = 1;sortList('regionData', 1)" :class="{'isOrderby':sortBy == 'backInputOrdersRate' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'backInputOrdersRate';currentSortValue = -1;sortList('regionData', -1)" :class="{'isOrderby':sortBy == 'backInputOrdersRate' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th v-if="tabSelectList.managerBalancePayRate">客户经理金额占比
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'managerBalancePayRate';currentSortValue = 1;sortList('regionData', 1)" :class="{'isOrderby':sortBy == 'managerBalancePayRate' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'managerBalancePayRate';currentSortValue = -1;sortList('regionData', -1)" :class="{'isOrderby':sortBy == 'managerBalancePayRate' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th v-if="tabSelectList.cardBalancePayRate">体检卡金额占比
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'cardBalancePayRate';currentSortValue = 1;sortList('regionData', 1)" :class="{'isOrderby':sortBy == 'cardBalancePayRate' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'cardBalancePayRate';currentSortValue = -1;sortList('regionData', -1)" :class="{'isOrderby':sortBy == 'cardBalancePayRate' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th v-if="tabSelectList.onlinePriceRate">网付金额占比
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'onlinePriceRate';currentSortValue = 1;sortList('regionData', 1)" :class="{'isOrderby':sortBy == 'onlinePriceRate' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'onlinePriceRate';currentSortValue = -1;sortList('regionData', -1)" :class="{'isOrderby':sortBy == 'onlinePriceRate' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th v-if="tabSelectList.offlinePriceRate">现付金额占比
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'offlinePriceRate';currentSortValue = 1;sortList('regionData', 1)" :class="{'isOrderby':sortBy == 'offlinePriceRate' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'offlinePriceRate';currentSortValue = -1;sortList('regionData', -1)" :class="{'isOrderby':sortBy == 'offlinePriceRate' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                  </tr>
                </thead> 
                <tbody>
                  <tr v-for="region in regionData">
                    <td>{{region.areaName}}</td>
                    <td v-if="tabSelectList.orderTimes">{{region.orderTimes}}</td>
                    <td v-if="tabSelectList.additemOrdersRate">{{region.additemOrdersRate | toPercentage}}</td>
                    <td v-if="tabSelectList.platformHISRate">{{region.platformHISRate | toPercentage}}</td>
                    <td v-if="tabSelectList.orderPrice">{{region.orderPrice}}</td>
                    <td v-if="tabSelectList.onlinePrice">{{region.onlinePrice}}</td>
                    <td v-if="tabSelectList.offlinePrice">{{region.offlinePrice}}</td>
                    <td v-if="tabSelectList.onlinePayOrders">{{region.onlinePayOrders}}</td>
                    <td v-if="tabSelectList.onlinePayOrdersRate">{{region.onlinePayOrdersRate | toPercentage}}</td>
                    <td v-if="tabSelectList.additemOrders">{{region.additemOrders}}</td>
                    <td v-if="tabSelectList.backInputOrdersRate">{{region.backInputOrdersRate | toPercentage}}</td>
                    <td v-if="tabSelectList.managerBalancePayRate">{{region.managerBalancePayRate | toPercentage}}</td>
                    <td v-if="tabSelectList.cardBalancePayRate">{{region.cardBalancePayRate | toPercentage}}</td>
                    <td v-if="tabSelectList.onlinePriceRate">{{region.onlinePriceRate | toPercentage}}</td>
                    <td v-if="tabSelectList.offlinePriceRate">{{region.offlinePriceRate | toPercentage}}</td>
                  </tr>
                </tbody>
              </table>

              <!-- 分页 -->
              <div class="page-wrap">
                <Page 
                 :total="allData.total" 
                 show-total
                 show-sizer
                 :page-size="allData.size" 
                 :current-page="allData.current" 
                 @on-change="currentChange"
                 @on-page-size-change="sizeChange"
                 :page-size-opts="[100,200,500]">
                </Page>
              </div>
            </div>
          </TabPane>
          <TabPane label="来源统计" name="source">
            <div class="wxReport-tab">
              <div class="clear">
                  <div class="wxReport-charts-fl ops-title">详细数据</div>
                  <div class="wxReport-charts-fr">
                    <Select 
                      v-model="selection"
                      placeholder="自定义指标"
                      style="width: 200px;margin-top: 0.44em;text-align: left;">
                      <Option  v-for="item in selectList" :value="item.value" :key="item.value">
                        <Checkbox v-model="tabSelectList[item.value]">{{item.label}}</Checkbox>
                      </Option>
                    </Select>
                  </div>
              </div>

              <table class="table">
                <thead>
                  <tr>
                    <th>来源</th>
                    <th v-if="tabSelectList.orderTimes">订单数
                        <span class="basic-sort">
                          <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'orderTimes';currentSortValue = 1;sortList('sourceData', 1)" :class="{'isOrderby':sortBy == 'orderTimes' && currentSortValue == 1}"></Icon>
                          <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'orderTimes';currentSortValue = -1;sortList('sourceData', -1)" :class="{'isOrderby':sortBy == 'orderTimes' && currentSortValue == -1}"></Icon>
                        </span>
                    </th>
                    <th v-if="tabSelectList.additemOrdersRate">加项数占比
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'additemOrdersRate';currentSortValue = 1;sortList('sourceData', 1)" :class="{'isOrderby':sortBy == 'additemOrdersRate' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'additemOrdersRate';currentSortValue = -1;sortList('sourceData', -1)" :class="{'isOrderby':sortBy == 'additemOrdersRate' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th v-if="tabSelectList.platformHISRate">平台/HIS订单比
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'platformHISRate';currentSortValue = 1;sortList('sourceData', 1)" :class="{'isOrderby':sortBy == 'platformHISRate' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'platformHISRate';currentSortValue = -1;sortList('sourceData', -1)" :class="{'isOrderby':sortBy == 'platformHISRate' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th v-if="tabSelectList.orderPrice">订单金额
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'orderPrice';currentSortValue = 1;sortList('sourceData', 1)" :class="{'isOrderby':sortBy == 'orderPrice' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'orderPrice';currentSortValue = -1;sortList('sourceData', -1)" :class="{'isOrderby':sortBy == 'orderPrice' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th v-if="tabSelectList.onlinePrice">网付金额
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'onlinePrice';currentSortValue = 1;sortList('sourceData', 1)" :class="{'isOrderby':sortBy == 'onlinePrice' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'onlinePrice';currentSortValue = -1;sortList('sourceData', -1)" :class="{'isOrderby':sortBy == 'onlinePrice' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th v-if="tabSelectList.offlinePrice">现付金额
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'offlinePrice';currentSortValue = 1;sortList('sourceData', 1)" :class="{'isOrderby':sortBy == 'offlinePrice' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'offlinePrice';currentSortValue = -1;sortList('sourceData', -1)" :class="{'isOrderby':sortBy == 'offlinePrice' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th v-if="tabSelectList.onlinePayOrders">网付订单数
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'onlinePayOrders';currentSortValue = 1;sortList('sourceData', 1)" :class="{'isOrderby':sortBy == 'onlinePayOrders' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'onlinePayOrders';currentSortValue = -1;sortList('sourceData', -1)" :class="{'isOrderby':sortBy == 'onlinePayOrders' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th v-if="tabSelectList.onlinePayOrdersRate">网付订单数占比
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'onlinePayOrdersRate';currentSortValue = 1;sortList('sourceData', 1)" :class="{'isOrderby':sortBy == 'onlinePayOrdersRate' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'onlinePayOrdersRate';currentSortValue = -1;sortList('sourceData', -1)" :class="{'isOrderby':sortBy == 'onlinePayOrdersRate' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th v-if="tabSelectList.additemOrders">加项订单数
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'additemOrders';currentSortValue = 1;sortList('sourceData', 1)" :class="{'isOrderby':sortBy == 'additemOrders' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'additemOrders';currentSortValue = -1;sortList('sourceData', -1)" :class="{'isOrderby':sortBy == 'additemOrders' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th v-if="tabSelectList.backInputOrdersRate">反导流占比
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'backInputOrdersRate';currentSortValue = 1;sortList('sourceData', 1)" :class="{'isOrderby':sortBy == 'backInputOrdersRate' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'backInputOrdersRate';currentSortValue = -1;sortList('sourceData', -1)" :class="{'isOrderby':sortBy == 'backInputOrdersRate' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th v-if="tabSelectList.managerBalancePayRate">客户经理金额占比
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'managerBalancePayRate';currentSortValue = 1;sortList('sourceData', 1)" :class="{'isOrderby':sortBy == 'managerBalancePayRate' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'managerBalancePayRate';currentSortValue = -1;sortList('sourceData', -1)" :class="{'isOrderby':sortBy == 'managerBalancePayRate' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th v-if="tabSelectList.cardBalancePayRate">体检卡金额占比
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'cardBalancePayRate';currentSortValue = 1;sortList('sourceData', 1)" :class="{'isOrderby':sortBy == 'cardBalancePayRate' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'cardBalancePayRate';currentSortValue = -1;sortList('sourceData', -1)" :class="{'isOrderby':sortBy == 'cardBalancePayRate' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th v-if="tabSelectList.onlinePriceRate">网付金额占比
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'onlinePriceRate';currentSortValue = 1;sortList('sourceData', 1)" :class="{'isOrderby':sortBy == 'onlinePriceRate' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'onlinePriceRate';currentSortValue = -1;sortList('sourceData', -1)" :class="{'isOrderby':sortBy == 'onlinePriceRate' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th v-if="tabSelectList.offlinePriceRate">现付金额占比
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'offlinePriceRate';currentSortValue = 1;sortList('sourceData', 1)" :class="{'isOrderby':sortBy == 'offlinePriceRate' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'offlinePriceRate';currentSortValue = -1;sortList('sourceData', -1)" :class="{'isOrderby':sortBy == 'offlinePriceRate' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="source in sourceData">
                    <td>{{source.typeOfOrder}}</td>
                    <td v-if="tabSelectList.orderTimes">{{source.orderTimes}}</td>
                    <td v-if="tabSelectList.additemOrdersRate">{{source.additemOrdersRate | toPercentage}}</td>
                    <td v-if="tabSelectList.platformHISRate">{{source.platformHISRate | toPercentage}}</td>
                    <td v-if="tabSelectList.orderPrice">{{source.orderPrice}}</td>
                    <td v-if="tabSelectList.onlinePrice">{{source.onlinePrice}}</td>
                    <td v-if="tabSelectList.offlinePrice">{{source.offlinePrice}}</td>
                    <td v-if="tabSelectList.onlinePayOrders">{{source.onlinePayOrders}}</td>
                    <td v-if="tabSelectList.onlinePayOrdersRate">{{source.onlinePayOrdersRate | toPercentage}}</td>
                    <td v-if="tabSelectList.additemOrders">{{source.additemOrders}}</td>
                    <td v-if="tabSelectList.backInputOrdersRate">{{source.backInputOrdersRate | toPercentage}}</td>
                    <td v-if="tabSelectList.managerBalancePayRate">{{source.managerBalancePayRate | toPercentage}}</td>
                    <td v-if="tabSelectList.cardBalancePayRate">{{source.cardBalancePayRate | toPercentage}}</td>
                    <td v-if="tabSelectList.onlinePriceRate">{{source.onlinePriceRate | toPercentage}}</td>
                    <td v-if="tabSelectList.offlinePriceRate">{{source.offlinePriceRate | toPercentage}}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </TabPane>
          <TabPane label="增量分析" name="increment">
            <div class="wxReport-charts">
                <div class="wxReport-charts-fl">
                   <div id="increment" v-bind:style="styleObject" v-loading="loading_increment" element-loading-text="拼命加载中..."></div>
                </div>
                <div class="wxReport-charts-fr">
                  <Select 
                    v-model="dimension"
                    placeholder="请选择"
                    style="width: 200px;text-align: left;"
                    @on-change='getIncrementMapByDimension'>
                    <Option  v-for="item in selectList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>
                </div>
              </div>
              <div class="wxReport-tab">
                <div class="clear">
                    <div class="wxReport-charts-fl ops-title">详细数据</div>
                </div>
                <table class="table">
                  <thead>
                    <tr>
                      <th>下单方式</th>
                      <th>订单数
                          <span class="basic-sort">
                            <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'orderTimes';currentSortValue = 1;sortList('incrementData', 1)" :class="{'isOrderby':sortBy == 'orderTimes' && currentSortValue == 1}"></Icon>
                            <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'orderTimes';currentSortValue = -1;sortList('incrementData', -1)" :class="{'isOrderby':sortBy == 'orderTimes' && currentSortValue == -1}"></Icon>
                          </span>
                      </th>
                      <th>加项订单数
                        <span class="basic-sort">
                          <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'additemOrders';currentSortValue = 1;sortList('incrementData', 1)" :class="{'isOrderby':sortBy == 'additemOrders' && currentSortValue == 1}"></Icon>
                          <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'additemOrders';currentSortValue = -1;sortList('incrementData', -1)" :class="{'isOrderby':sortBy == 'additemOrders' && currentSortValue == -1}"></Icon>
                        </span>
                      </th>
                      <th>加项数占比
                        <span class="basic-sort">
                          <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'additemOrdersRate';currentSortValue = 1;sortList('incrementData', 1)" :class="{'isOrderby':sortBy == 'additemOrdersRate' && currentSortValue == 1}"></Icon>
                          <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'additemOrdersRate';currentSortValue = -1;sortList('incrementData', -1)" :class="{'isOrderby':sortBy == 'additemOrdersRate' && currentSortValue == -1}"></Icon>
                        </span>
                      </th>
                      <th>订单金额
                        <span class="basic-sort">
                          <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'orderPrice';currentSortValue = 1;sortList('incrementData', 1)" :class="{'isOrderby':sortBy == 'orderPrice' && currentSortValue == 1}"></Icon>
                          <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'orderPrice';currentSortValue = -1;sortList('incrementData', -1)" :class="{'isOrderby':sortBy == 'orderPrice' && currentSortValue == -1}"></Icon>
                        </span>
                      </th>
                      <th>网付金额
                        <span class="basic-sort">
                          <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'onlinePrice';currentSortValue = 1;sortList('incrementData', 1)" :class="{'isOrderby':sortBy == 'onlinePrice' && currentSortValue == 1}"></Icon>
                          <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'onlinePrice';currentSortValue = -1;sortList('incrementData', -1)" :class="{'isOrderby':sortBy == 'onlinePrice' && currentSortValue == -1}"></Icon>
                        </span>
                      </th>
                      <th>网付金额占比
                        <span class="basic-sort">
                          <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'onlinePriceRate';currentSortValue = 1;sortList('incrementData', 1)" :class="{'isOrderby':sortBy == 'onlinePriceRate' && currentSortValue == 1}"></Icon>
                          <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'onlinePriceRate';currentSortValue = -1;sortList('incrementData', -1)" :class="{'isOrderby':sortBy == 'onlinePriceRate' && currentSortValue == -1}"></Icon>
                        </span>
                      </th>
                      <th>平均订单金额
                        <span class="basic-sort">
                          <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'averageOrderPrice';currentSortValue = 1;sortList('incrementData', 1)" :class="{'isOrderby':sortBy == 'averageOrderPrice' && currentSortValue == 1}"></Icon>
                          <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'averageOrderPrice';currentSortValue = -1;sortList('incrementData', -1)" :class="{'isOrderby':sortBy == 'averageOrderPrice' && currentSortValue == -1}"></Icon>
                        </span>
                      </th>
                      <th>平均网付金额
                        <span class="basic-sort">
                          <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'averageOnlinePrice';currentSortValue = 1;sortList('incrementData', 1)" :class="{'isOrderby':sortBy == 'averageOnlinePrice' && currentSortValue == 1}"></Icon>
                          <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'averageOnlinePrice';currentSortValue = -1;sortList('incrementData', -1)" :class="{'isOrderby':sortBy == 'averageOnlinePrice' && currentSortValue == -1}"></Icon>
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="increment in incrementData">
                      <td>{{increment.orderMode}}</td>
                      <td>{{increment.orderTimes}}</td>
                      <td>{{increment.additemOrders}}</td>
                      <td>{{increment.additemOrdersRate}}</td>
                      <td>{{increment.orderPrice}}</td>
                      <td>{{increment.onlinePrice}}</td>
                      <td>{{increment.onlinePriceRate | toPercentage}}</td>
                      <td>{{increment.averageOrderPrice}}</td>
                      <td>{{increment.averageOnlinePrice}}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
          </TabPane>
        </Tabs>
      </Row>
   </div>
    
  </div>
</template>

<script>
import OrderIncrementReport from './OrderIncrementReport.js'
export default OrderIncrementReport
</script>

<style lang="less">
.orderSourceReport
{
  font-size:14px;
}
.query-margin
{
	margin-left:20px;
}
.clear{
  clear:both;
  overflow:hidden;
  vertical-align: middle;
}
.os-tab
{
  margin-top:0.88em;
}
.os-tab-input
{
  width:217px;
}
.os-tab-select{
	width:217px;
  position:absolute;
  top:36px;
  left:0;
  list-style: none;
  padding:0;
  margin:0;
  background-color: #fff;
  border:1px solid #ccc;
  border-radius: 2px;
  z-index:100;
}
.os-tab-select li{
  padding:10px 0  0 10px;
}
</style>
