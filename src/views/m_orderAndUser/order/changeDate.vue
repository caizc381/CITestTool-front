<template>
  <div>
    <div class="table-date tc">
      <DatePicker v-model="time" type="month" style="width: 200px" :clearable="clearable" :options="options" format="yyyy-MM" @on-change="changeTime"></DatePicker>
      <table class="mt-table mt10">
            <tr v-for = '(row,index) in timeIntervals' :key="index">
              <td style="display:none"></td>
              <td class="tc" v-for = '(col,indexs) in timeIntervalsData' :key="indexs"
                :class="{'order-grey-td': index == 0 || indexs == 0,
                    'order-none': (col.enough == false || col[row.id].enough == false || col[row.id].expireDay == true) && index > 1,
                    'order-orange-td':col[row.id]==checkData}" 
                @click="setSelectedItem(col,row, index , indexs)">
                  
                  <span v-if="indexs==0">{{row.name}}</span>
                  <span v-if="index==0 && indexs> 0">{{col.label}}</span>
                  <span v-if="index==1 && indexs> 0">{{col.weekDay}}</span>
                  <span v-if="index > 1 && indexs > 0 && col[row.id].rest == false">
                      {{col[row.id].availableNum}}
                  </span>
                  <span v-if="index > 1 && indexs > 0 && col[row.id].rest == true">
                      休
                  </span>
              </td>
          </tr>
      </table>
      <span v-if="checkData!=''" class="f14 mt10 dlb tr">已选时间：<strong class="color-orange">
        {{searchT.time}}-{{timeIntervalsData[searchT.indexs].label}} 星期{{timeIntervalsData[searchT.indexs].weekDay}} （{{timeIntervals[searchT.index].name}}时段）</strong></span>
    </div>
  </div>
