<template>
 <div>
    <div class="header-search">
      <Input
        class="search"
        placeholder="中文或者拼音搜索"
        icon="search"
        v-model="queryList.keywords" />

      <span class="ml15 mr5 mt5">
        <span class="fs">显示废除项:</span>
        <i-switch size="large" v-model="delItem">
          <span slot="open">ON</span>
          <span slot="close">OFF</span>
        </i-switch>
      </span>

      <span class="total mt5">
        (共找到<span class="red">{{itemList.length}}</span>条,包含<span class="red">{{delItemConut}}</span>条废除项)
      </span>

      <Button class="fr mr10" type="primary" @click="importItemModal = true"><Icon type="android-exit" class="f14"></Icon> 导入体检中心单项</Button>
      
    </div>

    <div class="item-main body-content" style="padding-top: 0px;">
      <div class="item-main-left bdr-r">
        <div style="height: 40px;">
          <span v-if="multipleSelection.length>0">已选{{multipleSelection.length}}条</span>
          <span>
            <span class="ops-query mr5" v-for="item in showList" v-if="item.value" :key="item.value">
              <span>{{item.text}}</span><a @click="clearQuery(item)" class="pl5"><Icon type="close"></Icon></a>
            </span>
          </span>
          <span>
            <Button class="fr" type="primary" icon="plus-round" @click="dialogNew = !dialogNew">新增标准单项</Button>
          </span>
        </div>

        <div class="hide-tab" v-if="multipleSelection.length > 0">
          <span class="tab-check">
           <Checkbox
            :indeterminate="indeterminate"
            :value="checkAll"
            @click.prevent.native="handleCheckAll"></Checkbox>
          </span>
          <a class="tab-delete" @click="deleteItem(2)"><Icon class="mr5" type="trash-a"></Icon><span class='tab-color'>废除</span></a>
          <a class="tab-use" @click="deleteItem(1)"><Icon class="mr5" type="checkmark-circled"></Icon><span class='tab-color'>设为可用</span></a>
          <span class="tab-sty"></span>
          <span class="tab-crm fs">
            <Dropdown trigger="click">
              <a href="javascript:void(0)">
                CRM分类
                <Icon type="arrow-down-b"></Icon>
              </a>
              <Dropdown-menu slot="list">
                <Dropdown-item v-for="crm in crmList" @click.native="updateCrmType(crm.value)" :key="crm.value">{{crm.text}}</Dropdown-item>
              </Dropdown-menu>
           </Dropdown>
          </span>
          <span class="tab-customer fs">
            <Dropdown trigger="click">
                <a href="javascript:void(0)">
                  客户分类
                  <Icon type="arrow-down-b"></Icon>
                </a>
                <Dropdown-menu slot="list">
                  <Dropdown-item v-for="client in clientList" @click.native="updateClientType(client.value)" :key="client.value">{{client.text}}</Dropdown-item>
                </Dropdown-menu>
            </Dropdown>
          </span>
        </div>

        <div class="check-table-wrap" v-bind:style="{'height': height}">
          <Checkbox
            v-if="multipleSelection.length==0"
            class="check-page"
            :indeterminate="indeterminate"
            :value="checkAll"
            @click.prevent.native="handleCheckAll">
          </Checkbox>
          <table class="table">
              <thead v-if="multipleSelection.length==0">
                <tr>
                  <th style="width: 60px;"></th>
                  <th style="width: 60px;">序号</th>
                  <th>体检项目</th>
                  <th>
                    <Dropdown trigger="click">
                        <span class="ivu-dropdown hoverblue">
                          CRM分类 <i style="font-size:12px;" class="iconfont icon-guolvqi"></i>
                        </span>
                        <Dropdown-menu slot="list">
                          <Dropdown-item v-for="crm in crmList" @click.native="getQueryList(crm, 'crm')" :key="crm.value">{{crm.text}}</Dropdown-item>
                        </Dropdown-menu>
                    </Dropdown>
                  </th>
                  <th>
                    <Dropdown trigger="click">
                        <span class="ivu-dropdown hoverblue">
                          客户分类 <i style="font-size:12px;" class="iconfont icon-guolvqi"></i>
                        </span>
                        <Dropdown-menu slot="list">
                            <Dropdown-item v-for="client in clientList" @click.native="getQueryList(client, 'client')" :key="client.value">{{client.text}}</Dropdown-item>
                        </Dropdown-menu>
                    </Dropdown>
                  </th>
                  <th>状态</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="item in filteredData" @click="selectCurrentRow(item)" :class="{'currentRow': currentId == item.id}" :key="item.id">
                  <td><mt-checkbox :key="item.id" :checked="isChecked(item)" @on-check="handleCheck(item)"></mt-checkbox></td>
                  <td>{{item.id}}</td>
                  <td style="width:300px;">{{item.name}}</td>
                  <td>
                    <div v-for="crm in crmList" :key="crm.value">
                      <span v-if="crm.value == item.crmClassify">{{crm.text}}</span>
                    </div>
                  </td>
                  <td>
                    <div v-for="client in clientList" :key="client.value">
                      <span v-if="client.value == item.clientClassify">{{client.text}}</span>
                    </div>
                  </td>
                  <td>
                    <span>
                      <Tag :color="item.status == '1' ? 'green' : 'red'">{{item.status == '1' ? "正常":"废除"}}</Tag>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
        </div>
      </div> 

      <div class="item-main-right">
        <div class="tr bdr-b pb10">
          <span>
            <Button type="primary" @click="updateItem()">保存</Button>
            <Button class="ml10" type="text" @click="cancelUpdate()">取消</Button>
          </span>
        </div>

        <div style="clear: both; overflow-y: auto;padding-top: 10px;" v-bind:style="{'height': height}">
          <Form :model="editForm" :label-width="80">
             <div class="form-sty">项目信息 (ID: {{editForm.id}})</div>
             <FormItem label="项目名称">
               <Input v-model="editForm.name" />
             </FormItem>
             <FormItem label="性别">
               <RadioGroup v-model="editForm.gender" type="button">
                 <Radio label="2">不限</Radio>
                 <Radio label="0">男</Radio>
                 <Radio label="1">女</Radio>
               </RadioGroup>
             </FormItem>
             <FormItem label="CRM分类">
               <Select v-model="editForm.crmClassify" style="width:200px" placeholder="请选择CRM分类">
                  <Option v-for="item in crmList" :value="item.value" :key="item.value">{{ item.text }}</Option>
              </Select>
             </FormItem>
             <FormItem label="客户分类">
               <Select v-model="editForm.clientClassify" style="width:200px" placeholder="请选择客户分类">
                  <Option v-for="item in clientList" :value="item.value" :key="item.value">{{ item.text }}</Option>
              </Select>
             </FormItem>
             <FormItem label="适宜人群">
               <Input type="textarea" v-model="editForm.fitPeople" />
             </FormItem>
             <FormItem label="不适人群">
               <Input type="textarea" v-model="editForm.unfitPeople" />
             </FormItem>
             <FormItem label="项目简述">
               <Input type="textarea" v-model="editForm.description" :autosize="{ minRows: 4, maxRows: 4}" />
             </FormItem>
             <FormItem label="项目详情">
               <Input type="textarea" v-model="editForm.detail" :autosize="{ minRows: 6, maxRows: 6}" />
             </FormItem>
           </Form>
        </div>

      </div>
    </div>

    <!--创建医院任务弹框-->
    <Modal
        title="创建单项"
        v-model="dialogNew"
        @on-ok="newItem('newForm')"
        @on-cancel="handleReset('newForm')"
        :mask-closable="false">
        <Form :model="newForm" :rules="rules" ref="newForm" :label-width="80">
          <FormItem label="项目名称" prop="name">
            <Input v-model="newForm.name" />
          </FormItem>
          <FormItem label="性别">
            <RadioGroup v-model="newForm.gender" type="button">
              <Radio label="2">不限</Radio>
              <Radio label="0">男</Radio>
              <Radio label="1">女</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="CRM分类">
            <Select v-model="newForm.crmClassify" style="width:200px" placeholder="请选择CRM分类">
              <Option v-for="item in crmList" :value="item.value" :key="item.value">{{ item.text }}</Option>
            </Select>
         </FormItem>
         <FormItem label="客户分类">
           <Select v-model="newForm.clientClassify" style="width:200px" placeholder="请选择客户分类">
              <Option v-for="item in clientList" :value="item.value" :key="item.value">{{ item.text }}</Option>
           </Select>
          </FormItem>
          <FormItem label="适宜人群" prop="fitPeople">
            <Input type="textarea" v-model="newForm.fitPeople" />
          </FormItem>
          <FormItem label="不适人群" prop="unfitPeople">
            <Input type="textarea" v-model="newForm.unfitPeople" />
          </FormItem>
          <FormItem label="项目简述" prop="description">
            <Input type="textarea" v-model="newForm.description" :autosize="{ minRows: 4, maxRows: 4}" />
          </FormItem>
          <FormItem label="项目详情" prop="detail">
            <Input type="textarea" v-model="newForm.detail" :autosize="{ minRows: 6, maxRows: 6}" />
          </FormItem>
        </Form>
        <div slot="footer" class="dialog-footer">
          <Button type="text" @click="dialogNew = false">取消</Button>
          <Button type="primary" @click="newItem('newForm')">确定</Button>
        </div>
    </Modal>

    <!-- 导入体检中心单项弹框 -->
    <Modal title="导入单项" v-model="importItemModal" footer-hide>
      <item-importer v-if="importItemModal"/>
    </Modal>

