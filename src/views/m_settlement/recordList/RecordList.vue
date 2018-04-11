<template>
 <div class="record">
   <Row :row="24" class="header-search">
     <span>地区：</span>
     <Cascader
       class="dlb"
       :data="areaList"
       v-model="area"
       :clearable="true"
       :change-on-select="true"
       @on-change="getDetailId"
       style="width:200px">
     </Cascader>

     <span class="pl-20">体检机构：</span>
     <mt-select
       style="width:200px"
       v-model="queryList.organizationId"
       placeholder="请选择体检机构"
       :filters="['name', 'pinyin']"
       :options="hosList">
      </mt-select>

     <span class="pl-20">付款时间：</span>
     <DatePicker
      type="daterange"
      placeholder="选择日期范围"
      v-model="paymentTime"
      :clearable="true"
      :editable="false"
      @on-change="getdaterange">
     </DatePicker>
  </Row>

  <Row class="body-content">
    <table class="table mb15" v-for="record in recordList">
      <colgroup span="4"></colgroup>
      <col width="240">
      <col width="250">
      <col width="180">
      <thead>
        <tr class="noneBorder">
          <td colspan="7">
             <span class="b f18">{{record.organizationName}}</span>
             <span class="pl-40">付款时间：{{record.paymentTime | date('yyyy-MM-dd hh:mm:ss') }}</span>
          </td>
        </tr>
        <tr class="noneBorder">
          <td colspan="7">
             <div class="dlb"><span class="b">操作人:</span>{{record.operatorName}}</div>
             <div class="dlb ml30"><span class="b">账单总额:</span>{{record.payableAmount | money('￥')}}</div>
             <div class="dlb ml30"><span class="b">折后应付:</span>{{record.totalDiscountAmount | money('￥')}}</div>
             <div class="dlb ml30"><span class="b">消费额度:</span>{{record.totalConsumeQuotaAmount | moneyAddSymbol}}</div>

             <div class="dlb fr">
                <a v-if="record.certificate" class="pl-20"
                @click="dialogCertificate = !dialogCertificate; certificate = record.certificate">付款凭证</a>
            </div>
             <div class="dlb fr mr30"><span class="b">平台实付:</span><span class="orange">{{record.realAmount | money('￥')}}</span></div>
          </td>
        </tr>
        <tr class="noneBorder">
          <td colspan="7">
             <div><span class="b">付款备注：</span><span>{{record.remark}}</span></div>
          </td>
        </tr>
        <tr>
          <th class="td-col">结算批次</th>
          <th class="td-col">单位</th>
          <th class="td-col">单位类型</th>
          <th class="td-col">平台折扣</th>
          <th class="td-col">账单详情</th>
          <th class="td-col">付款详情</th>
          <th class="td-col">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in record.tradeHospitalPlatformBillList">
          <td>{{item.batchSn}}</td>
          <td>{{item.companyName}}</td>
          <td>{{item.companyType}}</td>
          <td>{{item.platformDiscount}}</td>
          <td>
            <div>平台支付：{{item.platformPayAmount | money('￥')}}</div>
            <div>平台退款：{{item.platformRefundAmount | money('￥')}}</div>
            <div>平台特殊退款：{{item.platformPrepaymentAmount | money('￥')}}</div>
            <div class="b">账单累计：{{item.platformChargedAmount | money('￥')}}</div>
          </td>
          <td>
            <div>
               <div>折扣应付：{{item.discountAmount | money('￥')}}</div>
               <div>
                  消费额度：{{item.consumeQuotaAmount | moneyAddSymbol}}
                  <span v-if="item.consumeQuotaAmount > 0">(结算盈余)</span>
                  <span v-if="item.consumeQuotaAmount < 0">(结算支付)</span>
               </div>
               <div>
                 <span class="b">平台实付：{{item.platformActurallyPayAmount | money('￥')}}</span>
                 <Poptip trigger="hover" placement="top-end" v-if="item.remark">
                    <Icon type="information-circled hoverblue"></Icon>
                    <div slot="title"><i>审核备注</i></div>
                    <div slot="content">
                      <div class="ops-poptip-content">{{item.remark}}</div>
                    </div>
                 </Poptip>
               </div>
            </div>
          </td>
          <td>
            <a @click="download(item.sn)">下载详单</a>
            <a v-if="item.circulationLog.length == 0">流转日志</a>
            <Tooltip v-if="item.circulationLog.length > 0" placement="left">
              <a>流转日志</a>
              <div slot="content" >
                  <div v-for="cir in item.circulationLog" style="width: 240px;">
                    <span>{{cir.gmtCreated | date('yyyy-MM-dd hh:mm:ss')}}</span>
                    <span>{{cir.operatorName}}</span>
                    <span class="orange">{{cir.operation}}</span>
                  </div>
              </div>
           </Tooltip>
          </td>
        </tr>
      </tbody>
    </table>

    <Spin size="large" fix v-if="recordLoading"></Spin>

    <mt-none style="padding: 20px;" :show="recordList.length == 0" size="large" />

    <div class="page-wrap">
      <Page
       :total="rowCount"
       show-total
       :page-size="page.pageSize"
       :current="page.currentPage"
       @on-change="handleCurrentChange">
      </Page>
    </div>
  </Row>

    <!-- 显示付款凭证 -->
    <Modal
      v-model="dialogCertificate"
      title="付款凭证">
      <div style="text-align:center"><img style="max-width:400px" :src="certificate" /></div>
      <div slot="footer">
        <Button type="primary" @click="dialogCertificate=false">确认</Button>
      </div>
    </Modal>

</div>
</template>

<script>
import RecordList from './RecordList.js'
export default RecordList
</script>

<style lang="less">
.record{
  font-size:14px;
}
.td-fc
  {
    color:#fea012;
  }
.pl-20
{
  padding-left:20px;
}
.pl-40
{
  padding-left:40px;
}
</style>
