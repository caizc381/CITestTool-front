<template>
  <div>
    <div class="form-term">
      <div class="form-header-title">
        <span class="fl">基本信息</span>
        <a v-if="!isEdit" v-permission="'hospitalManage:list:basicEdit'" class="fr" @click="clickEdit"><Icon type="edit"></Icon>编辑</a>
      </div>
      <Form :model="organizationVo" :label-width="120" ref="newHos">
        <FormItem label="体检中心信息" style="font-weight: bold;">
        </FormItem>
        <FormItem label="机构名称：" :class="{'ivu-form-item-required':isEdit}" class="dlb" style="width:66%">
          <span v-if="!isEdit" class="detailfont">{{hospital.name}}</span>
          <Input v-if="isEdit" type="text" :maxlength="30" v-model="organizationVo.name" placeholder="请输入体检中心名称" style="width:90%" />
        </FormItem>
        <FormItem label="外部编码：" class="dlb" style="width:33%">
          <span v-if="!isEdit" class="detailfont">{{hospital.outerOrgCode}}</span>
          <Input v-if="isEdit" type="text" :maxlength="30" v-model="organizationVo.outerOrgCode" placeholder="请输入外部编码" style="width:90%" />
        </FormItem>
        <FormItem label="机构类型：" class="dlb" :class="{'ivu-form-item-required':isEdit}" style="width:33%">
           <span v-if="!isEdit" class="detailfont">{{hospital.type}}</span>
           <Select v-if="isEdit" v-model="organizationVo.type" style="width:90%">
             <Option v-for="org in organizationTypeList" :value="org" :key="org">{{ org }}</Option>
           </Select>
        </FormItem>
        <FormItem label="医院等级：" class="dlb" :class="{'ivu-form-item-required':isEdit}" style="width:33%">
           <span v-if="!isEdit" class="detailfont">{{hospital.level}}</span>
           <Select v-if="isEdit" v-model="organizationVo.level" style="width:90%">
             <Option value="未知等级" label="未知等级"></Option>
             <Option value="三特" label="三特"></Option>
             <Option value="三甲" label="三甲"></Option>
             <Option value="三乙" label="三乙"></Option>
             <Option value="三丙" label="三丙"></Option>
             <Option value="三级" label="三级"></Option>
             <Option value="二甲" label="二甲"></Option>
             <Option value="二乙" label="二乙"></Option>
             <Option value="二丙" label="二丙"></Option>
             <Option value="二级" label="二级"></Option>
             <Option value="一甲" label="一甲"></Option>
             <Option value="一乙" label="一乙"></Option>
             <Option value="一丙" label="一丙"></Option>
           </Select>
        </FormItem>
        <FormItem v-if="!isEdit && hospital.type == '民营连锁'" label="机构品牌：" class="dlb" style="width:33%">
           <span class="detailfont">{{ brand.length > 0 ? brand[0].brandName : '' }}</span>
        </FormItem>
        <FormItem v-if="isEdit && organizationVo.type == '民营连锁'" label="机构品牌：" class="dlb" style="width:33%">
           <Select  v-model="organizationVo.brandId" style="width:90%">
             <Option v-for="brand in brandList" :value="brand.id" :key="brand.id">{{ brand.brandName }}</Option>
           </Select>
        </FormItem>

        <div class="parting-line"></div>

        <FormItem label="地址信息" style="font-weight: bold;">
        </FormItem>
        <FormItem label="地区：" class="dlb" :class="{'ivu-form-item-required':isEdit}" style="width:33%">
          <span v-if="!isEdit" class="detailfont">{{hospital.address.province}}/{{hospital.address.city}}/{{hospital.address.district}}</span>
          <Cascader
           class="dlb"
           v-if="isEdit"
           :data="areaList"
           v-model="organizationVo.addressIds"
           :clearable="true"
           :change-on-select="true"
           @on-change="handlerAddress"
           style="width:200px">
         </Cascader>
        </FormItem>
        <FormItem prop="address.address" label="详细地址：" class="dlb" :class="{'ivu-form-item-required':isEdit}" style="width:33%">
          <span v-if="!isEdit" class="detailfont">{{hospital.address.address}}</span>
          <Input v-if="isEdit" type="text" v-model="organizationVo.address.address" placeholder="请输入详细地址" style="width:600px" :maxlength="50" />
        </FormItem>
        <FormItem prop="address.longitude" label="经纬度：" :class="{'ivu-form-item-required':isEdit}">
          <div v-if="!isEdit">
             <span class="detailfont">{{hospital.address.longitude}},{{hospital.address.latitude}}</span><a class="ml5" @click="getAddress()">预览</a>
          </div>
          <div v-if="isEdit">
            <Input type="text" v-model="organizationVo.address.longitude" placeholder="经度" style="width:300px" />
            <Input type="text" v-model="organizationVo.address.latitude" placeholder="维度" style="width:300px" />
            <a @click="openMap()">通过地图拾取</a>
          </div>
        </FormItem>
        <FormItem label="交通信息：">
          <span v-if="!isEdit" class="detailfont">{{hospital.trafficInfo}}</span>
          <Input v-if="isEdit" type="textarea" v-model="organizationVo.trafficInfo" :maxlength="500" placeholder="最多500字" style="width: 200px" />
        </FormItem>
        <FormItem>
          <div v-if="errorInfoStatus" class="error">{{errorInfo}}</div>
        </FormItem>
        <FormItem v-if="isEdit">
            <Button type="primary" @click="save()">保存</Button>
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
      <div class="mt20" v-if="organizationVo.address.latitude || organizationVo.address.longitude">当前经纬度：{{organizationVo.address.longitude}},{{organizationVo.address.latitude}}</div>
      <div slot="footer">
         <Button @click="cancelMap">取消</Button>
         <Button type="primary" @click="showMap = false">确定</Button>
      </div>
   </Modal>

  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'basicInfo',
  data() {
    return {
      organizationVo: {
        address: {
          address: '',
          id: '',
          province: '',
          city: '',
          district: '',
          latitude: '',
          longitude: '',
        },
        id: '',
        level: '',
        name: '',
        type: '',
        addressIds: [],
        trafficInfo: '',
        outerOrgCode: '',
        brandId: '', 
      },
      organizationTypeList: ['公立医院','专业体检中心','民营连锁'],
      areaList: [],
      isEdit: false,
      showMap: false,
      previewMap: false,
      errorInfo: '',
      errorInfoStatus: false,
      brandList: [],
      brand: {},
    }
  },

  props: ['hospital'],

  created() {
    this.getBrandList();
  },

  mounted() {
    this.getAreaList(); 
    this.getBrandList();
  },

  methods: {

    //获取地址信息
    getAreaList() {
      this.$http.get('/areaAddress').then((response) => {
          this.areaList = response.body.provinces;
      }, (res) => {
          this.$Message.error(res.text);
      });
    },

    getBrandList(){
      this.$http.get('/listAllOrgBrand').then((response) => {
          this.brandList = response.body;
          this.brand = this.brandList.filter(item =>{
            return this.hospital.brandId == item.id
          })
      }, (res) => {
          this.$Message.error(res.text);
      });
    },

    clickEdit(){
      this.isEdit = true;
      this.organizationVo = JSON.parse(JSON.stringify(this.hospital));
    },

    save(){
      if(!this.organizationVo.name){
        this.errorInfo = '机构名称不能为空！';
        this.errorInfoStatus = true;
        return false;
      }
      if(this.organizationVo.name && this.organizationVo.name.length > 30){
        this.errorInfo = '机构名称长度不能超过30位！';
        this.errorInfoStatus = true;
        return false;
      }
      if(!this.organizationVo.type){
        this.errorInfo = '机构类型不能为空！';
        this.errorInfoStatus = true;
        return false;
      }
      if(!this.organizationVo.level){
        this.errorInfo = '机构等级不能为空！';
        this.errorInfoStatus = true;
        return false;
      }
      if(this.organizationVo.addressIds.length == 0){
        this.errorInfo = '地址不能为空！';
        this.errorInfoStatus = true;
        return false;
      }
      if(!this.organizationVo.address.address){
        this.errorInfo = '详细地址不能为空！';
        this.errorInfoStatus = true;
        return false;
      }
      if(this.organizationVo.address.address && this.organizationVo.address.address.length > 50){
        this.errorInfo = '详细地址不能超过50字！';
        this.errorInfoStatus = true;
        return false;
      }
      if(!this.organizationVo.address.longitude || !this.organizationVo.address.latitude){
        this.errorInfo = '经纬度不能为空！';
        this.errorInfoStatus = true;
        return false;
      }
      if(this.organizationVo.trafficInfo && this.organizationVo.trafficInfo.length > 500){
        this.errorInfo = '交通路线不能超过500字！';
        this.errorInfoStatus = true;
        return false;
      }
      if(this.organizationVo.type == '民营连锁' && !this.organizationVo.brandId) {
        this.errorInfo = '机构品牌必选!';
        this.errorInfoStatus = true;
        return false;
      }


      this.organizationVo.address.id = this.organizationVo.addressIds[this.organizationVo.addressIds.length - 1];
      //清空地址选择
      this.organizationVo.addressIds = undefined;
      this.organizationVo.brandId = this.organizationVo.type == '民营连锁' ? this.organizationVo.brandId:undefined;
      this.$http.post('/organizationBaseInfo',JSON.stringify(this.organizationVo)).then((response) => {
          this.$Message.success('操作成功');
          this.isEdit = false;
          this.errorInfoStatus = false;
          this.$emit('reload');
      }, (res) => {
          this.$Message.error(res.text);
      });
    },

    getAddress(){

     this.previewMap = true;
     var lnglatXY=[this.hospital.address.longitude, this.hospital.address.latitude];//地图上所标点的坐标
     var title = this.hospital.name;

     var map = new AMap.Map('mapContainer',{
          resizeEnable: true,
          zoom: 15,
          center:lnglatXY
      });

      var marker=new AMap.Marker({
          position:lnglatXY,
          title: title,
          map:map
      });
    },

    cancelValidate(){
      this.isEdit = false;
      this.organizationVo = JSON.parse(JSON.stringify(this.hospital));
      this.errorInfoStatus = false;
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

        if(_this.organizationVo.address.longitude && _this.organizationVo.address.latitude){
            var lnglatXY=[_this.organizationVo.address.longitude, _this.organizationVo.address.latitude];//地图上所标点的坐标
            geocoder.getAddress(lnglatXY, function(status, result) {
                if (status === 'complete' && result.info === 'OK') {
                   marker.setPosition(lnglatXY)
                   map.setCenter(marker.getPosition())
                }else{
                   //获取地址失败
                }
            });
        }else{
           var address =  _this.organizationVo.address.province +  _this.organizationVo.address.address;
           geocoder.getLocation(address, function(status, result) {
            if (status === 'complete' && result.info === 'OK') {
                marker.setPosition(result.geocodes[0].location)
                map.setCenter(marker.getPosition())

                _this.organizationVo.address.longitude = result.geocodes[0].location.lng;
                _this.organizationVo.address.latitude = result.geocodes[0].location.lat;

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
           _this.organizationVo.address.longitude = e.data.location.lng;
           _this.organizationVo.address.latitude = e.data.location.lat;
        })

        //为地图注册click事件获取鼠标点击出的经纬度坐标
        var clickEventListener = map.on('click', function(e) {
            _this.organizationVo.address.longitude = e.lnglat.getLng();
            _this.organizationVo.address.latitude = e.lnglat.getLat();
            marker.setPosition(e.lnglat);
            map.setCenter(marker.getPosition())
        })

      })
    },

    cancelMap(){
      document.getElementById("keyword").value = '请输入关键字：(选定后搜索)';
      this.organizationVo.address.longitude = JSON.parse(JSON.stringify(this.hospital.address.longitude));
      this.organizationVo.address.latitude = JSON.parse(JSON.stringify(this.hospital.address.latitude));
      this.showMap = false;
    },

    handlerAddress(val){
      this.organizationVo.address.province = this.getProvinceName(val);
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
</style>
