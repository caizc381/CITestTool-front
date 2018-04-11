<template>
  <div class="user-tab mt20">

    <span class="b">2.用户体检卡</span>
    <span v-show="dataCard.length>0">（体检卡{{page.totalCard}}张，可用余额￥{{cardTotalMoney | money}}）</span>

    <table class="table table-bordered text-center user-addborder user-tab mt10">
        <thead>
          <tr>
            <th>卡号</th>
            <th>卡名</th>
            <th>发卡机构/发卡单位</th>
            <th>发卡人/角色</th>
            <th>充值时间</th>
            <th>初始金额</th>
            <th >当前金额</th>
            <th >状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(card,index) in dataCard" :key="index">
            <td>{{card.cardNum}}</td>
            <td class="color-blue">{{card.cardName}}</td>
            <td>
                <div><Tag v-if="card.organizationType == 1" class="icon-sign" color="blue">医院</Tag>
                <Tag v-if="card.organizationType == 2" class="icon-sign" color="green">渠道</Tag>{{card.organizationName}}</div>
                <div><span v-if="card.companyType == 1">[P]</span>
                <span v-if="card.companyType == 2">[M]</span>{{card.companyName}}</div>
            </td>
            <td>{{card.managerName}}/{{card.managerRole}}</td>
            <td>{{card.rechargeTime | date('yyyy-MM-dd hh:mm:ss')}}</td>
            <td>￥{{card.capacity | money}}</td>
            <td>￥{{card.balance | money}}</td>
            <td v-if="card.status == 1 && card.capacity == card.balance"><span class="c-or">未使用</span></td>
            <td v-if="card.status == 1 && card.capacity > card.balance"><span class="c-gr">已使用</span></td>
            <td v-if="card.status == 3"><span class="c-9">金额回收</span></td>
            <td v-if="card.status == 2"><span class="c-9">已撤销</span></td>
            <td v-if="card.status == 0"><span class="c-9">不可用</span></td>
            <td>
              <div class="lh30 tc" v-if="card.hospitalSettlementStatus == 1 || card.hospitalSettlementStatus == 3">
                <a class="mr5" v-if="(card.status == 1 && card.capacity == card.balance) || (card.status == 1 && card.capacity > card.balance) || card.status == 3"  @click="revokeCard(card)">撤销发卡</a>
                <a  class="mr5" v-if="(card.status == 1 && card.capacity == card.balance) || (card.status == 1 && card.capacity > card.balance)" @click="recoverBalance(card)">金额收回</a>
              </div>
            </td>
          </tr>
        </tbody>
    </table>
    <div class="tc mt10 mb20" v-show="dataCard.length===0">当前列表的数据为空</div>

    <Modal
        v-model="modal1"
        title="提示"
        @on-ok="revokeCardFuc">
        <p>确定要撤销该卡吗？</p>
    </Modal>
    <Modal
        v-model="modal2"
        title="提示"
        @on-ok="recoverBalanceFuc">
        <p>确定要回收金额吗？</p>
    </Modal>

  </div>
</template>
<script>
export default {
  props: ["dataCard", "page", "cardTotalMoney", "currentUser"],
  data() {
    return {
      modal1: false,
      modal2: false,
      dataUse: {} //用于储存点击的列数据
    };
  },
  methods: {
    revokeCard(card) {
      this.modal1 = true;
      this.dataUse = card;
    },
    recoverBalance(card) {
      this.modal2 = true;
      this.dataUse = card;
    },
    revokeCardFuc() {
      let pagram = {
        card: this.dataUse,
        account: {
          name: this.currentUser.name
        }
      };
      this.$http.post("/revokeCard", pagram, { emulateJSON: false }).then(
        res => {
          this.$Message.success("操作成功！");
          this.$parent.getDataListCard();
        },
        res => {
          this.$Message.error(res.text);
        }
      );
    },
    recoverBalanceFuc() {
      let pagram = {
        card: this.dataUse,
        account: {
          name: this.currentUser.name
        }
      };
      this.$http.post("/recoverBalance", pagram, { emulateJSON: false }).then(
        res => {
          this.$Message.success("操作成功！");
          this.$parent.getDataListCard();
        },
        res => {
          this.$Message.error(res.text);
        }
      );
    }
  }
};
</script>