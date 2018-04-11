<template>
  <div>
    <div class="header-search">
  	 <div class="channel-comp-header ml15 mr20">
       <i-input style="width: 200px;" @on-enter="companyList"
       placeholder="简拼搜索渠道单位" icon="search" v-model="query.keyword"
       @on-click="companyList"></i-input>

       <label>所属渠道：</label>

       <div class="dlb w300">
         <mt-select
         v-model="query.channelId"
         placeholder="请选择渠道"
         :filters="['name', 'pinyin']"
         :options="channels"
         @on-change="companyList" />
       </div>

       <i-button class="fr" type="primary" @click="$router.push('/companyManage/channelCompany/create')">新建渠道单位</i-button>
     </div>
    </div>

    <div class="body-content">
     <div class="channel-comp-body">

       <table class="table">
         <tr>
           <th>ID</th>
           <th>单位名称</th>
           <th>所属渠道</th>
           <th>创建时间</th>
           <th>操作</th>
         </tr>
         <tr v-for="comp in channelCompanies" :key="comp.ld">
           <td>{{comp.id}}</td>
           <td>{{comp.name}}</td>
           <td>{{comp.organizationName}}</td>
           <td>{{comp.gmtCreated | date('yyyy-MM-dd hh:mm:ss')}}</td>
           <td><span class="hoverblue" @click="$router.push('/companyManage/channelCompany/edit/' + comp.id)">编辑</span></td>
         </tr>
       </table>
     </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChannelCompany',
  data() {
      return {
        query: {
          keyword: '',
          channelId: '',
        },

        channels: [],
        channelCompanies: []
      }
  },
  mounted() {
    this.companyList();
    this.channelList();
  },
  methods: {
    companyList() {
      this.$http.get('/company/channel/companyList?keyword=' + this.query.keyword + '&organizationId=' + this.query.channelId).then((response) => {
        this.channelCompanies = response.body;
      });
    },

    channelList() {
      this.$http.get('/company/channel/channelList').then((response) => {
        this.channels = response.body;
      });
    },
  }
};
</script>

<style lang="less">
.hoverblue {
  cursor: pointer;
  color: #1D8CE0;
  &:hover {
    color: #2e476b;
  }
  i {
    color: #96a7be;
    &:hover {
     color: #2e476b;
    }
  }
}
.hidden {
  visibility: hidden;
  height: 0px;
  width: 0px;
  overflow: hidden;
}
</style>
