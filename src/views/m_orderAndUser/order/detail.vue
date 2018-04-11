<template>
  <transition name="fade">
    <div class="detail-body"  v-if="detail.modal">
      <Row>
        <Col span="24" class="pl15 pt10 pb10">
          <div  @click="$parent.detail.modal = false" class="dlb">
            <Icon type="close"></Icon>
          </div>          
          <span class="f16 pl15 b">订单详情</span>
        </Col>
        <Col class="dvd-x grey" span="24"></Col>
        <Col class="pl10 pr5" span="24">
          <div class="ovh pt5 pb5">
            <div class="fl pt5">
              <div class="dib mr10">订单金额：<span class="c-or">￥{{detail.dataBase.orderPrice||0 | money}}</span></div>
              <div class="dib mr10">折扣：<span class="c-or">{{detail.dataBase.discount}}</span></div>
              <div v-if="detail.dataMore.refundPrice !== 0" class="dib">
                <div class="dib mr10" v-if="detail.dataMore.refundFlag === 0">
                  预计退款：<span class="c-or">￥{{detail.dataMore.refundPrice | money}}</span>
                  <i v-if="detail.dataMore.currency == '角'"
                  title="'实际退款金额由正负合计按照体检中心结算精度'+detail.dataMore.currency+'计算得出'"
                  class="iconfont icon-wenhao assist-hide"></i>
                </div>
                <div class="dib mr10" v-if="detail.dataMore.refundFlag === 1">
                  退款：<span class="c-or">￥{{detail.dataMore.refundPrice | money}}</span>
                  <i v-if="!detail.dataMore.customerPayRefund && detail.dataMore.currency == '角'"
                  class="iconfont icon-wenhao assist-hide"></i>
                  <i v-if="detail.dataMore.customerPayRefund && detail.dataMore.currency == '角'"
                  class="iconfont icon-wenhao assist-hide"></i>
                  <i v-if="detail.dataMore.customerPayRefund && detail.dataMore.currency != '角'"
                  class="iconfont icon-wenhao assist-hide"></i>
                </div>
              </div>
            </div>
            <div class="fr pt5" v-if="detail.dataBase.hisOrderPrice>0">
              内网价格：￥ {{detail.dataBase.hisOrderPrice*100 | money}}
            </div>
            <span class="dvd-x grey"></span>
          </div>
          
        </Col>
        <Col class="pl10" span="14">
          <div class="tr pr10 pt10 pb10 f16">正负合计：
            <span :class="detail.dataMore.summation>0?'c-gr':'c-rd'">{{detail.dataMore.summation || 0 | allMoney}}</span>
          </div>
          <span class="dvd-x grey"></span>
          <div class="ui-order-detail-itemstbl bdr-t" style="max-height:750px;">
            <!-- 现场加项 -->
          <div v-if="detail.dataMore.addExams && detail.dataMore.addExams.length>0">
            <table class="table fixed">
              <col width="35">
              <col width="160">
              <col width="50">
              <col width="90">
              <col width="90">
              <thead>
                <tr>
                  <td colspan="3" class="tit">现场加项</td>
                  <td colspan="2"><div class="tr c-gr f16">+￥{{detail.dataMore.addItemPriceSum||0 | money}}</div></td>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item,index) in detail.dataMore.addExams" :key="index">
                  <td>{{index+1}}</td>
                  <td class="ell" :title="item.name">{{item.name}}</td>
                  <td><span v-if="item.oldData !== true">{{item.checkState | checkState}}</span></td>
                  <td><div class="tr">￥{{item.price | money}}</div></td>
                  <td><div class="tr c-gr" v-if="item.oldData !== true">
                    <span v-if="item.refundState===2">+</span>
                    ￥{{item.price | money}}
                  </div></td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- 拒检未检项目 -->
          <div v-if="detail.dataMore.unexamedAndRefused && detail.dataMore.unexamedAndRefused.length>0">
            <table class="table fixed">
              <col width="35">
              <col width="160">
              <col width="50">
              <col width="90">
              <col width="90">
              <thead>
                <tr>
                  <td colspan="3" class="tit">原订单拒检和未检</td>
                  <td colspan="2"><div class="tr c-rd f16" v-if="detail.dataMore.refundPriceSum != null">-￥{{detail.dataMore.refundPriceSum||0 | money}}</div></td>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item,index) in detail.dataMore.unexamedAndRefused" :key="index">
                  <td>{{index+1}}</td>
                  <td class="ell" :title="item.name">{{item.name}}</td>
                  <td>{{item.checkState | checkState}}</td>
                  <td><div class="tr">￥{{item.price | money}}</div></td>
                  <td>
                    <div class="tr c-rd" v-if="item.oldData !== true">
                      <span v-if="item.refundState==1">-</span>
                      ￥{{item.price | money}}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- 套餐增加项 -->
          <div v-if="detail.dataMore.addItems && detail.dataMore.addItems.length > 0">
            <table class="table brk fixed">
              <col width="35">
              <col width="210">
              <col width="90">
              <col width="90">
              <thead>
                <tr>
                  <td colspan="3" class="tit">套餐增加项目</td>
                </tr>
              </thead>
              <tbody>
                <tr :key="index" v-for="(item,index) in detail.dataMore.addItems">
                  <td>{{index+1}}</td>
                  <td class="ell" :title="item.name">{{item.name}}</td>
                  <td><div class="tr">￥{{item.originalPrice||0 | money}}</div></td>
                  <td><div class="tr">￥{{item.price | money}}</div></td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- 套餐已减项目 不显示折后价-->
          <div v-if="detail.dataMore.delItems && detail.dataMore.delItems.length > 0">
            <table class="table brk fixed">
              <thead>
                <tr>
                  <td colspan="3" class="tit">套餐已减项目</td>
                </tr>
              </thead>
              <col width="35">
              <col width="300">
              <col width="90">
              <tbody>
                <tr :key="index" v-for="(item,index) in detail.dataMore.delItems">
                    <td>{{index+1}}</td>
                    <td class="ell" :title="item.name">{{item.name}}</td>
                    <td><div class="tr">￥{{item.originalPrice||0 | money}}</div></td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- 套餐内项目 -->
          <div v-if="detail.dataMore.mealItems && detail.dataMore.mealItems.length > 0">
            <table class="table brk fixed">
              <col width="50">
              <col width="200">
              <col width="90">
              <col width="90">
              <thead>
                <tr>
                  <td colspan="3" class="tit">套餐内项目</td>
                </tr>
              </thead>
              <tbody>
                <tr :key="index" v-for="(item,index) in detail.dataMore.mealItems">
                  <td>{{index+1}}</td>
                  <td class="ell" :title="item.name">{{item.name}}</td>
                  <td><div class="tr">￥{{item.originalPrice||0 | money}}</div></td>
                  <td><div class="tr">￥{{item.price||0 | money}}</div></td>
                </tr>
              </tbody>
            </table>
          </div>

          </div>
        </Col>
        <Col class="bdr-l pl10" span="10">
          <div class="ui-order-detail-info">
            <ul class="info-tbl brk">
              <li><span class="c-3 pr5">姓名:</span><span class="c-6">{{detail.dataBase.accountRelation.name}}</span></li>
              <li><span class="c-3 pr5">性别:</span><span class="c-6">{{detail.dataBase.accountRelation.gender  | filterGender}}</span></li>
              <li><span class="c-3 pr5">年龄:</span><span class="c-6">{{detail.dataBase.accountRelation.age}}</span></li>
              <li><span class="c-3 pr5">婚否:</span><span class="c-6">{{detail.dataBase.marriageStatusLabel || '未知'}}</span></li>
              <li><span class="c-3 pr5">联系电话:</span><span class="c-6">{{detail.dataBase.accountRelation.mobile || detail.dataBase.accountRelation.initialMobile || (detail.dataBase.orderAccount && detail.dataBase.orderAccount.receiveMsgMobile) || '无'}}</span></li>
              <li><span class="c-3 pr5">地址:</span><span class="c-6">{{detail.dataBase.accountRelation.address?detail.dataBase.accountRelation.address.address : '无'}}</span></li>
            </ul>
            <ul class="info-tbl brk">
              <li><span class="c-3 pr5">套餐名:</span><span class="c-6">{{detail.dataBase.mealName || '无'}}</span></li>
              <li><span class="c-3 pr5">单位:</span><span class="c-6">{{detail.dataBase.examCompany || '无'}}</span></li>
              <li><span class="c-3 pr5">体检日期:</span><span class="c-6">{{detail.dataBase.examDate | date('yyyy-MM-dd')}} {{detail.dataBase.examTimeIntervalName}}</span></li>
              <li><span class="c-3 pr5">预约人:</span><span class="c-6">{{detail.dataBase.operator}}</span></li>
              <li><span class="c-3 pr5">体检中心:</span><span class="c-6">{{detail.dataBase.hospital.name}}</span></li>
              <!-- <li><span class="c-3 pr5">地点:</span><span class="c-6">{{detail.dataBase.hospital.name}}</span></li> -->
              <li><span class="c-3 pr5">时间备注:</span><span class="c-6">{{detail.dataBase.remark.timeRemarks || '无'}}</span></li>
              <li><span class="c-3 pr5">导引单打印:</span><span class="c-6">{{detail.dataMore.guideInfo || '无'}}</span></li>
              <li><span class="c-3 pr5">导引单备注:</span><span class="c-6">{{detail.dataBase.remark.remarks || '无'}}</span></li>
              <li><span class="c-3 pr5">订单编号:</span><span class="c-6">{{detail.dataBase.orderNum}}</span></li>
            </ul>
            <ul class="info-tbl brk">
              <li><span class="c-3 pr5">订单状态:</span><span class="c-6">{{detail.dataBase.status | status}}</span></li>
            </ul>

            <ul class="info-tbl brk">
              <li>
                <span class="c-3 pr5">手动修改日志:</span>
                <span v-if="detail.dataMore.manualRefundLog && !detail.dataMore.manualRefundLog.applyTime" class="c-6">无</span>
                <div v-if="detail.dataMore.manualRefundLog && detail.dataMore.manualRefundLog.applyTime" class="c-6 mb10">
                  <div>{{ detail.dataMore.manualRefundLog.applyTime | date('yyyy-MM-dd hh:mm:ss')}}</div>
                  <div>
                    {{detail.dataMore.manualRefundLog.operator}}手动退款{{detail.dataMore.manualRefundLog.amount | money }}元，其中{{detail.dataMore.manualRefundLog.accountAmount | money}}元退到客户账户，
                    <span v-if="detail.dataMore.manualRefundLog.afterRefundStatus === detail.dataMore.manualRefundLog.beforeRefundStatus">
                      订单状态为 "{{detail.dataMore.manualRefundLog.beforeRefundStatus | status}}"
                    </span>
                    <span v-if="detail.dataMore.manualRefundLog.afterRefundStatus !== detail.dataMore.manualRefundLog.beforeRefundStatus">
                      订单状态从 "{{detail.dataMore.manualRefundLog.beforeRefundStatus | status}}" 变成 "{{detail.dataMore.manualRefundLog.afterRefundStatus | status}}"
                    </span>
                  </div>
                  <div>备注：{{detail.dataMore.manualRefundLog.remarks || '无'}}</div>
                </div>
              </li>
            </ul>
          </div>
        </Col>
      </Row>
    </div>
  </transition>
</template>
<script>
export default {
  props: ["detail"],
  methods: {},
  filters: {
    checkState(value) {
      if (value == 1) {
        return "已检";
      } else if (value == 2) {
        return "拒检";
      } else if (value == 3) {
        return "未检";
      } else {
        return "未知";
      }
    },
    allMoney(value) {
      if (value === undefined || value === null) {
        return ''
      }
      var flag = '';
      if(value < 0){
        flag = '-';
      }
      return flag + '￥' + (Math.abs(value)/100).toFixed(2);
    }
  },
  created() {}
};
</script>
<style lang="less" scope>
.grey {
  background: #ccc;
}

.ui-order-detail-info {
  overflow-y: scroll;
}
.ui-order-detail-itemstbl {
  overflow-y: scroll;
}

.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter,
.slide-fade-leave-to {
  -webkit-transform: translateX(100%);
  transform: translateX(100%);
}

.detail-body {
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  background: #fff;
  width: 950px;
  z-index: 99;
  min-width: 400px;
  overflow: hidden;
  box-sizing: border-box;
  padding-top: 50px;
  box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.3);
  -webkit-transform: translateX(0);
  transform: translateX(0);
  // visibility: hidden;
  // transition-name: transform;
}
</style>