<template>
 <div>
   <Row>
      <i-col :span="24" class="header-search">
         <Input class="w200"
           v-model="query.hospitalName"
           placeholder="请输入医院名称"
           @on-enter="getEmailList()" />

         <label>邮件类型：</label>
           <Select
             v-model="query.notifyType"
             placeholder="请选择邮件类型"
             filterable
             clearable
             style="width:200px"
             @on-change="getEmailList()">
              <Option v-for="em in notifyTypeList" :value="em.value" :key="em.value">{{ em.label }}</Option>
            </Select>

         <label>发送时间：</label>
           <DatePicker
             type="date"
             placeholder="选择日期"
             :clearable="true"
             :editable="false"
             @on-change="getSendTime">
           </DatePicker>

         <Button type="primary" @click="getEmailList()">查询</Button>
      </i-col>
    </Row>

    <Row class="body-content">
      <table class="table">
       <thead>
         <tr>
            <th>EmailId</th>
            <th>医院ID</th>
            <th>医院名称</th>
            <th>发送人</th>
            <th>收件人</th>
            <th>邮件标题</th>
            <th>邮件类型</th>
            <th>发送结果</th>
            <th>发送时间</th>
            <th>保存时间</th>
            <th>操作</th>
         </tr>
       </thead>
       <tbody>
         <tr v-for="item in emailList" :key="item.id">
            <td>
              {{item.id}}
            </td>
            <td>
              {{item.hospitalId}}
            </td>
            <td >
              <div :title="item.content">{{item.hospitalName}}</div>
            </td>
            <td>
              <div :title="item.sender">{{item.sender}}</div>
            </td>
            <td>
              <div class="ell-3" :title="item.receiver">{{item.receiver}}</div>
            </td>
            <td>
              {{item.subject}}
            </td>
            <td v-if="item.notifyType==='EXPORT_ORDER_MESSAGE'">
               浅对接
            </td>
            <td v-else-if="item.notifyType==='GROUP_APPLICATION_MAILL'">
               团检申请
            </td>
            <td v-else-if="item.notifyType==='MEAL_CHANGE_NOTIFY'">
               套餐修改
            </td>
            <td v-else-if="item.notifyType==='BOTTLENECK_EXAMITEM' || item.notifyType === null">
               瓶颈项目
            </td>
            <td>
               {{item.sendStatus | sendStatusFileter}}
            </td>
            <td>
              {{item.sendTime | date('yyyy-MM-dd hh:mm:ss')}}
            </td>
            <td>
              {{item.updateTime | date('yyyy-MM-dd hh:mm:ss')}}
            </td>
            <td>
              <Button type="primary" @click="reSend(item)">重发</Button>
            </td>
        </tr>
       </tbody>
     </table>

     <div class="page-wrap mt20 tc" v-if="emailList.length > 0">
      <Page 
        :total="page.rowCount"
        :current="page.currentPage"
        :page-size="page.pageSize"
        @on-change="changePage"
        @on-page-size-change="changeSize"
        show-total
        show-sizer></Page>
    </div>

     <mt-none style="padding: 20px;" :show="emailList.length == 0" size="large" />

    </Row>

</div>
</template>

<script>
import Email from './Email.js'
export default Email
</script>
