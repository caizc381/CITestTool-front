<template>
  <div>
    <div class="form-term">
      <div class="form-header-title">
        <span class="fl">手机站点设置</span>
        <a v-if="!isEdit" v-permission="'hospitalManage:list:siteEdit'" class="fr" @click="clickEdit"><Icon type="edit"></Icon>编辑</a>
      </div>
      <Form :model="organizationVo" :label-width="140" ref="newHos">
        <FormItem label="站点模板" style="font-weight: bold;">
        </FormItem>
        <FormItem label="模板：">
          <span v-if="!isEdit" class="detailfont">{{hospital.templateName}}</span>
          <div v-if="isEdit">
             <Select v-model="organizationVo.templateId" style="width:400px">
               <Option
                 v-for="template in templateList"
                 :label="template.name"
                 :value="template.id">
               </Option>
             </Select>
             <a :href="url" target="_blank">查看模板种类</a>
          </div>
        </FormItem>
        <FormItem label="色调：">
          <span v-if="!isEdit" class="detailfont">{{hospital.cssName}}</span>
          <div v-if="isEdit">
            <Select v-model="organizationVo.cssId" style="width:400px">
             <Option
               v-for="css in cssIdList"
               :label="css.name"
               :value="css.id">
             </Option>
            </Select>
          </div>
        </FormItem>

        <div class="parting-line"></div>

        <FormItem label="域名设置" style="font-weight: bold;">
        </FormItem>
        <FormItem label="C端网址：" :class="{'ivu-form-item-required':isEdit}">
          <span v-if="!isEdit" class="detailfont">https://www.mytijian.com/m/{{hospital.url}}</span>
          <div v-if="isEdit">
            <Input v-model="organizationVo.url" style="width:50%;" placeholder="网址后缀，最多16个字符，由字符和数字组成">
                <span slot="prepend">https://www.mytijian.com/m/</span>
            </Input>
            <span class="red" v-if="isRepeatUrl">网址不可用！</span>
          </div>
        </FormItem>

        <div class="parting-line"></div>

        <FormItem label="主Banner图片：" style="font-weight: bold;">
        </FormItem>
        <div style="padding:0 15px;">
         <!-- 展示态 -->
          <table v-if="!isEdit" class="table">
            <thead>
              <tr>
                <th>序号</th>
                <th>文件名</th>
                <th>预览图</th>
                <th>链接</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(banner,index) in hospital.mobileMainBannerRes">
                <td>{{index+1}}</td>
                <td>{{banner.name}}</td>
                <td>
                  <img class="remoteImg" :src="imageRemoteSite+banner.value" />
                </td>
                <td>
                  <span>{{banner.linkUrl}}</span>
                </td>
              </tr>
            </tbody>
          </table>
          <!-- 编辑态 -->
          <div v-if="isEdit" class="mb10">
            <label class="imgUpload">
              <input type="file" id="mainBanner" @change="uploadImage('mainBanner','mobileMainBannerRes','mobileMainBannerList')" />
              <Button type="ghost" icon="ios-cloud-upload-outline">上传图片</Button>
            </label>
            <div class="gray mt10">可上传多张,支持扩展名:.jpg,.png</div>
          </div>
          <table v-if="isEdit" class="table">
            <thead>
              <tr>
                <th>序号</th>
                <th>文件名</th>
                <th>预览图</th>
                <th>链接</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(banner,index) in organizationVo.mobileMainBannerRes">
                <td>{{index+1}}</td>
                <td>{{banner.name}}</td>
                <td>
                  <img v-if="banner.id" class="remoteImg" :src="imageRemoteSite+banner.value" />
                  <img v-if="!banner.id" class="remoteImg" :src="banner.value" />
                </td>
                <td>
                  <Input type="textarea" :maxlength="500" v-model="banner.linkUrl" placeholder="可输入图片链接地址" style="width:90%"></Input>
                </td>
                <td>
                  <Button type="text" @click="deleteItem('mobileMainBannerRes',banner)">删除</Button>
                  <Button type="text" v-if="index !== 0" @click="moveItem('mobileMainBannerRes',banner,-1)">上移</Button>
                  <Button type="text" v-if="index !== (organizationVo.mobileMainBannerRes.length-1)" @click="moveItem('mobileMainBannerRes',banner,1)">下移</Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="parting-line"></div>

        <FormItem label="副Banner图片：" style="font-weight: bold;">
        </FormItem>
        <div style="padding:0 15px;">
          <!-- 展示态 -->
          <table v-if="!isEdit" class="table">
            <thead>
              <tr>
                <th>序号</th>
                <th>文件名</th>
                <th>预览图</th>
                <th>链接</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(banner,index) in hospital.mobileDeputyBannerRes">
                <td>{{index+1}}</td>
                <td>{{banner.name}}</td>
                <td>
                  <img class="remoteImg" :src="imageRemoteSite+banner.value" />
                </td>
                <td>
                  <span>{{banner.linkUrl}}</span>
                </td>
              </tr>
            </tbody>
          </table>
          <!-- 编辑态 -->
          <div v-if="isEdit" class="mb10">
            <label class="imgUpload">
              <input type="file" id="deputyBanner" @change="uploadImage('deputyBanner','mobileDeputyBannerRes','mobileDeputyBannerList')" />
              <Button type="ghost" icon="ios-cloud-upload-outline">上传图片</Button>
            </label>
            <div class="gray mt10">可上传多张,支持扩展名:.jpg,.png</div>
          </div>
          <table v-if="isEdit" class="table">
            <thead>
              <tr>
                <th>序号</th>
                <th>文件名</th>
                <th>预览图</th>
                <th>链接</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(banner,index) in organizationVo.mobileDeputyBannerRes">
                <td>{{index+1}}</td>
                <td>{{banner.name}}</td>
                <td>
                  <img v-if="banner.id" class="remoteImg" :src="imageRemoteSite+banner.value" />
                  <img v-if="!banner.id" class="remoteImg" :src="banner.value" />
                </td>
                <td>
                  <Input type="textarea" :maxlength="500" v-model="banner.linkUrl" placeholder="可输入图片链接地址" style="width:90%"></Input>
                </td>
                <td>
                  <Button type="text" @click="deleteItem('mobileDeputyBannerRes',banner)">删除</Button>
                  <Button type="text" v-if="index !== 0" @click="moveItem('mobileDeputyBannerRes',banner,-1)">上移</Button>
                  <Button type="text" v-if="index !== (organizationVo.mobileDeputyBannerRes.length-1)" @click="moveItem('mobileDeputyBannerRes',banner,1)">下移</Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="parting-line"></div>

        <FormItem label="通用图片：" style="font-weight: bold;">
        </FormItem>
        <div style="padding:0 15px;overflow:hidden">
          <!-- 通用图片 -->
          <div class="currency">
            <div>LOGO:</div>

            <div v-if="!isEdit">
               <img v-if="hospital.logoRes" class="remoteImg" :src="imageRemoteSite + hospital.logoRes.value" />
               <img v-if="!hospital.logoRes" class="remoteImg" style="width: 120px; height: 120px; border:1px solid #eee;" />
            </div>

            <div v-if="isEdit">
              <div>
                <img v-if="organizationVo.logoRes" class="remoteImg" :src="organizationVo.logoRes.showPath" />
                <img v-if="!organizationVo.logoRes" class="remoteImg" style="width: 120px; height: 120px; border:1px solid #eee;" />
              </div>
              <div>
                <label class="imgUpload">
                  <input type="file" @change="updateRes($event,'logoRes')" />
                  <Button type="ghost">更新图片</Button>
                </label>
              </div>
            </div>

          </div>

          <div class="currency">
            <div>微信公众号二维码:</div>

            <div v-if="!isEdit">
               <img v-if="hospital.qrCodeRes" class="remoteImg" :src="imageRemoteSite + hospital.qrCodeRes.value" />
               <img v-if="!hospital.qrCodeRes" class="remoteImg" style="width: 120px; height: 120px; border:1px solid #eee;" />
            </div>

            <div v-if="isEdit">
              <div>
                <img v-if="organizationVo.qrCodeRes" class="remoteImg" :src="organizationVo.qrCodeRes.showPath" />
                <img v-if="!organizationVo.qrCodeRes" class="remoteImg" style="width: 120px; height: 120px; border:1px solid #eee;" />
              </div>
              <div>
                <label class="imgUpload">
                  <input type="file" @change="updateRes($event,'qrCodeRes')" />
                  <Button type="ghost">更新图片</Button>
                </label>
              </div>
            </div>

          </div>

          <div class="currency">
            <div>医院封面:</div>

            <div v-if="!isEdit">
              <img v-if="hospital.coverRes" class="remoteImg" :src="imageRemoteSite + hospital.coverRes.value" />
              <img v-if="!hospital.coverRes" class="remoteImg" style="width: 120px; height: 120px; border:1px solid #eee;"/>
            </div>

            <div v-if="isEdit">
              <div>
                <img v-if="organizationVo.coverRes" class="remoteImg" :src="organizationVo.coverRes.showPath" />
                <img v-if="!organizationVo.coverRes" class="remoteImg" style="width: 120px; height: 120px; border:1px solid #eee;"/>
              </div>
              <div >
                <label class="imgUpload">
                  <input type="file" @change="updateRes($event,'coverRes')" />
                  <Button type="ghost">更新图片</Button>
                </label>
              </div>
            </div>

          </div>
          <div v-if="isEdit" class="mt10 gray clear">建议尺寸120px*120px,支持扩展名:.jpg,.png</div>
        </div>

        <div class="parting-line"></div>

        <FormItem label="医院环境图片：" style="font-weight: bold;">
        </FormItem>
        <div style="padding:0 15px;">
          <!-- 展示态 -->
          <table class="table" v-if="!isEdit">
            <thead>
              <tr>
                <th>序号</th>
                <th>文件名</th>
                <th>预览图</th>
                <th>链接</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(banner,index) in hospital.environmentRes">
                <td>{{index+1}}</td>
                <td>{{banner.name}}</td>
                <td>
                  <img class="remoteImg" :src="imageRemoteSite+banner.value" />
                </td>
                <td>
                  <span>{{banner.linkUrl}}</span>
                </td>
              </tr>
            </tbody>
          </table>
          <!-- 编辑态 -->
          <div v-if="isEdit" class="mb10">
            <label class="imgUpload">
              <input type="file" id="environment" @change="uploadImage('environment','environmentRes','environmentList')" />
              <Button type="ghost" icon="ios-cloud-upload-outline">上传图片</Button>
            </label>
            <div class="gray mt10">可上传多张,支持扩展名:.jpg,.png</div>
          </div>
          <table v-if="isEdit" class="table">
            <thead>
              <tr>
                <th>序号</th>
                <th>文件名</th>
                <th>预览图</th>
                <th>链接</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(banner,index) in organizationVo.environmentRes">
                <td>{{index+1}}</td>
                <td>{{banner.name}}</td>
                <td>
                  <img v-if="banner.id" class="remoteImg" :src="imageRemoteSite+banner.value" />
                  <img v-if="!banner.id" class="remoteImg" :src="banner.value" />
                </td>
                <td>
                  <Input type="textarea" :maxlength="500" v-model="banner.linkUrl" placeholder="可输入图片链接地址" style="width:90%"></Input>
                </td>
                <td>
                  <Button type="text" @click="deleteItem('environmentRes',banner)">删除</Button>
                  <Button type="text" v-if="index !== 0" @click="moveItem('environmentRes',banner,-1)">上移</Button>
                  <Button type="text" v-if="index !== (organizationVo.environmentRes.length-1)" @click="moveItem('environmentRes',banner,1)">下移</Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="errorInfo" class="error ml15">{{errorInfo}}</div>

        <div style="padding:20px 15px;" v-if="isEdit">
            <Button v-if="!uploading" type="primary" @click="save()">保存</Button>
            <Button v-if="uploading" type="ghost">保存中...</Button>
            <Button type="ghost" style="margin-left: 8px" @click="cancelValidate()">取消</Button>
        </div>
      </Form>
    </div>

  </div>