</template>
<script>
export default {
  props: ["data"],
  data() {
    return {
      time: "",
      examItemIdList: [],
      monthList: [],
      checkData: "",
      searchT: {},
      timeIntervals: [
        { id: "label", name: "日期" },
        { id: "weekDay", name: "星期" }
      ],
      timeIntervalsData: [],
      clearable: false,
      options: {
        disabledDate(date) {
          let dateNow = new Date();
          return (
            (date < dateNow && date.getMonth() != dateNow.getMonth()) ||
            (date.getFullYear() - dateNow.getFullYear() > 1 ||
              date.getFullYear() < dateNow.getFullYear())
          );
        }
      }
    };
  },
  methods: {
    //改期
    changeExamDate() {
      let data = this.data;
      this.$http.get("/orderExamItems/" + data.orderNum).then(response => {
        this.examItemIdList = response.data;
        this.$http
          .get("/hospitalcounter/headCatalog?hospitalId=" + data.hospital.id)
          .then(res => {
            this.timeIntervals = this.timeIntervals.concat(res.data.dayRange);
            this.getChangeExamDate();
          });
      });
    },
    getChangeExamDate() {
      let startDate = this.monthList[0].date;
      let endDate = this.monthList[this.monthList.length - 1].date;
      let url2 =
        "/companycounter/book/capacity?companyId=" +
        this.data.examCompanyId +
        "&hospitalId=" +
        this.data.hospital.id +
        "&mealId=" +
        this.data.mealId +
        "&orderNum=" +
        1 +
        "&startDate=" +
        startDate +
        "&endDate=" +
        endDate;
      this.$http.get(url2).then(data => {
        let arr = [];
        let currDate = new Date();
        for (let i = 0, length = this.monthList.length; i < length; i++) {
          let item = data.data[i];
          item.label = this.monthList[i].label;
          item.weekDay = this.monthList[i].weekDay;
          //当前日期以前的时间段全部设置为不预约
          var date = new Date(this.monthList[i].date.replace(/-/g, "/"));
          var isCurrDate =
            date.getFullYear() === currDate.getFullYear() &&
            date.getMonth() === currDate.getMonth() &&
            date.getDate() === currDate.getDate();
          if (!isCurrDate && date < currDate) {
            item.enough = false;
          }
          arr.push(item);
        }
        arr.splice(0, 0, arr[0]);
        this.timeIntervalsData = arr;
      });
    },

    changeTime() {
      this.$nextTick(() => {
        this.monthList = this.getWeekDay(
          this.time.getFullYear(),
          this.time.getMonth() + 1
        );
        this.getChangeExamDate();
      });
    },

    setSelectedItem(col, row, index, indexs) {
      //不符合条件无法点击
      if (
        index <= 1 ||
        indexs == 0 ||
        col[row.id].rest ||
        ((col.enough == false ||
          col[row.id].enough == false ||
          col[row.id].expireDay == true) &&
          index > 1)
      ) {
        console.log("不符合");
        return false;
      }
      if (this.checkData == col[row.id]) {
        this.checkData = "";
        this.searchT = {};
      } else {
        let a = this.searchT;
        a.index = index;
        a.indexs = indexs;
        a.time = MyUtil.formatDate(this.time, "yyyy-MM");
        this.searchT = a;
        let pagram = {
          companyId: this.data.examCompanyId,
          hospitalId: this.data.hospital.id,
          orderNum: 1,
          date:
            this.searchT.time +
            "-" +
            this.timeIntervalsData[this.searchT.indexs].label,
          dayRangeId: this.timeIntervals[this.searchT.index].id,
          examItemIdList: this.examItemIdList
        };
        this.$http
          .post("/companycounter/book/modifyItemCheckCapacity", pagram)
          .then(
            res => {
              this.checkData = col[row.id];
            },
            res => {
              this.checkData = ''
              this.searchT = {};
              this.$Message.error(res.text);
            }
          );
      }
    },

    changeExamFuc() {
      //未选中，直接关闭
      if(this.checkData==='') {
        this.$Message.error('请在操作前先选改期时间段！')
        return false
      }

      let pagrams = {
        orderId: this.data.id,
        intervalId: this.timeIntervals[this.searchT.index].id,
        examDate:
          this.searchT.time +
          "-" +
          this.timeIntervalsData[this.searchT.indexs ].label
      };
      this.$http
        .post("/changeExamDate", pagrams)
        .then(
          ress => {
            if (ress.data.sameOrderId) {
              let p = '以下用户在改期日已有订单，不允许重复： 体检人：' + this.data.accountRelation.name +
                      ' 身份证号：' + ((this.data.accountRelation.idCard=='' || !this.data.accountRelation.idCard)?'无':this.data.accountRelation.idCard) +
                      ' 体检日期：' + this.searchT.time + '-' + this.timeIntervalsData[this.searchT.indexs].label + this.timeIntervals[this.searchT.index].name
              this.$Message.info({
                    content: p,
                    duration: 10,
                    closable: true
                });
            }else {
              this.$Message.success("订单修改成功");
              if (this.$parent.$parent.getDataList) {
                this.$parent.$parent.getDataList()
                this.$parent.$parent.modalChangeDate = false
              }else {
                this.$parent.$parent.modalChangeDate = false
                this.$parent.$parent.$parent.getDataListOrder()
              }
            }
            

          },
          ress => {
            this.$Message.error(res.text);
          }
        );
    },

    changeMon(mon) {
      if (
        (this.selectedYear === this.years[0] &&
          this.selectedMon === 1 &&
          mon === -1) ||
        (this.selectedYear === this.years[this.years.length - 1] &&
          this.selectedMon === 12 &&
          mon === 13)
      ) {
        return;
      }
      if (mon === -1) {
        this.selectedMon -= 1;
      } else if (mon === 13) {
        this.selectedMon += 1;
      } else {
        this.selectedMon = mon;
      }

      if (this.selectedMon === 0) {
        this.selectedMon = 12;
        this.selectedYear -= 1;
      } else if (this.selectedMon === 13) {
        this.selectedMon = 1;
        this.selectedYear += 1;
      }
    },

    getWeekDay(year, month) {
      let months31 = [1, 3, 5, 7, 8, 10, 12];
      let months30 = [4, 6, 9, 11];
      if (months31.indexOf(month) > -1) {
        return this.generateDayWeek(year, month, 32);
      }

      if (months30.indexOf(month) > -1) {
        return this.generateDayWeek(year, month, 31);
      }

      if (month === 2) {
        let currDte = new Date(year + "/" + month + "/" + "10");
        let isLeapYear =
          0 == currDte.getYear() % 4 &&
          (currDte.getYear() % 100 != 0 || currDte.getYear() % 400 == 0);
        if (isLeapYear) {
          return this.generateDayWeek(year, month, 30);
        } else {
          return this.generateDayWeek(year, month, 29);
        }
      }
    },

    generateDayWeek(year, month, interval) {
      let week = ["日", "一", "二", "三", "四", "五", "六"];
      let dayWeeks = [];
      let mt = month > 9 ? month : "0" + month;

      for (let i = 1; i < interval; i++) {
        let value = year + "-" + mt + "-" + (i > 9 ? i : "0" + i);
        let label = i > 9 ? i : "0" + i;

        var currDate = new Date(value.replace(/-/g, "/"));

        dayWeeks.push({
          label: label,
          date: value,
          weekDay: week[currDate.getDay()]
        });
      }

      return dayWeeks;
    }
  },
  created() {
    this.time = new Date();
    this.monthList = this.getWeekDay(
      this.time.getFullYear(),
      this.time.getMonth() + 1
    );
  }
};
</script>
<style lang="less" scoped>
.color-orange {
  color: #f90;
}
.order-grey-td {
  background-color: #f6f6f6;
  font-weight: normal;
  color: #000 !important;
}
.order-none {
  color: #bbbbbb;
}
.order-orange-td {
  background: #34c0e3;
  color: #ffffff;
}

td {
  border: 1px solid #ddd;
}
.tc {
  text-align: center !important;
}
</style>
