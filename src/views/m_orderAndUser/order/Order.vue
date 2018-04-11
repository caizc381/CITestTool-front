<template>
  <div>
    <Row class="header-search">
        <i-col span="12">
          <Select v-model="search.dateType" style="width:100px">
              <Option v-for="item in search.dateTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          <DatePicker 
            @on-change="dateChange"
            type="daterange" 
            :value='search.dataTime'
            placement="bottom-start" 
            placeholder="请选择时间范围"
            :options="search.dateOption" 
            style="width: 200px"></DatePicker>
          <Button type="primary" @click="searchFuc">确定</Button>          
        </i-col>
        <i-col span="10">
          <i-col span="24">
            <i-col span="4" class="pl5">
              <span class="dlb h32 lh32">体检中心：</span>
            </i-col>
            <i-col span="8">
              <mt-select
                v-model="search.hospitalId"
                :options="search.select1"
                placeholder="请选择"
                @on-change="chooseSelect1"
                @on-clear="clearSelect(1)"
                :filters="['name', 'pinYin']"></mt-select>
            </i-col>
            <i-col span="4" class="pl5">
              <span class="dlb h32 lh32">体检单位：</span>
            </i-col>
            <i-col span="8">
              <mt-select
                v-model="search.examCompanyId"
                :options="search.select2"
                placeholder="请选择"
                :disabled="search.hospitalId===''"              
                @on-change="chooseSelect2"
                @on-clear="clearSelect(2)"
                :filters="['name', 'pinyin']"></mt-select>
            </i-col>
          </i-col>
          <i-col span="24">
            <i-col span="4" class="pl5">
              <span class="dlb h32 lh32">渠道：</span>
            </i-col>
            <i-col span="8">
              <mt-select
                v-model="search.fromSite"
                :options="search.select3"
                placeholder="请选择"
                @on-change="chooseSelect3"
                @on-clear="clearSelect(3)"
              :filters="['name', 'pinYin']"></mt-select>
            </i-col>
            <i-col span="4" class="pl5">
               <span class="dlb h32 lh32">渠道单位：</span>
            </i-col>
            <i-col span="8">
              <mt-select
                v-model="search.channelCompanyId"
                :options="search.select4"
                placeholder="请选择"
                :disabled="search.fromSite==='' || search.fromSite<0"
                @on-change="chooseSelect4"
                @on-clear="clearSelect(4)"
                :filters="['name', 'pinyin']"></mt-select>
            </i-col>
          </i-col>
        </i-col>
        <i-col span="2">
          <a class="infofont db mt40" @click="clearSelect(0)">清空所有筛选</a>
        </i-col>
    </Row>

    <Row class="body-content">
      <i-col span="12">
        <Checkbox
            :indeterminate="operate.cancelData.length>0"
            :value="operate.checkAll"
            @click.prevent.native="handleCheckAll">全选</Checkbox>
        <span>已选 <strong>{{operate.data.length>0?(operate.data.length - operate.cancelData.length):operate.curCheckedData.length}}</strong> 项</span>
        <Checkbox v-model="search.showExportable" v-show="search.hospitalId!=='' && !operate.dockDegree" @on-change="getDataList">仅显示可导</Checkbox>
      </i-col>

      <!--操作按钮，有hospitalid才显示 -->
      <i-col span="12" class="tr">
        <Button type="ghost" @click="sendMegButton" v-show="search.hospitalId!=''">发送短信</Button>
        <Button type="ghost" @click="revokeButton" v-show="search.hospitalId!='' || search.fromSite!=''">撤销</Button>
        <Button type="ghost" @click="exportView" v-show="search.hospitalId!='' || search.fromSite!=''">导出查看</Button>
        <Button type="ghost" @click="batchExportOrder" v-show="search.hospitalId!='' && operate.dockDegree">导出到体检软件</Button>
        <Button type="ghost" @click="exportXls" v-show="search.hospitalId!='' && !operate.dockDegree">导出为xls</Button>
        <Button type="ghost" @click="restoreExport" v-show="search.hospitalId!=''">恢复未导</Button>
      </i-col>

      <!--表格内部的筛选条件展示区域-->
      <i-col span="24" class="mt10 ml20" 
        v-show="data.gender!=='' || data.orderStatuses.length>0 || data.isSelfMoneyZero!=='' || data.isOfflinePayMoneyZero!==''">
        <span>筛选条件：</span>

        <span v-show="data.gender!==''" class="ops-query mr5 ml10">
          <span>性别：{{data.gender == 0 ? "男" : "女"}}</span>
          <Icon type="close" @click.native.stop="clearStatus('gender')"></Icon>
        </span>

        <span v-show="data.orderStatuses.length>0" class="ops-query mr5 ml10">
          <span>订单状态：
            <label v-for="(itemsss,index) in data.orderStatuses" :key="index">
              <span> {{itemsss | status}}</span>
            </label>
          </span>
          
          <Icon type="close" @click.native.stop="clearStatus('orderStatuses')"></Icon>
        </span>

        <span v-show="data.isSelfMoneyZero!==''" class="ops-query mr5 ml10">
          <span>线上自付：{{data.isSelfMoneyZero? "等于0" : "大于0"}}</span>
          <Icon type="close" @click.native.stop="clearStatus('isSelfMoneyZero')"></Icon>
        </span>

        <span v-show="data.isOfflinePayMoneyZero!==''" class="ops-query mr5 ml10">
          <span>现场应付：{{data.isOfflinePayMoneyZero? "等于0" : "大于0"}}</span>
          <Icon type="close" @click.native.stop="clearStatus('isOfflinePayMoneyZero')"></Icon>
        </span>

        <a @click="clearStatus('all')">清空</a>
      </i-col>
    </Row>
    
    <Table 
      ref="selection"
      :columns="data.columns" 
      :data="data.list"
      @on-row-click="showOrderDetails"
      @on-row-dblclick="showOrderDetail"
      @on-selection-change="dataCheckChange"></Table>

    <!--分页-->
    <Row>
      <i-col span="24"  class="page-wrap">
        <Page 
          :total="page.pageTotal"
          :current="page.currentPage"
          :page-size="page.pageSize"
          @on-change="changePage"
          @on-page-size-change="changeSize"
          show-total
          show-sizer></Page>
      </i-col>
    </Row>

    <!--弹出框，短信-->
    <Modal
        v-model="operate.modal1"
        :title="'发送短信 已选'+ checkedData.length +'人'"
        @on-ok="sendMeg">
        <span>短信内容</span>
        <Input v-model="operate.msg" type="textarea" :rows="4" />
    </Modal>

    <!--弹出框，撤销-->
    <Modal
        v-model="operate.modal2"
        title="提示"
        @on-ok="revoke">
        <p class="c-rd" v-show="operate.revoke.people">{{operate.revoke.people}} 的订单已经导出到体检中心，因CRM无权限进入内网，此处撤单后还需内网删除此订单</p>
        <p>确认撤销这{{operate.modalSin==''?checkedData.length:1}}个订单吗？</p>
        <Checkbox v-model="operate.checkedRevole">发送撤单短信</Checkbox>
    </Modal>

    <!--弹出框，导出到体检中心-->
    <Modal
        v-model="operate.batchExport.modal"
        title="立即导出订单"
        @on-ok="batchExportOrderFuc">
        <p>你将导出 {{operate.batchExport.order.length}} 个订单</p>
    </Modal>

    <!--弹出框，导出为xls-->
    <Modal
        v-model="operate.modal4"
        title="导出转换"
        width="90%">
        <table class="table table-bordered table-grey">
          <thead>
            <tr>
                <th>姓名</th>
                <th>性别</th>
                <th>身份证号</th>
                <th>手机号码</th>
                <th>体检单位</th>
                <th>部门</th>
                <th>职级</th>
                <th>挂账单位</th>
                <th>介绍人</th>
                <th>订单金额</th>
                <th>自付金额</th>
                <th>退休</th>
                <th>保健号</th>
                <th>套餐名</th>
                <th>项目集合</th>
                <th>支付方式</th>
            </tr>
          </thead>
        </table>
        <div style="max-height:500px;overflowY:scroll;">
          <table class="table table-bordered table-grey">
            <tbody>
                <tr v-for="(order,index) in operate.modalData4" :key="index">
                    <td >{{order.accountRelation.name}}</td>
                    <td>{{order.accountRelation.gender | filterGender}}</td>
                    <td >{{order.accountRelation.idCard}}</td>
                    <td>{{order.accountRelation.mobile}}</td>
                    <td :title="order.examCompany" class="daily-ellipsis-td"><span>{{order.examCompany}}</span></td>
                    <td :title="order.accountRelation.department" class="daily-ellipsis-td">
                    <span>{{order.accountRelation.department}}</span></td>
                    <td :title="order.accountRelation.position" class="daily-ellipsis-td">
                    <span>{{order.accountRelation.position}}</span></td>
                    <td :title="order.accountCompany.name" class="daily-ellipsis-td">
                    <span>{{order.accountCompany.name}}</span></td>
                    <td :title="order.accountCompany.owner" class="daily-ellipsis-td">
                    <span>{{order.accountCompany.owner}}</span></td>
                    <td><span class="highlight">{{order.exportOrderPrice}}</span></td>
                    <td><span class="highlight">{{order.exportSelfMoney}}</span></td>
                    <td >{{order.retireLabel}}</td>
                    <td >{{order.accountRelation.healthNum}}</td>
                    <td :title="order.mealName" class="daily-ellipsis-td">
                      <span>{{order.mealName}}</span></td>
                    <td :title="order.hisItemIds" class="daily-ellipsis-td">
                      <span class="ell dib pct100">{{order.hisItemIds}}</span></td>
                    <td>{{order.payType}}</td>
                </tr>
            </tbody>
          </table>
        </div>
        <div slot="footer" class="tr">
            <a @click="operate.modal4=false">取消</a>
            <Button type="primary" @click="createXls">生成xls文件</Button>
        </div>
    </Modal>

    <!--弹出框，恢复未导-->
    <Modal
        v-model="operate.modal5"
        title="立即恢复订单"
        @on-ok="restoreExportS">
        <p>
          有 
          <span v-if="operate.modal5Data.exportedNum>0">{{operate.modal5Data.exportedNum}}个已导出</span>
          <span v-if="operate.modal5Data.exportedNum>0 && operate.modal5Data.exportFailedNum>0">，</span>
          <span v-if="operate.modal5Data.exportFailedNum>0">{{operate.modal5Data.exportFailedNum}}个导出错误</span>
          的订单确认
          </p>
    </Modal>

    <!--详情-->
    <!--订单详情-->
    <Detail :detail="detail"/>

    <!--弹出框，改期-->
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

  </div>
