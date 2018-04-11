<template>
 <div class="payment">
   <Row >
    <Col :row="24" class="header-search">
     <span class="ml15">地区：</span>
     <Cascader
       class="dlb w200"
       :data="areaList"
       v-model="area"
       :clearable="true"
       :change-on-select="true"
       @on-change="getDetailId">
     </Cascader>

     <span class="pl-20">体检机构：</span>
     <div class="dlb w200">
       <mt-select
         v-model="queryList.organizationId"
         placeholder="请选择体检机构"
         :filters="['name', 'pinyin']"
         :options="hosList">
        </mt-select>
     </div>

     <div class="fr mr20">
       <Button v-permission="'settle:consumption:consumpe'" class="dlb" type="primary" @click="openNewForm">添加消费额度</Button>
     </div>
    </Col>
  </Row>

  <Row class="body-content">
    <div class="ovh mt20 mb20">
      <Col :span="5" class="consumpe-header bdr-r">
        <div>平台消费总额</div>
        <div class="orange b f18" v-if="totalConsumpetionList">{{totalConsumpetionList.totalAmount | moneyAddSymbol}}</div>
        <div class="orange b f18" v-else>￥0.00</div>
      </Col>
      <Col :span="5" class="consumpe-header bdr-r">
        <div>上月净消费额</div>
        <div class="orange b f18" v-if="totalConsumpetionList">{{totalConsumpetionList.forwardMounthAmont | moneyAddSymbol}}</div>
        <div class="orange b f18" v-else>￥0.00</div>
      </Col>
      <Col :span="5" class="consumpe-header">
        <div>本月净消费额</div>
        <div class="orange b f18" v-if="totalConsumpetionList">{{totalConsumpetionList.presentMounthAmont | moneyAddSymbol}}</div>
        <div class="orange b f18" v-else>￥0.00</div>
      </Col>
    </div>

    <Tabs v-model="activeTab"  @on-click="clickCurrentTab">
        <TabPane label="医院统计" name="hosital">
          <div class="rel">
            <table class="table mb15">
              <colgroup span="5"></colgroup>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>体检机构</th>
                  <th>未确认事项</th>
                  <th>消费额度</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(hos,index) in hospitalDate">
                  <td>{{hos.organizationId}}</td>
                  <td>{{hos.organizationName}}</td>
                  <td>
                   <span v-if="hos.todoList == 0">{{hos.todoList}}</span>
                   <a class="gray" v-else @click="jumpToDetail(hos,1)">{{hos.todoList}}</a>
                  </td>
                  <td>{{hos.totalAmount | moneyAddSymbol}}</td>
                  <td>
                    <a  @click="jumpToDetail(hos,-1)">额度明细</a>
                  </td>
                </tr>
              </tbody>
            </table>

            <Spin size="large" fix v-if="hosLoading"></Spin>

            <div class="page-wrap">
              <Page
               :total="hospitalPage.rowCount"
               :page-size="hospitalPage.pageSize"
               :current="hospitalPage.currentPage"
               :page-size-opts="[10,20,50]"
                show-sizer
                show-total
                @on-change="currentPageInfo"
                @on-page-size-change="pageSizeInfo">
              </Page>
            </div>
            <mt-none style="padding: 20px;" :show="hospitalDate.length == 0" size="large" />
          </div>
        </TabPane>
        <TabPane label="消费明细" name="consumpe">
          <div class="rel">
            <!-- 查询条件 -->
            <div class="mb10">
              <span v-show="privateQuery.startTime && privateQuery.endTime" class="ops-query mr5">
                <span>{{privateQuery.startTime | date('yyyy-MM-dd') }} 至 {{privateQuery.endTime | date('yyyy-MM-dd') }}</span>
                <Icon type="close" @click.native.stop="privateQuery.startTime = undefined;privateQuery.endTime = undefined;"></Icon>
              </span>

              <span v-show="privateQuery.sceneQuery" class="ops-query mr5">
                <span>{{privateQuery.sceneQuery | scene}}</span>
                <Icon type="close" @click.native.stop="privateQuery.sceneQuery = undefined;privateQuery.scene = undefined"></Icon>
              </span>

              <a v-if="privateQuery.startTime || privateQuery.endTime || privateQuery.sceneQuery" @click="clearQuery()">清空</a>
            </div>

            <div class="fr mb10">
               <RadioGroup v-model="privateQuery.statusQuery" type="button">
                <Radio label="-1">全部</Radio>
                <Radio label="3">已确认</Radio>
                <Radio label="2">冻结中</Radio>
                <Radio label="1">未确认</Radio>
                <Radio label="4">已撤销</Radio>
               </RadioGroup>
            </div>

            <table class="table">
              <colgroup span="7"></colgroup>
              <col width="200"></col>
              <thead>
                <tr>
                  <th>
                    <DatePicker
                      :open="openPicker"
                      format="yyyy-MM-dd"
                      type="daterange"
                      placeholder="选择日期范围"
                      @on-change="getdaterange">
                       <a class="ivu-dropdown hoverblue" @click="handlerClick">
                        记录时间 <i style="font-size:12px;" class="iconfont icon-guolvqi"></i>
                       </a>
                    </DatePicker>
                  </th>
                  <th>体检机构/单位</th>
                  <th>发生时间</th>
                  <th>
                    <Dropdown trigger="click">
                      <span class="ivu-dropdown hoverblue">
                        类型 <i style="font-size:12px;" class="iconfont icon-guolvqi"></i>
                      </span>
                      <Dropdown-menu slot="list">
                          <Dropdown-item @click.native="privateQuery.sceneQuery = undefined">全部</Dropdown-item>
                          <Dropdown-item @click.native="privateQuery.sceneQuery = 1">医院开票</Dropdown-item>
                          <Dropdown-item @click.native="privateQuery.sceneQuery = 3">结算盈余</Dropdown-item>
                          <Dropdown-item @click.native="privateQuery.sceneQuery = 4">结算支付</Dropdown-item>
                          <Dropdown-item @click.native="privateQuery.sceneQuery = 2">财务调整</Dropdown-item>
                          <Dropdown-item @click.native="privateQuery.sceneQuery = 5">平台服务费</Dropdown-item>
                      </Dropdown-menu>
                    </Dropdown>
                  </th>
                  <th>金额</th>
                  <th>备注</th>
                  <th>状态</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="com in consumptionList">
                  <td>
                    <div>{{com.gmtCreated | date('yyyy-MM-dd')}}</div>
                    <div class="c-9">{{com.gmtCreated | date('hh:mm:ss')}}</div>
                  </td>
                  <td>
                    <div>{{com.hospitalName}}</div>
                    <div class="c-9">{{com.companyName}}</div>
                  </td>
                  <td>{{com.payTime | date('yyyy-MM-dd')}}</td>
                  <td>{{com.scene | scene}}</td>
                  <td>{{com.amount | moneyAddSymbol}}</td>
                  <td>
                    <div v-for="remark in com.remark">
                      {{remark}}
                    </div>
                  </td>
                  <td>
                    <div :class="{'orange': com.status==1,'successfont': com.status==3,'redfont': com.status==2,'gray': com.status==4}">{{com.status | status}}</div>
                  </td>
                  <td>
                    <a v-if="com.status == 1 && (com.scene == 1 || com.scene ==2)" @click="openRevoke(com)">撤销</a>
                    <a v-if="com.circulationLog.length == 0">流转日志</a>
                    <Tooltip v-if="com.circulationLog.length > 0" placement="left">
                        <a>流转日志</a>
                        <div slot="content">
                            <div v-for="item in com.circulationLog" style="width: 240px;">
                              <span>{{item.gmtCreated | date('yyyy-MM-dd hh:mm:ss')}}</span>
                              <span>{{item.operatorName}}</span>
                              <span class="orange">{{item.operation}}</span>
                            </div>
                        </div>
                    </Tooltip>
                  </td>
                </tr>
              </tbody>
            </table>

            <Spin size="large" fix v-if="consumLoading"></Spin>

            <div class="page-wrap">
              <Page
               :total="consumptionPage.rowCount"
               :page-size="consumptionPage.pageSize"
               :current="consumptionPage.currentPage"
               show-sizer
               show-total
               @on-change="currentPageInfo"
               @on-page-size-change="pageSizeInfo">
              </Page>
            </div>
            <mt-none style="padding: 20px;" :show="consumptionList.length == 0" size="large" />
          </div>
        </TabPane>
    </Tabs>
  </Row>

   <!--添加消费额度-->
    <Modal
      title="添加消费额度"
      v-model="dialogNew"
      :mask-closable="false"
      width="680">
        <Form
         :model="newObject"
         ref="newForm"
         :rules="rules"
         :label-width="80"
         class="demo-form-inline">
          <FormItem label="体检机构" prop="organizationId" class="form-line pct45">
            <mt-select
            v-model="newObject.organizationId"
            placeholder="请选择体检机构"
            @on-change="changeHospital"
            :filters="['name', 'pinyin']"
            :options="hosList" />
          </FormItem>
          <FormItem label="发生时间" prop="payTime" class="form-line pct45 ml10">
            <DatePicker
              type="date"
              placeholder="选择日期"
              v-model="newObject.payTime"
              :clearable="false"
              :editable="false">
            </DatePicker>
          </FormItem>
           <FormItem label="体检单位" class="form-line pct45">
            <mt-select
            v-model="newObject.companyId"
            placeholder="请选择体检单位"
            :filters="['name', 'pinyin']"
            :options="companyList" />
          </FormItem>
          <FormItem label="类型" prop="scene" class="form-line pct45 ml10">
            <Select v-model="newObject.scene" placeholder="请选择类型">
              <Option label="医院开票" value="1"></Option>
              <Option label="账务调整" value="2"></Option>
              <Option label="平台服务费" value="5"></Option>
            </Select>
          </FormItem>
          <FormItem label="金额" prop="amount" class="form-line pct45">
            <Input v-model.number="newObject.amount" auto-complete="off" @on-blur="verifyLen('amount')"></Input>
          </FormItem>
          <FormItem label="付款凭证" class="form-line pct45 ml10">
            <span class="imgCertificate" v-if="newObject.certificate">{{newObject.certificate | img}}</span>
            <a class="imgUpload"><input type="file" id="fileNew"  @change="action()" />上传凭证</a>
          </FormItem>
          <FormItem label="备注">
            <Input v-model="newObject.remark" type="textarea" :maxlength="100" :autosize="{minRows: 3,maxRows: 3}" placeholder="请输入..."></Input>
          </FormItem>
        </Form>
        <div class="error tc">{{errorInfo}}</div>
        <div slot="footer">
            <Button  @click="dialogNew = false;errorInfo = undefined">取消</Button>
            <Button type="primary" @click="newConsumption('newForm')">确认</Button>
        </div>
    </Modal>

    <!-- 撤销 -->
    <Modal
      v-model="dialogRevoke"
      title="提示">
      <p>确认删除该条消费额度？</p>
      <div slot="footer">
        <Button  @click="dialogRevoke = false">取消</Button>
        <Button type="primary" @click="revoke">确认</Button>
      </div>
    </Modal>

 </div>
</template>

<script>
import ConsumptionQuota from './ConsumptionQuota.js'
export default ConsumptionQuota
</script>

<style lang="less">
.consumpe-header {
  text-align: center;
  padding: 20px 0;
}
</style>
