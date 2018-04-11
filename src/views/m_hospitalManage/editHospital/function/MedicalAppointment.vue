<template>
  <div>
    <div class="form-term">
      <div class="form-header-title">
        <span class="fl">体检预约时间设置</span>
        <a v-if="!isEdit" v-permission="'hospitalManage:list:examTimeSetting'" class="fr" @click="clickEdit"><Icon type="edit"></Icon>编辑</a>
      </div>
      <Form :model="organizationVo" :label-width="120">
        <FormItem label="工作时间" style="font-weight: bold;">
        </FormItem>
        <FormItem label="工作日：">
          <span v-if="!isEdit" class="detailfont">{{hospital.funSettings.workDay | weekday}}</span>
          <CheckboxGroup v-if="isEdit" v-model="workDay">
              <Checkbox :label=2>周一</Checkbox>
              <Checkbox :label=3>周二</Checkbox>
              <Checkbox :label=4>周三</Checkbox>
              <Checkbox :label=5>周四</Checkbox>
              <Checkbox :label=6>周五</Checkbox>
              <Checkbox :label=7>周六</Checkbox>
              <Checkbox :label=1>周日</Checkbox>
          </CheckboxGroup>
        </FormItem>
        <FormItem label="体检时间：" class="dlb" style="width:33%">
           <span v-if="!isEdit && hospital.funSettings.examStartTime" class="detailfont">{{hospital.funSettings.examStartTime}}-{{hospital.funSettings.examEndTime}}</span>
           <div  v-if="isEdit">
             <TimePicker format="HH:mm" type="timerange" :value="examTime" placement="bottom-end" placeholder="选择时间" style="width: 168px" @on-change="changeExamTime"></TimePicker>
           </div>
        </FormItem>
        <FormItem label="抽血时间：" class="dlb" style="width:33%">
           <span v-if="!isEdit && hospital.funSettings.drawBloodStart" class="detailfont">{{hospital.funSettings.drawBloodStart}}-{{hospital.funSettings.drawBloodEnd}}</span>
           <div v-if="isEdit">
              <TimePicker format="HH:mm" type="timerange" :value="drawBloodTime" placement="bottom-end" placeholder="选择时间" style="width: 168px" @on-change="changeDrawBlood"></TimePicker>
           </div>
        </FormItem>

        <div class="parting-line"></div>

        <FormItem label="可预约时间段" style="font-weight: bold;"></FormItem>
        <div v-if="!isEdit">
          <FormItem label="时段：" v-for="(hos,index) in hospital.periodSetting">
            <span class="detailfont">{{ hos.name }}</span>
            <span v-if="hos.internalUsePeriod" class="ml20 gray">
              <span>(仅内部使用)</span>
              <span class="ml5">"仅内部使用"为B端预约时间，在C端无法看到</span>
            </span>
          </FormItem>
        </div>

        <div v-if="isEdit">
          <FormItem label="时段：" v-for="(hos,index) in organizationVo.periodSetting">
            <Input type="text" placeholder="时段" v-model="hos.name"  style="width:400px"></Input>
            <span v-if="index==0 && hos.internalUsePeriod">
              <Checkbox v-model="internalUsePeriod" class="ml20">仅内部使用</Checkbox>
              <span class="gray">"仅内部使用"为B端预约时间，在C端无法看到</span>
            </span>
            <span v-if="index!==0">
              <Checkbox v-model="hos.internalUsePeriod" class="ml20">仅内部使用</Checkbox>
              <span class="gray">"仅内部使用"为B端预约时间，在C端无法看到</span>
            </span>
          </FormItem>
          <FormItem label=" ">
            <a class="primaryfont" v-if="showPeriodBtn" v-permission="'hospitalManage:list:orderTime'" @click="addPeriod()"><Icon class="mr5" type="plus-circled"></Icon>添加时刻</a>
          </FormItem>
        </div>

        <div class="parting-line"></div>

        <FormItem label="提前时间" style="font-weight: bold;"></FormItem>
        <FormItem label="客户提前预约时间：" :label-width="160">
          <div v-if="!isEdit" class="detailfont">提前
             <span> {{ hospital.funSettings.previousBookDays }}天 </span>
             <span> {{ hospital.funSettings.previousBookTime }} </span>之前(跳过休息日)
          </div>
          <div v-if="isEdit">
            <span>提前</span>
            <Select v-model="organizationVo.funSettings.previousBookDays" style="width:200px">
               <Option label="1天" value="1"></Option>
               <Option label="2天" value="2"></Option>
               <Option label="3天" value="3"></Option>
               <Option label="4天" value="4"></Option>
               <Option label="5天" value="5"></Option>
             </Select>
             <TimePicker format="HH:mm" :value="organizationVo.funSettings.previousBookTime" placeholder="选择时间" style="width: 112px"></TimePicker>
            <span>之前(跳过休息日)</span>
            <div class="prompt">客户想要预约某一天体检，必须提前预约，提前时间为体检日往前推算设置的天数，在设置的几点几分可以预约，提前预约的天数会跳过休息日</div>
          </div>
        </FormItem>
        <FormItem label="客户提前导出时间：" :label-width="160">
          <div v-if="!isEdit" class="detailfont">提前
             <span> {{ hospital.funSettings.previousExportDays }}天 </span>导出(跳过休息日)
          </div>
          <div v-if="isEdit">
            <span>提前</span>
            <Select v-model="organizationVo.funSettings.previousExportDays" style="width:200px" placement='top'>
               <Option
                 v-for="days in previousExportDaysList"
                 :label="days.name"
                 :value="days.id">
               </Option>
             </Select>
            <span>之前(跳过休息日)</span>
            <div class="prompt">在自动导出订单的单位，客户预约的订单会按照设置的时间，跳过休息日，提前导入到内网，以便打印体检单</div>
          </div>
        </FormItem>
        <FormItem>
          <div v-if="errorInfoStatus" class="error">{{errorInfo}}</div>
        </FormItem>
        <FormItem v-if="isEdit">
            <Button type="primary" @click="save()">保存</Button>
            <Button type="ghost" style="margin-left: 8px" @click="cancelValidate()">取消</Button>
        </FormItem>
      </Form>

    </div>
  </div>