</template>

<script>
var co = require('co');

export default {
  name: 'mobileSite',
  data() {
    return {
      organizationVo: {
        cover: {},
        cssId: '',
        environmentList: [],
        hospitalId: '',
        logo: '',
        mobileDeputyBannerList: [],
        mobileMainBannerList: [],
        qrCode: {},
        templateId: '',
        url:'',
      },
      isEdit: false,
      isRepeatUrl: false,
      imageRemoteSite: '',
      url: '',

      mobileMainBannerList: [],
      mobileDeputyBannerList: [],
      environmentList: [],
      logoFile: '',
      qrCodeFile: '',
      coverFile: '',
      uploading: false,
      errorInfo: undefined
    }
   },

  props: ['hospital', 'templateList', 'cssIdList'],

  mounted() {
    this.url = location.href.split('#')[0] + '#/preview';
    this.imageRemoteSite = MyUtil.imageRemoteSite();
  },

  methods: {

    //验证地址是否重复
    verifyUrl () {
      if(!this.organizationVo.url){
        return false;
      }
      this.$http.get('/validateUrl?url='+this.organizationVo.url).then((response) => {
          this.isRepeatUrl = false;
      }, (res) => {
          this.isRepeatUrl = true;
      });
    },

    save () {
      if(!this.organizationVo.url){
        this.errorInfo = '网址不能为空！';
        return false;
      }
      if(this.organizationVo.url && !MyUtil.isUrl(this.organizationVo.url)){
        this.errorInfo = '格式不正确,请输入16位以内的字母或数字!';
        return false;
      }

      this.uploading = true;
      let hosPath = '/hospital/' + this.organizationVo.hospitalId + '/';
      let self = this;
      // 利用 generator / co 在同步写法

      co(function* () {

        for (let i=0; i<self.mobileMainBannerList.length; i++) {
          yield OssClient.addOssObject(hosPath + 'mobile_main_banner/', self.mobileMainBannerList[i]);
        }

        for (let i=0; i<self.mobileDeputyBannerList.length; i++) {
          yield OssClient.addOssObject(hosPath + 'mobile_deputy_banner/', self.mobileDeputyBannerList[i]);
        }

        for (let i=0; i<self.environmentList.length; i++) {
          yield OssClient.addOssObject(hosPath + 'big/', self.environmentList[i]);
        }

        if (self.organizationVo.logoRes && !self.organizationVo.logoRes.id) {
          yield OssClient.addOssObject(hosPath, self.organizationVo.logoRes.file);
        }

        if (self.organizationVo.coverRes && !self.organizationVo.coverRes.id) {
          yield OssClient.addOssObject(hosPath + 'cover/', self.organizationVo.coverRes.file);
        }

        if (self.organizationVo.qrCodeRes && !self.organizationVo.qrCodeRes.id) {
          yield OssClient.addOssObject(hosPath, self.organizationVo.qrCodeRes.file);
        }

        self.setImgSequence();
        yield self.$http.post('/updateHospitalSiteInfo', JSON.stringify(self.organizationVo)).then((response) => {
            self.$Message.success('操作成功');
            self.isEdit = false;
            self.$emit('reload');
            self.uploading = false;
            self.errorInfo = undefined
        }, (res) => {
          self.uploading = false;
          self.$Message.error(res.text);
        });

      }).catch(function (err) {
        self.uploading = false;
      });

    },

    setImgSequence() {
      this.organizationVo.mobileMainBannerRes = this.organizationVo.mobileMainBannerRes.map((item, idx) => {item.sequence = idx + 1; return item});
      this.organizationVo.mobileDeputyBannerRes = this.organizationVo.mobileDeputyBannerRes.map((item, idx) => {item.sequence = idx + 1; return item});
      this.organizationVo.environmentRes = this.organizationVo.environmentRes.map((item, idx) => {item.sequence = idx + 1; return item});
    },

    //上移下移
    moveItem(type, item,value){
      var list = this.organizationVo[type];
      for(let i=0; i<list.length; i++){
        if(list[i].name == item.name){
           var banner = list[i];
           list.splice(i,1);
           list.splice(i+value,0,banner);
           return;
        }
      }
    },

    //删除
    deleteItem(type, item){
      var list = this.organizationVo[type];
      for(let i=0; i<list.length; i++){
        if(list[i].id == item.id){
           list.splice(i,1);
           return;
        }
      }
    },

    clickEdit(){
      this.isEdit = true;
      this.organizationVo = JSON.parse(JSON.stringify(this.hospital));
       if(this.organizationVo.logoRes){
         this.organizationVo.logoRes.showPath =  this.imageRemoteSite + this.organizationVo.logoRes.value;
       }
       if(this.organizationVo.qrCodeRes){
         this.organizationVo.qrCodeRes.showPath =  this.imageRemoteSite + this.organizationVo.qrCodeRes.value;
       }
       if(this.organizationVo.coverRes){
         this.organizationVo.coverRes.showPath =  this.imageRemoteSite + this.organizationVo.coverRes.value;
       }
    },

    cancelValidate(){
      this.isEdit = false;
      this.organizationVo = JSON.parse(JSON.stringify(this.hospital));
    },

    uploadImage(id, res, list){
       var file = document.getElementById(id).files[0];

       if (!MyUtil.isValidImg(file)) {
         this.$Message.warning('只能上传10M以内的图片类型文件, 文件名只能是数字、字母、汉字及下划线');
         document.getElementById(id).value = '';
         return;
       }

       if (this.duplidateFileName(file, this.organizationVo[res])) {
         this.$Message.warning('文件名重复，请先修改文件名或删除已经存在的同名文件，再上传');
         document.getElementById(id).value = '';
         return;
       }

       var previewUrl = this.getObjectURL(file);

       this.organizationVo[res].push({
         name: file.name,
         value: previewUrl,
         sequence: this.organizationVo[res].length,
       })

       this[list].push(file);
     },

     duplidateFileName (newFile, files) {
       return files.some(item => {
         return item.name == newFile.name;
       })
     },

     updateRes(event, res){
       var file = event.target.files[0];

       if (!MyUtil.isValidImg(file)) {
         this.$Message.warning('只能上传10M以内的图片类型文件, 文件名只能是数字、字母、汉字及下划线');
         event.target.value = '';
         return;
       }

       var previewUrl = this.getObjectURL(file)

       this.organizationVo[res] = {
          name: file.name,
          value: previewUrl,
          showPath: previewUrl,
          file: file,
       }
     },

     //获取图片地址
     getObjectURL(file) {
       var url = null ;
       if (window.createObjectURL!=undefined) { // basic
          url = window.createObjectURL(file) ;
        } else if (window.URL!=undefined) { // mozilla(firefox)
          url = window.URL.createObjectURL(file) ;
        } else if (window.webkitURL!=undefined) { // webkit or chrome
          url = window.webkitURL.createObjectURL(file) ;
        }
        return url ;
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
    padding-right:5px;
  }
  #main {
  width: 480px;
  height: 480px;
 }
 .remoteImg {
   max-width: 200px;
 }
 .currency {
   display: inline-block;
   width:33%;
 }
 .imgUpload {
  position:relative;
  input {
    width: 0;
    height: 0;
    opacity: 0;
    position:absolute;
    top:0;
    left:0;
  }
}
</style>