</template>
<script>
import _union from "lodash/union";
import _without from "lodash/without";
import _difference from "lodash/difference";
import _ from "lodash";

import Detail from "./detail";
import ChangeDate from "./changeDate";

import { DataMore } from "./data.js";

export default {
  components: {
    Detail: Detail,
    ChangeDate: ChangeDate
  },
  data() {
    return {
      channelMap: [], //储存渠道数据
      setTime: 0, //防止多次触发
      setTimes: "", //防止多次触发，绑定函数
      search: {
        //头部数据，主要用于搜索
        dateType: "体检日期", //日期类型
        dateTypeList: [
          {
            value: "体检日期",
            label: "体检日期"
          },
          {
            value: "下单日期",
            label: "下单日期"
          }
        ],
        dataTime: [],
        dateOption: {
          shortcuts: [
            {
              text: "今天",
              value() {
                const end = new Date();
                const start = new Date();
                return [start, end];
              }
            },
            {
              text: "上个月",
              value() {
                const end = new Date();
                const start = new Date();
                end.setDate(0);
                start.setDate(0);
                start.setDate(1);
                return [start, end];
              }
            },
            {
              text: "本月",
              value() {
                let date = new Date();
                let y = date.getFullYear();
                let m = date.getMonth() + 1;
                let temp = new Date(y, m, 0);
                let days = temp.getDate();
                return [new Date(y, m - 1, 1), new Date(y, m - 1, days)];
              }
            }
          ]
        }, //ivew时间组件自定义按钮

        //筛选条件四个select
        select1: [],
        select2: [],
        select3: [],
        select4: [],
        hospitalId: "", //体检中心
        examCompanyId: "", //体检单位
        fromSite: "", //渠道
        channelCompanyId: "", //渠道单位
        showExportable: false //是否仅显示可导
      },
      operate: {
        //操作，页面右上角五个按钮以及全选
        checkAll: false,
        cancelData: [],
        curCheckedData: [], //当前页一选择
        data: [], //全选数据,只有id字段
        dataAll: [], //全选数据
        msg: "", //短信
        modal1: false,
        modal2: false,
        modalSin: "",
        checkedRevole: false,
        modal4: false,
        modalData4: [],
        modalDataId: [],
        //撤销数据
        revoke: {
          people: null
        },
        //导出到体检软件数据
        batchExport: {
          modal: false,
          order: []
        },
        modal5: false,
        modalSin5: "",
        modal5Data: {
          exportedNum: 0,
          orderIds: []
        },
        dockDegree: false //深浅对接程度，true深对接
      },
      data: {
        gender: "", //表格筛选，男女，男0
        isSelfMoneyZero: "", //线上自付
        isOfflinePayMoneyZero: "", //现场应付
        orderStatuses: [], //订单状态
        orderStatusesArr: DataMore.orderStatusesArr,
        list: [],
        columns: [
          {
            type: "selection",
            align: "center"
          },
          {
            title: "体检时间",
            key: "examDate",
            align: "center",
            render: (h, params) => {
              let time;
              if (params.row.examDate) {
                time = MyUtil.formatDate(
                  new Date(params.row.examDate),
                  "yyyy/MM/dd"
                );
              } else {
                time = "-";
              }

              let date =
                params.row.examTimeIntervalName == undefined
                  ? ""
                  : params.row.examTimeIntervalName;
              return h("span", time + " " + date);
            }
          },
          {
            title: "体检人",
            key: "examDate",
            align: "center",
            render: (h, params) => {
              return h("span", params.row.accountRelation.name);
            }
          },
          {
            title: "性别",
            key: "examDate",
            align: "center",
            render: (h, params) => {
              let gender = params.row.accountRelation.gender;
              const text = gender === 0 ? "男" : "女";

              return h("span", text);
            },
            filters: DataMore.gender,
            filterMultiple: false,
            filterRemote: (value, key, column) => {
              if (value[0] === 1) {
                this.data.gender = 0;
              } else if (value[0] === 2) {
                this.data.gender = 1;
              } else {
                this.data.gender = "";
              }
              this.clearCheckAll()
              this.getDataList();
            }
          },
          {
            title: "身份证号",
            key: "examDate",
            align: "center",
            render: (h, params) => {
              return h("span", params.row.accountRelation.idCard);
            }
          },
          {
            title: "体检中心/体检单位",
            key: "examDate",
            align: "center",
            render: (h, params) => {
              return h("span", [
                h("span", params.row.hospital.name),
                h("br"),
                h("span", params.row.examCompany)
              ]);
            }
          },
          {
            title: "渠道/渠道单位",
            key: "examDate",
            align: "center",
            render: (h, params) => {
              if (this.channelMap[params.row.fromSite]) {
                return h("div", [
                  h("span", this.channelMap[params.row.fromSite]),
                  h("br"),
                  h("span", params.row.channelCompany?params.row.channelCompany.name:'')
                ]);
              } else {
                return h("span", "-");
              }
            }
          },
          {
            title: "订单状态",
            key: "examDate",
            align: "center",
            render: (h, params) => {
              let status = params.row.status;
              if (params.row.isExport && params.row.status == 2) {
                //已导出
                return h(
                  "span",
                  {
                    attrs: {
                      class: "staus-blue"
                    }
                  },
                  "已导出"
                );
              } else if (
                (!params.row.isExport && params.row.status < 3) ||
                params.row.status > 2
              ) {
                let statusText = "";
                statusText = this.$options.filters.status(status);
                let a = "";
                if (params.row.refundScene === 5) {
                  a = "(手动)";
                }
                return h("div", [
                  h(
                    "span",
                    {
                      attrs: {
                        class: "orderstatus" + status
                      }
                    },
                    statusText
                  ),
                  h("span", a)
                ]);
              }
            },
            filters: DataMore.orderStatusesArr,
            filterMultiple: true,
            filterRemote: (value, key, column) => {
              if (value.length === 0) {
                this.data.orderStatuses = [];
              } else {
                this.data.orderStatuses = value;
              }
              this.clearCheckAll()
              this.getDataList();
            }
          },
          {
            title: "订单金额",
            key: "examDate",
            align: "center",
            render: (h, params) => {
              return h("span", (params.row.orderPrice / 100).toFixed(2));
            }
          },
          {
            title: "线上自付",
            key: "examDate",
            align: "center",
            render: (h, params) => {
              return h("span", params.row.selfMoney);
            },
            filters: DataMore.isSelfMoneyZero_isOfflinePayMoneyZero,
            filterMultiple: false,
            filterRemote: (value, key, column) => {
              if (value[0] === 1) {
                this.data.isSelfMoneyZero = true;
              } else if (value[0] === 2) {
                this.data.isSelfMoneyZero = false;
              } else {
                this.data.isSelfMoneyZero = "";
              }
              this.clearCheckAll()
              this.getDataList();
            }
          },
          {
            title: "现场应付",
            key: "examDate",
            align: "center",
            render: (h, params) => {
              return h(
                "span",
                params.row.offlinePayMoney ? params.row.offlinePayMoney : "0.00"
              );
            },
            filters: DataMore.isSelfMoneyZero_isOfflinePayMoneyZero,
            filterMultiple: false,
            // filteredValue: (() => {

            //   return []
            // })(),
            filterRemote: (value, key, column) => {
              if (value[0] === 1) {
                this.data.isOfflinePayMoneyZero = true;
              } else if (value[0] === 2) {
                this.data.isOfflinePayMoneyZero = false;
              } else {
                this.data.isOfflinePayMoneyZero = "";
              }
              this.clearCheckAll()
              this.getDataList();
            }
          },
          {
            title: "预约人",
            key: "examDate",
            align: "center",
            render: (h, params) => {
              return h("span", params.row.operator);
            }
          },
          {
            title: "下单时间",
            key: "examDate",
            align: "center",
            render: (h, params) => {
              let time = MyUtil.formatDate(
                new Date(params.row.insertTime),
                "yyyy-MM-dd hh:mm:ss"
              );
              return h(
                "span",
                {
                  attrs: {
                    title: time
                  }
                },
                time
              );
            }
          },
          {
            title: "套餐名称",
            key: "examDate",
            align: "center",
            width: 150,
            render: (h, params) => {
              return h(
                "span",
                {
                  attrs: {
                    title: params.row.mealName
                  }
                },
                params.row.mealName
              );
            }
          },
          {
            title: "操作",
            key: "examDate",
            align: "center",
            width: 150,
            render: (h, params) => {
              return (
                <div>
                  <a
                    onClick={e => this.showOrderDetail(e, params.row)}
                    class="mr5 ml5"
                  >
                    查看
                  </a>
                  {!params.row.isExport &&
                  (params.row.status === 2 ||
                    params.row.status == 1 ||
                    params.row.status === 11) ? (
                    <a
                      onClick={e => this.changeExamDate(e, params.row)}
                      class="mr5 ml5"
                    >
                      改期
                    </a>
                  ) : (
                    ""
                  )}
                  {!(
                    params.row.hasSettlementOpen &&
                    [2, 4, 5].indexOf(params.row.settleSign) > -1
                  ) ? (
                    <span>
                      {params.row.status === 2 ||
                      params.row.status === 1 ||
                      params.row.status === 11 ? (
                        <a
                          onClick={e => this.revokeSingleOrder(e, params.row)}
                          class="mr5 ml5"
                        >
                          撤销
                        </a>
                      ) : (
                        ""
                      )}
                    </span>
                  ) : (
                    ""
                  )}
                  {params.row.status == 10 ? (
                    <a
                      onClick={e => this.changeSingleToNoExport(e, params.row)}
                      class="mr5 ml5"
                    >
                      恢复未导
                    </a>
                  ) : (
                    ""
                  )}
                </div>
              );
            }
          }
        ]
      },
      detail: {
        //查看详情
        modal: false,
        dataBase: [], //列表取
        dataMore: [] //远程取
      },
      page: {
        currentPage: 1,
        pageTotal: 0,
        pageSize: 10
      },
      modalChangeDate: false, //改期模态框
      changeDateData: [] //改期模态框
    };
  },
  computed: {
    checkedData() {
      //用于全选，计算已选的数据
      let a = _difference(this.operate.data, this.operate.cancelData);
      return this.operate.data.length != 0 ? a : this.operate.curCheckedData;
    }
  },
  methods: {
    //时间范围函数
    dateChange(value) {
      this.search.dataTime = value;
    },

    searchFuc() {
      this.clearCheckAll();
      this.getDataList();
    },

    //select选择框模块
    chooseSelect1(value) {
      this.search.examCompanyId = ""; //清空之前的选择，
      if (this.search.fromSite == -1 && value != "") {
        //当只看渠道的时候，选择医院，清空此条件
        this.search.fromSite = "";
      }
      this.operate.dockDegree = false; //取消深对接之前的值
      this.search.hospitalId = value;
      this.clearCheckAll();
      this.searchHospitalSetting(value);
      this.getSelectData2(); //获取对应数据
      this.getDataList(); //每次筛选都会获取数据
    },
    chooseSelect2(value) {
      this.search.examCompanyId = value;
      this.clearCheckAll();
      this.getDataList();
    },
    chooseSelect3(value) {
      this.search.channelCompanyId = "";
      this.search.fromSite = value;
      if (value == -1) {
        this.search.examCompanyId = "";
        // this.search.hospitalId = "";
      }
      this.clearCheckAll();
      this.getSelectData3();
      this.getDataList();
    },
    chooseSelect4(value) {
      this.search.channelCompanyId = value;
      this.clearCheckAll();
      this.getDataList();
    },
    //清空
    clearSelect(type) {
      if (type === 1) {
        this.search.hospitalId = "";
        this.search.examCompanyId = "";
      } else if (type === 2) {
        this.search.examCompanyId = "";
      } else if (type === 3) {
        this.search.fromSite = "";
        this.search.channelCompanyId = "";
      } else if (type === 4) {
        this.search.channelCompanyId = "";
      } else {
        this.search.hospitalId = "";
        this.search.examCompanyId = "";
        this.search.fromSite = "";
        this.search.channelCompanyId = "";
      }
      this.clearCheckAll();
      this.getDataList();
    },
    //检查医院深浅对接
    searchHospitalSetting(id) {
      this.$http.get("/hospitalsetting?id=" + id).then(
        res => {
          this.operate.dockDegree = !res.data.exportWithXls;
        },
        res => {
          this.$Message.error(res.text);
        }
      );
    },

    //分页
    changePage(currentPage) {
      this.page.currentPage = currentPage;
      this.getDataList();
    },
    changeSize(size) {
      this.page.pageSize = size;
      this.page.currentPage = 1;
      this.getDataList();
    },

    //checkbox模块
    dataCheckChange(data) {
      if (data.length !== this.data.list.length) {
        this.operate.checkAll = false;
      } else if (
        this.operate.data.length != 0 &&
        data.length == this.data.list.length
      ) {
        this.operate.checkAll = true;
      }
      this.operate.curCheckedData = data.map(res => res.id);
      let allData = this.data.list.map(res => res.id);
      if (this.operate.data.length != 0) {
        this.operate.cancelData = _union(
          _difference(this.operate.cancelData, this.operate.curCheckedData),
          _difference(allData, this.operate.curCheckedData)
        );
      }
    },
    handleCheckAll() {
      if (this.operate.cancelData.length > 0) {
        this.operate.checkAll = false;
      } else {
        this.operate.checkAll = !this.operate.checkAll;
      }
      this.operate.cancelData = [];

      if (this.operate.checkAll) {
        this.getDataList("all");
      } else {
        this.$refs.selection.selectAll(false);
        this.operate.cancelData = [];
        this.operate.data = [];
      }
    },
    //清空全选数据
    clearCheckAll() {
      this.operate.data = [];
      this.operate.cancelData = [];
      this.operate.curCheckedData = [];
      this.operate.checkAll = false;
      this.$refs.selection.selectAll(false);
      this.page.currentPage = 1
    },

    //清除筛选条件按钮
    clearStatus(type) {
      if (type == "gender") {
        this.data.gender = "";
        this.$refs.selection.handleFilterReset(3); //ivew源码里面的方法,参数代表columns数组下标
      } else if (type == "orderStatuses") {
        this.data.orderStatuses = [];
        this.$refs.selection.handleFilterReset(7);
      } else if (type == "isSelfMoneyZero") {
        this.data.isSelfMoneyZero = "";
        this.$refs.selection.handleFilterReset(9);
      } else if (type == "isOfflinePayMoneyZero") {
        this.data.isOfflinePayMoneyZero = "";
        this.$refs.selection.handleFilterReset(10);
      }else {
        this.data.gender = "";
        this.data.orderStatuses = [];
        this.data.isSelfMoneyZero = "";
        this.data.isOfflinePayMoneyZero = "";
        this.$refs.selection.handleFilterReset(3);
        this.$refs.selection.handleFilterReset(7); 
        this.$refs.selection.handleFilterReset(9);
        this.$refs.selection.handleFilterReset(10);
      }
      this.getDataList();
    },

    //操作模块
    //发送短信
    sendMegButton () {
      if (this.checkedData.length === 0) {
        this.$Message.error({
          content: "请选择要导出的订单",
          duration: 10,
          closable: true
        });
        return
      }
      this.operate.modal1 = true
    },
    sendMeg() {
      if (this.operate.msg.length < 10) {
        this.$Message.error("短信字数不能小于10");
        return false;
      }
      let pagram = {};
      pagram.msg = this.operate.msg;
      pagram.hospitalId = this.search.hospitalId;
      pagram.orderIds = JSON.stringify(this.checkedData);
      this.$http.post("/batchSendMsg", pagram).then(
        res => {
          this.$Message.success("短信发送成功");
        },
        res => {
          this.$Message.error(res.text);
        }
      );
    },
    //撤销
    revokeButton() {
      if (this.checkedData.length === 0) {
        this.$Message.error({
          content: "请选择要导出的订单",
          duration: 10,
          closable: true
        });
        return
      }
      this.operate.modal2 = true
      this.operate.revoke.people = ''
      let num = 0
      if(this.operate.checkAll || this.operate.cancelData.length>0) {
        this.operate.dataAll.filter((arr,index)=>{
          for(let i of this.checkedData) {
            if(num<2) {
              if(arr.id == i && arr.isExport) {
                num ++
                this.operate.revoke.people += arr.accountRelation.name+ '、'
              }
            }else {
              return
            }
          }
        })
      }else {
        this.data.list.filter((arr,index)=>{
          for(let i of this.operate.curCheckedData) {
            if(num<2) {
              if(arr.id == i && arr.isExport) {
                num ++
                this.operate.revoke.people += arr.accountRelation.name+ '、'
              }
            }else {
              return
            }
          }
        })
      }
      
      if(num>0) {
        this.operate.revoke.people = this.operate.revoke.people.substring(0,this.operate.revoke.people.length-1)
        this.operate.revoke.people += ' 等'
      }else {
        this.operate.revoke.people = null
      }
    },
    revoke() {
      let pagram = {};
      pagram.sendMsg = this.operate.checkedRevole;
      if (this.operate.modalSin == "") {
        pagram.orderIds = this.checkedData;
      } else {
        let p = [];
        p.push(this.operate.modalSin);
        pagram.orderIds = p;
      }
      this.operate.modalSin = "";

      this.$http.post("/revokeorder", pagram).then(
        res => {
          this.$Message.success("撤销成功");
          this.clearCheckAll();
          this.getDataList();
        },
        res => {
          this.$Message.error(res.text);
        }
      );
    },
    //导出查看
    exportView() {
      if (this.checkedData.length === 0) {
        this.$Message.warning("请选择要导出的订单");
        return;
      }
      if (this.checkedData.length > 15000) {
        this.$Message.warning("订单总数已超过15000条，请缩小时间范围导出");
        return;
      }

      this.$Message.info({
        content: "正在导出，请稍后...",
        duration: 10
      });
      window.location.href =
        this.$http.options.root +
        "/exportCheckbook?orderIds[]=" +
        this.checkedData.join();
    },
    //导出为XLS
    exportXls() {
      if (this.checkedData.length === 0) {
        this.$Message.error({
          content: "请选择要导出的订单",
          duration: 10,
          closable: true
        });
        return
      }
      let pagram = {};
      pagram.hospitalId = this.search.hospitalId;
      pagram.orderIds = JSON.stringify(this.checkedData);
      this.$http.post("/getOrderCanExportXls", pagram).then(
        res => {
          if (res.data.num === 0) {
            this.$Message.error({
              content: "所选订单中没有可导的",
              duration: 10,
              closable: true
            });
          } else {
            this.operate.modalDataId = res.data.orderIds;
            this.$http
              .post("/orderInfoForExport", {
                orderIds: JSON.stringify(res.data.orderIds)
              })
              .then(
                res => {
                  this.operate.modal4 = true;
                  this.operate.modalData4 = res.data;
                },
                res => {
                  this.$Message.error(res.text);
                }
              );
          }
        },
        res => {
          this.$Message.error(res.text);
        }
      );
    },
    createXls() {
      this.operate.modal4 = false
      window.location.href =
        this.$http.options.root +
        "/exportOrder?orderIds=" +
        JSON.stringify(this.operate.modalDataId) +
        '&hospitalId=' +this.search.hospitalId+
        '&readOnly=false'
    },
    //导出到体检软件
    batchExportOrder() {
      if (this.checkedData.length === 0) {
        this.$Message.error({
          content: "请选择要导出的订单",
          duration: 10,
          closable: true
        });
        return
      }
      let param = {
          hospitalId: this.search.hospitalId,
          orderIds: JSON.stringify(this.checkedData)
      };
      this.$http.post('/getOrderCanExport',param).then(
        res => {
          if (res.data.num == 0) {
              this.$Message.error('没有需要操作的订单')
          }
          this.operate.batchExport.order = res.data.orderIds
          this.operate.batchExport.modal = true
        },
        res => {
          this.$Message.error(res.text);
        }
      );
    },
    batchExportOrderFuc () {
      let pagram = {
          hospitalId: this.search.hospitalId,
          orderIds: JSON.stringify(this.operate.batchExport.order)
      };
      this.$http.post('/batchExportOrder',pagram).then(
        res => {
          this.$Message.success('操作成功')
          this.clearCheckAll();
          this.getDataList();
        },
        res => {
          this.$Message.error(res.text);
        }
      );
    },

    //恢复未导
    restoreExport() {
      if (this.checkedData.length === 0 && this.operate.modalSin5 == "") {
        this.$Message.error({
          content: "请选择要导出的订单",
          duration: 10,
          closable: true
        });
        return
      }
      let pagram = {};
      if (this.operate.modalSin5 == "") {
        pagram.hospitalId = this.search.hospitalId;
        pagram.orderIds = JSON.stringify(this.checkedData);
      } else {
        let a = [];
        a.push(this.operate.modalSin5.id);
        pagram.orderIds = JSON.stringify(a);
        pagram.hospitalId = this.operate.modalSin5.hospital.id;
      }

      this.$http.post("/getOrderCanUnexport", pagram).then(
        res => {
          if (res.data.exportedNum === 0 && res.data.exportFailedNum === 0) {
            //多选。导出
            this.$Message.error({
              content: "没有需要操作的订单",
              duration: 10,
              closable: true
            });
          } else {
            this.operate.modal5Data = res.data;
            this.operate.modal5 = true;
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
    restoreExportS() {
      let pagram = {};
      pagram.hospitalId = this.search.hospitalId;
      pagram.orderIds = JSON.stringify(this.operate.modal5Data.orderIds);
      this.$http.post("/batchChangeOrderToUnExport", pagram).then(
        res => {
          this.$Message.success("恢复成功");
          this.clearCheckAll();
          this.getDataList();
        },
        res => {
          this.$Message.error(res.text);
        }
      );
    },

    //查看详情
    showOrderDetail(e, data) {
      document.body.click()
      if (typeof data === "number") {
        data = e;
      } else {
        e.stopPropagation();
      }

      this.detail.dataBase = data;
      this.detail.modal = true;
      this.showOrderDetails(data);
    },
    showOrderDetails(data) {
      if (!this.detail.modal) {
        return
      }
      this.detail.dataBase = data;
      this.$http.get("/watchOrder/" + data.id).then(
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
        },
        res => {
          this.$Message.error(res.text);
        }
      );
    },

    //改期
    changeExamDate(e, data) {
      e.stopPropagation();
      this.changeDateData = data;
      this.modalChangeDate = true;
      this.$nextTick(() => {
        this.$refs.changeDate.changeExamDate(data);
      });
    },
    closeModal() {
      this.$refs.changeDate.changeExamFuc();
    },

    //撤销，单独按钮
    revokeSingleOrder(e, data) {
      e.stopPropagation();
      this.operate.modalSin = data.id;
      this.operate.modal2 = true;
      //撤销，已导出状态，红字提示
      if (data.isExport) {
        this.operate.revoke.people = data.accountRelation.name;
      } else {
        this.operate.revoke.people = null;
      }
    },

    //恢复导出，单独按钮
    changeSingleToNoExport(e, data) {
      e.stopPropagation();
      this.operate.modalSin5 = data;
      this.restoreExport();
    },

    //获取渠道等select框数据
    //一级
    getSelectData() {
      this.$http.get("/orderOrganizationList").then(
        res => {
          this.channelMap = res.data.channelMap;
          this.search.select1 = res.data.hospitals;
          //渠道需要单独添加一个只看渠道，formsite为-1
          let a = res.data.channels;
          a.unshift({
            fromSite: -1,
            id: -1,
            name: "只看渠道"
          });
          this.search.select3 = a;
        },
        res => {
          this.$Message.error(res.text);
        }
      );
    },
    //二级，根据上一级执行
    getSelectData2() {
      let url = "/allCompanies?hasGuestCompany=true";
      if (this.search.hospitalId != "") {
        url += "&hospitalId=" + this.search.hospitalId;
      }
      this.$http.get(url).then(
        res => {
          this.search.select2 = res.data;
        },
        res => {
          this.$Message.error(res.text);
        }
      );
    },
    getSelectData3() {
      this.$http
        .get("/listChannelCompanyList?channelId=" + this.search.fromSite)
        .then(
          res => {
            this.search.select4 = res.data;
          },
          res => {
            this.$Message.error(res.text);
          }
        );
    },

    //获取列表数据,i为all全部获取
    getDataList(i) {
      //防止多次触发，0的时候执行，然后200ms才可再次执行
      if (this.setTime === 0) {
        this.setTime = 1;
        this.setTimes = setTimeout(() => {
          this.setTime = 0;
          clearTimeout(this.setTimes);
        }, 200);
      } else {
        return false;
      }

      //默认参数
      let pagram = {};
      if (i != "all") {
        pagram = {
          page: {
            pageSize: this.page.pageSize,
            currentPage: this.page.currentPage
          }          
        };
      }
      //根据下单时间类型，添加不同的查询字段
      if (this.search.dataTime[0] != "") {
        if (this.search.dateType == "体检日期") {
          pagram.examStartDate = new Date(this.search.dataTime[0] + " 00:00:00").toISOString();
          pagram.examEndDate = new Date(this.search.dataTime[1] + " 23:59:59").toISOString();
        } else {
          pagram.insertStartDate = new Date(this.search.dataTime[0] + " 00:00:00").toISOString();
          pagram.insertEndDate = new Date(this.search.dataTime[1] + " 23:59:59").toISOString();
        }
      }

      //根据筛选条件添加不同条件
      if (this.search.hospitalId !== "") {
        let a = []
        a.push(this.search.hospitalId/1)
        pagram.hospitalIds = a;
      }
      if (this.search.examCompanyId !== "") {
        let a = []
        a.push(this.search.examCompanyId/1)
        pagram.examCompanyIds = a;
      }
      if (this.search.fromSite !== "") {
        let a = []
        a.push(this.search.fromSite/1)
        pagram.fromSites = a;
      }
      if (this.search.channelCompanyId !== "") {
        let a = []
        a.push(this.search.channelCompanyId/1)
        pagram.channelCompanyIds = a;
      }
      if (this.search.showExportable) {
        pagram.showExportable = true;
      }

      if (this.data.gender !== "") {
        pagram.gender = this.data.gender;
      }
      if (this.data.isSelfMoneyZero !== "") {
        pagram.isSelfMoneyZero = this.data.isSelfMoneyZero;
      }
      if (this.data.isOfflinePayMoneyZero !== "") {
        pagram.isOfflinePayMoneyZero = this.data.isOfflinePayMoneyZero;
      }
      if (this.data.orderStatuses.length !== 0) {
        pagram.isExport = false;
        let arr = _.cloneDeep(this.data.orderStatuses);
        for (let a in arr) {
          if (arr[a] === -1) {
            arr[a] = 2;
            pagram.isExport = true;
          }
        }
        arr = arr.filter((res,index)=>{
          let a = arr.indexOf(res) == index
          if(!a) {
            delete pagram.isExport
          }
          return a
        })
        pagram.orderStatuses = arr;
      }

      let url;
      if (i != "all") {
        url = "/queryOrder";
      } else {
        url = "/queryAllOrderInfo";
      }

      this.$http.post(url, pagram,{ emulateJSON: false }).then(
        res => {
          if (i != "all") {
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

            //全选模块
            this.data.list = dataBe;
            for (let i of this.data.list) {
              if (
                this.operate.cancelData.indexOf(i.id) < 0 &&
                this.operate.data.indexOf(i.id) >= 0
              ) {
                i._checked = true;
              }
            }

            this.page.pageTotal = res.data.page.rowCount;
          } else {
            this.operate.dataAll = res.data
            this.operate.data = res.data.map(res => res.id);
            this.$refs.selection.selectAll(true);
          }
        },
        res => {
          this.$Message.error(res.text);
        }
      );
    }
  },
  created() {
    let time = MyUtil.formatDate(new Date(), "yyyy-MM-dd");
    this.search.dataTime = [time, time];
    this.getSelectData();
    this.getDataList();
  }
};
</script>
<style lang="less">
.mt40 {
  margin-top: 40px;
}
.w70 {
  width: 70px;
}
.ivu-table-cell {
  padding: 0 3px !important;
}

.staus-blue {
  color: #438eb9;
}

/********************订单状态***************************/
.orderstatus0 {
  padding: 2px;
  border-radius: 5px;
  color: white;
  color: orange;
}
.orderstatus1 {
  padding: 2px;
  border-radius: 5px;
  color: white;
  color: #5b5;
}
.orderstatus2 {
  padding: 2px;
  border-radius: 5px;
  color: white;
  color: #58c1bb;
}
.orderstatus3 {
  padding: 2px;
  border-radius: 5px;
  color: white;
  color: #58cf43;
}
.orderstatus4 {
  padding: 2px;
  border-radius: 5px;
  color: white;
  color: #ff99ee;
}
.orderstatus5 {
  padding: 2px;
  border-radius: 5px;
  color: white;
  color: #aaa;
}
.orderstatus6 {
  padding: 2px;
  border-radius: 5px;
  color: white;
  color: #ccc;
}
.orderstatus7 {
  padding: 2px;
  border-radius: 5px;
  color: white;
  color: #bb8eb9;
}
.orderstatus8 {
  padding: 2px;
  border-radius: 5px;
  color: white;
  color: #ccc;
}
.orderstatus9 {
  padding: 2px;
  border-radius: 5px;
  color: white;
  color: #9ce;
}
.orderstatus10 {
  padding: 2px;
  border-radius: 5px;
  color: white;
  color: red;
}
.orderstatus11 {
  padding: 2px;
  border-radius: 5px;
  color: white;
  color: orange;
}
</style>
