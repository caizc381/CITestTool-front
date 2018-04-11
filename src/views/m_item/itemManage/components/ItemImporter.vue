<template>
  <div class="f14">
    <div v-if="showParentModal">
      <Row>
        <i-col :span="6" class="form-head">机构类型：</i-col>
        <i-col :span="18">
          <Select v-model="orgType" style="width: 200px;" @on-change="handleOrgTypeChange">
            <Option :key="1" value="公立医院">公立医院</Option>
            <Option :key="2" value="专业体检中心">专业体检中心</Option>
            <Option :key="3" value="民营连锁">民营连锁</Option>
          </Select>
        </i-col>
      </Row>

      <Row class="mt10" v-if="orgType != '民营连锁'">
        <i-col :span="6" class="form-head">体检中心：</i-col>
        <i-col :span="18">
          <mt-select
            style="width:200px"
            v-model="hospitalId"
            placeholder="请选择体检中心"
            :filters="['name', 'pinYin']"
            :options="hospitalList">
            </mt-select>
        </i-col>
      </Row>

      <Row class="mt10" v-if="orgType == '民营连锁'">
        <i-col :span="6" class="form-head">机构品牌：</i-col>
        <i-col :span="18">
          <mt-select
            style="width:200px"
            v-model="orgBandId"
            placeholder="请选择机构品牌"
            :option-label="'brandName'"
            :filters="['brandName']"
            :options="brandList">
            </mt-select>
        </i-col>
      </Row>

      <Row class="mt10">
        <i-col :span="6" class="form-head">单项文件：</i-col>
        <i-col :span="18">
          <Upload class="dib"
            :before-upload="handleUpload"
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            action="">
            <Button type="ghost" icon="ios-cloud-upload-outline">上传Excel文件</Button>
          </Upload>
          <a class="dib ml10" href="http://mytijian-img.oss-cn-hangzhou.aliyuncs.com/ops/体检中心单项导入模板.xlsx">下载模板</a>
          <div v-if="file !== null">{{ file.name }} </div>
        </i-col>
      </Row>

      <div class="tr">
        <Button type="text" @click="closeModal">取消</Button>
        <Button class="ml10" type="primary" @click="upload" :disabled="!file">确定</Button>
      </div>
    </div>

    <!-- 导入结果弹框 -->
    <Modal title="导入单项结果" v-model="importResultModal" :mask-closable="false" :closable="false">
      <div v-if="!importFlag">
        <div v-if="!exceptionMsg">正在导入，请稍候...</div>
        <div class="errorfont mt10">{{ exceptionMsg }}</div>
      </div>
      <div v-if="!importFlag" slot="footer" class="tr">
        <Button type="primary" @click="completeImport" v-if="!showParentModal">我知道了</Button>
      </div>

      <div v-if="importFlag == 'fail'">
        <div class="errorfont mb10">导入失败，原因参考如下：</div>
        <div v-for="err in errorList" :key="err.examItemName">
          <span class="infofont mr10">{{ err.examItemName }}</span>
          <span>{{ err.desc }}</span>
        </div>
      </div>
      <div slot="footer" v-if="importFlag == 'fail'" class="tr">
        <Button type="text" @click="closeModal">取消</Button>
        <Button class="ml10" type="primary" @click="reupload">重新上传</Button>
      </div>

      <div v-if="importFlag == 'success'">
        <div>已成功导入 <span class="infofont">{{successExamItemNumber}}</span> 个单项</div>
      </div>
      <div v-if="importFlag == 'success'" slot="footer" class="tr">
        <Button type="primary" @click="completeImport">我知道了</Button>
      </div>
      
    </Modal>

  </div>
</template>

<script>
export default {
  name: 'itemImporter',
  data() {
    return {
      file: null,

      orgType: '公立医院',
      brandList: [],
      hospitalList: [],
      hospitalId: '',
      orgBandId: '',

      successExamItemNumber: 0,
      errorList: [],
      exceptionMsg: '',
      importResultModal: false,
      importFlag: '',

      showParentModal: true
    };
  },

  methods: {
    reupload() {
      this.importResultModal = false;
      this.showParentModal = true;
    },

    completeImport() {
      this.importResultModal = false;
      this.closeModal();
    },

    handleOrgTypeChange() {
      this.hospitalId = '';
      this.orgBandId = '';
      this.getHospitalList()
    },

    closeModal() {
      this.$parent.cancel();
    },

    handleUpload(file) {
      this.file = file;
      return false;
    },

    upload() {
      if (this.orgType != '民营连锁' && !this.hospitalId) {
        this.$Message.warning('请选择体检中心');
        return;
      }

      if (this.orgType == '民营连锁' && !this.orgBandId) {
        this.$Message.warning('请选择机构品牌');
        return;
      }

      if (!this.file) {
        this.$Message.warning('请选择要上传的文件');
        return;
      }

      const formData = new FormData();
      formData.append('file', this.file);
      if (this.hospitalId) formData.append('hospitalId', this.hospitalId);
      if (this.orgBandId) formData.append('orgBandId', this.orgBandId);

      this.startImport();
      this.$http.post('/examItem/examItemImport', formData).then((res) => {
        this.file = null;

        if (res.body.success) {
          this.importFlag = 'success';
          this.successExamItemNumber = res.body.successExamItemNumber;
        } else {
          this.importFlag = 'fail';
          this.digestError(res.body.errorExamItem);
        }

        this.showParentModal = false;
      }, (err) => {
        this.exceptionMsg = err.text;
        this.showParentModal = false;
      });
    },

    startImport() {
      this.importResultModal = true;
      this.importFlag = '';
      this.exceptionMsg = '';
    },

    digestError(rawError) {
      let errorList = [];
      rawError.forEach((item) => {
        let err = { examItemName: item.errorExamItemName };
        let errAttrs = item.errorAttrs.map(e => '/' + e.name + ' ' + e.errorDesc).join(',')
        err.desc = errAttrs;
        errorList.push(err);
      })
      this.errorList = errorList
    },

    downloadTemplate() {
      this.$http.get('/examItem/examItemTemplate');
    },

    getHospitalList() {
      if (this.orgType == '民营连锁') {
        this.$http.get('/listAllOrgBrand').then(response => {
          this.brandList = response.body.filter(item => !item.isDeleted);
        });
      } else {
        this.$http.get('/hospitalList').then(response => {
          let hospitalList = response.body.filter(item => {
            return item.type == this.orgType;
          });
          this.hospitalList = hospitalList;
        });
      }

    }
  },

  mounted() {
    this.getHospitalList();

    this.$Message.config({
      top: 50,
      duration: 3
    });
  }
};
</script>

<style scoped lang="less">
.form-head {
  text-align: right;
  line-height: 30px;
  font-size: 14px;
}
</style>

