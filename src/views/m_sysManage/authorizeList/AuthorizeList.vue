<template>
  <div>
    <Row>
      <Col :span="24" class="header-search">
        <span class="header-tab fl">
           <Input
              class="search mr5"
              style="width:200px"
              placeholder="请输入部门名称进行搜索"
              v-model="departmentName">
           </Input>
           <Input
              class="search mr5"
              style="width:200px"
              placeholder="请输入角色名称进行搜索"
              v-model="roleName">
           </Input>
           <Input
              class="search mr5"
              style="width:200px"
              placeholder="请输入授权描述进行搜索"
              v-model="permissionName">
           </Input>
           <Button class="ml10" type="primary" icon="search"  @click="getList()">搜索</Button>
         </span>
         <div class="fl ml30">
             <Button v-permission="'sys:authorize:save'" class="mr5" type="primary" icon="plus-round" @click="newDialog()">新增</Button>
             <Button v-permission="'sys:authorize:delete'" type="primary" icon="trash-a" @click="deleteAuthorize()">删除</Button>
         </div>
      </Col>
    </Row>

    <Row>
      <Col class="body-content">
        <CheckboxGroup v-model="multipleSelection">
          <table class="table">
            <thead>
              <tr>
                <th>选择</th>
                <th>部门名称</th>
                <th>角色名称</th>
                <th>授权菜单</th>
                <th>授权描述</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in authorizeList">
                <td><Checkbox :key="item.id" :label="item.id" class="hidden-label"></Checkbox></td>
                <td>{{item.departmentName}}</td>
                <td>{{item.roleName}}</td>
                <td>
                  <span>
                    <el-tree
                      :data="menuList"
                      :props="menuTree"
                      :default-checked-keys="item.menuIdList"
                      show-checkbox
                      node-key="id">
                    </el-tree>
                  </span>
                </td>
                <td>{{item.permissionName}}</td>
                <td>
                  <span>
                    <Button v-permission="'sys:authorize:update'" class="mr5" type="primary" icon="edit" @click="modifyDialog(item.id)">修改</Button>
                    <Button v-permission="'sys:authorize:delete'" type="primary" icon="trash-a" @click="deleteAuthorize(item.id)">删除</Button>
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </CheckboxGroup>
        <mt-none style="padding: 20px;" :show="authorizeList.length == 0" size="large" />
        <div class="page-wrap">
          <Page
           layout="total,prev, pager, next"
           show-total
           :total="page.totalCount"
           :page-size="page.pageSize"
           :current="page.currentPage"
           @on-change="handleCurrentChange">
          </Page>
        </div>
      </Col>
    </Row>

    <!--创建授权弹框-->
    <Modal
      title="新增授权"
      v-model="modal.new"
      :mask-closable="false">
      <Form :model="form" :rules="rules" ref="newModal"  :label-width="80">
        <FormItem label="部门" class="ivu-form-item-required">
          <el-tree
            :data="departmentList"
            :props="defaultTree"
            show-checkbox
            node-key="id"
            ref="treeOne"
            check-strictly
            :expand-on-click-node="true"
            @check-change="getDepartmentId">
         </el-tree>
         <div v-if="depErrorInfo" class="ivu-form-item-error-tip">{{depErrorInfo}}</div>
        </FormItem>
        <FormItem label="角色" prop="roleId">
          <Select v-model="form.roleId" placeholder="请选择角色">
            <Option
              v-for="item in roleList"
              :label="item.roleName"
              :value="item.id | toStr">
            </Option>
          </Select>
        </FormItem>
        <FormItem label="菜单授权">
          <el-tree
            :data="menuList"
            :props="menuTree"
            show-checkbox
            node-key="id"
            ref="treeTwo"
            :expand-on-click-node="true"
            @check-change="getMenuId">
          </el-tree>
        </FormItem>
        <FormItem label="授权描述">
          <Input v-model="form.permissionName"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
          <Button  @click="handleReset">取消</Button>
          <Button type="primary" @click="newAuthorize('newModal')">确认</Button>
      </div>
    </Modal>

    <!--修改授权弹框-->
    <Modal
      title="修改管理员"
      v-model="modal.modify"
      :mask-closable="false">
      <Form :model="form" :rules="rules" ref="modifyModal" :label-width="80">
        <FormItem label="部门" prop="departmentId">
          <el-tree
            :data="departmentList"
            :props="defaultTree"
            :check-strictly="true"
            :default-checked-keys="departmentIds"
            show-checkbox
            node-key="id"
            ref="treeOne"
            check-strictly
            :expand-on-click-node="true"
            @check-change="getDepartmentId()">
         </el-tree>
        </FormItem>
        <FormItem label="角色" prop="roleId">
          <Select v-model="form.roleId" placeholder="请选择角色">
              <Option
                v-for="item in roleList"
                :label="item.roleName"
                :value="item.id | toStr">
              </Option>
          </Select>
        </FormItem>
        <FormItem label="菜单授权">
          <el-tree
            :data="menuList"
            :props="menuTree"
            :default-checked-keys="form.menuIdList"
            show-checkbox
            node-key="id"
            ref="treeTwo"
            :expand-on-click-node="true"
            @check-change="getMenuId">
         </el-tree>
        </FormItem>
        <FormItem label="授权描述">
          <Input v-model="form.permissionName"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
          <Button  @click="handleReset">取消</Button>
          <Button type="primary" @click="modifyAuthorize('modifyModal')">确认</Button>
      </div>
    </Modal>

  </div>
</template>

<script>
import AuthorizeList from './AuthorizeList.js'
export default AuthorizeList
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
