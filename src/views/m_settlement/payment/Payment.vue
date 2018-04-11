<template>
  <div class="payment">
    <Row>
      <i-col :row="24" class="header-search">
      <span>地区：</span>
      <Cascader class="dlb w200" :data="areaList" v-model="area" :clearable="true" :change-on-select="true" @on-change="getDetailId">
      </Cascader>

      <span class="pl-20">体检机构：</span>
      <div class="dlb w200">
        <mt-select v-model="queryList.organizationId" placeholder="请选择体检机构" :filters="['name', 'pinyin']" :options="hosList">
        </mt-select>
      </div>
      </i-col>
    </Row>

    <Row class="body-content">
      <table v-for="(payment, idx) in paymentList" :key="idx" class="table mb15">
        <col width="50">
        <colgroup span="4"></colgroup>
        <col width="200">
        <col width="220">
        <col width="80">
        <col width="150">
        <thead>
          <tr class="noneBorder">
            <td colspan="9" style="line-height: 36px;">
              <span class="b f18">{{payment.organizationName}}</span>
              <span class="ml30">账单金额：
                <span class="b">{{payment.allPayment | money('￥')}}</span>
              </span>
              <span class="ml15">折扣应付：
                <span class="b">{{payment.allDiscountAmount | money('￥')}}</span>
              </span>
              <span class="ml15">消费额度：
                <span class="b">{{payment.allConsumeQuotaAmount | moneyAddSymbol}}</span>
              </span>

              <span class="fr">
                <Button type="primary" v-permission="'settle:payment:pay'" @click="pay(payment)">付款</Button>
              </span>
              <span class="fr mr30">平台实付：
                <span class="orange b">{{payment.allPayableTotalAmount | money('￥')}}</span>
              </span>

            </td>
          </tr>
          <tr>
            <th>
              <Checkbox class="selectAllItem" v-model="payment.isCheckedAll" @on-change="handleCheckAll(payment)"></Checkbox>
            </th>
            <th>结算批次</th>
            <th>单位</th>
            <th>单位类型</th>
            <th>平台折扣</th>
            <th>账单详情</th>
            <th>付款详情</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in payment.tradeHospitalPlatformBillList" :key="item.id">
            <td>
              <Checkbox class="selectOneItem" :disabled="item.status==4 || item.status==7" v-model="item.isCheck" @on-change="handleCheckOne(item,payment)"></Checkbox>
            </td>
            <td>{{item.batchSn}}</td>
            <td>
              <div class="ell" :title="item.companyName">{{item.companyName}}</div>
            </td>
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
                    <div slot="title">
                      <i>审核备注</i>
                    </div>
                    <div slot="content">
                      <div class="ops-poptip-content">{{item.remark}}</div>
                    </div>
                  </Poptip>
                </div>
              </div>
            </td>
            <td>
              <div :class="{'orgCol':item.status == 4,'greCol':item.status == 5,'successfont':item.status == 7}">{{item.status | billStatus}}</div>
            </td>
            <td>
              <a v-if="item.status==7" v-permission="'settle:payment:examine'" @click="editPayment(item, payment)">修改</a>
              <a v-if="item.status==4" v-permission="'settle:payment:examine'" @click="review(item, payment)">审核</a>
              <a @click="download(item.sn)">下载详单</a>
              <a v-if="item.circulationLog.length == 0">流转日志</a>
              <Tooltip v-if="item.circulationLog.length > 0" placement="left">
                <a>流转日志</a>
                <div slot="content">
                  <div v-for="(cir, idx) in item.circulationLog" :key="idx" style="width: 240px;">
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

      <Spin size="large" fix v-if="payLoading"></Spin>

      <mt-none style="padding: 20px;" :show="paymentList.length == 0" size="large" />
    </Row>

    <!-- 编辑 -->
    <Modal title="编辑" v-model="dialogEdit" :mask-closable="false">
      <Form :model="bill" ref="billForm" :label-width="100">
        <div class="dialog-header pl10">修改确认无误后，重新提交</div>
        <FormItem label="账单金额：">
          <span class="td-fc b">￥{{bill.platformChargedAmount}}</span>
        </FormItem>
        <FormItem label="折后应付：" prop="discountAmount" class="ivu-form-item-required">
          <i-input v-model.number="bill.discountAmount" auto-complete="off" class="dlb pct50" @on-blur="verifyLenEdit('discountAmount')">
          </i-input>
          <span class="discount">平台折扣：{{bill.platformDiscount}}</span>
        </FormItem>
        <FormItem label="平台实付：" prop="platformActurallyPayAmount" class="ivu-form-item-required">
          <i-input v-model.number="bill.platformActurallyPayAmount" auto-complete="off" class="dlb pct50" @on-blur="verifyLenEdit('platformActurallyPayAmount')">
          </i-input>
          <span class="discount" v-if="bill.consumeQuotaAmount < 0 && bill.discountAmount - (bill.minValue - bill.consumeQuotaAmount) > 0 ">最小值：￥{{(bill.discountAmount - (bill.minValue - bill.consumeQuotaAmount)) | twoDecimal}}</span>
          <span class="discount" v-else-if="bill.consumeQuotaAmount >= 0 && bill.discountAmount - bill.minValue > 0 ">最小值：￥{{(bill.discountAmount - bill.minValue) | twoDecimal}}</span>
          <span class="discount" v-else>最小值：￥0.00</span>
        </FormItem>
        <FormItem label="消费额度：">
          <span>￥{{(bill.platformActurallyPayAmount - bill.discountAmount) | twoDecimal}}</span>
        </FormItem>
        <FormItem label="备注：">
          <i-input v-model="bill.remark" type="textarea" :maxlength="50" :autosize="{minRows: 3,maxRows: 3}" placeholder="请输入审核说明"></i-input>
        </FormItem>
      </Form>
      <div class="error tc" v-if="errorInfo">{{errorInfo}}</div>
      <div slot="footer">
        <Button @click="handleReset()">取消</Button>
        <Button type="primary" @click="confirmEdit('billForm')">重新提交</Button>
      </div>
    </Modal>

    <!-- 审核 -->
    <Modal title="审核" v-model="dialogExamine" :mask-closable="false">
      <Form :model="examine" ref="examineForm" :label-width="100">
        <div class="dialog-header pl10">审核前请下载账单，确认账单无误后填写一下内容</div>
        <FormItem label="账单金额：">
          <span class="td-fc">￥{{examine.platformChargedAmount}}</span>
        </FormItem>
        <FormItem label="折后应付：" prop="discountAmount" class="ivu-form-item-required">
          <i-input v-model.number="examine.discountAmount" auto-complete="off" class="dlb pct50" @on-blur="verifyLenExamine('discountAmount')">
          </i-input>
          <span class="discount">平台折扣：{{examine.platformDiscount}}</span>
        </FormItem>
        <FormItem label="平台实付：" prop="platformActurallyPayAmount" class="ivu-form-item-required">
          <i-input v-model.number="examine.platformActurallyPayAmount" auto-complete="off" class="dlb pct50" @on-blur="verifyLenExamine('platformActurallyPayAmount')">
          </i-input>
          <span class="discount" v-if="examine.discountAmount - examine.minValue > 0 ">最小值：￥{{(examine.discountAmount - examine.minValue) | twoDecimal}}</span>
          <span class="discount" v-else>最小值：￥0.00</span>
        </FormItem>
        <FormItem label="消费额度：">
          <span>￥{{(examine.platformActurallyPayAmount - examine.discountAmount) | twoDecimal}}</span>
        </FormItem>
        <FormItem label="备注：">
          <i-input v-model="examine.remark" type="textarea" :maxlength="50" :autosize="{minRows: 3,maxRows: 3}" placeholder="请输入审核说明"></i-input>
        </FormItem>
      </Form>
      <div class="error tc" v-if="errorInfo">{{errorInfo}}</div>
      <div slot="footer">
        <Button @click="handleReset()">取消</Button>
        <Button type="primary" @click="reviewBill('examineForm')">提交审核</Button>
      </div>
    </Modal>

    <!-- 付款 -->
    <Modal title="付款" v-model="dialogPay" :mask-closable="false">
      <Form :model="payment" ref="payForm" :label-width="80">
        <div class="dialog-header pl10">请在打款成功后,在此上传付款凭证</div>
        <FormItem label="平台实付">
          <span class="orange b">{{payment.allPayableTotalAmount | money('￥')}}</span>
        </FormItem>
        <FormItem label="付款凭证">
          <span class="imgCertificate" v-if="payment.imageUrl">{{payment.imageUrl | img}}</span>
          <a class="imgUpload"><input type="file" id="fileNew" @change="action()" />上传凭证</a>
        </FormItem>
        <FormItem label="付款备注">
          <i-input v-model="payment.remark" type="textarea" :maxlength="100" :autosize="{minRows: 3,maxRows: 3}" placeholder="请输入付款备注"></i-input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="handleReset()">取消</Button>
        <Button type="primary" @click="payBill">确认</Button>
      </div>
    </Modal>

  </div>
</template>

<script>
import Payment from './Payment.js'
export default Payment
</script>

<style lang="less">
.dialog-header {
  font-size: 14px;
  padding-bottom: 10px;
}
.discount {
  color: #999;
}
.greCol {
  color: #32b789;
}
.redCol {
  color: #fe6869;
}
.orgCol {
  color: #fea012;
}
</style>
