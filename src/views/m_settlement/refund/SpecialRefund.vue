<template>
 <div class="bill">
   <Row>
     <i-col :span="24" class="header-search">
        <span class="ml15">体检机构：</span>

        <div class="dib w200">
          <mt-select
          v-model="queryList.organizationId"
          placeholder="请选择体检机构"
          @on-change="changeHospital"
          :filters="['name', 'pinyin']"
          :options="hosList" />
        </div>

        <div class="dib w200">
         <mt-select
         v-model="queryList.companyId"
         placeholder="请选择单位"
         :disabled="!queryList.organizationId"
         :loading="loadingCompany"
         :filters="['name', 'pinyin']"
         :options="companyList" />
        </div>

       <Button class="fr" type="primary"  v-permission="'settle:refund:new'" style="margin-right:20px;" @click="newForm()">新增</Button>
     </i-col>
    </Row>

    <Row class="body-content">
    <!-- 查询条件 -->
    <div class="mb10">
      <span v-show="time.length > 0 && time[0]" class="ops-query mr5">
        <span>{{time[0] | date('yyyy-MM-dd') }} 至 {{time[1] | date('yyyy-MM-dd') }}</span>
        <Icon type="close" @click.native.stop="clearDateRange"></Icon>
      </span>

      <span v-show="queryList.type !== '-1'" class="ops-query mr5">
        <span>{{queryList.type | payType}}</span>
        <Icon type="close" @click.native.stop="clearStatus('type')"></Icon>
      </span>

      <span v-show="queryList.settlementStatus !== '-1'" class="ops-query mr5">
        <span>{{queryList.settlementStatus | status}}</span>
        <Icon type="close" @click.native.stop="clearStatus('settlementStatus')"></Icon>
      </span>

    </div>
     <table class="table">
       <colgroup span="7"></colgroup>
       <col width="150">
       <thead>
         <tr class="noneBorder">
           <th>
            <DatePicker
              :open="openPicker"
              format="yyyy-MM-dd"
              v-model="time"
              type="daterange"
              placeholder="选择日期范围"
              @on-change="getdaterange">
               <a class="ivu-dropdown hoverblue" @click="handlerClick">
                记录时间 <i style="font-size:12px;" class="iconfont icon-guolvqi"></i>
               </a>
            </DatePicker>
          </th>
           <th>体检机构/单位</th>
           <th>退款时间</th>
           <th>退款金额</th>
           <th>备注</th>
           <th>操作人</th>
           <th>
              <Dropdown trigger="click">
                <span class="ivu-dropdown hoverblue">
                  状态 <i style="font-size:12px;" class="iconfont icon-guolvqi"></i>
                </span>
                <Dropdown-menu slot="list">
                  <Dropdown-item  @click.native="queryList.settlementStatus = '-1'">全部</Dropdown-item>
                  <Dropdown-item  @click.native="queryList.settlementStatus = '0'">未结算</Dropdown-item>
                  <Dropdown-item  @click.native="queryList.settlementStatus = '1'">已结算</Dropdown-item>
                  <Dropdown-item  @click.native="queryList.settlementStatus = '2'">已删除</Dropdown-item>
                </Dropdown-menu>
              </Dropdown>
           </th>
           <th>操作</th>
         </tr>
       </thead>
       <tbody>
         <tr v-for="(bill, idx) in billList" :key="idx">
           <td>
              <div>{{bill.gmtCreated | date('yyyy-MM-dd')}}</div>
              <div class="c-9">{{bill.gmtCreated | date('hh:mm:ss')}}</div>
           </td>
           <td>
             <div style="padding-top:5px;">{{bill.organizationName}}</div>
             <div style="color:#999;padding-top:5px;padding-bottom:5px;">
               <span class="tag mr5" type="gray" v-if="bill.isPlatformCompany">平台</span><span>{{bill.companyName}}</span>
             </div>
           </td>
           <td>
              <div>{{bill.paymentTime | date('yyyy-MM-dd')}}</div>
              <div class="c-9">{{bill.paymentTime | date('hh:mm:ss')}}</div>
           </td>
           <td>
             <div>{{bill.amount | money('￥')}}</div>
             <a class="alink" v-if="bill.certificate" @click="dialogCertificate=!dialogCertificate;certificate=bill.certificate">退款凭证</a>
           </td>
           <td>
             <Poptip trigger="hover" title="备注" :content="bill.remark" :width="300">
                <div class="ell-3">{{bill.remark}}</div>
             </Poptip>
           </td>
           <td>{{bill.operatorName}}</td>
           <td>
              <span :class="{'orange':bill.settlementStatus == 0,'successfont':bill.settlementStatus == 1,'redfont':bill.settlementStatus == 2}">{{bill.settlementStatus | status}}</span>
              <div v-if="bill.settlementStatus == 1">{{bill.batchSn}}</div>
           </td>
           <td>
             <span v-if="bill.settlementStatus==0">
               <a v-permission="'settle:refund:edit'" @click="editBill(bill.id)">修改</a>
               <a v-permission="'settle:refund:delete'"  @click="deleteBill(bill.id)">删除</a>
             </span>
           </td>
         </tr>
       </tbody>
     </table>

     <Spin size="large" fix v-if="settleLoading"></Spin>

     <mt-none style="padding: 20px;" :show="billList.length == 0" size="large" />

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

    <!--添加特殊退款-->
    <Modal
      title="新增特殊退款"
      v-model="dialogNew"
      :mask-closable="false"
      width="680">
        <Form
         :model="billModal"
         :rules="rules"
         ref="newForm"
         :label-width="80"
         class="demo-form-inline">
          <FormItem label="体检机构" prop="organizationId" class="form-line pct45">
            <mt-select
            v-model="billModal.organizationId"
            placeholder="请选择体检机构"
            @on-change="changeHospital"
            :filters="['name', 'pinyin']"
            :options="hosList" />
          </FormItem>
          <FormItem label="退款时间" prop="paymentTime" class="form-line pct45 ml10">
            <DatePicker
              type="date"
              placeholder="选择日期"
              v-model="billModal.paymentTime"
              :clearable="false"
              :editable="false">
            </DatePicker>
          </FormItem>
           <FormItem label="体检单位" prop="companyId" class="form-line pct45">
            <mt-select
            v-model="billModal.companyId"
            placeholder="请选择体检单位"
            :loading="loadingCompany"
            :filters="['name', 'pinyin']"
            :options="companyList" />
          </FormItem>
          <FormItem label="退款金额" prop="amount" class="form-line pct45 ml10">
            <i-input v-model.number="billModal.amount" auto-complete="off" @on-blur="verifyLenAmount('billModal')"></i-input>
          </FormItem>
          <FormItem label="退款凭证">
            <span class="imgCertificate">{{billModal.certificate | img}}</span>
            <a class="imgUpload"><input type="file" id="fileNew"  @change="action('new')" />上传凭证</a>
          </FormItem>
          <FormItem label="退款备注">
            <i-input v-model="billModal.remark" type="textarea" :maxlength="100" :autosize="{minRows: 3,maxRows: 3}" placeholder="请输入..."></i-input>
          </FormItem>
        </Form>
        <div slot="footer">
            <Button  @click="handleReset()">取消</Button>
            <Button type="primary" @click="newBill('newForm')">确认</Button>
        </div>
    </Modal>

    <!--编辑特殊退款-->
    <Modal
      title="编辑特殊退款"
      v-model="dialogEdit"
      :mask-closable="false"
       width="680">
        <Form
         :model="editModal"
         :rules="rules"
         ref="editForm"
         :label-width="80"
         class="demo-form-inline">
          <FormItem label="体检机构" prop="organizationId" class="form-line pct45">
            <mt-select
            v-model="editModal.organizationId"
            placeholder="请选择体检机构"
            @on-change="changeHospital"
            :filters="['name', 'pinyin']"
            :options="hosList" />
          </FormItem>
          <FormItem label="退款时间" prop="paymentTime" class="form-line pct45 ml10">
            <DatePicker
            type="date"
            placeholder="选择日期"
            v-model="editModal.paymentTime"
            :clearable="false"
            :editable="false"></DatePicker>
          </FormItem>
          <FormItem label="体检单位" prop="companyId" class="form-line pct45">
            <mt-select
            v-model="editModal.companyId"
            placeholder="请选择体检单位"
            :loading="loadingCompany"
            :filters="['name', 'pinyin']"
            :options="companyList" />
          </FormItem>
          <FormItem label="退款金额" prop="amount" class="form-line pct45 ml10">
            <i-input v-model.number="editModal.amount" auto-complete="off" @on-blur="verifyLenAmount('editModal')"></i-input>
          </FormItem>
          <FormItem label="退款凭证">
              <span class="imgCertificate">{{editModal.certificate | img}}</span>
              <a class="imgUpload"><input type="file" id="fileUpdate"  @change="action('update')" />重新上传</a>
          </FormItem>
          <FormItem label="退款备注">
            <i-input v-model="editModal.remark" type="textarea" :maxlength="100" :autosize="{minRows: 3,maxRows: 3}" placeholder="请输入..."></i-input>
          </FormItem>
        </Form>
        <div slot="footer">
            <Button  @click="handleReset()">取消</Button>
            <Button type="primary" @click="confirmEditBill('editForm')">确认</Button>
        </div>
    </Modal>

    <!-- 显示退款凭证 -->
    <Modal
      v-model="dialogCertificate"
      title="退款凭证">
      <div style="text-align:center"><img style="max-width:400px" :src="certificate" /></div>
      <div slot="footer">
        <Button type="primary" @click="dialogCertificate=false">确认</Button>
      </div>
    </Modal>

</div>
</template>

<script>
import SpecialRefund from './SpecialRefund.js'
export default SpecialRefund
</script>

<style lang="less">
.bill{
  font-size:14px;
  .alink
  {
    color:#20A0FF;
    cursor: pointer;
  }
  .tab-color{
    color: #1D8CE0;
  }
  .tag {
      background-color: #8795ab;
      border-radius: 2px;
      color: #fff;
      padding: 1px 2px;
      font-size: 12px;
  }
}
.nonedate{
  padding-top:10px;
  padding-bottom:10px;
  text-align:center;
}
.hoverblue{
  color:#58B7FF;
}
.form-line
{
  display:inline-block;
}
.imgCertificate {
  max-width:300px;
  display:inline-block;
}
.imgUpload {
  width:60px;
  margin-left:5px;
  display:inline-block;
  position:relative;
  input {
    width: 0;
    height: 30px;
    opacity: 0;
    position:absolute;
    top:0;
    left:0;
  }
}

</style>