</div>
</template>

<script>
import ItemManage from "./ItemManage.js";
export default ItemManage;
</script>

<style scoped lang="less">
.itemManage-search {
  display: block;
  clear: both;
  overflow: hidden;
  margin-bottom: 10px;
}
.search {
  display: inline-block;
  width: 200px;
}
.total {
  font-size: 14px;
  margin-left: 10px;
}
.form-sty {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 22px;
  margin-left: 10px;
}
.mr5 {
  margin-right: 5px;
}
.hide-tab {
  height: 45px;
  line-height: 45px;
  background-color: #eef1f6;
}
.tab-check {
  margin: 0 15px;
}
.tab-delete {
  margin: 0 15px;
  cursor: pointer;
}
.tab-use {
  margin: 0 15px;
  cursor: pointer;
}
.tab-sty {
  width: 0;
  height: 30px;
  border: 1px solid #ccc;
  margin: 0 10px;
}
.tab-crm {
  margin: 0 15px;
  cursor: pointer;
}
.tab-customer {
  margin: 0 15px;
  cursor: pointer;
}
.tab-color {
  color: #58b7ff;
}
.tab-color:hover {
  color: #1d8ce0;
}
.icon {
  color: #8492a6;
}
.red {
  color: #db7f6a;
  padding: 0 2px;
}
.currentRow {
  background: #eef1f6;
}
.check-table-wrap {
  position: relative;
  max-height: 100%;
  overflow-y: auto;
  clear: both;
  .check-page {
    position: absolute;
    top: 13px;
    left: 15px;
  }
}
.item-main {
  .item-main-left {
    float: left;
    width: 60%;
    padding: 10px;
    padding-left: 0px;
  }
  .item-main-right {
    float: right;
    width: 40%;
    max-height: 80%;
    padding-top: 10px;
    overflow-y: auto;
  }
  .table tr:hover {
    background-color: #eef1f6;
  }
}
</style>
