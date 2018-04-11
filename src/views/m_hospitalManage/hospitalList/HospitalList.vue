<template>
 <div>
   <div class="header-search">
     <div style="margin-top:-10px;">

       <div class="dlb mt10">
         <mt-select
         style="width:200px"
         v-model="organizationQuery.hospitalId"
         placeholder="请选择体检机构"
         @on-change="changeHospital"
         :filters="['name', 'pinYin']"
         :options="hospitalList" />
        </div>

        <div class="dlb mt10">
          <span class="query-margin">地区:</span>
          <Cascader
           class="dlb"
           :data="areaList"
           v-model="addressIds"
           :clearable="true"
           :change-on-select="true"
           @on-change="getDetailId"
           style="width:200px">
          </Cascader>
        </div>

        <div class="dlb mt10">
           <span class="query-margin">运营经理:</span>
           <mt-select
           style="width:200px"
           v-model="organizationQuery.opsManagerId"
           placeholder="请选择运营经理"
           @on-change="changeManager"
           :filters="['name', 'pinYin']"
           :options="managerList" />
        </div>

        <div class="dlb mt10">
         <span class="query-margin">对接:</span>
         <Select
           v-model="organizationQuery.exportWithXls"
           class="dlb"
           :clearable="true"
           style="width:200px">
           <Option value="false" label="深对接"></Option>
           <Option value="true" label="浅对接"></Option>
         </Select>
       </div>

      <a class="more-option ml15" v-if="!showMoreOption" @click="showMoreOption=true">更多筛选</a>
    </div>

    <!-- 更多筛选条件 -->
    <div v-if="showMoreOption">
      <div>
        <div class="dlb mt10">
          <span class="query-margin">医院类型:</span>
          <Select
           v-model="organizationQuery.type"
           class="dlb"
           :clearable="true"
           style="width:200px">
           <Option v-for="org in typeList" :value="org" :key="org">{{ org }}</Option>
         </Select>
        </div>

        <div class="dlb mt10">
           <span class="query-margin">医院等级:</span>
           <Select
             v-model="organizationQuery.level"
             class="dlb"
             style="width:200px"
             :clearable="true">
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
         </div>

         <div class="dlb mt10">
           <span class="query-margin">绑定微信:</span>
           <Select
             v-model="organizationQuery.isBindWX"
             class="dlb"
             :clearable="true"
             style="width:200px">
             <Option value="true" label="已绑定"></Option>
             <Option value="false" label="未绑定"></Option>
           </Select>
          </div>

         <div class="dlb mt10">
           <span class="query-margin">状态:</span>
           <Select
             v-model="organizationQuery.enable"
             class="dlb"
             :clearable="true"
             style="width:200px">
             <Option value="1" label="正常"></Option>
             <Option value="0" label="停用"></Option>
           </Select>
         </div>
      </div>

      <div>
        <div class="dlb mt10">
          <span class="query-margin">平台显示:</span>
          <Select
             v-model="organizationQuery.showInList"
             class="dlb"
             :clearable="true"
             style="width:200px">
             <Option value="1" label="显示"></Option>
             <Option value="0" label="不显示"></Option>
           </Select>
        </div>

         <div class="dlb mt10">
           <span class="query-margin">支付方式:</span>
           <Select
             v-model="organizationQuery.paymentType"
             class="dlb"
             :clearable="true"
             style="width:200px">
             <Option value="1" label="只允许线上"></Option>
             <Option value="2" label="只允许线下"></Option>
             <Option value="3" label="线上线下"></Option>
           </Select>
          </div>

         <div class="dlb mt10">
           <span class="query-margin">现场付款:</span>
           <Select
             v-model="organizationQuery.needLocalPay"
             class="dlb"
             :clearable="true"
             style="width:200px">
             <Option value="true" label="需要确认"></Option>
             <Option value="false" label="不需要确认"></Option>
           </Select>
          </div>

         <div class="dlb mt10">
           <span class="query-margin">平台折扣:</span>
           <Select
             v-model="organizationQuery.platformDiscount"
             class="dlb"
             :clearable="true"
             style="width:200px">
             <Option value="0" label="小于1.00"></Option>
             <Option value="1" label="等于1.00"></Option>
           </Select>
          </div>

        <a class="more-option ml15"  @click="showMoreOption=false">收起</a>
      </div>
    </div>
  </div>

  <div class="body-content" style="position: relative;">

    <div class="operate-btn">
      <Dropdown style="margin-left: 20px">
        <Button type="primary">
            新建体检中心
            <Icon type="arrow-down-b"></Icon>
        </Button>
        <DropdownMenu slot="list">
            <DropdownItem v-permission="'hospitalManage:list:newHospital'"  type="primary" @click.native="$router.push('/hospitalManage/list/create')">单个创建(推荐)</DropdownItem>
            <DropdownItem @click.native="showExport()">批量导入</DropdownItem>
        </DropdownMenu>
      </Dropdown>  
      <Button v-permission="'hospitalManage:list:exportHospital'" type="ghost" @click="batchOperation">{{handlerText}}</Button>
    </div>

    <Tabs v-model="currentTab" @on-click="clickCurrentTab">
        <TabPane label="基本信息" name="basic">
           <basic-list ref="basic" :organizationQuery="organizationQuery" :allHospitalIdList="allHospitalIdList" :isHandler="isHandler"></basic-list>
        </TabPane>
        <TabPane label="功能配置" name="function">
          <function-list ref="fun" :organizationQuery="organizationQuery" :allHospitalIdList="allHospitalIdList" :isHandler="isHandler"></function-list>
        </TabPane>
        <TabPane label="平台合作" name="cooperation">
           <cooperation-list ref="coop" :organizationQuery="organizationQuery" :allHospitalIdList="allHospitalIdList" :isHandler="isHandler"></cooperation-list>
        </TabPane>
        <TabPane label="站点设置" name="site">
          <site-list ref="site" :organizationQuery="organizationQuery" :allHospitalIdList="allHospitalIdList" :isHandler="isHandler"></site-list>
        </TabPane>
        <TabPane label="签约对接" name="sign">
          <sign-list ref="sign" :organizationQuery="organizationQuery" :allHospitalIdList="allHospitalIdList" :isHandler="isHandler"></sign-list>
        </TabPane>
    </Tabs>
  </div>
  
  <!--批量导入-->
    <Modal
      title="批量导入体检中心"
      v-model="model.export"
      :mask-closable="false">
        <Form
         :model="exportInfo"
         :label-width="100"
         class="demo-form-inline"
         v-if="exportStatus == 0">
          <FormItem label="机构类型">
            <Select v-model="exportInfo.type" placeholder="请选择机构类型">
             <Option v-for="org in typeList" :value="org" :key="org">{{ org }}</Option>
           </Select>
          </FormItem>
          <FormItem label="机构品牌" v-if="exportInfo.type == '民营连锁'">
            <Select v-model="exportInfo.brandId" placeholder="请选择机构品牌">
             <Option v-for="brand in brandList" :value="brand.id" :key="brand.id">{{ brand.brandName }}</Option>
           </Select>
          </FormItem>
          <FormItem label="体检中心名单">
            <Upload class="dib"
              :before-upload="handleUpload"
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              action="">
              <Button type="ghost" icon="ios-cloud-upload-outline">上传Excel文件</Button>
            </Upload>
            <a @click="downTemplate()">下载模板</a>
            <div v-if="exportInfo.file !== null">{{exportInfo.file.name}}</div>
          </FormItem>
        </Form>
        <div v-if="exportStatus == 1">
          <div>正在导入，请稍后.....</div>
        </div>
        <div slot="footer">
            <Button type="text" @click="model.export = false;" v-if="exportStatus == 0">取消</Button>
            <Button type="primary" @click="confirmExport()" v-if="exportStatus == 0">确认</Button>
        </div>
    </Modal>

    <!--批量导入结果-->
    <Modal
      title="批量导入体检中心"
      v-model="model.exportResult"
      :mask-closable="false">
      <div v-if="exportStatus == 2">
        <div>已成功导入{{successHospitalNumber}}条体检中心</div>
      </div>
      <div v-if="exportStatus == 3">
        <div>
          <div>
            <span class="red">导入失败！具体原因如下:</span>
            <div class="pl10" v-for="(error, index) in errorHospitals" :key="index" v-if="index == 0">
               <div class="f18 b">{{error.orgName}}</div>
               <div v-for="(list, idx) in error.errorAttrs" :key="idx">
                 <div>{{list.name}},{{list.errorDesc}}</div>
               </div>
            </div>
          </div>
          <a v-if="errorHospitals.length > 1" class="pl10" :href="url" target="_blank">查看更多失败原因</a>
        </div>
      </div>
      <div slot="footer">
          <Button type="text" v-if="exportStatus == 3" @click="model.exportResult = false;">取消</Button>
          <Button type="primary" v-if="exportStatus == 3" @click="model.exportResult = false;showExport(true)">重新导入</Button>
          <Button type="primary" v-if="exportStatus == 2" @click="model.exportResult = false;">我知道了</Button>
      </div>
    </Modal>

 </div>
</template>

<script>
import HospitalList from './HospitalList.js'

export default HospitalList
</script>

<style lang="less">
.operate-btn {
  position: absolute;
  top: 15px;
  right: 20px;
  z-index: 1000;
}
.basic-sort {
  position: relative;
  font-size: 14px;
  color: #999;
  .up {
    position: absolute;
    top: -2px;
    left: 0;
    z-index: 5;
  }
  .down {
    position: absolute;
    top: 5px;
    left: 0;
    z-index: 5;
  }
}
.dlb {
  display: inline-block !important;
}
.w300 {
  width: 300px !important;
}
.isOrderby {
  color: #2d8cf0;
}
.payway span{
    padding-right: 5px;
    border-right: 2px solid #999;
  }
.payway span:last-child {
  border-right: none;
}
.siteUrl{
  border:none;
  min-width:230px;
}
.detailfont {
  color: #666;
  font-size: 14px;
}
</style>
