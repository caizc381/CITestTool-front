<template>
 <div>
   <div class="header-search">
     <Breadcrumb>
          <BreadcrumbItem href="/channelManage/channelList">返回</BreadcrumbItem>
          <BreadcrumbItem>{{isNewChannel ? channelName:'新增渠道商'}}</BreadcrumbItem>
      </Breadcrumb>
   </div>

   <div class="body-content">
     <Tabs :value="currentTab"  @on-click="clickCurrentTab">
        <TabPane label="基本信息" name="basic">
          <!-- 基本信息 -->
          <basic-info :channel="basicInfo" @reload="getBasicDetail"></basic-info>     

        </TabPane>
        <TabPane label="消息提醒" name="message" v-if="isNewChannel">
           <!-- 消息提醒 -->
          <message-info v-if="messageInfo" :message="messageInfo" @reload="getMessageDetail"></message-info>

        </TabPane>
        <TabPane label="站点设置" name="site" v-if="isNewChannel">
          <!-- 站点设置 -->
          <site-info v-if="siteInfo" :site="siteInfo.siteInfo" :templateList="siteInfo.mobileTemplateList" :cssIdList="siteInfo.cssList" @reload="getSiteDetail"></site-info>

        </TabPane>
     </Tabs>
   </div>

  </div>
</template>

<script>
 import EditChannel from './EditChannel.js'
 export default EditChannel
</script>
