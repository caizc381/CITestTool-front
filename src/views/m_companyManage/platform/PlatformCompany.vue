<template>
  <div>
    <div class="header-search">
    	 <div class="channel-comp-header ml15 mr20">
         <i-input style="width: 200px;" @on-enter="companyList"
         placeholder="简拼搜索平台单位" icon="search" v-model="query.keyword"
         @on-click="companyList"></i-input>

        <i-button class="fr" type="primary" @click="$router.push('/companyManage/platformCompany/create')">新建平台单位</i-button>
       </div>
     </div>

     <div class="body-content">
       <div class="channel-comp-body">

         <table class="table">
           <tr>
             <th>ID</th>
             <th>单位名称</th>
             <th>创建时间</th>
             <th>操作</th>
           </tr>
           <tr v-for="comp in channelCompanies" :key="comp.id">
             <td>{{comp.id}}</td>
             <td>{{comp.name}}</td>
             <td>{{comp.gmtCreated | date('yyyy-MM-dd hh:mm:ss')}}</td>
             <td><span class="hoverblue" @click="$router.push('/companyManage/platformCompany/edit/' + comp.id)">编辑</span></td>
           </tr>
         </table>
       </div>
     </div>

  </div>
</template>

<script>

export default {
  name: 'PlatformCompany',
  data() {
      return {
        query: {
          keyword: '',
        },

        channels: [],
        channelCompanies: []
      }
  },
  mounted() {
    this.companyList();
  },
  methods: {
    companyList() {
      this.$http.get('/company/platform/list?keyword=' + this.query.keyword).then((response) => {
        this.channelCompanies = response.body.filter(item => {
          return item.id > 5;
        });
      });
    },
  }
};
</script>

<style scoped lang="less">
.hoverblue {
  cursor: pointer;
  color: #1D8CE0;
  &:hover {
    color: #20A0FF;
  }
}
</style>
