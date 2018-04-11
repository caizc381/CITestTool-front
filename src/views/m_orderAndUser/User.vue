<template>
<div>
  <div class="header-search">
    <Input style="width: 250px;" icon="search" @on-keyup.enter="search" v-model="keyword" placeholder="输入姓名/身份证/手机号码" @on-click="search" />
  </div>

  <div class="body-content">

    <div class="user-tab">

        <span class="b">1.用户列表</span>

        <div class="user-tab-head">
          <div class="user-tab-th">客户名称</div>
          <div class="user-tab-th" style="width:15%">身份证号</div>
          <div class="user-tab-th" style="width:10%">联系方式</div>
          <div class="user-tab-th">性别</div>
          <div class="user-tab-th">年龄</div>
          <div class="user-tab-th">账户余额</div>
          <div class="user-tab-th" style="width:10%">登录账号</div>
          <div class="user-tab-th" style="width:15%">来源</div>
          <div class="user-tab-th" style="width:20%">操作</div>
        </div>

        <div class="user-tab-body">
          <div v-for="item in userList" :key="item.idCard" :class="{'focus-group': item.idCard == selectIdCard}" @click="selectIdCard = item.idCard">
            <div class="user-tab-tr" :key="user.rowId" v-for="user in item.groupList" :class="{'bg-f5': user.rowId === selectRowId}" @click="selectUser(user)">
              <div class="user-tab-td ell" :title="user.name">{{user.name}}</div>
              <div class="user-tab-td" style="width:15%">{{user.idCard}}</div>
              <div class="user-tab-td" style="width:10%">{{user.mobile}}<span class="c-rd" style="padding-left:2px;" v-if="user.mobile && !user.isStandardMobile">!</span></div>
              <div class="user-tab-td">{{user.gender | filterGender}}</div>
              <div class="user-tab-td">{{user.age}}</div>
              <div class="user-tab-td">{{user.balance | money('￥')}}</div>
              <div class="user-tab-td" style="width:10%" :title="user.loginName">
                <div class="ellipsis" v-if="user.mainType == 2">{{user.loginName}}</div>
              </div>
              <div class="user-tab-td" style="width:15%">
                <div>
                  <Tag v-if="user.tagName" :color="user.tagColor">{{user.tagName}}</Tag>{{user.source}}<br/>
                  <span class="c-9">{{user.companyName}}</span>
                </div>
              </div>
              <div class="user-tab-td lh30" style="text-align: left;width:20%">
                <span v-if="!user.tagName">
                  <a class="mr5" @click="edit(user,1)">查看</a>
                  <a class="mr5" @click="reset(user,1)">重置密码</a>
                  <a class="mr5" @click="reset(user,0)">密码6个1</a>
                </span>
                <span v-else>
                  <a class="mr5" @click="edit(user,0)">查看/修改</a>
                </span>
              </div>
            </div>
          </div>

          <div class="user-tab-tr suspend" :style="styles">
            <div class="user-tab-td">{{currentUser.name}}</div>
            <div class="user-tab-td" style="width:15%">{{currentUser.idCard}}</div>
            <div class="user-tab-td" style="width:10%">{{currentUser.mobile}}<span class="c-rd" style="padding-left:2px;" v-if="currentUser.mobile && !currentUser.isStandardMobile">!</span></div>
            <div class="user-tab-td">{{currentUser.gender | filterGender}}</div>
            <div class="user-tab-td">{{currentUser.age}}</div>
            <div class="user-tab-td">{{currentUser.balance | money('￥')}}</div>
            <div class="user-tab-td" style="width:10%" :title="currentUser.loginName">
              <div class="ellipsis" v-if="currentUser.mainType == 2">{{currentUser.loginName}}</div>
            </div>
            <div class="user-tab-td" style="width:15%">
              <div>
                <Tag v-if="currentUser.tagName" :color="currentUser.tagColor">{{currentUser.tagName}}</Tag>{{currentUser.source}}<br/>
                <span class="c-9">{{currentUser.companyName}}</span>
              </div>
            </div>
            <div class="user-tab-td lh30" style="text-align: left;width:20%">
                <span v-if="!currentUser.tagName">
                  <a class="mr5" @click="edit(currentUser,1)">查看</a>
                  <a class="mr5" @click="reset(currentUser,0)">密码6个1</a>
                </span>
                <span v-else>
                  <a class="mr5" @click="edit(currentUser,0)">查看/修改</a>
                </span>
              </div>
          </div>

        </div>

        <div class="tc mt10 mb20" v-show="userList.length===0">当前列表的数据为空</div>

    </div>

    <Modal
        v-model="operate.modal1"
        title="信息修改"
        width="50%">
         <Form  :label-width="80" inline v-if="operate.modal1">
            <FormItem label="姓名：" style="width:29%">
                <Input v-model="operate.data.name" />
            </FormItem>
            <FormItem label="性别：" style="width:29%">
                <Select v-model="operate.data.gender" disabled>
                    <Option :value="Number(0)">男</Option>
                    <Option :value="Number(1)">女</Option>
                </Select>
            </FormItem>
            <FormItem label="身份证号：" style="width:29%">
                <Input v-model="operate.data.idCard" disabled />
            </FormItem>
            <FormItem label="手机号：" style="width:29%">
                <Input v-model="operate.data.mobile" />
            </FormItem>
            <FormItem label="员工号：" style="width:29%">
                <Input v-model="operate.data.employeeId" disabled />
            </FormItem>
            <FormItem label="年龄：" style="width:29%">
                <Input v-model="operate.data.age" />
            </FormItem>
            <FormItem label="婚否：" style="width:29%">
                <Select v-model="operate.data.marriageStatus">
                    <Option :value="Number(1)">已婚</Option>
                    <Option :value="Number(0)">未婚</Option>
                </Select>
            </FormItem>
            <FormItem label="登录名：" style="width:29%">
                <Input v-model="operate.data.loginName" disabled />
            </FormItem>
         </Form>
         <span class="c-rd ml20">{{errMessege}}</span>
        <div slot="footer">
            <Button v-show="operate.type" type="primary" @click="editFuc">确定</Button>
            <Button type="ghost" @click="operate.modal1=false">取消</Button>
        </div>
    </Modal>
    <Modal
        v-model="operate.modal2"
        title="提示"
        @on-ok="resetFuc">
        <p>确定重置密码</p>
    </Modal>

    <!--card/order列表-->
    <Card :dataCard='dataCard' :cardTotalMoney='cardTotalMoney' :page="page" :currentUser='currentUser'/>

    <div class="mt20 mb20 tc" v-if="page.totalCard>0">
        <Page 
          :total="page.totalCard"
          :current="page.currentPageCard"
          :page-size="page.pageSizeCard"
          @on-change="changePageCard"
          @on-page-size-change="changeSizeCard"
          :page-size-opts="page.sizeOps"
          show-total
          show-sizer></Page>
    </div>

    <Order :dataOrder='dataOrder' :currentUser='currentUser'/>

    <div class="mt20 mb20 tc" v-if="page.totalOrder>0">
        <Page 
          :total="page.totalOrder"
          :current="page.currentPageOrder"
          :page-size="page.pageSizeOrder"
          @on-change="changePageOrder"
          @on-page-size-change="changeSizeOrder"
          :page-size-opts="page.sizeOps"
          show-total
          show-sizer></Page>
    </div>
  </div>