</template>

<script>
export default {
  data() {
      return {
        organizationVo: {
          periodSettingList: [],
          funSettings: {
            drawBloodEnd: '',
            drawBloodStart: '',
            examEndTime: '',
            examStartTime: '',
            hospitalId: '',
            previousBookDays: '',
            previousBookTime: '',
            previousExportDays: '',
            workDay: '',
          }
        },
        workDay: [],
        isEdit: false,
        previousExportDaysList: [],
        period:{
          id: '',
          name: '',
          internalUsePeriod: false,
          hospitalId: '',
        },
        showPeriodBtn: true,
        errorInfo: '',
        errorInfoStatus: false,
        examTime:[],
        drawBloodTime:[],
        internalUsePeriod: true,
      }
  },

  props: ['hospital'],

  filters: {
    weekday (val) {
      let v = (val || '').replace('2', '周一').replace('3', '周二').replace('4', '周三').replace('5', '周四').replace('6', '周五').replace('7', '周六').replace('1', '周日')
      return v;
    }
  },

  mounted() {
   this.previousExportDaysList =  MyUtil.getDaysList( 100, '天');
   this.previousExportDaysList.unshift({ 'id': 0, 'name': '0天'});
  },

  methods: {
    save(){
      //清空地址选择
      this.organizationVo.addressIds = undefined;
      
      this.workDay = this.workDay.filter(it => !isNaN(it)).sort();
      this.organizationVo.funSettings.workDay = this.workDay.join(",");
      //清空无效时刻
      this.organizationVo.periodSettingList = this.organizationVo.periodSetting.filter((item)=>{
         return item.name;
      });
      if(this.examTime.length == 0){
        this.errorInfo = '体检时间不能为空！';
        this.errorInfoStatus = true;
        return false;
      }
      if(this.drawBloodTime.length == 0){
        this.errorInfo = '抽血时间不能为空！';
        this.errorInfoStatus = true;
        return false;
      }
      if(this.organizationVo.periodSettingList.length == 0){
        this.errorInfo = '预约时间段不能为空！';
        this.errorInfoStatus = true;
        return false;
      }
      for(var p in this.organizationVo.periodSettingList){
        if(this.organizationVo.periodSettingList[p].name == null){
          this.errorInfo = '预约时间段名称不能为空！';
          this.errorInfoStatus = true;
          return false;
        }
        if(this.organizationVo.periodSettingList[p].name.length > 15){
          this.errorInfo = '预约时间段名称不能超过15个字！';
          this.errorInfoStatus = true;
          return false;
        }
      }


      //第一条可预约时段取消仅内部使用
      if(!this.internalUsePeriod){
         this.organizationVo.periodSetting[0].internalUsePeriod = false
      }

      this.$http.post('/examTimeSetting',JSON.stringify(this.organizationVo)).then((response) => {
          this.$Message.success('操作成功');
          this.errorInfoStatus = false;
          this.isEdit = false;
          this.$emit('reload');
      }, (res) => {
          this.$Message.error(res.text);
          this.errorInfoStatus = false;
      });
    },

    clickEdit(){
      this.isEdit = true;
      this.showPeriodBtn = true;
      this.organizationVo = JSON.parse(JSON.stringify(this.hospital));
      this.organizationVo.funSettings.previousBookDays = this.organizationVo.funSettings.previousBookDays+'';
      this.drawBloodTime = [this.organizationVo.funSettings.drawBloodStart,this.organizationVo.funSettings.drawBloodEnd];
      this.examTime = [this.organizationVo.funSettings.examStartTime,this.organizationVo.funSettings.examEndTime];
      this.workDay = (this.organizationVo.funSettings.workDay ? this.organizationVo.funSettings.workDay.split(',') : []).map(item => +item);
    },

    cancelValidate(){
      this.isEdit = false;
      this.organizationVo = JSON.parse(JSON.stringify(this.hospital));
    },

    addPeriod(){
      this.showPeriodBtn = false;
      this.period.hospitalId = this.hospital.funSettings.hospitalId;
      this.organizationVo.periodSetting.push(this.period);
    },

    changeDrawBlood (time) {
      this.organizationVo.funSettings.drawBloodStart = time[0];
      this.organizationVo.funSettings.drawBloodEnd = time[1];
    },

    changeExamTime (time) {
      this.organizationVo.funSettings.examStartTime = time[0];
      this.organizationVo.funSettings.examEndTime = time[1];
    },

  }
}
</script>

<style scoped>
  .form-header-title {
    clear: both;
    overflow: hidden;
  }
  .ivu-icon-edit:before {
    padding-right:5px;
  }
</style>
