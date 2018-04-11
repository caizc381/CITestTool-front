<template>
 <div>
   <Row>
      <i-col :span="24" class="header-search">
         <Input class="search"
           v-model="keywords"
           placeholder="请输入手机号码"
           :on-icon-click="getMessageList"
           icon="search"
           @on-enter="getMessageList" />
         <span>(只搜索最近10天发送的消息)</span>
      </i-col>
    </Row>

    <Row class="body-content">
      <table class="table">
       <thead>
         <tr>
            <th>MsgId</th>
            <th>手机号</th>
            <th>内容</th>
            <th>状态</th>
            <th>业务场景</th>
            <th>业务场景标识</th>
            <th>重试次数</th>
            <th>发送时间</th>
            <th>更新时间</th>
            <th>操作</th>
         </tr>
       </thead>
       <tbody>
         <tr v-for="item in messageList" :key="item.id">
            <td>
              {{item.id}}
            </td>
            <td>
              {{item.mobile}}
            </td>
            <td style="max-width:500px;">
              <div class="msgContent" :title="item.content">{{item.content}}</div>
            </td>
            <td>
              {{item.smsStatusEnum}}
            </td>
            <td>
              {{item.unifyBusinessTypeEnum}}
            </td>
            <td>
              {{item.businessId}}
            </td>
            <td>
              {{item.sendCount}}
            </td>
            <td>
              {{item.createTime | date('yyyy-MM-dd hh:mm:ss')}}
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

     <mt-none style="padding: 20px;" :show="messageList.length == 0" size="large" />

    </Row>

</div>
</template>

<script>
import Message from './Message.js'
export default Message
</script>

<style scoped lang="less">
.search{
  width:300px;
}
.msgContent {
  width:100%;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
</style>
