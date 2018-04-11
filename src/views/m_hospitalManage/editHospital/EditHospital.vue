<template>
 <div>
   <div class="header-search">
     <Breadcrumb>
          <BreadcrumbItem href="/hospitalManage/list">返回</BreadcrumbItem>
          <BreadcrumbItem>
            <dropdown-select 
            :options="hospitalList"
            :selectId = "$route.params.hospitalId" 
            placeholder="简拼搜索体检中心"
            :filters = "['name','pinYin']"
            @on-change="handleCurrent">
            </dropdown-select>
          </BreadcrumbItem>
      </Breadcrumb>
   </div>

   <div class="body-content">
     <Tabs :value="currentTab" @on-click="clickCurrentTab">
        <TabPane label="基本信息" name="basic">
          <!-- 基本信息 -->
          <basic-info ref="basic"  v-if="hospitalInfo.hospital" :hospital="hospitalInfo.hospital" @reload="getBasicDetail(currentHos.id)"></basic-info>
          <!-- 业务人员 -->
          <manager-info class="mt10" v-if="hospitalInfo.hospital && hospitalInfo.manager && hospitalInfo.mediatorInfo && hospitalInfo.basicSettings" :hospital="hospitalInfo" @reload="getBasicDetail(currentHos.id)"></manager-info>
          <!-- 更多信息 -->
          <more-info class="mt10" v-if="hospitalInfo.hospital && hospitalInfo.basicSettings" :hospital="hospitalInfo" @reload="getBasicDetail(currentHos.id)"></more-info>
        </TabPane>
        <TabPane label="功能配置" name="function">
          <!-- 功能开通及设置 -->
          <function-info v-if="functionInfo.funSettings" :hospital="functionInfo" @reload="getFunctionDetail(currentHos.id)"></function-info>
          <!-- 交易设置 -->
          <business-info class="mt10" v-if="functionInfo.funSettings" :hospital="functionInfo" @reload="getFunctionDetail(currentHos.id)"></business-info>
          <!-- 体检预约时间设置 -->
          <medical-appointment class="mt10" v-if="functionInfo.funSettings && functionInfo.periodSetting" :hospital="functionInfo" @reload="getFunctionDetail(currentHos.id)"></medical-appointment>

        </TabPane>
        <TabPane label="平台合作" name="cooperation">
          <!-- 折扣信息 -->
          <discount-info v-if="cooperationInfo" :hospital="cooperationInfo" @reload="getCooperationDetail(currentHos.id)"></discount-info>

          <!-- 其他 -->
          <other-discount-info class="mt10" v-if="cooperationInfo" :hospital="cooperationInfo" @reload="getCooperationDetail(currentHos.id)"></other-discount-info>

        </TabPane>
        <TabPane label="站点设置" name="site">

          <!-- c端站点设置 -->
          <mobile-site v-if="siteInfo && siteInfo.siteInfo" :hospital="siteInfo.siteInfo" :templateList="siteInfo.mobileTemplateList" :cssIdList="siteInfo.cssList" @reload="getSiteDetail(currentHos.id)"></mobile-site>

        </TabPane>
        <TabPane label="消息设置" name="message">
          <!-- 消息设置 -->
          <message-info v-if="messageInfo" :hospital="messageInfo" @reload="getMessageDetail(currentHos.id)"></message-info>

        </TabPane>
        <TabPane label="问卷分配" name="questionnaire">
          <!-- 问卷分配 -->
          <questionnaire v-if="queInfo" :hospital="queInfo" :hospitalId="currentHos.id" @reload="getQuestionDetail(currentHos.id)"></questionnaire>

        </TabPane>
        <TabPane label="签约对接" name="sign">
           <!-- 医院合作联系人信息 -->
           <hoscontacts-info v-if="signInfo" :hospital="signInfo" :hospitalId="currentHos.id" @reload="getSignDetail(currentHos.id)"></hoscontacts-info>

           <!-- 医院合作签约信息 -->
           <hoscontract-info class="mt10" v-if="signInfo" v-permission="'hospitalManage:list:signInfo'" :hospitalId="currentHos.id" :hospital="signInfo" @reload="getSignDetail(currentHos.id)"></hoscontract-info>

           <!-- 体检软件厂商对接信息 -->
           <manufacturersdocking-info class="mt10" v-if="signInfo" :hospitalId="currentHos.id" :hospital="signInfo" @reload="getSignDetail(currentHos.id)"></manufacturersdocking-info>

        </TabPane>
     </Tabs>
   </div>

  </div>
</template>

<script>
 import EditHospital from './EditHospital.js'
 export default EditHospital
</script>
