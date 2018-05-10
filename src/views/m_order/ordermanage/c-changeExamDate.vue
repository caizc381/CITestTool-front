<template>
<div>

  <div class="mt-alert" v-if="errorMsg !== ''">{{errorMsg}} <i class="iconfont icon-cha hoverblue" @click="errorMsg = ''"></i></div>

  <div class="tc">
    选择月份：
    <el-date-picker
      :editable="monthPickerOption.editable"
      :clearable="monthPickerOption.clearable"
      :format="monthPickerOption.format"
      v-model="month"
      type="month"
      @change="changeMon"
      align="left">
    </el-date-picker>
  </div>

  <div class="date-list mt10">
    <div class="date-item-wrap" v-for="item in weekdays">
      <div>
        {{item}}
      </div>
    </div>
    <div class="date-item-wrap" v-for="item in dateList">
      <div class="date-item" :class="{ 'select-day': isSelcetDate(item.date), 'disable': !item.enable }" @click="changeDate(item)">

        <div class="strong">{{item.date}}</div>
        <div v-if="!item.enable">
          <div>{{item.indicators.limit ? item.indicators.limit : ''}}</div>
        </div>

      </div>
    </div>
    <div style="clear: both;"></div>
  </div>

  <div class="range-list">
    选择时段：
    <div v-for="range in dateRanges" v-show="!range.internalUsePeriod"
    class="date-range mr10"
    :class="{ 'select-range': isSelcetRange(range) && dateInCurrentMonth, 'disable-range': !range.enable}"
    @click.stop="selectRange(range)">
      <el-tooltip :open-delay=700 :content="range.name" placement="top" effect="light">
        <span class="ellipsis">{{range.name}}</span>
      </el-tooltip>
    </div>
  </div>

  <div class="mt10">体检日期：{{selectedDate || initExamDate}} {{selectedRange.name || initExamRang.name}}</div>

  <div slot="footer" class="dialog-footer">
    <span class="fr">
      <el-button @click="close(false)">取 消</el-button>
      <el-button type="primary" @click="confirmChange">确 定</el-button>
    </span>
  </div>

</div>

</template>

<script type="text/ecmascript-6">
import service from '../service'

