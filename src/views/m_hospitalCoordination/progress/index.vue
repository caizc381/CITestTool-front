<template>
  <div>
    <div class="header-search">
	    <dropdown-select
		    :options="channelList"
		    placeholder="简拼搜索体检中心"
		    :filters = "['name','pinYin']"
		    @on-change="handleCurrent"
        style="font-size:18px;">
	    </dropdown-select>
    </div>

    <div class="body-content">

      <Alert class="mt10 mb10 lh40">以下显示最近的更新记录，查询历史记录可联系运维</Alert>
       
      <table class="table table-bordered text-center user-addborder user-tab">
        <thead>
          <tr>
            <th>阶段</th>
            <th>完成时间</th>
            <th>完成人</th>
            <th>记录时间</th>
            <th>记录人</th>
            <th width="100">操作</th>
          </tr>
        </thead>            
        <tbody>
            <tr v-for="(item,index) in dataList" :key="index">
              <td>{{item.planEntity.description}}</td>
              <td>
                <span v-if="item.gmtModified || index==0">{{item.gmtModified | date('yyyy-MM-dd')}}</span>
                <span v-else class="c-or">未记录</span>
              </td>
              <td>{{item.finishUser}}</td>
              <td>{{item.gmtCreated | date('yyyy-MM-dd hh:mm:ss')}}</td>
              <td>{{item.recordUser}}</td>
              <td v-if="index!==0 && recordAuthority">
                <a v-if="item.gmtModified" @click="changeModal('update',item)">更新</a>
                <a v-else @click="changeModal('record',item)">记录</a>
              </td>
            </tr>
        </tbody>
      </table>
    </div>

    <Modal
        v-model="modal"
        title="提示">
        <Form :label-width="100">
          <FormItem label="体检中心：">
            <span>{{operateData.name}}</span>
          </FormItem>
          <FormItem label="当前阶段：">
            <span>{{operateData.status}}</span>
          </FormItem>
          <FormItem label="完成时间：">
            <DatePicker type="date"  
              v-model="operateData.gmtModified"
              :clearable=false 
              class="w200"></DatePicker>
          </FormItem>
          <FormItem label="完成人：">
            <mt-select
              style="width:200px!important"
              v-model="operateData.finishUserId"
              :options="operateData.list"
              placeholder="请选择完成人"
              :option-label="'employeeName'"
              :option-key="'id'"
              :filters="['employeeName', 'pinYin']"></mt-select>
          </FormItem>
        </Form>
        <div slot="footer">
            <a class="mr10" @click="modal=false">取消</a>
            <Button type="primary" @click="changeData()" :disabled="operateData.finishUserId=='' || operateData.gmtModified==''">确定</Button>
        </div>
    </Modal>

  </div>
</template>
<script>
import DropdownSelect from "components/ui/DropdownSelect";

import _ from "lodash";

export default {
  components: {
    "dropdown-select": DropdownSelect
  },
  name: "hosProgress",
  data() {
    return {
      channelList: [],
      dataList: [],
      currentHospitalId: "",
      curData: {}, //当前选中数据，模态框
      modal: false,
      operateData: {
        name: "",
        status: "",
        gmtModified: "",
        finishUserId: "",
        list: []
      }
    };
  },
  watch: {
    //检测所选医院，变化的时候重新获取列表
    currentHospitalId() {
      this.getDataList();
    }
  },
  computed: {
    //是否永远记录修改权限
    recordAuthority: function() {
      let a =
        localStorage.permissions
          .split(",")
          .indexOf("hospital:coordination:record") > -1;
      return a;
    }
  },
  methods: {
    //选择医院select
    handleCurrent(id) {
      this.currentHospitalId = id;
    },
    //更新、记录按钮
    changeModal(type, data) {
      this.modal = true;
      this.curData = data;
      this.operateData.name = this.channelList[
        _.findIndex(this.channelList, {"id":this.currentHospitalId})
      ].name;
      this.operateData.status = data.planEntity.description;
      this.operateData.gmtModified = data.gmtModified;
      this.operateData.finishUserId = data.finishUserId;
    },
    //更新、记录函数
    changeData() {
      let finishUser
      for(let i of this.operateData.list) {
        if(i.id==this.operateData.finishUserId) {
          finishUser = i.employeeName
        }
      }
      let pagram = {
        id: this.curData.id,
        finishUser: finishUser,
        finishUserId: this.operateData.finishUserId/1,
        planEntity: JSON.stringify({ description: this.operateData.status }),
        gmtCreated: new Date().toString(),
        gmtModified: new Date(this.operateData.gmtModified).toString(),
        recordUser: localStorage.employeeName,
        recordUserId: localStorage.CurrentUserId
      };
      this.$http.post("/work/updateJointPlan", pagram).then(
        res => {
          this.$message.success("操作成功！");
          this.modal = false;
          this.getDataList();
        },
        res => {
          this.$message.error(res.data);
        }
      );
    },
    //获取医院列表
    getMenuList() {
      this.$http.get("/hospitalList").then(
        res => {
          this.channelList = res.data;
          this.currentHospitalId = this.channelList[0].id;
        },
        err => {
          this.$message.error(err.data);
        }
      );
    },
    //获取记录人列表
    getUserList() {
      this.$http.post("/user/list", {pageSize:999}).then(
        res => {
          this.operateData.list = res.data.list;
        },
        err => {
          this.$message.error(err.data);
        }
      );
    },
    //获取数据
    getDataList() {
      this.$http
        .post("/work/listJointPlan", { hospitalId: this.currentHospitalId })
        .then(
          res => {
            let arr = res.data;
            for (let i in arr) {
              if (arr[i].gmtCreated) {
                arr[i].gmtCreated = arr[i].gmtCreated;
              }
              if (arr[i].gmtModified) {
                arr[i].gmtModified = arr[i].gmtModified;
              }
            }
            this.dataList = arr;
          },
          err => {
            this.$message.error(err.data);
          }
        );
    }
  },
  mounted() {
    this.getUserList();
    this.getMenuList();
  }
};
</script>
<style lang="less" scoped>
.text-notice {
  height: 55px;
  border-radius: 5px;
  background: rgb(214, 237, 245);
  line-height: 55px;
  padding-left: 20px;
  color: rgb(140, 164, 170);
}
</style>
