<template>
  <div>
    <div class="user-tab mt20">

        <span class="b">3.用户订单</span>

        <table class="table table-bordered text-center user-addborder user-tab mt10">
            <thead>
              <tr>
                <th>体检时间</th>
                <th>体检人</th>
                <th>体检中心/体检单位</th>
                <th>渠道/渠道单位</th>
                <th>客户经理</th>
                <th>订单状态</th>
                <th>订单金额</th>
                <th>线上自付</th>
                <th>现场自付</th>
                <th>预约人</th>
                <th>下单时间</th>
                <th>套餐名称</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(order,index) in dataOrder" :key="index">
               <td :title="order.examDate | date('yyyy-MM-dd')">
                    <span>
                        {{order.examDate | date('yyyy-MM-dd')}} {{order.examTimeIntervalName}}
                    </span>
                </td>
                <td class="color-blue">{{order.accountRelation.name}}</td>
                <td :title="order.hospital.name + ''+order.examCompany">
                  <span class="ho-ellipsis">
                      {{order.hospital.name}}
                      <br>
                      {{order.examCompany}}
                  </span>
                </td>
                <td>
                  <span class="ho-ellipsis" v-if="order.channel && order.channelCompany">
                      {{order.channel.name}}
                      <br>
                      <span v-if="order.channelCompany && order.channelCompany.platformCompanyId == 3">[M]</span>
                      <span v-if="order.channel&& order.channelCompany && !(order.channelCompany.platformCompanyId == 3 || order.channelCompany.platformCompanyId == 4 || order.channelCompany.platformCompanyId == 5)">[P]</span>
                      {{order.channelCompany.name}}
                  </span>
                  <span v-if="!order.channel">-</span>
                </td>
                <td>
                    {{order.manager}}
                </td>
                <td>
                  <span :class="{'c-gr':order.status == 1 || order.status == 2 || order.status == 3, 'c-rd':order.status == 10 || (order.isExport && order.status == 2),'c-or':order.status == 0 || order.status == 7 || order.status == 9 || order.status == 11,'c-9':order.status == 5 || order.status == 6 || order.status == 8}">
                    {{order.status | status}}
                    <span v-if="order.refundScene === 5">(手动)</span>
                  </span>
                </td>                
                <td>
                    <span>￥{{(order.orderPrice/100).toFixed(2)}}</span>
                </td>
                <td>
                   <span>￥{{order.selfMoney}}</span>
                </td>
                <td>
                   <span>￥{{order.offlinePayMoney}}</span>
                </td>
                <td>
                   {{order.operator}}
                </td>
                <td>{{order.insertTime | date('yyyy-MM-dd hh:mm:ss')}}</td>
                <td>{{order.mealName}}</td>
                <td>
                  <div class="lh30">
                    <a class="mr5" @click="showOrderDetail(order)">查看</a>
                    <a v-if="(!order.isExport && order.status==2) || order.status==1 || order.status == 11" class="mr5" @click="changeExamDate(order)">改期</a>
                    <span v-if="!(order.hasSettlementOpen && [2,4,5].indexOf(order.settleSign)>-1)">
                      <a v-if="order.status==0 || order.status == 1 || (!order.isExport && order.status==2) || order.status == 7 || order.status == 11" class="mr5" @click="revokeSingleOrder(order)">撤销</a>
                    </span>
                    <a v-if="order.status==10 || order.isExport" class="mr5" @click="changeSingleToNoExport(order)">恢复未导</a>
                    <a class="mr5" v-if="!order.isExport && order.status==2" @click="batchExportOrder(order)">导出到内网</a>
                  </div>
                </td>
              </tr>
            </tbody>
        </table>
            <div class="tc mt10 mb20" v-show="dataOrder.length===0">当前列表的数据为空</div>

    </div>

    <Detail :detail="detail"/>

    <Modal
        v-model="modalChangeDate"
        title="改期"
        width="80%">
        <p>已选 1 人</p>
      <ChangeDate v-if="modalChangeDate" :data="changeDateData" ref="changeDate"/>
      <div slot="footer">
        <Button type="ghost" @click="modalChangeDate=false">取消</Button>
        <Button type="primary" @click="closeModal">确定</Button>
      </div>
    </Modal>

    <Modal
        v-model="modal3"
        title="提示"
        @on-ok="revokeSingleOrderFuc">
        <p>确认撤销这 1 个订单吗？</p>
        <Checkbox v-model="checkedRevole3">发送撤单短信</Checkbox>
    </Modal>

    <Modal
        v-model="modal4"
        title="立即恢复订单"
        @on-ok="changeSingleToNoExportFuc">
        <p>{{megExport}}</p>
    </Modal>

    <!--modal框部分-->
    <Modal
        v-model="modal5"
        title="立即导出订单"
        @on-ok="batchExportOrderFuc">
        <p>你将导出 1  个订单</p>
    </Modal>

  </div>