export default {
  name: 'changeExamDate',

  data() {
    return {

      weekdays: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],

      monthPickerOption: {
        editable: false,
        clearable: false,
        format: 'yyyy-MM'
      },

      initExamDate: '',
      initExamRang: {},

      selectedDate: '',
      selectedRange: {},

      datePickerEditable: false,
      month: new Date().format('yyyy-MM'),
      dateList: [],
      dateRanges: [],

      errorMsg: ''
    };
  },

  props: {
    order: {
      type: Object,
      required: true
    }
  },

  beforeMount() {
    this.initExamDate = new Date(this.order.examDate).format('yyyy-MM-dd');
    this.initExamRang = { id: this.order.examTimeIntervalId, name: this.order.examTimeIntervalName };

    if (this.order.id) {
      this.getBookDateTable(this.month);
    }
  },

  methods: {

    isSelcetDate(date) {
      return this.selectedDate === (this.month + '-' + date);
    },

    isSelcetRange(range) {
      return this.selectedRange.id === range.id;
    },

    // 切换月份时，如果还没有选择日期，选中默认(改期前)的体检日期
    initSelect() {
      if (this.selectedDate) {
        return;
      }
      for (let item in this.dateList) {
        let dateItem = this.dateList[item];
        if ((this.month + '-' + dateItem.date) == this.initExamDate) {
          this.selectedDate = this.initExamDate;
          this.selectedRange = this.initExamRang;
          this.setRangeEnable(dateItem);
        }
      }
    },

    changeDate(item) {

      this.errorMsg = '';
      if (this.isSelcetDate(item.date) || !item.enable) {
        return;
      }
      this.setRangeEnable(item)

      if (item.ranges.length === 0) {
        this.errorMsg = item.date + ' 号人数已满，请选择其它日期';
        return;
      }

      let willSelectedDate = this.month + '-' + item.date;
      this.selectedDate = willSelectedDate;
      this.selectedRange = item.ranges[0];

    },

    // 根据每天的可用时段，设置可选时段
    setRangeEnable(item) {
      let enableRangeIds = item.durationAvaliables;
      // 遍历所有时段，不是可选时段，设置enable属性
      this.dateRanges.map((range) => {
        if (enableRangeIds.includes(range.id)) {
          range.enable = true;
        } else {
          range.enable = false;
        }
        return range;
      })

    },

    // 选择时段，返回是否成功
    selectRange(range) {
      this.errorMsg = '';
      if (this.isSelcetRange(range) || !this.dateInCurrentMonth || !range.enable) {
        return;
      }

      service.modifyItemCheckCapacity(this.order, range.id, this.selectedDate).then((res)=>{
        this.selectedRange = range;
      }, (error) => {
        this.errorMsg = error.text;
      });
    },

    changeMon(mon) {
      this.month = mon;
      this.getBookDateTable(mon);
    },

    getMonthDayRange(mon) {
      let yearMonth = mon.split('-');
      return myUtil.getFirstAndLastDayOfMonth(yearMonth[0], yearMonth[1]);
    },

    getBookDateTable(mon) {
      let monthRange = this.getMonthDayRange(mon);
      service.getBookDate(monthRange, this.order.examCompanyId, this.order.hospital.id).then((data) => {

        this.dateRanges = data.body.dayRanges;
        this.dateList = service.parseDateList(data.body.dateUnits, data.body.dayRanges);

        this.initSelect();
      });
    },

    confirmChange() {
      if (!this.selectedRange.id) {
        this.$message.warning('请先选择一个改期日');
        return;
      }

      if (this.initExamDate === this.selectedDate && this.initExamRang.id === this.selectedRange.id) {
        this.$message.warning('所选日期与原订单日期一样');
        return;
      }

      let param = {
        orderId: this.order.id,
        intervalId: this.selectedRange.id,
        newExamDate: this.selectedDate
      };

      this.errorMsg = '';
      service.changeOrderExamDate(param).then((res) => {
        this.$notify({
          title: '成功',
          message: '改期成功',
          type: 'success'
        });
        this.close('success');
      }, (error) => {
        this.errorMsg = error.text;
      });

    },

    close(succ) {
      this.$emit('closeDialog', succ);
    }

  },

  computed: {
    dateInCurrentMonth() {
      return this.selectedDate.indexOf(this.month) > -1;
    }
  },

  watch: {
    order: {
      handler: function(val, oldVal) {
        if (val.id) {
          this.getBookDateTable(this.month);
        }
      }
    }

  },

  components: {
  },

  filters: {
  }

};
</script>

<style scoped lang="less">
@import '../../../assets/style/common.less';

.dialog-footer {
  padding: 20px;
}
.date-list {
  width: 100%;
  text-align: center;
  .date-item-wrap {
    width: 14%;
    float: left;
    display: inline-block;
  }
}
.date-item {
  margin: 2px;
  padding: 5px;
  height: 40px;
  border: 1px solid #999;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    border-color: #20a0ff;
  }
}
.range-list {
  margin-top: 10px;
  .date-range {
    border: 1px solid #ddd;
    border-radius: 3px;
    width: 100px;
    padding: 0px 1px;
    cursor: pointer;
    line-height: 25px;
    display: inline-block;
    text-align: center;
    &:hover {
      background: #20a0ff;
      color: #fff;
    }
  }
}
.select-day {
  background: #20a0ff;
  color: #fff!important;
  border-color: #ddd;
}
.select-range {
  background: #20a0ff;
  color: #fff;
  border-radius: 3px;
}
.disable {
  color: #aaa;
  cursor: not-allowed;
  border-color: #ddd;
  &:hover {
    border-color: #ddd;
  }
}
.disable-range {
  cursor: not-allowed!important;
  &:hover {
    background: #fff!important;
    color: @black!important;
  }
}
</style>