</div>

</template>

<script>
import _ from "lodash";
import Card from "./user/card";
import Order from "./user/order";
function getScroll(target, top) {
  const prop = top ? "pageYOffset" : "pageXOffset";
  const method = top ? "scrollTop" : "scrollLeft";

  let ret = target[prop];

  if (typeof ret !== "number") {
    ret = window.document.documentElement[method];
  }

  return ret;
}

function getOffset(element) {
  const rect = element.getBoundingClientRect();

  const scrollTop = getScroll(window, true);
  const scrollLeft = getScroll(window);

  const docEl = window.document.body;
  const clientTop = docEl.clientTop || 0;
  const clientLeft = docEl.clientLeft || 0;

  return {
    top: rect.top + scrollTop - clientTop,
    left: rect.left + scrollLeft - clientLeft
  };
}

export default {
  name: "UserManagement",
  components: {
    Card: Card,
    Order: Order
  },

  data() {
    return {
      keyword: "",
      userList: [],
      selectIdCard: "",
      selectRowId: "",
      styles: {
        top: "-80px",
        position: "fixed"
      },
      currentUser: {}, //用户列表选中数据

      operate: {
        //用户列表操作
        type: false, //操控是否修改，或简单密码,true密码简单、可以修改
        modal1: false,
        modal2: false,
        data: {} //选中data
      },

      page: {
        //分页数据，三组，对应三组
        rowCount: -1,
        currentPage: 1,
        pageSize: 5,
        total: 0,

        rowCountCard: -1,
        currentPageCard: 1,
        pageSizeCard: 5,
        totalCard: 0,

        rowCountOrder: -1,
        currentPageOrder: 1,
        pageSizeOrder: 5,
        totalOrder: 0,

        sizeOps: [5, 10, 20, 50] //分页size配置
      },

      //card表格数据
      dataCard: [],
      cardTotalMoney: 0,

      //订单数据
      dataOrder: [],
      errMessege: ""
    };
  },

  watch: {
    currentUser() {
      this.getDataListCard();
      this.getDataListOrder();
    }
  },

  methods: {
    selectUser(user) {
      if(this.currentUser == user) {
        return
      }
      this.clearPage()
      this.selectRowId = user.rowId;
      this.currentUser = user;
      this.handleScroll();
    },

    clearPage () {
      this.page.totalOrder = 0
      this.page.totalCard = 0
      this.page.pageSizeCard = 5
      this.page.pageSizeOrder = 5
      this.page.currentPageOrder = 1
      this.page.currentPageCard = 1
    },

    search() {
      this.clearPage()
      this.getUserList()
    },

    getUserList() {
      this.dataCard = [];
      this.dataOrder = [];
      this.page.totalCard = 0;
      this.page.totalOrder = 0;
      var name = "";
      var mobile = "";
      var idCard = "";

      if (MyUtil.isMobile(this.keyword)) {
        mobile = this.keyword;
      } else if (MyUtil.isIdCard(this.keyword)) {
        idCard = this.keyword;
      } else {
        name = this.keyword;
      }
      let url =
        "/accountManagePageInfo?rowCount=" +
        this.page.rowCount +
        "&currentPage=" +
        this.page.currentPage +
        "&pageSize=" +
        this.page.pageSize +
        "&name=" +
        name +
        "&mobile=" +
        mobile +
        "&idCard=" +
        idCard;
      this.$http.get(url).then(
        res => {
          this.userList = this.filterList(res.body);
          if (this.userList.length==0) {
            return false
          }
          this.selectIdCard = this.userList[0].groupList[0].idCard
          this.selectUser(this.userList[0].groupList[0])
          this.getDataListCard();
          this.getDataListOrder();
        },
        err => this.$Message.error(err.text)
      );
    },

    filterList(list = []) {
      var finalList = {};

      list.forEach((item, idx) => {
        item.rowId = idx;
        item = this.parseAttr(item);
        let exist = finalList[item.idCard];
        if (exist) {
          finalList[item.idCard].groupList.push(item);
        } else {
          finalList[item.idCard] = { idCard: item.idCard, groupList: [item] };
        }
      });

      return _.map(finalList);
    },

    parseAttr(item) {
      if (item.accountSourceType == "H") {
        item.tagColor = "blue";
        item.tagName = "医院";
      } else if (item.accountSourceType == "Q") {
        item.tagColor = "green";
        item.tagName = "渠道";
      }
      return item;
    },

    handleScroll() {
      let target = this.$el.getElementsByClassName("user-tab-tr bg-f5")[0];
      if (!target) {
        return;
      }
      const scrollTop = getScroll(window, true);
      const elOffset = getOffset(target);
      const windowHeight = window.innerHeight;
      const elHeight = target.offsetHeight;
      // Fixed Top
      if (elOffset.top - 50 < scrollTop) {
        this.styles = {
          top: "50px",
          left: `${elOffset.left}px`,
          width: `${target.offsetWidth}px`,
          position: "fixed"
        };
      } else if (elOffset.top - 50 > scrollTop) {
        this.styles = {
          top: "-80px",
          position: "fixed"
        };
      }
    },

    //用户列表操作
    edit(data, type) {
      this.operate.modal1 = true;
      this.operate.data = JSON.parse(JSON.stringify(data));
      if (type === 1) {
        this.operate.type = false;
      } else {
        this.operate.type = true;
      }
      this.errMessege = "";
    },
    reset(data, type) {
      this.operate.modal2 = true;
      this.operate.data = data;
      if (type === 1) {
        this.operate.type = false;
      } else {
        this.operate.type = true;
      }
    },
    editFuc() {
      if (this.operate.data.mobile == "" || !this.operate.data.mobile) {
        
      }else {
        if (!MyUtil.isMobile(this.operate.data.mobile)) {
          this.errMessege = "手机号码格式不正确！";
          return;
        }
      }

      var patrn = /^[0-9]*$/;
      if (!patrn.test(this.operate.data.age) || this.operate.data.age > 120) {
        this.errMessege = "年龄格式错误！";
        return;
      }
      if (this.operate.data.name == "") {
        this.errMessege = "姓名必填";
        return;
      }
      this.$http
        .post("/updateAccount", this.operate.data, { emulateJSON: false })
        .then(
          res => {
            this.$Message.success("操作成功");
            this.operate.modal1 = false;
            this.getUserList();
          },
          res => {
            this.$Message.error(res.text);
          }
        );
    },
    resetFuc() {
      let pagram = {
        accountId: this.operate.data.id
      };
      if (this.operate.type) {
        pagram.simplePasswd = true;
      }
      this.$http.post("/account/resetPwd", pagram).then(
        res => {
          this.$Message.success("操作成功");
        },
        res => {
          this.$Message.error(res.text);
        }
      );
    },

    //分页，Card代表体验卡，3代表订单
    changePageCard(currentPage) {
      this.page.currentPageCard = currentPage;
      this.getDataListCard();
    },
    changeSizeCard(size) {
      this.page.pageSizeCard = size;
      this.getDataListCard();
    },

    changePageOrder(currentPage) {
      this.page.currentPageOrder = currentPage;
      this.getDataListOrder();
    },
    changeSizeOrder(size) {
      this.page.pageSizeOrder = size;
      this.getDataListOrder();
    },

    //获取体验卡列表
    getDataListCard() {
      let url =
        "/card?rowCount=" +
        this.page.rowCountCard +
        "&currentPage=" +
        this.page.currentPageCard +
        "&pageSize=" +
        this.page.pageSizeCard +
        "&accountId=" +
        this.currentUser.id;
      this.$http.get(url).then(res => {
        this.dataCard = res.data.cardList.records;
        this.page.totalCard = res.data.totalCard;
        this.cardTotalMoney = res.data.cardTotalMoney;
      });
    },

    //获取订单列表
    getDataListOrder() {
      //默认参数
      let arr = []
      arr.push(this.currentUser.id)
      let pagram = {
        accountIds: arr,
        page: {
          currentPage: this.page.currentPageOrder,
          pageSize: this.page.pageSizeOrder,
          rowCount: this.page.rowCountOrder
        }        
      };

      let url = "/queryOrder";

      this.$http.post(url, pagram,{ emulateJSON: false }).then(
        res => {
          let dataBe = res.data.records;
          //处理格式，详情页面使用
          for (let a of dataBe) {
            if (a.remark && typeof a.remark == "string") {
              a.remark = JSON.parse(a.remark);
              if (a.remark.remarks == "null") {
                a.remark.remarks = "";
              }
              if (a.remark.timeRemarks == "null") {
                a.remark.timeRemarks = "";
              }
            }
            if (!a.remark) {
              a.remark = {};
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

          this.dataOrder = dataBe;
          this.page.totalOrder = res.data.page.rowCount;
        },
        res => {
          this.$Message.error(res.text);
        }
      );
    }
  },

  computed: {},

  mounted() {
    window.addEventListener("scroll", this.handleScroll, false);
  },

  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll, false);
  }
};
</script>

<style lang="less" scoped>
.user-tab {
  width: 100%;
}
.user-tab-head {
  display: flex;
  width: 100%;
  background-color: #eef1f6;
}
.user-tab-body {
  border-left: 1px solid #dfe6ec;
  border-right: 1px solid #dfe6ec;
  border-bottom: 1px solid #dfe6ec;
}
.user-tab-th {
  width: 7.5%;
  text-align: left;
  vertical-align: middle;
  padding: 8px 8px 8px 15px;
  height: 40px;
  line-height: 25px;
  color: #333;
  font-size: 14px;
}
.user-tab-tr {
  display: flex;
  width: 100%;
  border-top: 1px solid #dfe6ec;
  cursor: pointer;
}
.user-tab-td {
  width: 7.5%;
  text-align: left;
  vertical-align: middle;
  padding: 8px 8px 8px 15px;
  color: #666;
  font-size: 14px;
  margin: auto;
}
.user-select-tr {
  border: 1px solid #20a1ff;
}
.user-select-td {
  border-left: 2px solid #20a1ff;
  background-color: #eef2f6;
}
.focus-group {
  border: 1px solid #0b9eff;
}
.suspend {
  top: -60px;
  background: #f5f5f5;
}
</style>
