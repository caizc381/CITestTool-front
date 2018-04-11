<template>
 <div>
   <Row>
      <i-col :span="24" class="header-search">
         <Input class="dlb w300"
           v-model="searchWord"
           placeholder="请输入关键词"
           icon="search"
           @on-click="getManagerList"
           @on-enter="getManagerList" />
         <span class="ml10"><Button type="primary" @click="openNewModal('new', undefined)">新增</Button></span>
         <span class="fr mr15"><Button type="primary" @click="dialog.newCard = true">生成实体卡</Button></span>
      </i-col>
    </Row>

    <Row class="body-content">
      <table class="table">
       <colgroup span="7"></colgroup>
       <thead>
         <tr>
            <th>账号</th>
            <th>客户经理</th>
            <th>所属渠道</th>
            <th>挂账单位</th>
            <th>介绍人</th>
            <th>账户余额(￥)</th>
            <th>专属网址</th>
            <th style="width: 200px;">操作</th>
         </tr>
       </thead>
       <tbody>
         <tr v-for="manager in managerList" :key="manager.account.id">
           <td>{{manager.userList[0].username}}</td>
           <td>
            <div :title="manager.account.name">{{manager.account.name}}</div>
          </td>
          <td>
            <div :title="manager.hospitalName">{{manager.hospitalName}}</div>
          </td>
          <td>
            <div :title="manager.accountCompany.name">{{manager.accountCompany.name}}</div>
          </td>
          <td>
            <div :title="manager.accountCompany.owner">{{manager.accountCompany.owner}}</div>
         </td>
         <td>{{(manager.balance/100).toFixed(2)}}</td>
         <td>{{manager.identity}}</td>
         <td>
           <a @click="openNewModal('edit', manager.account.id)">编辑</a>
           <a @click="openReModal(manager.account.id,'remove')">删除</a>
           <a @click="$router.push('/channelManage/managermanagement/rechange/' + manager.account.id)">账务</a>
           <a @click="openReModal(manager.account.id,'reset')">重置密码</a>
          </td>
        </tr>
       </tbody>
     </table>

     <mt-none style="padding: 20px;" :show="managerList.length == 0" size="large" />

    </Row>

    <!-- 新增/编辑 -->
    <Modal
      v-model="dialog.new"
      title="编辑客户经理"
      :mask-closable="false">
      <div>
        <Form :model="managerObject" :rules="rules" ref="editManage" :label-width="100">
          <FormItem label="所属渠道" class="ivu-form-item-required">
            <Select v-model="managerObject.channelId" :disabled="isEditChannel">
              <Option 
               v-for="channel in channelList" 
               :value="channel.id+''" 
               :key="channel.id">{{ channel.name }}</Option>
            </Select>
            <div class="c-9">注：所属渠道保存后不能修改，请谨慎选择！</div>
            <div v-if="showDepErrorInfo" class="ivu-form-item-error-tip">请选择部门!</div>
          </FormItem>
          <FormItem label="账号" prop="username">
            <Input v-model="managerObject.username" :disabled="editFlag" />
          </FormItem>
          <FormItem label="客户经理" prop="name">
            <Input v-model="managerObject.name" />
          </FormItem>
          <FormItem label="手机号码" prop="mobile">
            <Input v-model="managerObject.mobile" />
          </FormItem>
          <FormItem label="专属网址">
            <Input v-model="managerObject.identity" />
          </FormItem>
          <FormItem>
            <div v-if="errorInfo" class="error">{{errorInfo}}</div>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="text" @click="dialog.new = false">取消</Button>
        <Button type="primary" @click="newManager('editManage')">确认</Button>
      </div>
    </Modal>

    <!-- 发卡 -->
    <Modal
     v-model="dialog.newCard"
     title="设置发卡数量"
     :mask-closable="false">
      <div>
        <span class="mr5">请输入发卡数量</span>
        <InputNumber :min="1" v-model="cardNum"></InputNumber>
      </div>
      <div slot="footer">
        <Button type="text" @click="dialog.newCard = false">取消</Button>
        <Button type="primary" @click="newCard">确认</Button>
      </div>
    </Modal>
    
    <!-- 重置密码 -->
    <Modal
     v-model="dialog.reset"
     title="提示"
     :mask-closable="false">
      <div>
        是否确定重置密码？
      </div>
      <div slot="footer">
        <Button type="text" @click="dialog.reset = false">取消</Button>
        <Button type="primary" @click="resetPwd">确认</Button>
      </div>
    </Modal>

    <!-- 删除 -->
    <Modal
     v-model="dialog.remove"
     title="提示"
     :mask-closable="false">
      <div>
        是否确定删除该客户经理？
      </div>
      <div slot="footer">
        <Button type="text" @click="dialog.remove = false">取消</Button>
        <Button type="primary" @click="removeManager">确认</Button>
      </div>
    </Modal>

</div>
</template>

<script>
import Manager from './Manager.js'
export default Manager
</script>

<style lang="less">

</style>
