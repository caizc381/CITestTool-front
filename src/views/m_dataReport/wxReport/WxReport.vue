<template>
  <div class="wxReport">
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
       <div class="ops-title">微信关注统计</div>
       <Col :span="10">
            <div class="result-ul">
             <Col :span="24">
               <div class="wx-total-title">新关注</div>
               <div class="wx-total-val fontbg" v-if="pieData.newUser">{{pieData.newUser}}</div>
               <div class="wx-total-val fontbg" v-else>0</div>
             </Col>
            </div>
            <div class="result-ul">
             <Col :md="6" :sm="12" class="result-ul-li">
               <div class="wx-total-title">总关注</div>
               <div class="wx-total-val" v-if="pieData.cumulateUser">{{pieData.cumulateUser}}</div>
               <div class="wx-total-val" v-else>0</div>
             </Col>
             <Col :md="6" :sm="12" class="result-ul-li">
                <div class="wx-total-title">取消关注</div>
                <div class="wx-total-val" v-if="pieData.cancelUser">{{pieData.cancelUser}}</div>
                <div class="wx-total-val" v-else>0</div>
             </Col>
             <Col :md="6" :sm="12" class="result-ul-li">
                <div class="wx-total-title">总绑定</div>
                <div class="wx-total-val" v-if="pieData.countBindUser">{{pieData.countBindUser}}</div>
                <div class="wx-total-val" v-else>0</div>
             </Col>
             <Col :md="6" :sm="12">
                <div class="wx-total-title">新绑定</div>
                <div class="wx-total-val" v-if="pieData.newBindUser">{{pieData.newBindUser}}</div>
                <div class="wx-total-val" v-else>0</div>
             </Col>
            </div>
       </Col>
       <Col :span="10" v-loading="loading_pie"  element-loading-text="拼命加载中...">
          <div id="pieData" style="width: 600px;height:300px;"></div>
       </Col>
      </Row>

      <Row>
        <Tabs v-model="activeName" @on-click="handleClick">
          <TabPane label="趋势统计" name="trend">
            <div class="wxReport-charts">
              <div class="wxReport-charts-fl">
                <div id="trend" v-bind:style="styleObject"  v-loading="loading_trend" element-loading-text="拼命加载中..."></div>
              </div>

              <div class="wxReport-charts-fr">
                <RadioGroup v-model="queryList.countCycle" type="button" style="margin-right:20px;">
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
              <div class="ops-title">详细数据</div>
              <table class="table">
                <thead>
                  <tr>
                    <th>时间</th>
                    <th v-if="queryList.countCycle=='daily'">总关注
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'cumulateUser';currentSortValue = 1;sortList('trendData', 1)" :class="{'isOrderby':sortBy == 'cumulateUser' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'cumulateUser';currentSortValue = -1;sortList('trendData', -1)" :class="{'isOrderby':sortBy == 'cumulateUser' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th>新关注
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'newUser';currentSortValue = 1;sortList('trendData', 1)" :class="{'isOrderby':sortBy == 'newUser' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'newUser';currentSortValue = -1;sortList('trendData', -1)" :class="{'isOrderby':sortBy == 'newUser' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th>取消关注
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'cancelUser';currentSortValue = 1;sortList('trendData', 1)" :class="{'isOrderby':sortBy == 'cancelUser' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'cancelUser';currentSortValue = -1;sortList('trendData', -1)" :class="{'isOrderby':sortBy == 'cancelUser' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th v-if="queryList.countCycle=='daily'">总绑定
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'countBindUser';currentSortValue = 1;sortList('trendData', 1)" :class="{'isOrderby':sortBy == 'countBindUser' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'countBindUser';currentSortValue = -1;sortList('trendData', -1)" :class="{'isOrderby':sortBy == 'countBindUser' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th>新绑定
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'newBindUser';currentSortValue = 1;sortList('trendData', 1)" :class="{'isOrderby':sortBy == 'newBindUser' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'newBindUser';currentSortValue = -1;sortList('trendData', -1)" :class="{'isOrderby':sortBy == 'newBindUser' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th>搜索
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'fromSearch';currentSortValue = 1;sortList('trendData', 1)" :class="{'isOrderby':sortBy == 'fromSearch' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'fromSearch';currentSortValue = -1;sortList('trendData', -1)" :class="{'isOrderby':sortBy == 'fromSearch' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th>分享
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'fromCardShare';currentSortValue = 1;sortList('trendData', 1)" :class="{'isOrderby':sortBy == 'fromCardShare' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'fromCardShare';currentSortValue = -1;sortList('trendData', -1)" :class="{'isOrderby':sortBy == 'fromCardShare' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th>扫码
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'fromScan';currentSortValue = 1;sortList('trendData', 1)" :class="{'isOrderby':sortBy == 'fromScan' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'fromScan';currentSortValue = -1;sortList('trendData', -1)" :class="{'isOrderby':sortBy == 'fromScan' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th>支付
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'fromPay';currentSortValue = 1;sortList('trendData', 1)" :class="{'isOrderby':sortBy == 'fromPay' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'fromPay';currentSortValue = -1;sortList('trendData', -1)" :class="{'isOrderby':sortBy == 'fromPay' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th>其他
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'fromOther';currentSortValue = 1;sortList('trendData', 1)" :class="{'isOrderby':sortBy == 'fromOther' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'fromOther';currentSortValue = -1;sortList('trendData', -1)" :class="{'isOrderby':sortBy == 'fromOther' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="trend in trendData">
                    <td>{{trend.refDate}}</td>
                    <td v-if="queryList.countCycle=='daily'">{{trend.cumulateUser}}</td>
                    <td>{{trend.newUser}}</td>
                    <td>{{trend.cancelUser}}</td>
                    <td v-if="queryList.countCycle=='daily'">{{trend.countBindUser}}</td>
                    <td>{{trend.newBindUser}}</td>
                    <td>{{trend.fromSearch}}</td>
                    <td>{{trend.fromCardShare}}</td>
                    <td>{{trend.fromScan}}</td>
                    <td>{{trend.fromPay}}</td>
                    <td>{{trend.fromOther}}</td>
                  </tr>
                </tbody>
              </table>
              <div class="page-wrap">
                <Page 
                 :total="allData.total" 
                 show-total
                 show-sizer
                 :page-size="allData.size" 
                 :current-page="allData.current" 
                 @on-change="currentChange"
                 @on-page-size-change="pageSizeChange"
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
                  @on-change='getHospitalMapMapByDimension'>
                  <Option  v-for="item in selectList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                 </Select>
              </div>
            </div>
            <div class="wxReport-tab">
              <div class="ops-title">详细数据</div>
              <table class="table">
                <thead>
                  <tr>
                    <th>机构ID</th>
                    <th>机构名称</th>
                    <th>总关注
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'cumulateUser';currentSortValue = 1;sortList('hospitalData', 1)" :class="{'isOrderby':sortBy == 'cumulateUser' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'cumulateUser';currentSortValue = -1;sortList('hospitalData', -1)" :class="{'isOrderby':sortBy == 'cumulateUser' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th>新关注
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'newUser';currentSortValue = 1;sortList('hospitalData', 1)" :class="{'isOrderby':sortBy == 'newUser' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'newUser';currentSortValue = -1;sortList('hospitalData', -1)" :class="{'isOrderby':sortBy == 'newUser' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th>取消关注
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'cancelUser';currentSortValue = 1;sortList('hospitalData', 1)" :class="{'isOrderby':sortBy == 'cancelUser' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'cancelUser';currentSortValue = -1;sortList('hospitalData', -1)" :class="{'isOrderby':sortBy == 'cancelUser' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th>总绑定
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'countBindUser';currentSortValue = 1;sortList('hospitalData', 1)" :class="{'isOrderby':sortBy == 'countBindUser' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'countBindUser';currentSortValue = -1;sortList('hospitalData', -1)" :class="{'isOrderby':sortBy == 'countBindUser' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th>新绑定
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'newBindUser';currentSortValue = 1;sortList('hospitalData', 1)" :class="{'isOrderby':sortBy == 'newBindUser' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'newBindUser';currentSortValue = -1;sortList('hospitalData', -1)" :class="{'isOrderby':sortBy == 'newBindUser' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th>搜索
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'fromSearch';currentSortValue = 1;sortList('hospitalData', 1)" :class="{'isOrderby':sortBy == 'fromSearch' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'fromSearch';currentSortValue = -1;sortList('hospitalData', -1)" :class="{'isOrderby':sortBy == 'fromSearch' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th>分享
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'fromCardShare';currentSortValue = 1;sortList('hospitalData', 1)" :class="{'isOrderby':sortBy == 'fromCardShare' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'fromCardShare';currentSortValue = -1;sortList('hospitalData', -1)" :class="{'isOrderby':sortBy == 'fromCardShare' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th>扫码
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'fromScan';currentSortValue = 1;sortList('hospitalData', 1)" :class="{'isOrderby':sortBy == 'fromScan' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'fromScan';currentSortValue = -1;sortList('hospitalData', -1)" :class="{'isOrderby':sortBy == 'fromScan' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th>支付
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'fromPay';currentSortValue = 1;sortList('hospitalData', 1)" :class="{'isOrderby':sortBy == 'fromPay' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'fromPay';currentSortValue = -1;sortList('hospitalData', -1)" :class="{'isOrderby':sortBy == 'fromPay' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th>其他
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'fromOther';currentSortValue = 1;sortList('hospitalData', 1)" :class="{'isOrderby':sortBy == 'fromOther' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'fromOther';currentSortValue = -1;sortList('hospitalData', -1)" :class="{'isOrderby':sortBy == 'fromOther' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="hos in hospitalData">
                    <td>{{hos.organizationId}}</td>
                    <td>{{hos.organizationName}}</td>
                    <td>{{hos.cumulateUser}}</td>
                    <td>{{hos.newUser}}</td>
                    <td>{{hos.cancelUser}}</td>
                    <td>{{hos.countBindUser}}</td>
                    <td>{{hos.newBindUser}}</td>
                    <td>{{hos.fromSearch}}</td>
                    <td>{{hos.fromCardShare}}</td>
                    <td>{{hos.fromScan}}</td>
                    <td>{{hos.fromPay}}</td>
                    <td>{{hos.fromOther}}</td>
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
                 @on-page-size-change="pageSizeChange"
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
              <div class="ops-title">详细数据</div>
              <table class="table">
                <thead>
                  <tr>
                    <th>地区</th>
                    <th>总关注
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'cumulateUser';currentSortValue = 1;sortList('regionData', 1)" :class="{'isOrderby':sortBy == 'cumulateUser' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'cumulateUser';currentSortValue = -1;sortList('regionData', -1)" :class="{'isOrderby':sortBy == 'cumulateUser' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th>新关注
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'newUser';currentSortValue = 1;sortList('regionData', 1)" :class="{'isOrderby':sortBy == 'newUser' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'newUser';currentSortValue = -1;sortList('regionData', -1)" :class="{'isOrderby':sortBy == 'newUser' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th>取消关注
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'cancelUser';currentSortValue = 1;sortList('regionData', 1)" :class="{'isOrderby':sortBy == 'cancelUser' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'cancelUser';currentSortValue = -1;sortList('regionData', -1)" :class="{'isOrderby':sortBy == 'cancelUser' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th>总绑定
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'countBindUser';currentSortValue = 1;sortList('regionData', 1)" :class="{'isOrderby':sortBy == 'countBindUser' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'countBindUser';currentSortValue = -1;sortList('regionData', -1)" :class="{'isOrderby':sortBy == 'countBindUser' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th>新绑定
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'newBindUser';currentSortValue = 1;sortList('regionData', 1)" :class="{'isOrderby':sortBy == 'newBindUser' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'newBindUser';currentSortValue = -1;sortList('regionData', -1)" :class="{'isOrderby':sortBy == 'newBindUser' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th>搜索
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'fromSearch';currentSortValue = 1;sortList('regionData', 1)" :class="{'isOrderby':sortBy == 'fromSearch' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'fromSearch';currentSortValue = -1;sortList('regionData', -1)" :class="{'isOrderby':sortBy == 'fromSearch' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th>分享
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'fromCardShare';currentSortValue = 1;sortList('regionData', 1)" :class="{'isOrderby':sortBy == 'fromCardShare' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'fromCardShare';currentSortValue = -1;sortList('regionData', -1)" :class="{'isOrderby':sortBy == 'fromCardShare' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th>扫码
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'fromScan';currentSortValue = 1;sortList('regionData', 1)" :class="{'isOrderby':sortBy == 'fromScan' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'fromScan';currentSortValue = -1;sortList('regionData', -1)" :class="{'isOrderby':sortBy == 'fromScan' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th>支付
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'fromPay';currentSortValue = 1;sortList('regionData', 1)" :class="{'isOrderby':sortBy == 'fromPay' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'fromPay';currentSortValue = -1;sortList('regionData', -1)" :class="{'isOrderby':sortBy == 'fromPay' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                    <th>其他
                      <span class="basic-sort">
                        <Icon class="up" type="arrow-up-b" @click.native="sortBy = 'fromOther';currentSortValue = 1;sortList('regionData', 1)" :class="{'isOrderby':sortBy == 'fromOther' && currentSortValue == 1}"></Icon>
                        <Icon class="down" type="arrow-down-b" @click.native="sortBy = 'fromOther';currentSortValue = -1;sortList('regionData', -1)" :class="{'isOrderby':sortBy == 'fromOther' && currentSortValue == -1}"></Icon>
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="region in regionData">
                    <td>{{region.organizationName}}</td>
                    <td>{{region.cumulateUser}}</td>
                    <td>{{region.newUser}}</td>
                    <td>{{region.cancelUser}}</td>
                    <td>{{region.countBindUser}}</td>
                    <td>{{region.newBindUser}}</td>
                    <td>{{region.fromSearch}}</td>
                    <td>{{region.fromCardShare}}</td>
                    <td>{{region.fromScan}}</td>
                    <td>{{region.fromPay}}</td>
                    <td>{{region.fromOther}}</td>
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
                 @on-page-size-change="pageSizeChange"
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
import WxReport from './WxReport.js'
export default WxReport
</script>

<style lang="less">
.wxReport {
  font-size: 14px;
}
.serach-line {
  padding-bottom: 15px;
}
table {
	 width: 100%;
   border-collapse: collapse;
}
table th {
	height: 35px;
	border: 1px solid #eee;
	color: #1f2d3d;
	font-weight: normal;
}
.result {
	border-top: 1px solid #ccc;
}
.result-ul {
	text-align: center;
	padding-bottom: 20px;
	overflow: hidden;
}
.result-ul-li {
	border-right: 1px solid #e7e7e7;
}
.order{
	padding-left:5px;
}
.wx-total-val {
	font-size: 18px;
	font-weight: bold;
	padding: 10px 0;
}
.fontbg {
	font-size: 26px;
}
.wx-total {
	margin-top: 20px;
  text-align: center;
}
.orderby {
	cursor: pointer;
}
.orderby:hover {
	color: #20A0FF;
}
.wxReport-tab {
	clear: both;
}
.wxReport-charts-fl {
	width: 45%;
	float: left;
}
.wxReport-charts-fr {
	width: 54%;
	float: right;
	text-align: right;
}
</style>