</template>
<script>
import Detail from "./../order/detail";
import ChangeDate from "./../order/changeDate";
export default {
  props: ["dataOrder", "currentUser"],
  components: {
    Detail: Detail,
    ChangeDate: ChangeDate
  },
  data() {
    return {
      dataUse: {}, //选中的数据

      detail: {
        //查看详情
        modal: false,
        dataBase: [], //列表取
        dataMore: [] //远程取
      },

      modalChangeDate: false, //改期模态框
      changeDateData: [], //改期模态框

      modal3: false, //3代表撤销
      checkedRevole3: false,

      modal4: false,//4代表回复未导
      megExport: '',

      modal5: false //5代表导出到内网功能
    };
  },
  methods: {
    //订单列表操作
    //查看详情
    showOrderDetail(data) {
      this.detail.dataBase = data;
      this.$http.get("/orderDetail?orderId=" + data.id).then(
        res => {
          let dataBe = res.data;
          dataBe.mealItems = [];
          dataBe.addItems = [];
          dataBe.delItems = [];
          for (let itemId in dataBe.itemSnap) {
            let item = dataBe.itemSnap[itemId];
            if (item.typeToMeal == 1) {
              dataBe.mealItems.push(item);
            } else if (item.typeToMeal == 2) {
              dataBe.delItems.push(item);
            } else if (item.typeToMeal == 3) {
              dataBe.addItems.push(item);
            }
          }

          let { refundItemsClassifySnap = [] } = dataBe;

            // {} => []
            refundItemsClassifySnap = Object.keys(
              refundItemsClassifySnap || []
            ).map(v => refundItemsClassifySnap[v]);

            // 分类
            const res2 = _.groupBy(refundItemsClassifySnap, "addExam");

            // 加项、拒检&未检
            dataBe.addExams = res2["true"] || [];
            dataBe.unexamedAndRefused = res2["false"] || [];

            // 新的拒检未检没有，老的数据有 【TODO: 修正老数据】
            const hasUnexamedItems = Array.isArray(dataBe.unexamedItemsDetail);
            const hasRefusedItems = Array.isArray(dataBe.refusedItemsDetail);
            const hasLocalItems = Array.isArray(dataBe.locale);

            const addCheckState = (arr, state) => {
              return arr.map(v => {
                return (
                  (v.oldData = true),
                  (v.checkState = state),
                  (v.originalPrice = v.price),
                  v
                );
              });
            };

            if (
              !dataBe.unexamedAndRefused.length &&
              (hasUnexamedItems || hasRefusedItems)
            ) {
              // 未检
              if (hasUnexamedItems) {
                dataBe.unexamedAndRefused = addCheckState(
                  dataBe.unexamedItemsDetail,
                  3
                );
              }

              // 拒检
              if (hasRefusedItems) {
                dataBe.unexamedAndRefused = dataBe.unexamedAndRefused.concat(
                  addCheckState(dataBe.refusedItemsDetail, 2)
                );
              }
            }

            // 现场加项
            if (!dataBe.addExams.length && hasLocalItems) {
              dataBe.addExams = addCheckState(dataBe.locale, 1);
            }
            //结束

          this.detail.dataMore = dataBe;
          this.detail.modal = true;
        },
        res => {
          this.$Message.error(res.text);
        }
      );
    },

    //改期
    changeExamDate(data) {
      this.changeDateData = data;
      this.modalChangeDate = true;
      this.$nextTick(() => {
        this.$refs.changeDate.changeExamDate(data);
      });
    },
    closeModal() {
      this.$refs.changeDate.changeExamFuc();
    },

    //撤销
    revokeSingleOrder(data) {
      this.dataUse = data;
      this.modal3 = true;
    },
    revokeSingleOrderFuc() {
      let a = [];
      a.push(this.dataUse.id);
      let pagram = {
        orderIds: a
      };
      if (this.checkedRevole3) {
        pagram.sendMsg = true;
      }
      this.$http.post("/revokeorder", pagram).then(
        res => {
          this.$Message.success("操作成功！");
          this.$parent.getDataListOrder();
        },
        res => {
          this.$Message.error(res.text);
        }
      );
    },

    //恢复导出
    changeSingleToNoExport(data) {
      this.dataUse = data;
      let pagram = {};
      let a = [];
      a.push(this.dataUse.id);
      pagram.orderIds = JSON.stringify(a);
      pagram.hospitalId = this.dataUse.hospital.id;

      this.$http.post("/getOrderCanUnexport", pagram).then(
        res => {
            if (res.data.exportedNum === 0 && res.data.exportFailedNum === 0) {
              this.$Message.error({
                content: "没有需要操作的订单",
                duration: 10,
                closable: true
              });
            } else {
              if(res.data.exportedNum != 0) {
                this.megExport = '有 1 个已导出的订单'
              }else {
                this.megExport = '有 1 个导出错误的订单'
              }
              this.modal4 = true;
            }
        },
        res => {
          this.$Message.info({
            content: "Tips for manual closing",
            duration: 10,
            closable: true
          });
        }
      );
    },
    changeSingleToNoExportFuc () {
      let pagram = {};
      let a = [];
      a.push(this.dataUse.id);
      pagram.orderIds = JSON.stringify(a);
      pagram.hospitalId = this.dataUse.hospital.id;
      this.$http.post("/batchChangeOrderToUnExport", pagram).then(
        res => {
          this.$Message.success("操作成功");
          this.$parent.getDataListOrder();
        },
        res => {
          this.$Message.error(res.text);
        }
      );
    },

    //导出到内网
    batchExportOrder(data) {
      this.dataUse = data;
      let a = [];
      a.push(this.dataUse.id);
      let pagram = {
        hospitalId: this.dataUse.hospital.id,
        orderIds: JSON.stringify(a)
      };
      this.$http.post("/getOrderCanExport", pagram).then(
        res => {
          if (res.data.num > 0) {
            this.modal5 = true;
          } else {
            this.$Message.error("没有可导数据！");
          }
        },
        res => {
          this.$Message.error(res.text);
        }
      );
    },
    batchExportOrderFuc() {
      let a = [];
      a.push(this.dataUse.id);
      let pagram = {
        hospitalId: this.dataUse.hospital.id,
        orderIds: JSON.stringify(a)
      };
      this.$http.post("/batchExportOrder", pagram).then(
        res => {
          this.$Message.success("操作成功！");
          this.$parent.getDataListOrder();
        },
        res => {
          this.$Message.error(res.text);
        }
      );
    }
  }
};
</script>