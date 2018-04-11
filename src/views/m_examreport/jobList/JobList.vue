<template>
  <div>
  <div class="header-search">
     <Input
       class="search"
        placeholder="请输入体检中心名称或者ID"
        icon="search"
        v-model="keyWords"
        @keyup.native.enter="searchHospital"
        :on-icon-click="searchHospital">
     </Input>
   </div>

   <div class="body-content">
      <table class="table">
        <thead>
          <tr>
            <th>选择</th>
            <th>ID</th>
            <th>任务名称</th>
            <th>类型</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="job in jobList">
            <td><Checkbox :key="job.id" :label="job.id" class="hidden-label"></Checkbox></td>
            <td>{{ job.hospitalId }}</td>
            <td>{{ job.hospitalName }}</td>
            <td>
              <div>
                <Tag color="green" v-if="job.type == '1'">异常建议</Tag>
                <Tag color="red" v-if="job.type == '2'">总检报告</Tag>
              </div>
            </td>
            <td>
              <div>
                <Tag color="green" v-if="job.status == '0'">关闭</Tag>
                <Tag color="red" v-else>启动</Tag>
              </div>
            </td>
            <td>
              <Button type="warning" @click="changeJob(job.hospitalId, job.type, 2)">重新启动</Button>
              <Button type="primary" @click="changeJob(job.hospitalId, job.type, 1)">启动</Button>
              <Button type="error"  @click="changeJob(job.hospitalId, job.type, 0)">关闭</Button>
            </td>
          </tr>
        </tbody>
      </table>

      <mt-none style="padding: 20px;" :show="jobList.length == 0" size="large" />

    </div>
  </div>
</template>

<script>
import JobList from './JobList.js'
export default JobList
</script>

<style scoped>
.btn
{
  display: block;
  clear: both;
  padding-bottom: 20px;
  overflow: hidden;
}
.search {
  width:400px;
}
</style>
