<template>
 <div>
   <Row>
      <i-col :span="24" class="header-search tr pr15">
         <Button type="primary" @click="$router.push('/channelManage/channelList/edit/new')">新增渠道商</Button>
      </i-col>
    </Row>

    <Row class="body-content">
      <table class="table">
       <colgroup span="7"></colgroup>
       <thead>
         <tr>
            <th>Id</th>
            <th>名称</th>
            <th>管理员</th>
            <th>账号</th>
            <th>管理员手机</th>
            <th>状态</th>
            <th>操作</th>
         </tr>
       </thead>
       <tbody>
         <tr v-for="channel in channelList" :key="channel.hospital.id">
         	<td>{{channel.hospital.id}}</td>
					<td>{{channel.hospital.name}}</td>
					<td>{{channel.manager.name}}</td>
          <td>{{channel.manager.username}}</td>
					<td>{{channel.manager.mobile}}</td>
					<td>
            <div :class="{'redfont':channel.hospital.enable == 0,'successfont':channel.hospital.enable == 1}">
            {{channel.hospital.enable == 1 ? '正常':'停用'}}</div>
          </td>
					<td>
					   <a @click="$router.push('/channelManage/channelList/edit/' + channel.hospital.id)">基本详情</a>
					</td>
         </tr>
       </tbody>
     </table>

     <Spin size="large" fix v-if="loading"></Spin>

     <mt-none style="padding: 20px;" :show="channelList.length == 0" size="large" />

    </Row>

</div>
</template>

<script>
import ChannelList from './ChannelList.js'
export default ChannelList
</script>

<style scoped lang="less">

</style>
