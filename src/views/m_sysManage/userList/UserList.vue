<template>
  <div>
  	<Row>
      <Col :span="24" class="header-search">
          <Input class="dlb w300"
            placeholder="请输入用户名"
            icon="search"
            v-model="keywords"
            @keyup.native.enter="serachUser"
            :on-icon-click="serachUser">
         </Input>
         <div class="dlb ml20">
           <Button v-permission="'sys:user:save'" class="mr5" type="primary" icon="plus-round" @click="newDialog()">新增</Button>
           <Button v-permission="'sys:user:delete'" type="primary" icon="trash-a" @click="deleteUser()">删除</Button>
         </div>
      </Col>
    </Row>

    <Row class="body-content">
      <Col>
        <CheckboxGroup v-model="multipleSelection">
          <table class="table">
            <colgroup span="8"></colgroup>
            <col width="200">
            <thead>
               <tr>
                 <th>选择</th>
                 <th>员工编号</th>
                 <th>员工名称</th>
                 <th>部门名称</th>
                 <th>角色</th>
                 <th>手机号码</th>
                 <th>状态</th>
                 <th>创建时间</th>
                 <th>操作</th>
               </tr>
            </thead>

            <tbody>
              <tr v-for="user in userList">
                <td><Checkbox :key="user.id" :label="user.id" class="hidden-label"></Checkbox></td>
                <td><span>{{user.employeeNo}}</span></td>
                <td><span>{{user.employeeName}}</span></td>
                <td><span>{{user.departName}}</span></td>
                <td>
                  <span v-for="(role,index) in user.roles">
                     <span v-if="index == user.roles.length-1">{{role.roleName}}</span>
                     <span v-else>{{role.roleName}},</span>
                  </span>
                </td>
                <td><span>{{user.mobile}}</span></td>
                <td><span>{{user.status}}</span></td>
                <td><span>{{user.gmtCreated | date('yyyy-MM-dd hh:mm:ss')}}</span></td>
                <td>
                  <span>
                    <Button v-permission="'sys:user:update'" class="mr5" type="primary" icon="edit" @click="modifyDialog(user.id)">修改</Button>
                    <Button v-permission="'sys:user:delete'" type="primary" icon="trash-a" @click="deleteUser(user.id)">删除</Button>
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </CheckboxGroup>
        <mt-none style="padding: 20px;" :show="userList.length == 0" size="large" />
        <div class="page-wrap">
          <Page
           :total="page.totalCount"
           show-total
           show-sizer
           :page-size="page.pageSize"
           :current-page="page.currentPage"
           @on-change="handleCurrentChange">
          </Page>
        </div>
      </Col>
    </Row>

    <!--创建管理员弹框-->
     <Modal
       title="新增管理员"
       v-model="modal.new"
       :mask-closable="false">
        <Form :model="newForm" :rules="rules" ref="newModal"  :label-width="80">
          <FormItem label="登录名" prop="loginName">
            <Input v-model="newForm.loginName"></Input>
          </FormItem>
          <FormItem label="密码" prop="password">
            <Input v-model="newForm.password"></Input>
          </FormItem>
          <FormItem label="员工编号" prop="employeeNo">
            <Input v-model="newForm.employeeNo"></Input>
          </FormItem>
          <FormItem label="员工名称">
            <Input v-model="newForm.employeeName"></Input>
          </FormItem>
          <FormItem label="所属部门" prop="parentDepartmentIdList">
            <Cascader
            :data="departmentList"
            v-model="newForm.parentDepartmentIdList"
            not-found-text="暂无数据"
            change-on-select></Cascader>
          </FormItem>
          <FormItem label="角色">
            <Select v-model="newForm.roleIds" multiple placeholder="请选择角色">
                <Option
                  v-for="item in roleList"
                  :label="item.roleName"
                  :value="item.id">
                </Option>
            </Select>
          </FormItem>
          <FormItem label="电话号码">
            <Input v-model="newForm.mobile"></Input>
          </FormItem>
          <FormItem label="是否启用">
           <RadioGroup v-model="newForm.status">
              <Radio label="1">启用</Radio>
              <Radio label="2">禁用</Radio>
           </RadioGroup>
         </FormItem>
        </Form>
        <div slot="footer">
            <Button  @click="handleReset">取消</Button>
            <Button type="primary" @click="newUser('newModal')">确认</Button>
        </div>
     </Modal>

    <!--修改管理员弹框-->
    <Modal
      title="修改管理员"
      v-model="modal.modify"
      :mask-closable="false">
      <Form :model="editForm" :rules="rules" ref="modifyModal"  :label-width="80">
        <FormItem label="登录名" prop="loginName">
          <Input v-model="editForm.loginName" disabled></Input>
        </FormItem>
        <FormItem label="密码">
          <Input v-model="editForm.password"></Input>
        </FormItem>
        <FormItem label="员工名称">
          <Input v-model="editForm.employeeName"></Input>
        </FormItem>
        <FormItem label="所属部门" prop="parentDepartmentIdList">
          <Cascader
          :data="departmentList"
          v-model="editForm.parentDepartmentIdList"
          not-found-text="暂无数据"
          change-on-select></Cascader>
        </FormItem>
         <FormItem label="角色">
          <Select v-model="editForm.roleIds" multiple placeholder="请选择角色">
            <Option
              v-for="item in roleList"
              :label="item.roleName"
              :value="item.id">
            </Option>
          </Select>
        </FormItem>
        <FormItem label="电话号码">
          <Input v-model="editForm.mobile"></Input>
        </FormItem>
        <FormItem label="是否启用">
         <RadioGroup v-model="editForm.status">
            <Radio label="1">启用</Radio>
            <Radio label="2">禁用</Radio>
         </RadioGroup>
       </FormItem>
      </Form>
      <div slot="footer">
          <Button  @click="handleReset">取消</Button>
          <Button type="primary" @click="modifyUser('modifyModal')">确认</Button>
      </div>
    </Modal>

  </div>
</template>

<script>
import UserListJs from './UserList.js'
export default UserListJs
</script>

<style scoped>
.search{
  float:left;
  width:40%;
}
.header-btn
{
	 margin-left: 45%;
}
</style>
