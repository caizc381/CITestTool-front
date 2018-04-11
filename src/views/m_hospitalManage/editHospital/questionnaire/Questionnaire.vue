<template>
  <div>
    <div class="form-term">
      <div class="form-header-title">
        <span class="fl">消息设置</span>
        <a v-if="!isEdit" v-permission="'hospitalManage:list:surveyInfoEdit'" class="fr" @click="clickEdit"><Icon type="edit"></Icon>编辑</a>
      </div>

      <div class="form-body">
        <table class="table">
           <thead>
             <tr>
               <th>ID</th>
               <th>问卷名称</th>
               <th>展示形式</th>
               <th>答题形式</th>
               <th>分配</th>
             </tr>
           </thead>
           <tbody>
             <tr v-for="survey in hospital">
               <td>
                 {{survey.id}}
               </td>
               <td>
                 <span>{{survey.title}}</span>
               </td>
               <td>
                 <span v-if="!isEdit">{{survey.showType == 1 ? '普通问卷':'主问卷'}}</span>
                 <div v-if="isEdit">
                   <Select v-model="survey.showType" style="width:100%">
                     <Option value="1" label="普通问卷"></Option>
                     <Option value="2" label="主问卷"></Option>
                   </Select>
                 </div>
               </td>
               <td>
                 <span v-if="!isEdit">{{survey.pageType == 1 ? '一页问卷':'对话形式'}}</span>
                 <div v-if="isEdit">
                   <Select v-model="survey.pageType" style="width:100%">
                     <Option value="1" label="一页问卷"></Option>
                     <Option value="2" label="对话形式"></Option>
                   </Select>
                 </div>
               </td>
               <td style="width:200px">
                 <span v-if="!isEdit" :class="{'successfont':survey.isAllocatingToHospital == 0}">{{ survey.isAllocatingToHospital == 1 ? '未分配':'已分配'}}</span>
                 <div v-if="isEdit">
                   <i-switch v-model="survey.isAllocate" @on-change="changeStatue(survey)"></i-switch>
                 </div>
               </td>
             </tr>
           </tbody>
        </table>
      </div>
    </div>

    <div class="mt20" v-if="isEdit">
      <Button type="primary" @click="save()">保存</Button>
      <Button type="ghost" style="margin-left: 8px" @click="cancel()">取消</Button>
    </div>

  </div>
</template>

<script>
export default {
  name: 'message',
  data() {
    return {
      isEdit: false,
      isAllocatingToHospital: false,
    }
   },

  props: ['hospital','hospitalId'],

  methods: {

    save(){
      this.$http.post('/allocateSurvey?hospitalId='+ this.hospitalId,JSON.stringify(this.hospital)).then((response) => {
          this.$Message.success('操作成功');
          this.isEdit = false;
          this.$emit('reload');
      }, (res) => {
          this.$Message.error(res.text);
      });
    },

    clickEdit(){
     this.isEdit = true;
     this.addDefultProp();
    },

    cancel(){
     this.isEdit = false;
     this.$emit('reload');
    },

    addDefultProp(){
      for(let i =0; i < this.hospital.length; i++){
        this.hospital[i].isAllocate =  this.hospital[i].isAllocatingToHospital == 1 ? false : true;
        this.hospital[i].showType = this.hospital[i].showType +'';
        this.hospital[i].pageType = this.hospital[i].pageType +'';
      }
    },

    changeStatue(survey){
      survey.isAllocatingToHospital = survey.isAllocate ? 0 : 1;
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
    padding-right: 5px;
  }
  .form-header-title{
    margin-bottom: 0;
  }
</style>
