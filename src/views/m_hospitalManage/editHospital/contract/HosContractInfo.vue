<template>
  <div>
    <div class="form-term">
      <div class="form-header-title">
        <span class="fl">医院合作签约信息</span>
        <a v-if="!isEdit" v-permission="'hospitalManage:list:signEdit'" class="fr" @click="clickEdit"><Icon type="edit"></Icon>编辑</a>
      </div>
      <Form :model="organizationVo" :label-width="100" ref="newHos">

        <div v-if="!isEdit">
          <FormItem label="服务协议" style="font-weight: bold;">
          </FormItem>
          <FormItem label="生效日期：" class="dlb" style="width:33.33%">
            <span v-if="hospital.serviceContract" class="detailfont">{{hospital.serviceContract.startDate | date('yyyy-MM-dd')}}</span>
          </FormItem>
          <FormItem label="失效日期：" class="dlb" style="width:33.33%">
            <div v-if="hospital.serviceContract" class="detailfont">{{hospital.serviceContract.endDate | date('yyyy-MM-dd')}}
               <span class="ml5" :class="{'orange':hospital.serviceContract.status == 1}" v-if="hospital.serviceContract.status == 1">即将过期</span>
               <span class="ml5" :class="{'redfont':hospital.serviceContract.status == 2}" v-if="hospital.serviceContract.status == 2">已过期</span>
             </div>
          </FormItem>
          <FormItem label="特殊条款：">
            <span v-if="hospital.serviceContract" class="detailfont">{{hospital.serviceContract.clausesInfo}}</span>
          </FormItem>
          <FormItem label="合同附件：">
             <a class="contract-item" v-for="f in serviceContractFiles" :href="f.path" :download="f.path">{{f.name}}</a>
          </FormItem>

          <div class="parting-line"></div>

          <FormItem label="保密协议" style="font-weight: bold;">
          </FormItem>
          <FormItem label="生效日期：" class="dlb" style="width:33.33%">
            <span v-if="hospital.secrecyContract" class="detailfont">{{hospital.secrecyContract.startDate | date('yyyy-MM-dd')}}</span>
          </FormItem>
          <FormItem label="失效日期：" class="dlb" style="width:33.33%">
            <div v-if="hospital.secrecyContract" class="detailfont">{{hospital.secrecyContract.endDate | date('yyyy-MM-dd')}}
               <span class="ml5" :class="{'orange':hospital.secrecyContract.status == 1}" v-if="hospital.secrecyContract.status == 1">即将过期</span>
               <span class="ml5" :class="{'redfont':hospital.secrecyContract.status == 2}" v-if="hospital.secrecyContract.status == 2">已过期</span>
             </div>
          </FormItem>
          <FormItem label="特殊条款：">
            <span v-if="hospital.secrecyContract" class="detailfont">{{hospital.secrecyContract.clausesInfo}}</span>
          </FormItem>
           <FormItem label="合同附件：">
             <a class="contract-item" v-for="f in secrecyContractFiles" :href="f.path" :download="f.path">{{f.name}}</a>
           </FormItem>

          <div class="parting-line"></div>

          <FormItem label="代收协议" style="font-weight: bold;">
          </FormItem>
          <FormItem label="生效日期：" class="dlb" style="width:33.33%">
            <span v-if="hospital.collectionContract" class="detailfont">{{hospital.collectionContract.startDate | date('yyyy-MM-dd')}}</span>
          </FormItem>
          <FormItem label="失效日期：" class="dlb" style="width:33.33%">
            <div v-if="hospital.collectionContract" class="detailfont">{{hospital.collectionContract.endDate | date('yyyy-MM-dd')}}
               <span class="ml5" :class="{'orange':hospital.collectionContract.status == 1}" v-if="hospital.collectionContract.status == 1">即将过期</span>
               <span class="ml5" :class="{'redfont':hospital.collectionContract.status == 2}" v-if="hospital.collectionContract.status == 2">已过期</span>
             </div>
          </FormItem>
          <FormItem label="特殊条款：">
            <span v-if="hospital.collectionContract" class="detailfont">{{hospital.collectionContract.clausesInfo}}</span>
          </FormItem>
           <FormItem label="合同附件：">
             <a class="contract-item" v-for="f in collectionContractFiles" :href="f.path" :download="f.path">{{f.name}}</a>
           </FormItem>

           <div class="parting-line"></div>

          <FormItem label="折扣协议" style="font-weight: bold;">
          </FormItem>
          <FormItem label="生效日期：" class="dlb" style="width:33.33%">
            <span v-if="hospital.discountContract" class="detailfont">{{hospital.discountContract.startDate | date('yyyy-MM-dd')}}</span>
          </FormItem>
          <FormItem label="失效日期：" class="dlb" style="width:33.33%">
            <div v-if="hospital.discountContract" class="detailfont">{{hospital.discountContract.endDate | date('yyyy-MM-dd')}}
               <span class="ml5" :class="{'orange':hospital.discountContract.status == 1}" v-if="hospital.discountContract.status == 1">即将过期</span>
               <span class="ml5" :class="{'redfont':hospital.discountContract.status == 2}" v-if="hospital.discountContract.status == 2">已过期</span>
             </div>
          </FormItem>
          <FormItem label="特殊条款：">
            <span v-if="hospital.discountContract" class="detailfont">{{hospital.discountContract.clausesInfo}}</span>
          </FormItem>
           <FormItem label="合同附件：">
             <a class="contract-item" v-for="f in discountContractFiles" :href="f.path" :download="f.path">{{f.name}}</a>
           </FormItem>

        </div>

        <div v-if="isEdit">
          <FormItem label="服务协议" style="font-weight: bold;">
          </FormItem>
          <FormItem label="生效日期：" class="dlb" style="width:33.33%">
              <DatePicker type="date" v-model="organizationVo.serviceContract.startDate" placeholder="选择日期" style="width: 200px"></DatePicker>
          </FormItem>
          <FormItem label="失效日期：" class="dlb" style="width:33.33%">
              <DatePicker type="date" v-model="organizationVo.serviceContract.endDate" placeholder="选择日期" style="width: 200px"></DatePicker>
              <a class="primaryfont invalid-bor" @click="calculateTime('serviceContract',1)">1年</a>
              <a class="primaryfont invalid-bor" @click="calculateTime('serviceContract',2)">2年</a>
              <a class="primaryfont pl5" @click="calculateTime('serviceContract',3)">3年</a>
          </FormItem>
          <FormItem label="特殊条款：">
             <Input  type="textarea" :maxlength="5000" v-model="organizationVo.serviceContract.clausesInfo" placeholder="特殊条款" style="width:90%"></Input>
          </FormItem>
          <FormItem label="合同附件：">
            <mt-uploader
            @on-remove="deleteFile"
            button-text="上传文件"
            @on-change="uploadServiceContractImg($event)"
            :files="organizationVo.serviceContract.appendixInfo">

            </mt-uploader>
          </FormItem>

          <div class="parting-line"></div>

          <FormItem label="保密协议" style="font-weight: bold;">
          </FormItem>
          <FormItem label="生效日期：" class="dlb" style="width:33.33%">
              <DatePicker type="date" v-model="organizationVo.secrecyContract.startDate" placeholder="选择日期" style="width: 200px"></DatePicker>
          </FormItem>
          <FormItem label="失效日期：" class="dlb" style="width:33.33%">
              <DatePicker type="date" v-model="organizationVo.secrecyContract.endDate" placeholder="选择日期" style="width: 200px"></DatePicker>
              <a class="primaryfont invalid-bor" @click="calculateTime('secrecyContract',1)">1年</a>
              <a class="primaryfont invalid-bor" @click="calculateTime('secrecyContract',2)">2年</a>
              <a class="primaryfont pl5" @click="calculateTime('secrecyContract',3)">3年</a>
          </FormItem>
          <FormItem label="特殊条款：">
             <Input  type="textarea" :maxlength="5000" v-model="organizationVo.secrecyContract.clausesInfo" placeholder="特殊条款" style="width:90%"></Input>
          </FormItem>
          <FormItem label="合同附件：">

            <mt-uploader
            @on-remove="deleteFile"
            button-text="上传文件"
            @on-change="uploadSecrecyContractImg($event)"
            :files="organizationVo.secrecyContract.appendixInfo">
            </mt-uploader>
          </FormItem>

          <div class="parting-line"></div>

          <FormItem label="代收协议" style="font-weight: bold;">
          </FormItem>
          <FormItem label="生效日期：" class="dlb" style="width:33.33%">
              <DatePicker type="date" v-model="organizationVo.collectionContract.startDate" placeholder="选择日期" style="width: 200px"></DatePicker>
          </FormItem>
          <FormItem label="失效日期：" class="dlb" style="width:33.33%">
              <DatePicker type="date" v-model="organizationVo.collectionContract.endDate" placeholder="选择日期" style="width: 200px"></DatePicker>
              <a class="primaryfont invalid-bor" @click="calculateTime('collectionContract',1)">1年</a>
              <a class="primaryfont invalid-bor" @click="calculateTime('collectionContract',2)">2年</a>
              <a class="primaryfont pl5" @click="calculateTime('collectionContract',3)">3年</a>
          </FormItem>
          <FormItem label="特殊条款：">
             <Input  type="textarea" :maxlength="5000" v-model="organizationVo.collectionContract.clausesInfo" placeholder="特殊条款" style="width: 90%"></Input>
          </FormItem>
          <FormItem label="合同附件：">
            <mt-uploader
            @on-remove="deleteFile"
            button-text="上传文件"
            @on-change="uploadCollectionContractImg($event)"
            :files="organizationVo.collectionContract.appendixInfo">
            </mt-uploader>

          </FormItem>

          <div class="parting-line"></div>

          <FormItem label="折扣协议" style="font-weight: bold;">
          </FormItem>
          <FormItem label="生效日期：" class="dlb" style="width:33.33%">
              <DatePicker type="date" v-model="organizationVo.discountContract.startDate" placeholder="选择日期" style="width: 200px"></DatePicker>
          </FormItem>
          <FormItem label="失效日期：" class="dlb" style="width:33.33%">
              <DatePicker type="date"  v-model="organizationVo.discountContract.endDate" placeholder="选择日期" style="width: 200px"></DatePicker>
              <a class="primaryfont invalid-bor" @click="calculateTime('discountContract',1)">1年</a>
              <a class="primaryfont invalid-bor" @click="calculateTime('discountContract',2)">2年</a>
              <a class="primaryfont pl5" @click="calculateTime('discountContract',3)">3年</a>
          </FormItem>
          <FormItem label="特殊条款：">
             <Input  type="textarea" :maxlength="5000" v-model="organizationVo.discountContract.clausesInfo" placeholder="特殊条款" style="width:90%"></Input>
          </FormItem>
          <FormItem label="合同附件：">
            <mt-uploader
            @on-remove="deleteFile"
            button-text="上传文件"
            @on-change="uploadDiscountContractImg($event)"
            :files="organizationVo.discountContract.appendixInfo">
            </mt-uploader>
          </FormItem>

        </div>

        <FormItem>
          <div v-if="errorInfoStatus" class="error">{{errorInfo}}</div>
        </FormItem>

        <FormItem v-if="isEdit">
            <Button type="primary" @click="save()">保存</Button>
            <Button type="ghost" style="margin-left: 8px" @click="cancelValidate()">取消</Button>
        </FormItem>
      </Form>
    </div>

  </div>
