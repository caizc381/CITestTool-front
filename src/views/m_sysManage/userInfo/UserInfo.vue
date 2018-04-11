<template>
  <div class="userInfo">

   <Col :span="12" class="ml20">
    <div class="userInfo-form">
  		<div class="demo-ruleForm">
  		  <div class="form-item">
          <span class="label">登录名称</span>
  		    <span class="inp">{{userInfo.loginName}}</span>
  		  </div>
  		  <div class="form-item">
          <span class="label">用户编号</span>
  		    <span class="inp">{{userInfo.employeeNo}}</span>
  		  </div>
  		   <div class="form-item">
          <span class="label">用户名称</span>
  		    <span class="inp">{{userInfo.employeeName}}</span>
  		  </div>
  		   <div class="form-item">
          <span class="label">手机号码</span>
  		    <span class="inp">{{userInfo.mobile}}</span>
  		  </div>
  		   <div class="form-item">
          <span class="label">用户状态</span>
          <RadioGroup class="ml20" v-model="userInfo.status">
              <Radio disabled label="1">正常</Radio>
              <Radio disabled label="2">冻结</Radio>
           </RadioGroup>
  		  </div>
        <div class="form-item">
          <span class="label">用户密码</span>
          <span class="update_psd">
            <Button type="primary" @click="showPsdInput=!showPsdInput">{{showPsdInput ? '取消修改':'修改密码'}}</Button>
          </span>
          <Form v-if="showPsdInput" :model="password" :rules="rules" ref="password" class="psd-form">
             <FormItem label="原密码" prop="old">
               <Input type="text" v-model="password.old" auto-complete="off" placeholder="请输入原密码"></Input>
             </FormItem>
             <FormItem label="新密码" prop="new">
               <Input type="text" v-model="password.new" auto-complete="off" placeholder="请输入新密码"></Input>
             </FormItem>
             <FormItem>
               <Button type="primary" @click="submitPsd('password')">提交</Button>
             </FormItem>
          </Form>
        </div>
  	</div>
  </div>
 </Col>

</div>
</template>

<script>
 import UserInfo from './UserInfo.js'
 export default UserInfo
</script>

<style>
	.userInfo
	{
    overflow: hidden;
  }
  .userInfo-form
  {
  	border: 1px solid #ccc;
    margin-top: 20px;
  	padding: 20px;
    font-size:14px;
  }
  .form-item
   {
     padding:20px 0;
   }
  .form-item .inp
  {
  	padding-left: 20px;
  }
  .psd-form
  {
    margin-top:20px;
  }
 .update_psd
  {
    display: inline-block;
    padding-left: 20px;
  }
</style>
