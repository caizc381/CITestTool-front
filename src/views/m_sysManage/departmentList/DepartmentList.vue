<template>
  <div>
    <Row>
      <i-col :span="24" class="header-search">
        <span class="header-tab">
           <Button v-permission="'sys:department:save'" class="mr5"  icon="plus-round" type="primary"  @click="newDialog()">新增
           </Button>
            <Button v-permission="'sys:department:update'" class="mr5"  icon="edit" type="primary"  @click="modifyDialog()">修改
           </Button>
            <Button v-permission="'sys:department:delete'"  icon="trash-a" type="primary"  @click="deleteDepartment()">删除
           </Button>
        </span>
      </i-col>
    </Row>

    <Row class="body-content">
      <i-col :span="24" class="depart-tree">
        <el-tree
          :data="departmentList"
          :props="defaultTree"
          show-checkbox
          node-key="id"
          ref="tree"
          default-expand-all
          check-strictly
          :expand-on-click-node="false"
          @check-change="getNode()">
        </el-tree>
      </i-col>
    </Row>

   <!--创建部门弹框-->
    <Modal 
      title="新建部门" 
      v-model="modal.new"
      :mask-closable="false">
      <Form :model="form" :rules="rules" ref="newModal" :label-width="80">
        <FormItem label="部门名称" prop="departmentName">
          <Input v-model="form.departmentName" />
        </FormItem>
        <FormItem label="所属上级">
          <Cascader :data="departments" v-model="form.parentIdList" change-on-select></Cascader>
        </FormItem>
        <FormItem label="所属地区">
          <Row :gutter="10">
            <i-col span="11">
              <Select v-model="form.areaId" placeholder="请选择区域" @on-change="selectionChangeA">
                <Option
                  v-for="item in areaList"
                  :label="item.areaName"
                  :value="item.id"
                  :key="item.id">
                </Option>
             </Select>
          </i-col>
          <i-col span="11">
            <Select v-model="form.provinceId" placeholder="请选择省份">
                <Option
                  v-for="item in provinceList"
                  :label="item.provinceName"
                  :value="item.id"
                  :key="item.id">
                </Option>
            </Select>
          </i-col>
         </Row>
        </FormItem>
      </Form>
      <div slot="footer">
          <Button  @click="handleReset">取消</Button>
          <Button type="primary" @click="newDepartment('newModal')">确认</Button>
      </div>
    </Modal>

    <!--修改部门弹框-->
    <Modal
      title="修改部门" 
      v-model="modal.modify"
      :mask-closable="false">
      <Form :model="form" :rules="rules" ref="modifyModal" :label-width="80">
        <FormItem label="部门名称" prop="departmentName">
          <Input v-model="form.departmentName" />
        </FormItem>
        <FormItem label="所属上级" prop="parentIdList">
          <Cascader :data="departments" v-model="form.parentIdList" change-on-select></Cascader>
        </FormItem>
        <FormItem label="所属地区">
          <Row :gutter="10">
            <i-col span="11">
              <Select v-model="form.areaId" placeholder="请选择区域" @on-change="selectionChangeA">
                <Option
                  v-for="item in areaList"
                  :label="item.areaName"
                  :value="item.id"
                  :key="item.id">
                </Option>
             </Select>
            </i-col>
            <i-col span="11">
              <Select v-model="form.provinceId" placeholder="请选择省份">
                  <Option
                    v-for="item in provinceList"
                    :label="item.provinceName"
                    :value="item.id"
                    :key="item.id">
                  </Option>
              </Select>
            </i-col>
          </Row>
        </FormItem>
      </Form>
      <div slot="footer">
          <Button  @click="handleReset">取消</Button>
          <Button type="primary" @click="modifyDepartment('modifyModal')">确认</Button>
      </div>
    </Modal>

  </div>
</template>

<script>
import DepartmentList from './DepartmentList.js'
export default DepartmentList
</script>

<style scoped>
.depart-tree{
  border:1px solid #dfe6ec;
}
</style>
