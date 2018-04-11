<template>
 <div>
   <div class="header-search">
     <div class="ops-title ml15">新建体检中心</div>
   </div>

   <div class="body-content">
     <Steps :current="currentStep">
        <Step title="填写基本信息"></Step>
        <Step title="功能设置"></Step>
        <Step title="站点设置"></Step>
        <Step title="新建完成"></Step>
    </Steps>

    <div style="min-height:400px;margin-top:10px;margin-bottom:30px;">
      <Form ref="hospitalForm" :model="organizationManageVo" :label-width="120">
       <div v-if="currentStep == 0">
         <div class="form-term">
            <div class="form-header-title">基本信息</div>

            <FormItem label="体检中心信息" style="font-weight: bold;">
            </FormItem>
            <FormItem label="机构名称：" class="ivu-form-item-required">
              <i-input type="text" v-model="organizationManageVo.hospital.name" placeholder="请输入体检中心名称" style="width:90%" :maxlength="30">
              </i-input>
            </FormItem>
            <FormItem label="机构类型：" class="dlb ivu-form-item-required" style="width:33%">
               <Select v-model="organizationManageVo.hospital.type" style="width:90%">
                 <Option v-for="org in typeList" :value="org" :key="org">{{ org }}</Option>
               </Select>
            </FormItem>
            <FormItem label="医院等级：" class="dlb ivu-form-item-required" style="width:33%">
               <Select v-model="organizationManageVo.hospital.level" style="width:90%">
                 <Option value="未知等级" label="未知等级"></Option>
                 <Option value="三特" label="三特"></Option>
                 <Option value="三甲" label="三甲"></Option>
                 <Option value="三乙" label="三乙"></Option>
                 <Option value="三丙" label="三丙"></Option>
                 <Option value="三级" label="三级"></Option>
                 <Option value="二甲" label="二甲"></Option>
                 <Option value="二乙" label="二乙"></Option>
                 <Option value="二丙" label="二丙"></Option>
                 <Option value="二级" label="二级"></Option>
                 <Option value="一甲" label="一甲"></Option>
                 <Option value="一乙" label="一乙"></Option>
                 <Option value="一丙" label="一丙"></Option>
               </Select>
            </FormItem>

            <div class="parting-line"></div>

            <FormItem label="地址信息" style="font-weight: bold;">
            </FormItem>
            <FormItem label="地区：" class="dlb ivu-form-item-required" style="width:33%">
              <Cascader :data="areaList" v-model="organizationManageVo.addressIds" change-on-select style="width:90%"></Cascader>
            </FormItem>
            <FormItem label="详细地址：" class="dlb ivu-form-item-required" style="width:33%">
              <i-input type="text" v-model="organizationManageVo.address.address" placeholder="请输入详细地址" style="width:90%"  :maxlength="50">
              </i-input>
            </FormItem>
            <FormItem label="经纬度：" class="ivu-form-item-required">
              <i-input type="text" v-model="organizationManageVo.address.longitude" placeholder="经度" style="width:25%">
              </i-input>
              <i-input type="text" v-model="organizationManageVo.address.latitude" placeholder="纬度" style="width:25%">
              </i-input>
              <a @click="openMap()">通过地图拾取</a>
            </FormItem>
            <FormItem label="交通信息：">
              <i-input type="textarea" :maxlength="500" v-model="organizationManageVo.hospital.trafficInfo" placeholder="最多500字" style="width:90%">
              </i-input>
            </FormItem>
         </div>

         <div class="form-term mt10">
            <div class="form-header-title">业务运营人员</div>

            <FormItem label="管理员" style="font-weight: bold;">
            </FormItem>
            <FormItem label="姓名：" class="dlb ivu-form-item-required" style="width:33%">
              <i-input type="text" v-model="organizationManageVo.manager.managerName" placeholder="姓名" style="width:90%" :maxlength="10">
              </i-input>
            </FormItem>
            <FormItem label="性别：" class="dlb" style="width:33%">
               <RadioGroup v-model="organizationManageVo.manager.gender">
                  <Radio label="0">男</Radio>
                  <Radio label="1">女</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="手机号：" class="dlb ivu-form-item-required" style="width:33%">
              <i-input type="text" v-model="organizationManageVo.manager.mobile" placeholder="手机号" style="width:90%">
              </i-input>
            </FormItem>
            <FormItem label="crm账号：" class="ivu-form-item-required">
              <i-input type="text" v-model="organizationManageVo.manager.username" placeholder="crm账号" style="width:50%" @on-blur="verifyManagerName">
              </i-input>
              <span class="red" v-if="isRepeatManagerName">用户名已重复！</span>
            </FormItem>

            <div class="parting-line"></div>

            <FormItem label="业务联系人" style="font-weight: bold;">
            </FormItem>
            <FormItem  label="姓名：" class="dlb" style="width:33%">
              <i-input type="text" v-model="organizationManageVo.mediatorInfo.name" placeholder="姓名" style="width:90%" :maxlength="10">
              </i-input>
            </FormItem>
            <FormItem  label="手机号：" class="dlb" style="width:33%">
              <i-input type="text" v-model="organizationManageVo.mediatorInfo.mobile" placeholder="手机号" style="width:90%">
              </i-input>
            </FormItem>
             <FormItem label="邮箱：" class="dlb" style="width:33%">
              <i-input type="text" v-model="organizationManageVo.mediatorInfo.mail" placeholder="邮箱" style="width:90%">
              </i-input>
            </FormItem>

            <div class="parting-line"></div>

            <FormItem label="平台运营经理" style="font-weight: bold;">
            </FormItem>
            <FormItem  label="姓名：">
              <mt-select
               style="width: 200px;"
               v-model="organizationManageVo.hospital.opsManagerId"
               placeholder="请选择运营经理"
               @on-change="changeManager"
               :filters="['name', 'pinYin']"
               :options="managerList" />
               {{organizationManageVo.hospital.opsManagerId}}
            </FormItem>
            <FormItem label="年业务量：">
              <InputNumber placeholder="上一年业务量" :max="9999999999"  :min="0" v-model="organizationManageVo.settings.businessAmount"></InputNumber>
              <span>万</span>
            </FormItem>
            <FormItem label="运营备注：">
              <i-input type="textarea" v-model="organizationManageVo.settings.opsRemark" :maxlength="500" placeholder="最多500字" style="width:90%">
              </i-input>
            </FormItem>
         </div>

         <div class="form-term mt10">
            <div class="form-header-title">更多信息</div>

            <FormItem label="体检中心信息" style="font-weight: bold;">
            </FormItem>
            <FormItem label="体检电话：" class="dlb ivu-form-item-required" style="width:33%">
              <i-input type="text" v-model="organizationManageVo.hospital.phone" placeholder="体检电话" style="width:90%">
              </i-input>
            </FormItem>
            <FormItem label="团检电话：" class="dlb ivu-form-item-required" style="width:33%">
              <i-input type="text" v-model="organizationManageVo.settings.groupExamTel" placeholder="团检电话" style="width:90%">
              </i-input>
            </FormItem>
            <br/>
            <FormItem label="客服电话：" class="dlb ivu-form-item-required" style="width:33%">
              <i-input type="text" v-model="organizationManageVo.settings.serviceTel" placeholder="客服电话" style="width:90%">
              </i-input>
            </FormItem>
            <FormItem label="技术支持：" class="dlb ivu-form-item-required" style="width:33%">
              <i-input type="text" v-model="organizationManageVo.settings.technicalTel" placeholder="技术支持" style="width:90%">
              </i-input>
            </FormItem>
            <FormItem label="医院标签：" class="ivu-form-item-required">
              <i-input type="text" v-model="organizationManageVo.hospital.keywords" placeholder="请输入关键词，关键词用‘|’隔开，如‘健康管理|专业体检中心’" style="width:90%">
              </i-input>
            </FormItem>
            <FormItem label="体检须知：" class="ivu-form-item-required">
              <i-input type="textarea" :rows="4" v-model="organizationManageVo.hospital.examNotice" placeholder="最多500字" style="width:90%">
              </i-input>
            </FormItem>
            <FormItem label="提供早餐：">
              <RadioGroup v-model="organizationManageVo.settings.isBreakfast">
                <Radio label="true">提供</Radio>
                <Radio label="false">不提供</Radio>
                </RadioGroup>
            </FormItem>

            <div class="parting-line"></div>

            <FormItem label="体检中心信息" style="font-weight: bold;">
            </FormItem>
            <FormItem label="简介：">
              <i-input type="textarea" v-model="organizationManageVo.hospital.briefIntro" :maxlength="500" placeholder="最多500字" style="width:90%">
              </i-input>
            </FormItem>
            <FormItem label="详细介绍：">
              <i-input type="textarea" v-model="organizationManageVo.hospital.detailIntro" :maxlength="500" placeholder="最多500字" style="width:90%">
              </i-input>
            </FormItem>
         </div>

         <div v-if="stepOne" class="error">{{errorInfo}}</div>

         <div class="ml30 mt10">
            <Button type="ghost" @click="$router.push('/hospitalManage/list')">取消</Button>
            <Button type="primary" class="ml10" @click="verifyStepOne()">下一步</Button>
         </div>
       </div>

       <div v-if="currentStep == 1">
         <div class="form-term">
            <div class="form-header-title">功能开通设置</div>

            <FormItem label="体检软件功能支持" style="font-weight: bold;"></FormItem>
            <FormItem label="调整价格：" class="dlb" style="width:33%">
              <RadioGroup v-model="organizationManageVo.settings.allowAdjustPrice">
                  <Radio label="true">支持</Radio>
                  <Radio label="false">不支持</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="无体检日期订单：" class="dlb" style="width:33%">
              <RadioGroup v-model="organizationManageVo.settings.exportWithNoExamDate">
                  <Radio label="true">支持</Radio>
                  <Radio label="false">不支持</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="最大下单数：" class="dlb" style="width:33%">
              <InputNumber :max="5" :min="1" v-model="organizationManageVo.settings.sameDayOrderMaximum"></InputNumber>
              <div class="prompt">指同一用户同一天最大下单数</div>
            </FormItem>

            <div class="parting-line"></div>

            <FormItem label="其他设置" style="font-weight: bold;"></FormItem>
            <FormItem label="体检报告：" class="dlb" style="width:33%">
              <RadioGroup v-model="organizationManageVo.settings.openGroupExamReport">
                  <Radio label="true">开通</Radio>
                  <Radio label="false">不开通</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="智能推荐：" class="dlb" style="width:33%">
              <RadioGroup v-model="organizationManageVo.settings.isSmartRecommend">
                  <Radio label="true">开通</Radio>
                  <Radio label="false">不开通</Radio>
              </RadioGroup>
            </FormItem>
         </div>

         <div class="form-term mt10">
            <div class="form-header-title">交易设置</div>

            <FormItem label="财务" style="font-weight: bold;">
            </FormItem>
            <FormItem label="结算精度：" class="dlb" style="width:33%">
              <RadioGroup v-model="organizationManageVo.settings.calculatorService">
                  <Radio label="1">元</Radio>
                  <Radio label="2">角</Radio>
                  <Radio label="3">分</Radio>
              </RadioGroup>
              <div class="prompt">指单项价格、套餐以及订单总价的精度</div>
            </FormItem>
            <FormItem label="结算日期：" class="dlb" style="width:33%">
               <span>每月</span>
               <Select v-model="organizationManageVo.settings.settleCycle" style="width:400px">
                 <Option
                   v-for="settleCycle in settleCycleList"
                   :label="settleCycle.name"
                   :value="settleCycle.id"
                   :key="settleCycle.id">
                 </Option>
               </Select>
            </FormItem>

            <div class="parting-line"></div>

            <FormItem label="支付设置" style="font-weight: bold;">
            </FormItem>
            <FormItem label="C端支付：" style="width:33%">
               <Checkbox v-model="organizationManageVo.settings.accountPay">余额支付</Checkbox>
               <Checkbox v-model="organizationManageVo.settings.aliPay">支付宝支付</Checkbox>
               <Checkbox v-model="organizationManageVo.settings.weiXinPay">微信支付</Checkbox>
               <Checkbox v-model="organizationManageVo.settings.acceptOfflinePay">现场支付</Checkbox>
            </FormItem>
            <FormItem label="现场支付订单：" style="width:33%">
              <RadioGroup v-model="organizationManageVo.settings.needLocalPay">
                  <Radio label="true">需要收款确认</Radio>
                  <Radio label="false">不需要收款确认</Radio>
              </RadioGroup>
              <div class="prompt">如果开通了'现场支付',如果体检软件本身无法很好的区分需不需要确认现场收款，强烈建议选择'需要收款确认'</div>
            </FormItem>
         </div>

         <div class="form-term mt10">
            <div class="form-header-title">体检预约时间设置</div>

            <div class="form-title">工作时间及人数</div>
            <FormItem label="工作日：">
              <CheckboxGroup v-model="workDayArr">
                <Checkbox :label=2>周一</Checkbox>
                <Checkbox :label=3>周二</Checkbox>
                <Checkbox :label=4>周三</Checkbox>
                <Checkbox :label=5>周四</Checkbox>
                <Checkbox :label=6>周五</Checkbox>
                <Checkbox :label=7>周六</Checkbox>
                <Checkbox :label=1>周日</Checkbox>
              </CheckboxGroup>
            </FormItem>
            <FormItem label="体检时间：" class="dlb" style="width:33%">
               <TimePicker format="HH:mm" type="timerange" :value="examTime" placement="bottom-end" placeholder="选择时间" style="width: 168px" @on-change="changeExamTime"></TimePicker>
            </FormItem>
            <FormItem label="抽血时间：" class="dlb" style="width:33%">
               <TimePicker format="HH:mm" type="timerange" :value="drawBloodTime" placement="bottom-end" placeholder="选择时间" style="width: 168px" @on-change="changeDrawBlood"></TimePicker>
            </FormItem>

            <div class="parting-line"></div>

            <FormItem label="可预约时间段" style="font-weight: bold;"></FormItem>
            <div class="m15 prompt" style="position: relative;top: -30px;">设置体检中心可预约时段，及该时段允许从平台预约人数上限</div>

            <FormItem label="时段一：">
               <i-input type="text" placeholder="时段" style="width:400px" v-model="time.name"></i-input>
               <i-input style="width: 80px" :maxlength="4" placeholder="人数上限" v-model="time.limitNum" /> <span>人 / 天</span>
               <br/>
               <Checkbox v-model="showMoreTime">更多时段</Checkbox>
               <span class="m10 gray">建站时最多提供两个时段选择，如需更多时段，请在建站完成之后联系质控组添加</span>
               <br/>
               <div v-if="showMoreTime">
                  <i-input type="text" placeholder="时段" v-model="otherTime.name"  style="width:400px"></i-input>
                  <i-input style="width: 80px" :maxlength="4" placeholder="人数上限" v-model="otherTime.limitNum" /> <span>人 / 天</span>
                  <Checkbox v-model="otherTime.internalUsePeriod" class="ml20">仅内部使用</Checkbox>
                  <span class="m10 gray">'仅内部使用'为B端预约时间，在C端无法看到</span>
               </div>
            </FormItem>

            <div class="parting-line"></div>

            <FormItem label="提前时间" style="font-weight: bold;"></FormItem>
            <FormItem label="客户提前预约时间：">
              <span>提前</span>
              <Select v-model="organizationManageVo.settings.previousBookDays" style="width:200px">
                 <Option label="1天" value="1"></Option>
                 <Option label="2天" value="2"></Option>
                 <Option label="3天" value="3"></Option>
                 <Option label="4天" value="4"></Option>
                 <Option label="5天" value="5"></Option>
               </Select>
               <TimePicker format="HH:mm" :value="organizationManageVo.settings.previousBookTime" placeholder="选择时间" style="width: 112px"></TimePicker>
              <span>之前(跳过休息日)</span>
              <div class="prompt">客户想要预约某一天体检，必须提前预约，提前时间为体检日往前推算设置的天数，在设置的几点几分可以预约，提前预约的天数会跳过休息日</div>
            </FormItem>
            <FormItem label="客户提前导出时间：">
              <span>提前</span>
              <Select v-model="organizationManageVo.settings.previousExportDays" style="width:200px" placement='top'>
                 <Option
                   v-for="days in previousExportDaysList"
                   :label="days.name"
                   :value="days.id"
                   :key="days.id">
                 </Option>
               </Select>
              <span>之前(跳过休息日)</span>
              <div class="prompt">在自动导出订单的单位，客户预约的订单会按照设置的时间，跳过休息日，提前导入到内网，以便打印体检单</div>
            </FormItem>
         </div>
          <div v-if="stepSe" class="error">{{errorInfo}}</div>
         <div class="ml30 mt10">
            <Button type="ghost" @click="prevStep">上一步</Button>
            <Button type="primary" class="ml10" @click="verifyStepTwo()">下一步</Button>
         </div>
       </div>

       <div v-if="currentStep == 2">
         <div class="form-term">
            <div class="form-header-title">站点域名及模板设置</div>

            <FormItem label="域名设置" style="font-weight: bold;"></FormItem>
            <FormItem label="C端网址：" class="ivu-form-item-required">
              <i-input v-model="organizationManageVo.siteVo.url" style="width:800px;" placeholder="网址后缀，最多16个字符，由字符和数字组成" @on-blur="verifyUrl">
                  <span slot="prepend">https://www.mytijian.com/m/</span>
              </i-input>
              <span class="red" v-if="isRepeatUrl">网址不可用！</span>
            </FormItem>

            <div class="parting-line"></div>

            <FormItem label="站点模板：" style="font-weight: bold;"></FormItem>
            <FormItem label="C端模板：">
              <Select v-model="organizationManageVo.siteVo.mobileTemplateId" style="width:400px">
                 <Option
                   v-for="template in mobileTemplateList"
                   :label="template.name"
                   :value="template.id"
                   :key="template.id">
                 </Option>
               </Select>
               <a :href="url" target="_blank">查看模板种类</a>
            </FormItem>
            <FormItem label="站点色调：">
              <Select v-model="organizationManageVo.siteVo.cssId" style="width:400px">
                 <Option
                   v-for="css in cssIdList"
                   :label="css.name"
                   :value="css.id"
                   :key="css.id">
                </Option>
               </Select>
            </FormItem>
         </div>

         <div v-if="stepTwo" class="error">{{errorInfo}}</div>

         <div class="ml30 mt10">
            <Button type="ghost" @click="prevStep">上一步</Button>
            <Button type="primary" class="ml10" @click="createHospital">提交资料</Button>
         </div>
       </div>

       <div v-if="currentStep == 3">
         <div class="form-term">
            <div class="form-end">
              <p>新建成功，您可以做以下操作：</p>
              <p>
                <a class="mr5" href="javascript:;" @click="$router.push('/hospitalManage/list/edit/basic/'+currentId)">查看体检中心详情</a>或返回
                <a class="ml5" @click="$router.push('/hospitalManage/list')" href="javascript:;">体检中心管理</a></p>
            </div>
         </div>
       </div>

      </Form>
    </div>
   </div>

   <Modal
     title="获取经纬度"
     v-model="showMap"
     :closable='false'
     :mask-closable="false">
      <div class="mapTip">
          <input type="text" id="keyword" name="keyword" value="请输入关键字：(选定后搜索)" onfocus='this.value=""' class="ivu-input"  style="width:480px;"/>
      </div>
      <div id="mapContainer"></div>
      <div class="mt20" v-if="organizationManageVo.address.latitude || organizationManageVo.address.longitude">当前经纬度：{{organizationManageVo.address.longitude}},{{organizationManageVo.address.latitude}}</div>
      <div slot="footer">
         <Button @click="cancelMap">取消</Button>
         <Button type="primary" @click="showMap = false">确定</Button>
      </div>
   </Modal>

 </div>
</template>

<script>
import CreateHospital from './CreateHospital.js'
export default CreateHospital
</script>

<style lang="less">
.form-term {
  border:1px solid #dfe6ec;
}
.form-header-title {
  padding: 10px 15px;
  background-color: #f7f7f7;
  border-bottom: 1px solid #dfe6ec;
  margin-bottom: 10px;
  overflow: hidden;
}
.form-title {
  font-weight: bold;
  padding: 10px 15px 15px 15px;
}

.parting-line
{
  margin: 10px 15px;
  height: 0;
  border-top: 1px solid #dfe6ec;
}
.prompt {
  color: #999;
}
.form-end {
  padding: 40px 0;
  text-align: center;
  font-size: 16px;
  p {
    line-height: 50px;
  }
}
#mapContainer {
  width: 480px;
  height: 480px;
}
.mapTip {
    padding-bottom: 16px;
  }
.error{
  color: red;
  font-size: 14px;
  padding: 10px 0;
}
</style>
