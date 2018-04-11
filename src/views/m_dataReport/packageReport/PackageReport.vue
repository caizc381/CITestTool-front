<template>
  <div class="packageReport">
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
  	    <span>机构单位：</span>
        <mt-select
         style="width:200px"
         v-model="queryList.hospitalId"
         placeholder="请选择机构"
         :filters="['hospitalName', 'hospitalPinyin']"
         :options="hospitalList"
         @on-change="changeHospital">
        </mt-select>
        <mt-select
         style="width:200px"
         v-model="queryList.examCompanyId"
         placeholder="请选择机构"
         :filters="['examCompanyName', 'examCompanyPinyin']"
         :options="companyList"
         :disabled="!queryList.hospitalId">
        </mt-select>
  	  </div>
     </Col>
    </Row>

    <div class="body-content">
      <Row class="result">
       <div class="ops-title">套餐成交统计</div>
       <Col :span="24">
         <Row class="result-ul">
             <Col :md="6" :sm="12" class="result-ul-li">
                <div class="wx-total-title">下单数</div>
                <div class="wx-total-val fontbg" v-if="totaldata.orderTimes">{{totaldata.orderTimes}}</div>
                <div class="wx-total-val fontbg" v-else>0</div>
             </Col>
             <Col :md="6" :sm="12" class="result-ul-li">
                <div class="wx-total-title">订单平均金额</div>
                <div class="wx-total-val fontbg" v-if="totaldata.orderAveragePrice">￥{{totaldata.orderAveragePrice}}</div>
                <div class="wx-total-val fontbg" v-else>￥0</div>
             </Col>
             <Col :md="6" :sm="12" class="result-ul-li">
                <div class="wx-total-title">网付平均金额</div>
                <div class="wx-total-val fontbg" v-if="totaldata.onlineAveragePrice">￥{{totaldata.onlineAveragePrice}}</div>
                <div class="wx-total-val fontbg" v-else>￥0</div>
             </Col>
             <Col :md="6" :sm="12">
               <div class="wx-total-title">网付金额占比</div>
               <div class="wx-total-val fontbg">{{totaldata.onlineOrderRate | toPercentage}}</div>
             </Col>
          </Row>
       </Col>
      </Row>

      <Row>
        <div class="wxReport-tab">
          <table class="table">
            <thead>
              <tr>
                <th>套餐ID</th>
                <th>套餐名称</th>
                <th>套餐金额
                  <span class="basic-sort">
                    <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'mealPrice';currentSortValue = 1;sortList(1)" :class="{'isOrderby':sortBy == 'mealPrice' && currentSortValue == 1}"></Icon>
                    <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'mealPrice';currentSortValue = -1;sortList(-1)" :class="{'isOrderby':sortBy == 'mealPrice' && currentSortValue == -1}"></Icon>
                  </span>
                </th>
                <th>下单数
                  <span class="basic-sort">
                    <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'orderTimes';currentSortValue = 1;sortList(1)" :class="{'isOrderby':sortBy == 'orderTimes' && currentSortValue == 1}"></Icon>
                    <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'orderTimes';currentSortValue = -1;sortList('trendData', -1)" :class="{'isOrderby':sortBy == 'orderTimes' && currentSortValue == -1}"></Icon>
                  </span>
                </th>
                <th>订单平均金额
                  <span class="basic-sort">
                    <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'orderAveragePrice';currentSortValue = 1;sortList(1)" :class="{'isOrderby':sortBy == 'orderAveragePrice' && currentSortValue == 1}"></Icon>
                    <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'orderAveragePrice';currentSortValue = -1;sortList(-1)" :class="{'isOrderby':sortBy == 'orderAveragePrice' && currentSortValue == -1}"></Icon>
                  </span>
                </th>
                <th>网付订单数占比
                  <span class="basic-sort">
                    <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'onlineOrderRate';currentSortValue = 1;sortList(1)" :class="{'isOrderby':sortBy == 'onlineOrderRate' && currentSortValue == 1}"></Icon>
                    <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'onlineOrderRate';currentSortValue = -1;sortList(-1)" :class="{'isOrderby':sortBy == 'onlineOrderRate' && currentSortValue == -1}"></Icon>
                  </span>
                </th>
                <th>网付平均金额
                  <span class="basic-sort">
                    <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'onlineAveragePrice';currentSortValue = 1;sortList(1)" :class="{'isOrderby':sortBy == 'onlineAveragePrice' && currentSortValue == 1}"></Icon>
                    <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'onlineAveragePrice';currentSortValue = -1;sortList(-1)" :class="{'isOrderby':sortBy == 'onlineAveragePrice' && currentSortValue == -1}"></Icon>
                  </span>
                </th>
                <th>网付金额占比
                  <span class="basic-sort">
                    <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'onlinePriceRate';currentSortValue = 1;sortList(1)" :class="{'isOrderby':sortBy == 'onlinePriceRate' && currentSortValue == 1}"></Icon>
                    <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'onlinePriceRate';currentSortValue = -1;sortList(-1)" :class="{'isOrderby':sortBy == 'onlinePriceRate' && currentSortValue == -1}"></Icon>
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="pkg in packageData.records">
                <td>{{pkg.mealId}}</td>
                <td>{{pkg.mealName}}</td>
                <td>{{pkg.mealPrice}}</td>
                <td>{{pkg.orderTimes}}</td>
                <td>{{pkg.orderAveragePrice}}</td>
                <td>{{pkg.onlineOrderRate | toPercentage}}</td>
                <td>{{pkg.onlineAveragePrice}}</td>
                <td>{{pkg.onlinePriceRate | toPercentage}}</td>
              </tr>
            </tbody>
          </table>
          <!-- 分页 -->
          <div class="page-wrap">
            <Page
             :total="packageData.total"
             show-total
             show-sizer
             :page-size="packageData.size"
             :current-page="packageData.current"
             @on-change="currentChange"
             @on-page-size-change="sizeChange"
             :page-size-opts="[100,200,500]">
            </Page>
          </div>
        </div>
      </Row>
    </div>

  </div>
</template>

<script>
import PackageReport from './PackageReport.js'
export default PackageReport
</script>

<style lang="less">
</style>
