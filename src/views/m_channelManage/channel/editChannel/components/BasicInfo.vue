<template>
  <div>
    <div class="form-term">
      <div class="form-header-title">
        <span class="fl">基本信息</span>
        <a v-if="!isEdit" class="fr" @click="clickEdit"><Icon type="edit"></Icon>编辑</a>
      </div>

      <Form :model="newChannel" :label-width="120" ref="newChannel">
        <FormItem label="基本信息" style="font-weight: bold;">
        </FormItem>
        <div v-if="isEdit">
        	<FormItem label="机构名称：" class="dlb pct33 ivu-form-item-required">
	          <Input type="text" :maxlength="30" v-model="newChannel.organization.name" placeholder="请输入机构名称" class="pct90">
	          </Input>
	        </FormItem>
	        <FormItem label="机构类型：" class="dlb pct33 ivu-form-item-required">
	           <Select v-model="newChannel.organization.type" class="pct90">
	             <Option v-for="org in jkList" :value="org">{{ org }}</Option>
	           </Select>
	        </FormItem>
	        <FormItem label="体检电话：" class="dlb pct33 ivu-form-item-required">
	          <Input type="text" v-model="newChannel.organization.phone" placeholder="体检电话" class="pct90"> 
	          </Input>
	        </FormItem>
	        <FormItem label="团检电话：" class="dlb pct33 ivu-form-item-required">
	          <Input type="text" v-model="newChannel.organization.groupExamTel" placeholder="团检电话" class="pct90"> 
	          </Input>
	        </FormItem>
	        <br/>
	        <FormItem label="客服电话：" class="dlb pct33 ivu-form-item-required">
	          <Input type="text" v-model="newChannel.organization.serviceTel" placeholder="客服电话" class="pct90"> 
	          </Input>
	        </FormItem>
	        <FormItem label="技术支持：" class="dlb pct33 ivu-form-item-required">
	          <Input type="text" v-model="newChannel.organization.technicalTel" placeholder="技术支持" class="pct90"> 
	          </Input>
	        </FormItem>
	        <FormItem label="地区：" class="dlb pct33 ivu-form-item-required">
	          <Cascader 
	           class="dlb"
	           :data="areaList" 
	           v-model="addressIds"
	           :clearable="true"
	           :change-on-select="true">
	         </Cascader>
	        </FormItem>
	        <FormItem label="详细地址：" class="dlb pct33 ivu-form-item-required">
	          <Input type="text" v-model="newChannel.organization.address.address" class="w300" placeholder="请输入详细地址" :maxlength="50">
	          </Input>
	        </FormItem>
	        <FormItem label="经纬度：" class="ivu-form-item-required">
	            <Input type="text" v-model="newChannel.organization.longitude" placeholder="经度" class="w300">
	            </Input>
	            <Input type="text" v-model="newChannel.organization.latitude" placeholder="维度" class="w300">
	            </Input>
	            <a @click="openMap()">通过地图拾取</a>
	        </FormItem>
          <FormItem label="C端网址：" class="dlb pct33 ivu-form-item-required">
            <Input 
             type="text" 
             v-model="newChannel.organization.url" 
             placeholder="请输入c端网址" 
             :maxlength="16"
             @on-blur="checkUrl()">
            </Input>
            <div class="redfont" v-show="isValidUrl">网址已存在！</div>
          </FormItem>

	        <div class="parting-line"></div>

	        <FormItem label="详细信息" style="font-weight: bold;">
	        </FormItem>
	        <FormItem label="医院标签：">
	          <Input  type="text"  v-model="newChannel.organization.keywords" placeholder="请输入关键词，关键词用‘|’隔开，如‘健康管理|专业体检中心’" class="pct90"> 
	          </Input>
	        </FormItem>
	        <FormItem label="简介：">
	          <Input type="textarea" v-model="newChannel.organization.briefIntro" :maxlength="500" placeholder="最多500字" class="pct90">
	          </Input>
	        </FormItem>
	        <FormItem label="详细介绍：">
	          <Input type="textarea" v-model="newChannel.organization.detailIntro" :maxlength="500" placeholder="最多500字" class="pct90">
	          </Input>
	        </FormItem>
	        <FormItem label="体检须知：">
	          <Input type="textarea" v-model="newChannel.organization.examNotice" placeholder="最多500字" class="pct90">
	          </Input>
	        </FormItem>

	        <div class="parting-line"></div>

	        <FormItem label="管理员设置" style="font-weight: bold;">
	        </FormItem>
	        <FormItem label="账号：" class="ivu-form-item-required pct90">
	          <Input 
            type="text" 
            v-model="newChannel.manager.username" 
            placeholder="账号" 
            class="pct90"
            :disabled="$route.params.channelId !== 'new' && newChannel.manager.username !== null"
            @on-blur="checkAccount()"></Input>
            <div class="redfont" v-show="isValidName">账号已存在！</div>
	        </FormItem>
	        <FormItem label="姓名：" class="ivu-form-item-required pct90">
	          <Input type="text" v-model="newChannel.manager.name" placeholder="姓名" class="pct90"></Input>
	        </FormItem>
	        <FormItem label="手机号：" class="ivu-form-item-required pct90">
	          <Input type="text" v-model="newChannel.manager.mobile" placeholder="手机号" class="pct90">
	          </Input>
	        </FormItem>
	        <FormItem label="性别：" class="ivu-form-item-required pct90">
	           <RadioGroup v-model="newChannel.manager.gender">
	              <Radio label="0">男</Radio>
	              <Radio label="1">女</Radio>
	          </RadioGroup>
	        </FormItem>
	        <FormItem>
	          <div v-if="errorInfo" class="error">{{errorInfo}}</div>
	        </FormItem>
        </div>

        <div v-if="!isEdit && channel">
        	<FormItem label="机构名称：" class="dlb pct33">
	          <span class="detailfont">{{channel.organization.name}}</span>
	        </FormItem>
	        <FormItem label="机构类型：" class="dlb pct33">
	          <span class="detailfont">{{channel.organization.type}}</span>
	        </FormItem>
	        <FormItem label="体检电话：" class="dlb pct33">
	          <span class="detailfont">{{channel.organization.phone}}</span>
	        </FormItem>
	        <FormItem label="团检电话：" class="dlb pct33">
	          <span class="detailfont">{{channel.organization.groupExamTel}}</span>
	        </FormItem>
	        <br/>
	        <FormItem label="客服电话：" class="dlb pct33">
	          <span class="detailfont">{{channel.organization.serviceTel}}</span>
	        </FormItem>
	        <FormItem label="技术支持：" class="dlb pct33">
	          <span class="detailfont">{{channel.organization.technicalTel}}</span>
	        </FormItem>
	        <FormItem label="地区：" class="dlb pct33">
	          <span class="detailfont">{{channel.organization.address.province}}{{channel.organization.address.city}}{{channel.organization.address.district}}</span>
	        </FormItem>
	        <FormItem class="dlb pct33" label="详细地址：">
	          <span class="detailfont">{{channel.organization.address.address}}</span>
	        </FormItem>
	        <FormItem  label="经纬度：">
	          <span class="detailfont">{{channel.organization.longitude}},{{channel.organization.latitude}}</span>
	          <a class="ml5" @click="getAddress()">预览</a>
	        </FormItem>
          <FormItem label="C端网址：" class="dlb pct33">
            <span class="detailfont">{{channel.organization.url}}</span>
          </FormItem>

	        <div class="parting-line"></div>

	        <FormItem label="详细信息" style="font-weight: bold;">
	        </FormItem>
	        <FormItem label="医院标签：">
	          <span  class="detailfont">{{channel.organization.keywords}}</span>
	        </FormItem>
	        <FormItem label="简介：">
	          <span class="detailfont">{{channel.organization.briefIntro}}</span>
	        </FormItem>
	        <FormItem label="详细介绍：">
	          <span class="detailfont">{{channel.organization.detailIntro}}</span>
	        </FormItem>
	        <FormItem label="体检须知：">
	          <span class="detailfont">{{channel.organization.examNotice}}</span>
	        </FormItem>

	        <div class="parting-line"></div>

	        <FormItem label="管理员设置" style="font-weight: bold;">
	        </FormItem>
	        <FormItem label="账号：" class="pct90">
	          <span class="detailfont">{{channel.manager.username}}</span>
	        </FormItem>
	        <FormItem label="姓名：" class="pct90">
	          <span class="detailfont">{{channel.manager.name}}</span>
	        </FormItem>
	        <FormItem label="手机号：" class="pct90">
	          <span class="detailfont">{{channel.manager.mobile}}</span>
	        </FormItem>
	        <FormItem label="性别：" class="pct90">
	           <span class="detailfont">{{channel.manager.gender ? '女':'男'}}</span>
	        </FormItem>
        </div>

        <FormItem v-if="isEdit">
            <Button type="primary" @click="verifyRequired()">保存</Button>
            <Button type="ghost" style="margin-left: 8px" @click="cancelValidate()">取消</Button>
        </FormItem>

      </Form>
    </div>

    <Modal 
     title="地图" 
     v-model="previewMap"
     :closable='false'
     :mask-closable="false"> 
      <div id="mapContainer"></div>
      <div slot="footer">
         <Button type="primary" @click="previewMap = false">确定</Button>
      </div>
   </Modal>

   <Modal 
     title="获取经纬度" 
     v-model="showMap"
     :closable='false'
     :mask-closable="false"> 
      <div class="mapTip">
          <input type="text" id="keyword" name="keyword" value="请输入关键字：(选定后搜索)" onfocus='this.value=""' class="ivu-input"  style="width:480px;"/>
      </div>
      <div id="main"></div>
      <div class="mt20" v-if="newChannel.organization.latitude || newChannel.organization.longitude">当前经纬度：{{newChannel.organization.longitude}},{{newChannel.organization.latitude}}</div>
      <div slot="footer">
         <Button @click="showMap = false">取消</Button>
         <Button type="primary" @click="showMap = false">确定</Button>
      </div>
   </Modal>

  </div>