</template>

<script>
import Uploader from 'components/ui/Uploader'
var co = require('co');

export default {
  name: 'HosContractInfo',
  components: {
    'mt-uploader': Uploader,
  },
  data() {
    return {
      organizationVo: {
        serviceContract: {
          appendixInfo: [],
          clausesInfo: '',
          endDate: '',
          id: '',
          startDate: '',
          type: '',
        },
        secrecyContract: {
          appendixInfo: [],
          clausesInfo: '',
          endDate: '',
          id: '',
          startDate: '',
          type: '',
        },
        collectionContract: {
          appendixInfo: [],
          clausesInfo: '',
          endDate: '',
          id: '',
          startDate: '',
          type: '',
        },
        discountContract: {
          appendixInfo: [],
          clausesInfo: '',
          endDate: '',
          id: '',
          startDate: '',
          type: '',
        }
      },
      isEdit: false,
      imageRemoteSite: '',
      errorInfoStatus: false,
      errorInfo: ''
    }
  },

  props: ['hospital','hospitalId'],

  filters: {
     imgName: function(value){
       if(!value){
          return null;
       }else{
         if(value.indexOf('jpg') > 0 || value.indexOf('jpg') > 0){
            var str = value.split('/')
            return str[str.length -1]
         }else{
            return null;
         }

       }
     }
  },

  computed: {
    serviceContractFiles() {
      let s = (!this.hospital.serviceContract || typeof this.hospital.serviceContract.appendixInfo === 'object') ? '' : this.hospital.serviceContract.appendixInfo;
      return this.parseToFileList(s);
    },
    secrecyContractFiles() {
      let s = (!this.hospital.secrecyContract || typeof this.hospital.secrecyContract.appendixInfo === 'object') ? '' : this.hospital.secrecyContract.appendixInfo;
      return this.parseToFileList(s);
    },
    collectionContractFiles() {
      let s = (!this.hospital.collectionContract || typeof this.hospital.collectionContract.appendixInfo === 'object') ? '' : this.hospital.collectionContract.appendixInfo;
      return this.parseToFileList(s);
    },
    discountContractFiles() {
      let s = (!this.hospital.discountContract || typeof this.hospital.discountContract.appendixInfo === 'object') ? '' : this.hospital.discountContract.appendixInfo;
      return this.parseToFileList(s);
    },
  },

  mounted() {
    this.imageRemoteSite = MyUtil.imageRemoteSite();
  },

  methods: {
    save(){
      let hosPath = '/hospital/' + this.hospitalId + '/contract/';
      let self = this;
      co(function* () {
        for (let i=0; i<self.organizationVo.serviceContract.appendixInfo.length; i++) {
          let file = self.organizationVo.serviceContract.appendixInfo[i];
          if (file.isAdd) {
            yield OssClient.addOssObject(hosPath + 'serviceContract/', file.source);
          }
          if (file.isDelete) {
            yield OssClient.deleteOssObject(hosPath + 'serviceContract/', file);
          }
        }

        for (let i=0; i<self.organizationVo.secrecyContract.appendixInfo.length; i++) {
          let file = self.organizationVo.secrecyContract.appendixInfo[i];
          if (file.isAdd) {
            yield OssClient.addOssObject(hosPath + 'secrecyContract/', file.source);
          }
          if (file.isDelete) {
            yield OssClient.deleteOssObject(hosPath + 'secrecyContract/', file);
          }
        }

        for (let i=0; i<self.organizationVo.collectionContract.appendixInfo.length; i++) {
          let file = self.organizationVo.collectionContract.appendixInfo[i];
          if (file.isAdd) {
            yield OssClient.addOssObject(hosPath + 'collectionContract/', file.source);
          }
          if (file.isDelete) {
            yield OssClient.deleteOssObject(hosPath + 'collectionContract/', file);
          }
        }

        for (let i=0; i<self.organizationVo.discountContract.appendixInfo.length; i++) {
          let file = self.organizationVo.discountContract.appendixInfo[i];
          if (file.isAdd) {
            yield OssClient.addOssObject(hosPath + 'discountContract/', file.source);
          }
          if (file.isDelete) {
            yield OssClient.deleteOssObject(hosPath + 'discountContract/', file);
          }
        }

        var organization = [];

        self.organizationVo.serviceContract.organizationId = self.hospitalId
        self.organizationVo.serviceContract.type = 1

        self.organizationVo.secrecyContract.organizationId = self.hospitalId
        self.organizationVo.secrecyContract.type = 2

        self.organizationVo.collectionContract.organizationId = self.hospitalId
        self.organizationVo.collectionContract.type = 3

        self.organizationVo.discountContract.organizationId = self.hospitalId
        self.organizationVo.discountContract.type = 4

        organization.push(self.organizationVo.serviceContract)
        organization.push(self.organizationVo.secrecyContract)
        organization.push(self.organizationVo.collectionContract)
        organization.push(self.organizationVo.discountContract)

        let copy = JSON.parse(JSON.stringify(organization));
        copy.map(item => {
          if(item.appendixInfo){
             item.appendixInfo = item.appendixInfo.filter(it => {return !it.isDelete;}).map(item1 => {
              return item1.relativePath;
            });
            item.appendixInfo = item.appendixInfo.join(':')
            return item;
          }
        })

        yield ()=>{
          self.verificateDate() && self.$http.post('/editSignInfo',JSON.stringify(copy)).then((response) => {
            self.$Message.success('操作成功');
            self.isEdit = false;
            self.errorInfoStatus = false;
            self.$emit('reload');
          }, (res) => {
              self.$Message.error(res.text);
          });
        } 
      })
    },
    
    //校验失效时间和生效时间
    verificateDate(){
      if((this.organizationVo.serviceContract.startDate && !this.organizationVo.serviceContract.endDate)||(this.organizationVo.secrecyContract.startDate && !this.organizationVo.secrecyContract.endDate)||(this.organizationVo.collectionContract.startDate && !this.organizationVo.collectionContract.endDate)||(this.organizationVo.discountContract.startDate && !this.organizationVo.discountContract.endDate)){
         this.errorInfo = '请选择失效日期';
         this.errorInfoStatus = true;
         return false;
      }
      else if((!this.organizationVo.serviceContract.startDate && this.organizationVo.serviceContract.endDate)||(!this.organizationVo.secrecyContract.startDate && this.organizationVo.secrecyContract.endDate)||(!this.organizationVo.collectionContract.startDate && this.organizationVo.collectionContract.endDate)||(!this.organizationVo.discountContract.startDate && this.organizationVo.discountContract.endDate)){
         this.errorInfo = '请选择生效日期';
         this.errorInfoStatus = true;
         return false;
      }else{
         return true;
      }
    },

    clickEdit(){
      this.isEdit = true;
      if(this.hospital.serviceContract){
        this.organizationVo.serviceContract = JSON.parse(JSON.stringify(this.hospital.serviceContract))
        this.organizationVo.serviceContract.appendixInfo = this.parseToFileList(this.hospital.serviceContract.appendixInfo);
      }

      if(this.hospital.secrecyContract){
        this.organizationVo.secrecyContract = JSON.parse(JSON.stringify(this.hospital.secrecyContract))
        this.organizationVo.secrecyContract.appendixInfo = this.parseToFileList(this.hospital.secrecyContract.appendixInfo);
      }

      if(this.hospital.collectionContract){
        this.organizationVo.collectionContract = JSON.parse(JSON.stringify(this.hospital.collectionContract))
        this.organizationVo.collectionContract.appendixInfo = this.parseToFileList(this.hospital.collectionContract.appendixInfo);
      }

      if(this.hospital.discountContract){
        this.organizationVo.discountContract = JSON.parse(JSON.stringify(this.hospital.discountContract))
        this.organizationVo.discountContract.appendixInfo = this.parseToFileList(this.hospital.discountContract.appendixInfo);
      }

    },

    parseToFileList(fileStr = '') {
      let files = [];
      let temp = fileStr.split(':');
      temp.forEach(item => {
        if(item){
          let f = {};
          f.id = Math.random();
          f.name = item.substr(item.lastIndexOf('/') + 1);
          f.path = this.imageRemoteSite + item;
          f.relativePath = item;
          files.push(f);
        }
      });

      return files;
    },

    cancelValidate(){
      this.isEdit = false;
    },

    //计算时间
    calculateTime( filed, value){
      if(this.organizationVo[filed].startDate){
         this.organizationVo[filed].endDate = this.transform(this.organizationVo[filed].startDate,value);
      }else{
         var now = new Date();
         this.organizationVo[filed].startDate = now.toLocaleDateString();
         this.organizationVo[filed].endDate = this.transform(this.organizationVo[filed].startDate,value);
      }
    },

    transform(time,value){
      var currentTime = new Date(time);
      var year = currentTime.getFullYear()+value;
      var month = currentTime.getMonth()+1;
      var day = currentTime.getDate();
      return year+'-'+month+'-'+day;
    },

    deleteFile(f) {
      // this.hospital.serviceContract.appendixInfo
      // this.hospital.discountContract.appendixInfo
      // this.hospital.collectionContract.appendixInfo
      // this.hospital.secrecyContract.appendixInfo
      if (f.isAdd) {
        this.organizationVo.serviceContract.appendixInfo = this.organizationVo.serviceContract.appendixInfo.filter(item => {
          return item.id != f.id;
        })
        this.organizationVo.discountContract.appendixInfo = this.organizationVo.discountContract.appendixInfo.filter(item => {
          return item.id != f.id;
        })
        this.organizationVo.collectionContract.appendixInfo = this.organizationVo.collectionContract.appendixInfo.filter(item => {
          return item.id != f.id;
        })
        this.organizationVo.secrecyContract.appendixInfo = this.organizationVo.secrecyContract.appendixInfo.filter(item => {
          return item.id != f.id;
        })
      } else {

        this.organizationVo.serviceContract.appendixInfo = this.organizationVo.serviceContract.appendixInfo.map(item => {
          if (f.id == item.id) {
            item.isDelete = true;
          }
          return item;
        })

        this.organizationVo.discountContract.appendixInfo = this.organizationVo.discountContract.appendixInfo.map(item => {
          if (f.id == item.id) {
            item.isDelete = true;
          }
          return item;
        })

        this.organizationVo.collectionContract.appendixInfo = this.organizationVo.collectionContract.appendixInfo.map(item => {
          if (f.id == item.id) {
            item.isDelete = true;
          }
          return item;
        })

        this.organizationVo.secrecyContract.appendixInfo = this.organizationVo.secrecyContract.appendixInfo.map(item => {
          if (f.id == item.id) {
            item.isDelete = true;
          }
          return item;
        })
      }
    },

    uploadServiceContractImg(event) {
      if (!this.validateImg(event)) {
        return;
      }

      let file = event.target.files[0];
      let hosPath = this.imageRemoteSite + '/hospital/' + this.hospitalId + '/contract/';
      let f = {
        id: Math.random(),
        name: file.name,
        path: hosPath + 'serviceContract/' + file.name,
        relativePath: 'hospital/' + this.hospitalId + '/contract/serviceContract/' + file.name,
        source: file,
        isAdd: true,
      }

      this.organizationVo.serviceContract.appendixInfo.push(f);
    },

    uploadSecrecyContractImg(event) {
      if (!this.validateImg(event)) {
        return;
      }

      let file = event.target.files[0];
      let hosPath = this.imageRemoteSite + '/hospital/' + this.hospitalId + '/contract/';
      let f = {
        id: Math.random(),
        name: file.name,
        path: hosPath + 'secrecyContract/' + file.name,
        relativePath: 'hospital/' + this.hospitalId + '/contract/secrecyContract/' + file.name,
        source: file,
        isAdd: true,
      }

      this.organizationVo.secrecyContract.appendixInfo.push(f);
    },

    uploadCollectionContractImg(event) {
      if (!this.validateImg(event)) {
        return;
      }

      let file = event.target.files[0];
      let hosPath = this.imageRemoteSite + '/hospital/' + this.hospitalId + '/contract/';
      let f = {
        id: Math.random(),
        name: file.name,
        path: hosPath + 'collectionContract/' + file.name,
        relativePath: 'hospital/' + this.hospitalId + '/contract/collectionContract/' + file.name,
        source: file,
        isAdd: true,
      }

      this.organizationVo.collectionContract.appendixInfo.push(f);
    },

    uploadDiscountContractImg(event) {
      if (!this.validateImg(event)) {
        return;
      }

      let file = event.target.files[0];
      let hosPath = this.imageRemoteSite + '/hospital/' + this.hospitalId + '/contract/';
      let f = {
        id: Math.random(),
        name: file.name,
        path: hosPath + 'discountContract/' + file.name,
        relativePath: 'hospital/' + this.hospitalId + '/contract/discountContract/' + file.name,
        source: file,
        isAdd: true,
      }

      this.organizationVo.discountContract.appendixInfo.push(f);
    },

    validateImg(event) {
      var file = event.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        this.$Message.warning('只能上传10M以内文件');
        event.target.value = '';
        return false;
      }
      return true;
    },

  }
}
</script>

<style scoped>
  .form-header-title {
    clear: both;
    overflow: hidden;
  }
  .ivu-icon-edit:before {
    padding-right: 5px;
  }
  #main {
  width: 480px;
  height: 480px;
 }
 .linkToImg {
   color: #19be6b;
 }
 .invalid-bor {
   border-right: 1px solid #2d8cf0;
   padding: 0 5px;
 }
 .contract-item {
   display: block;
 }
</style>
