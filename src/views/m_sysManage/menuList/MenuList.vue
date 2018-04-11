<template>
	<div>
	 <Row>
    <Col :span="24" class="header-search">
      <Input class="dlb w300"
        placeholder="请输入菜单名"
        icon="search"
        v-model="keywords">
       </Input>

       <span class="dlb ml20">
          <Button v-permission="'sys:menu:save'" class="mr5" type="primary" icon="plus-round" @click="newDialog()">新增</Button>
          <Button v-permission="'sys:menu:delete'" type="primary" icon="trash-a" @click="deleteMenu()">删除</Button>
       </span>

    </Col>
   </Row>

   <Row class="body-content">
     <Col :span="24">
        <CheckboxGroup v-model="multipleSelection">
          <table class="table">
            <colgroup span="8"></colgroup>
            <col width="200">
            <thead>
              <tr>
                <th>选择</th>
                <th>菜单编号</th>
                <th>菜单名称</th>
                <th>菜单Url</th>
                <th>菜单图标</th>
                <th>菜单类型</th>
                <th>上级菜单</th>
                <th>菜单描述</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="menu in menuList">
                <td><Checkbox :key="menu.id" :label="menu.id" class="hidden-label"></Checkbox></td>
                <td>{{menu.id}}</td>
                <td>{{menu.menuName}}</td>
                <td>{{menu.menuUrl}}</td>
                <td><span>{{menu.menuIcon}}</span></td>
                <td>
                  <span>
                    <Tag color="blue" v-if="menu.menuType == 1">目录</Tag>
                    <Tag color="green" v-if="menu.menuType == 2">菜单</Tag>
                    <Tag color="red" v-if="menu.menuType == 3">按钮</Tag>
                  </span>
                </td>
                <td>{{menu.parentName}}</td>
                <td>{{menu.description}}</td>
                <td>
                  <span>
                    <Button v-permission="'sys:menu:update'" class="mr5" type="primary" icon="edit" @click="modifyDialog(menu.id)">修改</Button>
                    <Button v-permission="'sys:menu:delete'" type="primary" icon="trash-a" @click="deleteMenu(menu.id)">删除</Button>
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </CheckboxGroup>
				<mt-none style="padding: 20px;" :show="menuList.length == 0" size="large" />
        <div class="page-wrap">
          <Page
           layout="total,prev, pager, next"
           :total="page.totalCount"
           show-total
           :page-size="page.pageSize"
           :current-page="page.currentPage"
           @on-change="handleCurrentChange">
          </Page>
        </div>
     </Col>
   </Row>

    <!--创建菜单弹框-->
    <Modal
      title="新增菜单"
      v-model="modal.new"
      :mask-closable="false">
      <Form :model="form" :rules="rules" ref="newModal" :label-width="100">
        <FormItem label="菜单类型">
          <RadioGroup v-model="form.menuType">
            <Radio label="1">目录</Radio>
            <Radio label="2">菜单</Radio>
            <Radio label="3">按钮</Radio>
          </RadioGroup>
        </FormItem>
        <div v-if="form.menuType==1">
          <FormItem label="目录名称" prop="menuName">
            <Input v-model="form.menuName"></Input>
          </FormItem>
          <FormItem label="目录地址" prop="menuUrl">
            <Input v-model="form.menuUrl"></Input>
          </FormItem>
          <FormItem label="目录图标">
             <Input v-model="form.menuIcon"></Input>
          </FormItem>
          <FormItem label="排序">
            <Input v-model="form.seq"></Input>
          </FormItem>
          <FormItem label="目录描述">
            <Input type="textarea" v-model="form.description" autosize></Input>
          </FormItem>
        </div>
        <div v-if="form.menuType==2">
          <FormItem label="菜单名称" prop="menuName">
            <Input v-model="form.menuName"></Input>
          </FormItem>
          <FormItem label="菜单地址" prop="menuUrl">
            <Input v-model="form.menuUrl"></Input>
          </FormItem>
          <FormItem label="菜单标识">
            <Input v-model="form.perms"></Input>
          </FormItem>
          <FormItem label="菜单图标">
             <Input v-model="form.menuIcon"></Input>
          </FormItem>
          <FormItem label="排序">
            <Input v-model="form.seq"></Input>
          </FormItem>
          <FormItem label="所属上级">
            <Select v-model="form.parentId" placeholder="请选择" @change="selectionChange">
              <Option
                v-for="item in menuIdlist"
                :label="item.menuName"
                :value="item.id">
              </Option>
            </Select>
          </FormItem>
          <FormItem label="菜单描述" prop="description">
            <Input type="textarea" v-model="form.description" autosize></Input>
          </FormItem>
        </div>
        <div v-if="form.menuType==3">
          <FormItem label="按钮名称" prop="menuName">
            <Input v-model="form.menuName"></Input>
          </FormItem>
          <FormItem label="按钮标识">
            <Input v-model="form.perms"></Input>
          </FormItem>
          <FormItem label="按钮图标">
             <Input v-model="form.menuIcon"></Input>
          </FormItem>
          <FormItem label="排序">
            <Input v-model="form.seq"></Input>
          </FormItem>
          <FormItem label="所属上级">
             <Cascader :data="buttonIdList" change-on-select v-model="form.parentIds"></Cascader>
          </FormItem>
          <FormItem label="按钮描述" prop="description">
            <Input type="textarea" v-model="form.description" autosize></Input>
          </FormItem>
        </div>
      </Form>
      <div slot="footer">
          <Button  @click="handleReset">取消</Button>
          <Button type="primary" @click="newMenu('newModal')">确认</Button>
      </div>
    </Modal>

    <!--修改菜单弹框-->
    <Modal
      title="修改菜单"
      v-model="modal.modify"
      :mask-closable="false">
      <Form :model="form" :rules="rules" ref="modifyModal" :label-width="100">
        <FormItem label="菜单类型" prop="menuType">
          <RadioGroup v-model="form.menuType">
            <Radio v-if="form.menuType==1" disabled  label="1">目录</Radio>
            <Radio v-if="form.menuType==2" disabled  label="2">菜单</Radio>
            <Radio v-if="form.menuType==3" disabled  label="3">按钮</Radio>
          </RadioGroup>
        </FormItem>
        <div v-if="form.menuType==1">
          <FormItem label="目录名称" prop="menuName">
            <Input v-model="form.menuName"></Input>
          </FormItem>
          <FormItem label="目录地址" prop="menuUrl">
            <Input v-model="form.menuUrl"></Input>
          </FormItem>
          <FormItem label="目录图标">
             <Input v-model="form.menuIcon"></Input>
          </FormItem>
          <FormItem label="排序">
            <Input v-model="form.seq"></Input>
          </FormItem>
          <FormItem label="目录描述">
            <Input type="textarea" v-model="form.description" autosize></Input>
          </FormItem>
        </div>
        <div v-if="form.menuType==2">
          <FormItem label="菜单名称" prop="menuName">
            <Input v-model="form.menuName"></Input>
          </FormItem>
          <FormItem label="菜单地址" prop="menuUrl">
            <Input v-model="form.menuUrl"></Input>
          </FormItem>
          <FormItem label="菜单标识">
            <Input v-model="form.perms"></Input>
          </FormItem>
          <FormItem label="菜单图标">
             <Input v-model="form.menuIcon"></Input>
          </FormItem>
          <FormItem label="排序">
            <Input v-model="form.seq"></Input>
          </FormItem>
          <FormItem label="所属上级">
            <Select v-model="form.parentId" placeholder="请选择">
                <Option
                  v-for="item in menuIdlist"
                  :label="item.menuName"
                  :value="item.id">
                </Option>
            </Select>
          </FormItem>
          <FormItem label="菜单描述" prop="description">
            <Input type="textarea" v-model="form.description" autosize></Input>
          </FormItem>
        </div>
        <div v-if="form.menuType==3">
          <FormItem label="按钮名称" prop="menuName">
            <Input v-model="form.menuName"></Input>
          </FormItem>
          <FormItem label="按钮标识" prop="perms">
            <Input v-model="form.perms" disabled></Input>
          </FormItem>
          <FormItem label="按钮图标">
             <Input v-model="form.menuIcon"></Input>
          </FormItem>
          <FormItem label="排序">
            <Input v-model="form.seq"></Input>
          </FormItem>
          <FormItem label="所属上级">
            <Cascader :data="buttonIdList" change-on-select v-model="form.parentIds"></Cascader>
          </FormItem>
          <FormItem label="按钮描述" prop="description">
            <Input type="textarea" v-model="form.description" autosize></Input>
          </FormItem>
        </div>
      </Form>
      <div slot="footer">
          <Button  @click="handleReset">取消</Button>
          <Button type="primary" @click="modifyMenu('modifyModal')">确认</Button>
      </div>
    </Modal>

	</div>
</template>

<script>
import MenuList from './MenuList.js'
export default MenuList
</script>

<style scoped>
.header
{
  padding-bottom: 20px;
}
</style>