</template>

<script>
export default {
  name: 'basicInfo',
  data() {
    return {
    	jkList: ['普通体检中介','网络平台客户','集团客户'],
    	newChannel:{
        organization: {
          name: '',
          phone: '',
          serviceTel: '',
          url: '',
          type: '',
          groupExamTel: '',
          technicalTel: '',
          address: {
            address: '',
            id: '',
            province: '',
            city: '',
            district: '',
            longitude: '',
            latitude: '',
          },
          keywords: '',
          briefIntro: '',
          detailIntro: '',
          examNotice: '',
        },
        manager: {
          username: '',
          name: '',
          mobile: '',
          gender: '',
        },  
    	},
      addressIds: [],
    	ableBasic: true,
    	isEdit: undefined,
    	previewMap: false,
    	showMap: false,
    	areaList: [],
    	errorInfo: undefined,
      isValidUrl: false,
      isValidName: false,
    }
  },

  props: ['channel'],

  mounted() {
    if(this.$route.params.channelId == 'new'){
      this.isEdit = true;
    }else{
      this.isEdit = false;
    }
    this.getAreaList();
  },

  methods: {

  	save(){
      this.newChannel.organization.organizationType = 2;
      this.newChannel.organization.address.id = this.addressIds[this.addressIds.length-1];

      this.$http.post('/organization/add',JSON.stringify(this.newChannel)).then((response) => {
        this.$Message.success('操作成功!');
        this.isEdit = false;
        this.errorInfo = undefined;
        if(this.$route.params.channelId == 'new'){
          this.$router.push('/channelManage/channelList'); 
        }else{
          this.$emit('reload');
        }
      }, (res) => {
          this.$Message.error(res.text);
      });
  	},

    verifyRequired(){

      if (!this.newChannel.organization.name) {
        this.errorInfo = '机构名称不能为空';
        return false;
      }
      if (!this.newChannel.organization.type) {
        this.errorInfo = '机构类型不能为空';
        return false;
      }
      if (!this.newChannel.organization.phone) {
        this.errorInfo = '体检电话不能为空';
        return false;
      }
      if (!MyUtil.isPhone(this.newChannel.organization.phone)) {
        this.errorInfo = '体检电话不正确';
        return false;
      }
      if (!this.newChannel.organization.groupExamTel) {
        this.errorInfo = '团检电话不能为空';
        return false;
      }
      if (!MyUtil.isPhone(this.newChannel.organization.groupExamTel)) {
        this.errorInfo = '团检电话不正确';
        return false;
      }
      if (!this.newChannel.organization.serviceTel) {
        this.errorInfo = '客服电话不能为空';
        return false;
      }
      if (!MyUtil.isPhone(this.newChannel.organization.serviceTel)) {
        this.errorInfo = '客服电话不正确';
        return false;
      }
      if (!this.newChannel.organization.technicalTel) {
        this.errorInfo = '技术支持电话不能为空';
        return false;
      }
      if (!MyUtil.isPhone(this.newChannel.organization.technicalTel)) {
        this.errorInfo = '技术支持电话不正确';
        return false;
      }
      if (!this.newChannel.organization.url) {
        this.errorInfo = 'C端网址必填';
        return false;
      }
      if(this.newChannel.organization.url && !MyUtil.isUrl(this.newChannel.organization.url)){
        this.errorInfo = '格式不正确,请输入16位以内的字母或数字!';
        return false;
      }
      if (this.addressIds == 0) {
        this.errorInfo = '地区必选';
        return false;
      }
      if (!this.newChannel.organization.longitude || !this.newChannel.organization.latitude) {
        this.errorInfo = '经纬度必填';
        return false;
      }
      if (!this.newChannel.manager.username) {
        this.errorInfo = '管理员账号必填';
        return false;
      }
      if (!this.newChannel.manager.name) {
        this.errorInfo = '管理员姓名必填';
        return false;
      }
      if (!this.newChannel.manager.mobile) {
        this.errorInfo = '管理员手机号必填';
        return false;
      }
      if (!MyUtil.isPhone(this.newChannel.manager.mobile)) {
        this.errorInfo = '管理员手机号不正确';
        return false;
      }

      if(this.newChannel.manager.gender === ''){
        this.errorInfo = '管理员性别必选';
        return false;
      }

      if(!this.isValidUrl && !this.isValidName){
        this.save();
      }
    },
    
    //检查C端网址后缀是否存在
    checkUrl(){
      var url = '/validateSite?url='+this.newChannel.organization.url;
      if(this.newChannel.organization.siteId){
        url += '&siteId=' + this.newChannel.organization.siteId
      }

      this.$http.get(url).then((response) => {   
        if (response.result == 1) {
          this.isValidUrl = true;
        }else {
          this.isValidUrl = false;
        }
      }, (res) => {
          this.isValidUrl = false;
      });
    },
   
    //检查账号是否存在
    checkAccount(){
      let url = '/validateUserName?userName=' + this.newChannel.manager.username + '&organizationType=2';

      this.$http.get(url).then((response) => {
        if (response.result == 1) {
          this.isValidName = true;
        }else {
          this.isValidName = false;
        }
      }, (res) => {
          this.isValidUrl = false;
      });
    },

  	//获取地址信息
    getAreaList(){
      this.$http.get('/areaAddress').then((response) => {
        this.areaList = response.body.provinces;
      }, (res) => {
          this.$Message.error(res.text);
      });
    },

    clickEdit(){
      this.isEdit = true;
      this.newChannel = JSON.parse(JSON.stringify(this.channel));
      this.addressIds = this.channel.addressIds;
    },

    cancelValidate(){
      this.isEdit = false;
      this.errorInfo = undefined;
      if(this.$route.params.channelId == 'new'){
        this.$router.push('/channelManage/channelList'); 
      }else{
        this.$emit('reload');
      }
    },

  	getAddress(){

     this.previewMap = true;
     var lnglatXY=[this.channel.organization.longitude || 120.201641, this.channel.organization.latitude || 30.248911];//地图上所标点的坐标
     var title = this.channel.organization.name;
      
     var map = new AMap.Map('mapContainer',{
          resizeEnable: true,
          zoom: 13,
          center:lnglatXY
      });

      var marker = new AMap.Marker({
          position:lnglatXY,
          title: title,
          map:map
      });
    },

     //获取经纬度
    openMap(){
      this.showMap = true;
      let _this = this;

      var map = new AMap.Map("main", {
              resizeEnable: true,
              zoom: 13,//地图显示的缩放级别
              keyboardEnable: false
      });

      AMap.plugin(['AMap.Autocomplete','AMap.PlaceSearch','AMap.Geocoder'],function(){

        var autoOptions = {
          input: "keyword"//使用联想输入的input的id
        }
        var autocomplete= new AMap.Autocomplete(autoOptions);

        var placeSearch = new AMap.PlaceSearch({
              map:map
        })

        var marker = new AMap.Marker({
           map:map
        });

        var geocoder = new AMap.Geocoder();

        if(_this.newChannel.organization.longitude && _this.newChannel.organization.latitude){
            var lnglatXY=[_this.newChannel.organization.longitude, _this.newChannel.organization.latitude];//地图上所标点的坐标
            geocoder.getAddress(lnglatXY, function(status, result) {
                if (status === 'complete' && result.info === 'OK') {
                   marker.setPosition(lnglatXY)
                   map.setCenter(marker.getPosition())
                }else{
                   //获取地址失败
                }
            });  
        }else{
           // var address =  _this.newChannel.organization.address.province +  _this.newChannel.organization.address.address;
           var provinceName = _this.newChannel.organization.address.province || _this.getProvinceName(_this.addressIds);
           var address = provinceName +  _this.newChannel.organization.address.address;

           geocoder.getLocation(address, function(status, result) {
            if (status === 'complete' && result.info === 'OK') {
                marker.setPosition(result.geocodes[0].location)
                map.setCenter(marker.getPosition())

                _this.newChannel.organization.longitude = result.geocodes[0].location.lng;
                _this.newChannel.organization.latitude = result.geocodes[0].location.lat;

            }else{
                //获取经纬度失败
            }
          });
        }

        AMap.event.addListener(autocomplete, "select", function(e){
           //TODO 针对选中的poi实现自己的功能
           placeSearch.setCity( e.poi.adcode );
           placeSearch.search( e.poi.name); //关键字查询查询
        })

        AMap.event.addListener(placeSearch, "markerClick", function(e){
           _this.newChannel.organization.longitude = e.data.location.lng;
           _this.newChannel.organization.latitude = e.data.location.lat;        
        })

        //为地图注册click事件获取鼠标点击出的经纬度坐标
        var clickEventListener = map.on('click', function(e) {
            _this.newChannel.organization.longitude = e.lnglat.getLng();
            _this.newChannel.organization.latitude = e.lnglat.getLat();
            marker.setPosition(e.lnglat);
            map.setCenter(marker.getPosition())
        })

      })
    },

    //获取省名称
    getProvinceName(id){
      if(id.length == 0){
        return '';
      }
      for(var i=0; i<this.areaList.length; i++){
          if(this.areaList[i].value == id[0]){
            return  this.areaList[i].label;
          }
       }
    },

  }
}  
</script>

<style scoped>
#main {
  width: 480px;
  height: 480px; 
 }
</style>
