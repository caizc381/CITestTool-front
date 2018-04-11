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

			     <span class="query-margin">机构：</span>
           <mt-select
             style="width:200px"
             v-model="queryList.hospitalId"
             placeholder="请选择机构"
             :filters="['hospitalName', 'hospitalPinyin']"
             :options="hospitalList">
          </mt-select>
    	  </div>
      </Col>
    </Row>
    
    <div class="body-content">
      <Row class="result">
       <div class="ops-title">下单来源统计</div>
          <Col :span="8">
            <div class="result-ul">
             <Col :span="24">
               <div class="wx-total-title">订单数</div>
               <div class="wx-total-val fontbg" v-if="pieData.orderTimes">{{pieData.orderTimes}}</div>
               <div class="wx-total-val fontbg" v-else>0</div>
             </Col>
            </div>
            <div class="result-ul">
             <Col :span="12" class="result-ul-li">
               <div class="wx-total-title">订单金额</div>
               <div class="wx-total-val" v-if="pieData.orderPrice">￥{{pieData.orderPrice}}</div>
               <div class="wx-total-val" v-else>￥0</div>
             </Col>
             <Col :span="12">
               <div class="wx-total-title">网付金额</div>
               <div class="wx-total-val" v-if="pieData.onlinePrice">￥{{pieData.onlinePrice}}</div>
               <div class="wx-total-val" v-else>￥0</div>
             </Col>
            </div>
        </Col>
        <Col :span="12" v-loading="loading_pie"  element-loading-text="拼命加载中...">
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
                <Radio label="hours">按时</Radio>
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
                  <th v-if="tabSelectList.orderPrice">订单金额
                    <span class="basic-sort">
                      <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'orderPrice';currentSortValue = 1;sortList('trendData', 1)" :class="{'isOrderby':sortBy == 'orderPrice' && currentSortValue == 1}"></Icon>
                      <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'orderPrice';currentSortValue = -1;sortList('trendData', -1)" :class="{'isOrderby':sortBy == 'orderPrice' && currentSortValue == -1}"></Icon>
                    </span>
                  </th>
                  <th v-if="tabSelectList.companyReplaceOrder">单位代预约数
                    <span class="basic-sort">
                      <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'companyReplaceOrder';currentSortValue = 1;sortList('trendData', 1)" :class="{'isOrderby':sortBy == 'companyReplaceOrder' && currentSortValue == 1}"></Icon>
                      <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'companyReplaceOrder';currentSortValue = -1;sortList('trendData', -1)" :class="{'isOrderby':sortBy == 'companyReplaceOrder' && currentSortValue == -1}"></Icon>
                    </span>
                  </th>
                  <th v-if="tabSelectList.immediateOrder">极速预约数
                    <span class="basic-sort">
                      <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'immediateOrder';currentSortValue = 1;sortList('trendData', 1)" :class="{'isOrderby':sortBy == 'immediateOrder' && currentSortValue == 1}"></Icon>
                      <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'immediateOrder';currentSortValue = -1;sortList('trendData', -1)" :class="{'isOrderby':sortBy == 'immediateOrder' && currentSortValue == -1}"></Icon>
                    </span>
                  </th>
                  <th v-if="tabSelectList.cardOrder">卡预约数
                    <span class="basic-sort">
                      <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'cardOrder';currentSortValue = 1;sortList('trendData', 1)" :class="{'isOrderby':sortBy == 'cardOrder' && currentSortValue == 1}"></Icon>
                      <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'cardOrder';currentSortValue = -1;sortList('trendData', -1)" :class="{'isOrderby':sortBy == 'cardOrder' && currentSortValue == -1}"></Icon>
                    </span>
                  </th>
                  <th v-if="tabSelectList.thatDayOrderByC">C端当天下单
                    <span class="basic-sort">
                      <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'thatDayOrderByC';currentSortValue = 1;sortList('trendData', 1)" :class="{'isOrderby':sortBy == 'thatDayOrderByC' && currentSortValue == 1}"></Icon>
                      <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'thatDayOrderByC';currentSortValue = -1;sortList('trendData', -1)" :class="{'isOrderby':sortBy == 'thatDayOrderByC' && currentSortValue == -1}"></Icon>
                    </span>
                  </th>
                  <th v-if="tabSelectList.otherOrderByC">C端预约下单
                    <span class="basic-sort">
                      <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'otherOrderByC';currentSortValue = 1;sortList('trendData', 1)" :class="{'isOrderby':sortBy == 'otherOrderByC' && currentSortValue == 1}"></Icon>
                      <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'otherOrderByC';currentSortValue = -1;sortList('trendData', -1)" :class="{'isOrderby':sortBy == 'otherOrderByC' && currentSortValue == -1}"></Icon>
                    </span>
                  </th>
                  <th v-if="tabSelectList.companyReplaceRate">单位代预约占比
                    <span class="basic-sort">
                      <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'companyReplaceRate';currentSortValue = 1;sortList('trendData', 1)" :class="{'isOrderby':sortBy == 'companyReplaceRate' && currentSortValue == 1}"></Icon>
                      <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'companyReplaceRate';currentSortValue = -1;sortList('trendData', -1)" :class="{'isOrderby':sortBy == 'companyReplaceRate' && currentSortValue == -1}"></Icon>
                    </span>
                  </th>
                  <th v-if="tabSelectList.immediateOrderRate">极速预约占比
                    <span class="basic-sort">
                      <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'immediateOrderRate';currentSortValue = 1;sortList('trendData', 1)" :class="{'isOrderby':sortBy == 'immediateOrderRate' && currentSortValue == 1}"></Icon>
                      <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'immediateOrderRate';currentSortValue = -1;sortList('trendData', -1)" :class="{'isOrderby':sortBy == 'immediateOrderRate' && currentSortValue == -1}"></Icon>
                    </span>
                  </th>
                  <th v-if="tabSelectList.cardOrderRate">卡预约占比
                    <span class="basic-sort">
                      <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'cardOrderRate';currentSortValue = 1;sortList('trendData', 1)" :class="{'isOrderby':sortBy == 'cardOrderRate' && currentSortValue == 1}"></Icon>
                      <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'cardOrderRate';currentSortValue = -1;sortList('trendData', -1)" :class="{'isOrderby':sortBy == 'cardOrderRate' && currentSortValue == -1}"></Icon>
                    </span>
                  </th>
                  <th v-if="tabSelectList.thatDayOrderByCRate">C端当天下单占比
                    <span class="basic-sort">
                      <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'thatDayOrderByCRate';currentSortValue = 1;sortList('trendData', 1)" :class="{'isOrderby':sortBy == 'thatDayOrderByCRate' && currentSortValue == 1}"></Icon>
                      <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'thatDayOrderByCRate';currentSortValue = -1;sortList('trendData', -1)" :class="{'isOrderby':sortBy == 'thatDayOrderByCRate' && currentSortValue == -1}"></Icon>
                    </span>
                  </th>
                  <th v-if="tabSelectList.otherOrderByCRate">C端预约下单占比
                    <span class="basic-sort">
                      <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'otherOrderByCRate';currentSortValue = 1;sortList('trendData', 1)" :class="{'isOrderby':sortBy == 'otherOrderByCRate' && currentSortValue == 1}"></Icon>
                      <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'otherOrderByCRate';currentSortValue = -1;sortList('trendData', -1)" :class="{'isOrderby':sortBy == 'otherOrderByCRate' && currentSortValue == -1}"></Icon>
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="trend in trendData">
                  <td>{{trend.refDate}}</td>
                  <td v-if="tabSelectList.orderTimes">{{trend.orderTimes}}</td>
                  <td v-if="tabSelectList.orderPrice">{{trend.orderPrice}}</td>
                  <td v-if="tabSelectList.companyReplaceOrder">{{trend.companyReplaceOrder}}</td>
                  <td v-if="tabSelectList.immediateOrder">{{trend.immediateOrder}}</td>
                  <td v-if="tabSelectList.cardOrder">{{trend.cardOrder}}</td>
                  <td v-if="tabSelectList.thatDayOrderByC">{{trend.thatDayOrderByC}}</td>
                  <td v-if="tabSelectList.otherOrderByC">{{trend.otherOrderByC}}</td>
                  <td v-if="tabSelectList.companyReplaceRate">{{trend.companyReplaceRate | toPercentage}}</td>
                  <td v-if="tabSelectList.immediateOrderRate">{{trend.immediateOrderRate | toPercentage}}</td>
                  <td v-if="tabSelectList.cardOrderRate">{{trend.cardOrderRate | toPercentage}}</td>
                  <td v-if="tabSelectList.thatDayOrderByCRate">{{trend.thatDayOrderByCRate | toPercentage}}</td>
                  <td v-if="tabSelectList.otherOrderByCRate">{{trend.otherOrderByCRate | toPercentage}}</td>
                </tr>
              </tbody>
            </table>
            <!-- 分页 -->
            <div class="page-wrap" v-if="queryList.dynamicAttr.countCycle=='daily'">
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
                    <th v-if="tabSelectList.orderPrice">订单金额
                       <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'orderPrice';currentSortValue = 1;sortList('hospitalData', 1)" :class="{'isOrderby':sortBy == 'orderPrice' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'orderPrice';currentSortValue = -1;sortList('hospitalData', -1)" :class="{'isOrderby':sortBy == 'orderPrice' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th v-if="tabSelectList.companyReplaceOrder">单位代预约数
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'companyReplaceOrder';currentSortValue = 1;sortList('hospitalData', 1)" :class="{'isOrderby':sortBy == 'companyReplaceOrder' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'companyReplaceOrder';currentSortValue = -1;sortList('hospitalData', -1)" :class="{'isOrderby':sortBy == 'companyReplaceOrder' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th v-if="tabSelectList.immediateOrder">极速预约数
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'immediateOrder';currentSortValue = 1;sortList('hospitalData', 1)" :class="{'isOrderby':sortBy == 'immediateOrder' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'immediateOrder';currentSortValue = -1;sortList('hospitalData', -1)" :class="{'isOrderby':sortBy == 'immediateOrder' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th v-if="tabSelectList.cardOrder">卡预约数
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'cardOrder';currentSortValue = 1;sortList('hospitalData', 1)" :class="{'isOrderby':sortBy == 'cardOrder' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'cardOrder';currentSortValue = -1;sortList('hospitalData', -1)" :class="{'isOrderby':sortBy == 'cardOrder' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th v-if="tabSelectList.thatDayOrderByC">C端当天下单
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'thatDayOrderByC';currentSortValue = 1;sortList('hospitalData', 1)" :class="{'isOrderby':sortBy == 'thatDayOrderByC' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'thatDayOrderByC';currentSortValue = -1;sortList('hospitalData', -1)" :class="{'isOrderby':sortBy == 'thatDayOrderByC' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th v-if="tabSelectList.otherOrderByC">C端预约下单
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'otherOrderByC';currentSortValue = 1;sortList('hospitalData', 1)" :class="{'isOrderby':sortBy == 'otherOrderByC' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'otherOrderByC';currentSortValue = -1;sortList('hospitalData', -1)" :class="{'isOrderby':sortBy == 'otherOrderByC' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th v-if="tabSelectList.companyReplaceRate">单位代预约占比
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'companyReplaceRate';currentSortValue = 1;sortList('hospitalData', 1)" :class="{'isOrderby':sortBy == 'companyReplaceRate' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'companyReplaceRate';currentSortValue = -1;sortList('hospitalData', -1)" :class="{'isOrderby':sortBy == 'companyReplaceRate' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th v-if="tabSelectList.immediateOrderRate">极速预约占比
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'immediateOrderRate';currentSortValue = 1;sortList('hospitalData', 1)" :class="{'isOrderby':sortBy == 'immediateOrderRate' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'immediateOrderRate';currentSortValue = -1;sortList('hospitalData', -1)" :class="{'isOrderby':sortBy == 'immediateOrderRate' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th v-if="tabSelectList.cardOrderRate">卡预约占比
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'cardOrderRate';currentSortValue = 1;sortList('hospitalData', 1)" :class="{'isOrderby':sortBy == 'cardOrderRate' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'cardOrderRate';currentSortValue = -1;sortList('hospitalData', -1)" :class="{'isOrderby':sortBy == 'cardOrderRate' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th v-if="tabSelectList.thatDayOrderByCRate">C端当天下单占比
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'thatDayOrderByCRate';currentSortValue = 1;sortList('hospitalData', 1)" :class="{'isOrderby':sortBy == 'thatDayOrderByCRate' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'thatDayOrderByCRate';currentSortValue = -1;sortList('hospitalData', -1)" :class="{'isOrderby':sortBy == 'thatDayOrderByCRate' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th v-if="tabSelectList.otherOrderByCRate">C端预约下单占比
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'otherOrderByCRate';currentSortValue = 1;sortList('hospitalData', 1)" :class="{'isOrderby':sortBy == 'otherOrderByCRate' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'otherOrderByCRate';currentSortValue = -1;sortList('hospitalData', -1)" :class="{'isOrderby':sortBy == 'otherOrderByCRate' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="hos in hospitalData">
                    <td>{{hos.hospitalId}}</td>
                    <td>{{hos.hospitalName}}</td>
                    <td v-if="tabSelectList.orderTimes">{{hos.orderTimes}}</td>
                    <td v-if="tabSelectList.orderPrice">{{hos.orderPrice}}</td>
                    <td v-if="tabSelectList.companyReplaceOrder">{{hos.companyReplaceOrder}}</td>
                    <td v-if="tabSelectList.immediateOrder">{{hos.immediateOrder}}</td>
                    <td v-if="tabSelectList.cardOrder">{{hos.cardOrder}}</td>
                    <td v-if="tabSelectList.thatDayOrderByC">{{hos.thatDayOrderByC}}</td>
                    <td v-if="tabSelectList.otherOrderByC">{{hos.otherOrderByC}}</td>
                    <td v-if="tabSelectList.companyReplaceRate">{{hos.companyReplaceRate | toPercentage}}</td>
                    <td v-if="tabSelectList.immediateOrderRate">{{hos.immediateOrderRate | toPercentage}}</td>
                    <td v-if="tabSelectList.cardOrderRate">{{hos.cardOrderRate | toPercentage}}</td>
                    <td v-if="tabSelectList.thatDayOrderByCRate">{{hos.thatDayOrderByCRate | toPercentage}}</td>
                    <td v-if="tabSelectList.otherOrderByCRate">{{hos.otherOrderByCRate | toPercentage}}</td>
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
                  @on-change='getRegionMapMapByDimension'>
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
                    <th v-if="tabSelectList.orderPrice">订单金额
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'orderPrice';currentSortValue = 1;sortList('regionData', 1)" :class="{'isOrderby':sortBy == 'orderPrice' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'orderPrice';currentSortValue = -1;sortList('regionData', -1)" :class="{'isOrderby':sortBy == 'orderPrice' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th v-if="tabSelectList.companyReplaceOrder">单位代预约数
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'companyReplaceOrder';currentSortValue = 1;sortList('regionData', 1)" :class="{'isOrderby':sortBy == 'companyReplaceOrder' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'companyReplaceOrder';currentSortValue = -1;sortList('regionData', -1)" :class="{'isOrderby':sortBy == 'companyReplaceOrder' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th v-if="tabSelectList.immediateOrder">极速预约数
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'immediateOrder';currentSortValue = 1;sortList('regionData', 1)" :class="{'isOrderby':sortBy == 'immediateOrder' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'immediateOrder';currentSortValue = -1;sortList('regionData', -1)" :class="{'isOrderby':sortBy == 'immediateOrder' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th v-if="tabSelectList.cardOrder">卡预约数
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'cardOrder';currentSortValue = 1;sortList('regionData', 1)" :class="{'isOrderby':sortBy == 'cardOrder' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'cardOrder';currentSortValue = -1;sortList('regionData', -1)" :class="{'isOrderby':sortBy == 'cardOrder' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th v-if="tabSelectList.thatDayOrderByC">C端当天下单
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'thatDayOrderByC';currentSortValue = 1;sortList('regionData', 1)" :class="{'isOrderby':sortBy == 'thatDayOrderByC' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'thatDayOrderByC';currentSortValue = -1;sortList('regionData', -1)" :class="{'isOrderby':sortBy == 'thatDayOrderByC' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th v-if="tabSelectList.otherOrderByC">C端预约下单
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'otherOrderByC';currentSortValue = 1;sortList('regionData', 1)" :class="{'isOrderby':sortBy == 'otherOrderByC' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'otherOrderByC';currentSortValue = -1;sortList('regionData', -1)" :class="{'isOrderby':sortBy == 'otherOrderByC' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th v-if="tabSelectList.companyReplaceRate">单位代预约占比
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'companyReplaceRate';currentSortValue = 1;sortList('regionData', 1)" :class="{'isOrderby':sortBy == 'companyReplaceRate' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'companyReplaceRate';currentSortValue = -1;sortList('regionData', -1)" :class="{'isOrderby':sortBy == 'companyReplaceRate' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th v-if="tabSelectList.immediateOrderRate">极速预约占比
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'immediateOrderRate';currentSortValue = 1;sortList('regionData', 1)" :class="{'isOrderby':sortBy == 'immediateOrderRate' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'immediateOrderRate';currentSortValue = -1;sortList('regionData', -1)" :class="{'isOrderby':sortBy == 'immediateOrderRate' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th v-if="tabSelectList.cardOrderRate">卡预约占比
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'cardOrderRate';currentSortValue = 1;sortList('regionData', 1)" :class="{'isOrderby':sortBy == 'cardOrderRate' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'cardOrderRate';currentSortValue = -1;sortList('regionData', -1)" :class="{'isOrderby':sortBy == 'cardOrderRate' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th v-if="tabSelectList.thatDayOrderByCRate">C端当天下单占比
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'thatDayOrderByCRate';currentSortValue = 1;sortList('regionData', 1)" :class="{'isOrderby':sortBy == 'thatDayOrderByCRate' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'thatDayOrderByCRate';currentSortValue = -1;sortList('regionData', -1)" :class="{'isOrderby':sortBy == 'thatDayOrderByCRate' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th v-if="tabSelectList.otherOrderByCRate">C端预约下单占比
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'otherOrderByCRate';currentSortValue = 1;sortList('regionData', 1)" :class="{'isOrderby':sortBy == 'otherOrderByCRate' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'otherOrderByCRate';currentSortValue = -1;sortList('regionData', -1)" :class="{'isOrderby':sortBy == 'otherOrderByCRate' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="region in regionData">
                    <td>{{region.areaName}}</td>
                    <td v-if="tabSelectList.orderTimes">{{region.orderTimes}}</td>
                    <td v-if="tabSelectList.orderPrice">{{region.orderPrice}}</td>
                    <td v-if="tabSelectList.companyReplaceOrder">{{region.companyReplaceOrder}}</td>
                    <td v-if="tabSelectList.immediateOrder">{{region.immediateOrder}}</td>
                    <td v-if="tabSelectList.cardOrder">{{region.cardOrder}}</td>
                    <td v-if="tabSelectList.thatDayOrderByC">{{region.thatDayOrderByC}}</td>
                    <td v-if="tabSelectList.otherOrderByC">{{region.otherOrderByC}}</td>
                    <td v-if="tabSelectList.companyReplaceRate">{{region.companyReplaceRate}}</td>
                    <td v-if="tabSelectList.immediateOrderRate">{{region.immediateOrderRate}}</td>
                    <td v-if="tabSelectList.cardOrderRate">{{region.cardOrderRate}}</td>
                    <td v-if="tabSelectList.thatDayOrderByCRate">{{region.thatDayOrderByCRate}}</td>
                    <td v-if="tabSelectList.otherOrderByCRate">{{region.otherOrderByCRate}}</td>
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
        </Tabs>
     </Row>
   </div>
    
  </div>
</template>

<script>
import OrderSourceReport from './OrderSourceReport.js'
export default OrderSourceReport
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
