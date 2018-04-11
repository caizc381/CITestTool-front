<template>
 <div>
  <Row>
    <Col :span="24" class="header-search">
      <span class="header-tab">
          <Input
           class="search"
            placeholder="请输入医院编码或者名称"
            icon="search"
            v-model="keywords"
            @keyup.native.enter="searchHosp"
            @on-click="searchHosp">
         </Input>
         <Button type="primary" v-show="rules.saveEnable" class="newHospTask" icon="plus-round" @click="showCreateTask()">新增</Button>
      </span>
    </Col>
  </Row>

  <Row class="body-content" :gutter="20">
    <Col :span="10">
       <table class="table">
         <thead>
           <tr>
             <th>ID</th>
             <th>名称</th>
             <th>操作</th>
           </tr>
         </thead>
         <tbody>
           <tr v-for="hos in hospitalList">
             <td>{{hos.id}}</td>
             <td>{{hos.name}}</td>
             <td>
               <span>
                <Button type="primary" @click="showTasks(hos.id,hos.name)">任务详情</Button>
               </span>
             </td>
           </tr>
         </tbody>
       </table>

       <div class="page-wrap">
        <Page
         :total="page.totalCount"
         show-total
         :page-size="page.pageSize"
         :current-page="page.currentPage"
         @on-change="handleCurrentChange">
        </Page>
       </div>

    </Col>

    <Col :span="14">
      <div>
        <span class="header-tab ops-title" v-if="hospitalList.length>0 && taskList.length>0">{{selectHospName}}</span>
        <table class="table" v-if="hospitalList.length>0 && taskList.length>0">
          <thead>
            <tr>
              <th>任务名称</th>
              <th>状态</th>
              <th>参数</th>
              <th>时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="task in taskList">
              <td>{{task.taskName}}</td>
              <td>
                 <span>
                  <i-switch
                   size="large"
                   v-model="task.status"
                   v-bind:disabled="!rules.updateEnable"
                   @on-change="openOrCloseTask(task)">
                   <span slot="open">开启</span>
                   <span slot="close">关闭</span>
                  </i-switch>
                </span>
              </td>
              <td>{{task.taskParamsText}}</td>
              <td>{{task.cronExpression}}</td>
              <td>
                <span>
                  <Button
                    type="warning"
                    v-bind:disabled="!rules.editEnable"
                    @click="showEditTaskDialog(task)">编辑
                  </Button>
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Col>

  </Row>

  <!--创建医院任务弹框-->
  <Modal
    title="创建医院任务"
    v-model="modal.new"
    @on-ok="createHospTask()"
    :mask-closable="false">
    <Form :model="form" :label-width="80">
      <FormItem label="医院ID" >
        <Input v-model="form.hospitalId" auto-complete="off"></Input>
      </FormItem>
      <FormItem label="地区">
        <mt-select
        v-model="form.provinceId"
        placeholder="请选择省份"
        :filters="['name']"
        :options="provinceList" />
      </FormItem>
    </Form>
  </Modal>

  <!--编辑任务参数和crontabExpression-->
  <Modal
     title="编辑任务"
     v-model="modal.modify"
     @on-ok="editTask()"
     :mask-closable="false">
      <div style="font-size:16px;text-align: center;padding-bottom:10px;">{{this.editTaskForm.taskName}}</div>
      <Form :model="editTaskForm" :label-width="80">
          <FormItem v-if="editTaskForm.taskParam!=editTaskForm.NO_TASK_PARAM" label="参数">
              <Input type="textarea"
              placeholder="请填写参数,json格式"
              style="resize:both"
              v-model="editTaskForm.taskParam"
              auto-complete="off"></Input>
          </FormItem>
          <FormItem label="执行时间">
              <Input v-model="editTaskForm.cronExpression" auto-complete="off"></Input>
          </FormItem>
      </Form>
  </Modal>

</div>
</template>

<script>
import HospitalListTask from './HospitalListTask.js'
export default HospitalListTask
</script>

<style scoped lang="less">
.search{
  float:left;
  width:50%;
}

.newHospTask{
  float:left;
  margin-left:30px;
}

.hospitalList
{
  overflow-y: scroll;
}
</style>
