<template>
 <div>
  <div v-if="!showDetail">
    <Row>
      <i-col :span="24" class="header-search">
        <span class="ml15">Agent管理</span>
      </i-col>
    </Row>

    <div class="body-content">
       <table class="table">
         <thead>
           <tr>
              <th>医院编码</th>
              <th>医院名字</th>
              <th>agent状态</th>
              <th>agent版本</th>
              <th>心跳周期</th>
              <th>最近一次心跳时间</th>
              <th>详情</th>
           </tr>
         </thead>
         <tbody>
           <tr v-for="agentInfo in agentList">
            <td>
                {{agentInfo.hospitalId}}
            </td>
            <td>
                {{agentInfo.hospitalName}}
            </td>
            <td>
                <span>
                  <Tag v-if="agentInfo.status == 0" color="red">
                  宕机</Tag>
                  <Tag v-if="agentInfo.status == 1" color="green">
                  正常</Tag>
                  <Tag v-if="agentInfo.status == 2" color="yellow">
                  异常</Tag>
                </span>
            </td>
            <td>
                {{agentInfo.version}}
            </td>
            <td>
              {{agentInfo.heartBeatPeriod}}
            </td>
            <td>
              {{ agentInfo.recentHeartBeatTimeMills | date('yyyy-MM-dd hh:mm:ss') }}
            </td>
            <td>
                <Button  type="primary" @click="getDetail(agentInfo.hospitalId)">查看详情</Button>
            </td>
          </tr>
         </tbody>
       </table>

       <mt-none style="padding: 20px;" :show="agentList.length == 0" size="large" />

        <div class="page-wrap">
          <Page
           :total="page.rowCount"
           show-total
           show-sizer
           :page-size="page.pageSize"
           :current-page="page.currentPage"
           @on-change="handleCurrentChange"
           @on-page-size-change="handleSizeChange">
          </Page>
       </div>
    </div>
  </div>

  <div v-if="showDetail" class="body-content">
     <div>
       <Button @click="showDetail = false;" type="ghost" icon="ios-arrow-back">返回</Button>
     </div>
     <div style="width: 100%; overflow-x: auto;">
       <table class="table mt10 agent-table">
         <thead>
           <tr>
              <th>错误原因</th>
              <th>预约人</th>
              <th>体检人手机</th>
              <th>体检人</th>
              <th>性别</th>
              <th>身份证号</th>
              <th style="min-width: 150px;">体检单位</th>
              <th>状态</th>
              <th>订单号</th>
              <th>订单价</th>
              <th>下单日期</th>
              <th style="min-width: 150px;">体检日期</th>
              <th>订单项目</th>
              <th style="min-width: 150px;">挂账单位</th>
              <th>导出时间</th>
              <th>导出人</th>
              <th>VIP</th>
              <th>家属</th>
              <th>部门</th>
              <th>付款类型</th>
              <th>现场应付</th>
           </tr>
         </thead>
         <tbody>
           <tr v-for="order in orderList" @dblclick="getOrderDetail(order.id)">
            <td><span>{{order.exportFailedMsg || order.exportMsg }}</span></td>
            <td><span>{{order.operator}}</span></td>
            <td><span>{{order.accountRelation.mobile}}</span></td>
            <td><span>{{order.accountRelation.name}}</span></td>
            <td><span>{{order.accountRelation.gender | filterGender}}</span></td>
            <td><span>{{order.accountRelation.idCard}}</span></td>
            <td><span>{{order.examCompany}}</span></td>
            <td>
               <span :class="{'successfont':(order.status==1 || order.status==2 || order.status ==3),'orange':(order.status==0||order.status==7),'redfont':(order.status == 4 || order.status == 5 || order.status == 6),'gray':order.status ==8}">{{order.status | orderStatus}}</span>
            </td>
            <td><span>{{order.orderNum}}</span></td>
            <td><span>{{order.exportOrderPrice}}</span></td>
            <td><span style="width: 130px;">{{order.insertTime | date('yyyy-MM-dd')}}</span></td>
            <td><span style="width: 130px;">{{order.examDate | date('yyyy-MM-dd')}} {{order.examTimeIntervalName}}</span></td>
            <td>
              <Button  type="primary" @click="getOrderDetail(order.id)">查看</Button>
            </td>
            <td><span>{{order.accountCompany.name}}</span></span></td>
            <td ><span>{{order.exportTime  | date('yyyy-MM-dd') }}</span></td>
            <td><span>{{order.exportAccountName}}</span></td>
            <td><span>{{order.vip}}</span></td>
            <td><span>{{order.isFamily}}</span></td>
            <td><span>{{order.accountRelation.department}}</span></td>
            <td><span>{{order.payType}}</span></td>
            <td><span>{{order.offlinePayMoney}}</span></td>
          </tr>
         </tbody>
       </table>
     </div>

     <mt-none style="padding: 20px;" :show="orderList.length == 0" size="large" />

  </div>

  <!-- 查看详情 -->
  <Modal
    title="订单项目"
    v-model="modalDetail"
    :mask-closable="false">
    <div class="item-title" v-if="addItems.length>0">
      套餐增加项目
    </div>
    <div style="max-height:300px;overflow: auto;">
      <table class="table" v-if="addItems.length>0">
        <tbody>
          <tr v-for="(item,index) in addItems">
            <td>{{index+1}}</td>
            <td>{{item.name}}</td>
            <td>￥{{item.originalPrice/100}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="item-title" v-if="delItems.length>0">
      套餐已减项目
    </div>
    <div style="max-height:300px;overflow: auto;">
      <table class="table"  v-if="delItems.length>0">
        <tbody>
          <tr v-for="(item,index) in delItems">
            <td>{{index+1}}</td>
            <td>{{item.name}}</td>
            <td>￥{{item.originalPrice/100}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="item-title">
      套餐内项目
    </div>
    <div style="max-height:300px;overflow: auto;">
      <table class="table">
        <tbody>
          <tr v-for="(item,index) in mealItems">
            <td>{{index+1}}</td>
            <td>{{item.name}}</td>
            <td>￥{{item.originalPrice/100}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </Modal>

</div>
</template>

<script>
import Agent from './Agent.js'
export default Agent
</script>

<style scoped lang="less">
.item-title
{
  font-size:16px;
  font-weight: bold;
  padding:5px 0;
}
.agent-table td, .agent-table th {
  min-width: 60px;
}
</style>
