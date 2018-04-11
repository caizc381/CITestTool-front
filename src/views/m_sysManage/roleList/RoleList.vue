<template>
  <div>
  	<Row>
      <Col :span="24" class="header-search">
         <Input class="dlb w300"
            placeholder="请输入角色名称"
            icon="search"
            v-model="keywords"
             @keyup.native.enter="serachRole"
            :on-icon-click="serachRole"
            >
         </Input>
         <div class="dlb ml20">
           <Button v-permission="'sys:role:save'" class="mr5" type="primary" icon="plus-round" @click="newDialog()">新增</Button>
           <Button v-permission="'sys:role:delete'" type="primary" icon="trash-a" @click="deleteRole()">删除</Button>
         </div>
       </Col>
    </Row>

    <Row class="body-content">
      <Col>
         <CheckboxGroup v-model="multipleSelection">
          <table class="table">
            <colgroup span="6"></colgroup>
            <col width="200">
            <thead>
              <tr>
                <th>选择</th>
                <th>角色编号</th>
                <th>角色名称</th>
                <th>角色描述</th>
                <th>创建时间</th>
                <th>更新时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="role in roleList">
                <td><Checkbox :key="role.id" :label="role.id" class="hidden-label"></Checkbox></td>
                <td>{{role.id}}</td>
                <td>{{role.roleName}}</td>
                <td>{{role.description}}</td>
                <td>{{role.gmtCreated | date('yyyy-MM-dd hh:mm:ss') }}</td>
                <td>{{role.gmtModified | date('yyyy-MM-dd hh:mm:ss') }}</td>
                <td>
                  <span>
                    <Button v-permission="'sys:role:update'" class="mr5" type="primary" icon="edit" @click="modifyDialog(role.id)">修改</Button>
                    <Button v-permission="'sys:role:delete'"  type="primary" icon="trash-a" @click="deleteRole(role.id)">删除</Button>
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
         </CheckboxGroup>
        <mt-none style="padding: 20px;" :show="roleList.length == 0" size="large" />
        <div class="page-wrap">
          <Page
           layout="total,prev, pager, next"
           show-total
           :total="page.totalCount"
           :page-size="page.pageSize"
           :current-page="page.currentPage"
           @on-change="handleCurrentChange">
          </Page>
        </div>
      </Col>
    </Row>

    <!--创建角色弹框-->
    <Modal
      title="新增角色"
      v-model="modal.new"
      :mask-closable="false">
      <Form :model="form" :rules="rules" ref="newModal" :label-width="80">
        <FormItem label="角色名称" prop="roleName">
          <Input v-model="form.roleName"></Input>
        </FormItem>
        <FormItem label="角色描述">
          <Input type="textarea" v-model="form.description" autosize></Input>
        </FormItem>
      </FormItem>
      </Form>
      <div slot="footer">
          <Button  @click="handleReset">取消</Button>
          <Button type="primary" @click="newRole('newModal')">确认</Button>
      </div>
    </Modal>

    <!--修改角色弹框-->
    <Modal
      title="修改角色"
      v-model="modal.modify"
      :mask-closable="false">
      <Form :model="form" :rules="rules" ref="modifyModal" :label-width="80">
        <FormItem label="角色名称" prop="roleName">
          <Input v-model="form.roleName"></Input>
        </FormItem>
        <FormItem label="角色描述">
          <Input type="textarea" v-model="form.description" autosize></Input>
        </FormItem>
      </Form>
      <div slot="footer">
          <Button  @click="handleReset">取消</Button>
          <Button type="primary" @click="modifyRole('modifyModal')">确认</Button>
      </div>
    </Modal>

  </div>
</template>

<script>
import RoleList from './RoleList.js'
export default RoleList
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
