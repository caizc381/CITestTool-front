<template>
<div>
  <div class="header-search">
    <span>当前体检中心：</span>
    <span>
      <mt-select
        style="width:200px"
        v-model="hospitalId"
        placeholder="请选择体检中心"
        @on-change="selectHospital"
        :filters="['name', 'pinyin']"
        :options="hospitalList"
        :clearable="false">
      </mt-select>
    </span>
  </div>
  <div class="body-content">

    <Row>
      <i-col :span="16">
        <div class="itemMap-top">
         	<i-col :span="6">
         	   <div class="itemMap-top-tab bgf6">
       	 	   	  <div class="tdline line-1 p0"><Checkbox v-model="checkAll" class="selectAll">全选</Checkbox></div>
       	 	   	  <div class="tdline"><Checkbox v-model="checkList.checkedGender">覆盖性别</Checkbox></div>
       	 	   	  <div class="tdline"><Checkbox v-model="checkList.checkedFitPeople">覆盖适宜人群</Checkbox></div>
       	 	   	  <div class="tdline"><Checkbox v-model="checkList.checkedUnfitPeople">覆盖不适宜人群</Checkbox></div>
       	 	   	  <div class="tdline line"><Checkbox v-model="checkList.checkedDescription">覆盖项目描述</Checkbox></div>
       	 	   	  <div class="tdline line"><Checkbox v-model="checkList.checkedDetail">覆盖项目详情</Checkbox></div>
       	 	   	  <div class="tdline"><Checkbox v-model="checkList.checkedCrmClassify">覆盖CRM分类</Checkbox></div>
       	 	   	  <div class="tdline"><Checkbox v-model="checkList.checkedClientClassify">覆盖客户分类</Checkbox></div>
       	 	   </div>
       	 	</i-col>
       	 	<i-col :span="9">
       	 	    <div class="itemMap-top-tab">
       	 	   	  <div class="tdline line-1 p0">
       	 	   	  	<span class="line-1-title bgf6">体检中心项目</span>
       	 	   	  	<span class="line-1-title">{{hospitalItem.name}}</span>
       	 	   	  </div>
       	 	   	  <div class="tdline">{{hospitalItem.gender | filterGender}}</div>
       	 	   	  <div class="tdline">{{hospitalItem.fitPeople}}</div>
       	 	   	  <div class="tdline">{{hospitalItem.unfitPeople}}</div>
       	 	   	  <div class="tdline line">
                 <Tooltip :content="hospitalItem.description" placement="top">
                    <div class="ell-3">{{hospitalItem.description}}</div>
                 </Tooltip>
       	 	   	  </div>
                <div class="tdline line">
                  <Tooltip :content="hospitalItem.detail" placement="top">
                    <div class="ell-3">{{hospitalItem.detail}}</div>
                  </Tooltip>
                </div>
       	 	   	  <div class="tdline">{{hospitalItem.crmClassifyName}}</div>
       	 	   	  <div class="tdline">{{hospitalItem.clientClassifyName}}</div>
       	 	   </div>
       	 	</i-col>
       	 	<i-col :span="9">
       	 	    <div class="itemMap-top-tab">
       	 	   	  <div class="tdline line-1 p0">
       	 	   	  	<span class="line-1-title bgf6">标准库的映射项目<span class="red" v-if="standardItem.length==0">(暂无匹配项!)</span></span>
       	 	   	  	<span class="line-1-title">{{standardItem.name}}</span>
       	 	   	  </div>
       	 	   	   <div class="tdline">{{standardItem.gender | filterGender}}</div>
       	 	   	  <div class="tdline">{{standardItem.fitPeople}}</div>
       	 	   	  <div class="tdline">{{standardItem.unfitPeople}}</div>
                <div class="tdline line">
                  <Tooltip :content="standardItem.description" placement="top">
                    <div class="ell-3">{{standardItem.description}}</div>
                  </Tooltip>
                </div>
       	 	   	  <div class="tdline line">
                  <Tooltip :content="standardItem.detail" placement="top">
                    <div class="ell-3">{{standardItem.detail}}</div>
                  </Tooltip>
       	 	   	  </div>
       	 	   	  <div class="tdline">{{standardItem.crmClassifyName}}</div>
       	 	   	  <div class="tdline">{{standardItem.clientClassifyName}}</div>
       	 	   </div>
       	  </i-col>
        </div>

        <div class="mt10 mb10">
            <span><Button type="primary" @click="mapItem">映射并执行</Button></span>
            <span class="ml10 mr10"><Button @click="nextItem">下一个</Button></span>
            <Tag type="dot" color="green" v-if="currentMappedItem">已映射（{{currentMappedItem}}）</Tag>
        </div>

      </i-col>

      <i-col :span="8">
       <div class="ops">
         <div class="bgf6 ops-title">
           <span class="p5">标准库项目</span>
           <span class="dlb">
             <Input
             icon="search"
             v-model="standardItemKeyword"
             @on-change="delaySearchStandard" />
           </span>
         </div>
        <div class="ops-ul">
         <ul v-if="standardItemList.length > 0">
            <li v-for="item in standardItemList" :key="item.id" @click="selectStandardItem(item)" v-bind:class="{'selected': standardItem.id === item.id}">
             {{item.name}}
            </li>
         </ul>
        <div v-else class="no-data">暂无数据</div>
       </div>
      </div>
     </i-col>

    </Row>

    <Row class="row">
   	 <i-col :span="24">
     	 <table class="table" style="border: none;">
          <thead>
            <tr class="bgf6" height="55px">
              <th width="10%">序号</th>
              <th width="40%">
                 <span>体检中心项目</span>
                 <span class="dlb">
                    <Input
                    icon="search"
                    v-model="hospitalItemKeyword"
                    @on-change="delaySearchHospitalItem" />
                 </span>
              </th>
              <th width="30%">
                 <span>标准库的映射项目</span>
                 <span class="dlb">
                    <Select v-model="isMapped" style="width:200px" @on-change="getHospitalItemList">
                       <Option label="全部" :value="0"></Option>
                       <Option label="已映射" :value="1"></Option>
                       <Option label="未映射" :value="2"></Option>
                    </Select>
                </span>
              </th>
              <th width="20%">操作</th>
            </tr>
          </thead>
       </table>
       <div class="hospital-list">
 	 	      <table v-if="hospitalItemList.length > 0" class="table">
     	 	 		<tr v-for="item in hospitalItemList" :key="item.examItem.id" @click="selectHospitalItem(item)" v-bind:class="{'selected': hospitalItem.id === item.examItem.id}">
     	 	 			<td width="10%">{{item.examItem.id}}</td>
     	 	 			<td width="40%">
                {{item.examItem.name}}
                <Tooltip v-if="!item.examItem.show" content="体检中心隐藏" placement="top">
                  <Icon class="c-rd" type="ios-information"></Icon>
                </Tooltip>
              </td>
     	 	 			<td width="30%"><span v-if="!!item.examItemStandard">{{item.examItemStandard.name}}</span></td>
     	 	 			<td width="20%">
                <a v-if="item.isRelevance==1" @click="unMapItem(item)">取消映射</a>
              </td>
     	 	 		</tr>
 	 	     </table>
         <div v-else class="no-data">暂无数据</div>
   	 	 </div>
   	 </i-col>
    </Row>

  </div>

</div>
</template>

<script>

export default {
  data() {
    return {
      hospitalId: undefined,
      hospitalList: [],
      checkList: {
        checkedGender: false,
        checkedFitPeople: false,
        checkedUnfitPeople: false,
        checkedDetail: false,
        checkedDescription: false,
        checkedClientClassify: false,
        checkedCrmClassify: false,
      },

      standardItem: {},
      standardItemKeyword: '',
      standardItemList: [],

      hospitalItem: {},
      hospitalItemKeyword: '',
      hospitalItemList: [],
      isMapped: 0,

      currentMappedItem: false,
    };
  },

  mounted() {
    this.getHospitalList();
  },

  computed: {
    checkAll: {
      // getter
      get: function () {
        let checkAll = true;
        for (let attr in this.checkList) {
          if (!this.checkList[attr]) {
            checkAll = false;
            break;
          }
        }
        return checkAll;
      },
      // setter
      set: function (newValue) {
        if (!newValue) {
          this.clearCheckList();
        } else {
          for (let attr in this.checkList) {
            this.checkList[attr] = true;
          }
        }
      }

    },
  },

  methods: {
    delaySearchStandard() {
      if (this.timing1) {
        clearTimeout(this.timing1);
        this.timing1 = undefined;
      }
      this.timing1 = setTimeout(() => {
        this.getStandardItemList(this.standardItemKeyword, true);
      }, 250);
    },

    delaySearchHospitalItem() {
      if (this.timing2) {
        clearTimeout(this.timing2);
        this.timing2 = undefined;
      }
      this.timing2 = setTimeout(() => {
        this.getHospitalItemList();
      }, 250);
    },

    getHospitalList() {
      this.$http.post('/hospital/listHospital', JSON.stringify({})).then((response) => {
        let hospitalList = response.body.filter(item => { return item.orgType == 1; });
        this.hospitalList = hospitalList;

        if (this.hospitalList && this.hospitalList.length > 0) {
          this.hospitalId = (sessionStorage.getItem("selectHospitalId") || this.hospitalList[0].id)/1;
        }
      })
    },

    selectHospital(hosId) {
      this.hospitalId = hosId;
      this.hospitalItemKeyword = '';
      this.isMapped = 0;
      this.getHospitalItemList();
      sessionStorage.setItem("selectHospitalId", hosId);
    },

    selectHospitalItem(item) {
      this.hospitalItem = item.examItem;
      this.getHospitalItemById(item.examItem.id);
      if (!!item.examItemStandard) {  // 如果是已匹配项目，查询标准项信息
        this.currentMappedItem = item.examItemStandard.name;
        this.getStandardItemById(item.examItemStandard.id);
        this.clearCheckList();
      } else {
        this.currentMappedItem = '';
        this.standardItem = {};
        if (this.cacheList) {
          this.checkList = this.cacheList;
        }
      }
      this.getMatchItems(this.hospitalItem.name);
    },

    getHospitalItemList() {
      let url = '/examItem/hospitalItemAndStandardRela';
      url += '?hospitalId=' + this.hospitalId;
      url += '&examItemKeywords=' + this.hospitalItemKeyword;
      url += '&isRelevance=' + this.isMapped;

      this.$http.get(url).then((response) => {
        this.hospitalItemList = response.body;
        if (this.hospitalItemList && this.hospitalItemList.length > 0) {
          this.selectHospitalItem(this.hospitalItemList[0]);
        }
      })
    },

    getHospitalItemById(id) {
      this.$http.get('/examItem/getHospitalExamItemById?hospitalId=' + this.hospitalId + '&examItemId=' + id).then((response) => {
        this.hospitalItem = response.body;
      })
    },

    selectStandardItem(standardItem) {
      this.standardItem = standardItem;
      this.getStandardItemById(standardItem.id);
    },

    getStandardItemById(id) {
      this.$http.get('/examItem/standardInfo/' + id).then((response) => {
        this.standardItem = response.body;
      })
    },

    // 根据医院单项name获取标准库单项列表
    // isInputSearch 是否是输入框搜索
    getStandardItemList(name, isInputSearch = false) {
      return this.$http.get('/examItem/standardList?status=1&keywords=' + name).then((response) => {
        this.standardItemList = isInputSearch ? response.body.list : this.combineResult(response.body.list);
        return response;
      });
    },

    // 合并几次搜索的结果，扩大搜索范围
    combineResult(list) {
      let appendList = list.filter((item) => {
        let exist = false;
        this.standardItemList.forEach((ei) => {
          if (ei.id == item.id) {
            exist = true;
          }
        })
        return !exist;
      })
      return this.standardItemList.concat(appendList);
    },

    getMatchItems(name) {
      this.standardItemKeyword = '';
      this.standardItemList = [];
      let word1 = name.substr(0, 2);
      let word2 = name.substr(1, 3);
      let word3 = name.substr(2, 4);
      let word4 = name.substr(3, 5);

      // 第一次的搜索相对精确一点，把它放到其它搜索之后，以便搜索之后默认选中
      this.isValidSearchWord(word1) && this.getStandardItemList(word1).then(() => {
        var p2 = this.isValidSearchWord(word2) && this.getStandardItemList(word2);
        var p3 = this.isValidSearchWord(word3) && this.getStandardItemList(word3);
        var p4 = this.isValidSearchWord(word4) && this.getStandardItemList(word4);

        var p = Promise.all([p2, p3, p4]).then(() => {
          if (!this.standardItem.id && this.standardItemList.length > 0) {
            this.standardItem = this.standardItemList[0];
          }
        });
      })

    },

    isValidSearchWord(word) {
      return word && word.length > 1;
    },

    nextItem() {
      if (!this.hospitalItem.id || this.hospitalItemList.length == 0) {
        return;
      }
      let nextItem;
      this.hospitalItemList.forEach((item, index) => {
        if (item.examItem.id == this.hospitalItem.id && this.hospitalItemList[index + 1]) {
          nextItem = this.hospitalItemList[index + 1];
        }
      });
      if (nextItem) {
        this.selectHospitalItem(nextItem);
      }

      //  设置滚动高度
      var li_height = this.$el.querySelector('.hospital-list table .selected').offsetTop;
      this.$el.querySelector('.hospital-list').scrollTop = li_height;
    },

    cacheCheckList() {
      this.cacheList = JSON.parse(JSON.stringify(this.checkList));
    },

    clearCheckList() {
      this.checkList = {
        checkedGender: false,
        checkedFitPeople: false,
        checkedUnfitPeople: false,
        checkedDetail: false,
        checkedDescription: false,
        checkedClientClassify: false,
        checkedCrmClassify: false,
      };
    },

    //映射项目
    mapItem() {
      if (!this.standardItem.id) {
          this.$Message.warning('请选择标准库');
          return;
      }
      var params = {
        standardId: this.standardItem.id,
        examItemId: this.hospitalItem.id,
        hospitalId: this.hospitalId,
        isRelevance: 1,
        checkedGender: this.checkList.checkedGender,
        checkedFitPeople: this.checkList.checkedFitPeople,
        checkedUnfitPeople: this.checkList.checkedUnfitPeople,
        checkedDetail: this.checkList.checkedDetail,
        checkedDescription: this.checkList.checkedDescription,
        checkedClientClassify: this.checkList.checkedClientClassify,
        checkedCrmClassify: this.checkList.checkedCrmClassify,
      }
      this.$http.post('/examItem/standardRelationUpdate', JSON.stringify(params)).then((response) => {
        this.hospitalItemList.map(item => {
          if (item.examItemStandard && item.examItemStandard.id == this.standardItem.id) { // 去除之前的关联
            item.examItemStandard = undefined;
            item.isRelevance = 2;
          }

          if (item.examItem.id === this.hospitalItem.id) {
            item.isRelevance = 1;
            item.examItemStandard = this.standardItem;
            this.cacheCheckList();
            this.selectHospitalItem(item);
          }
          return item;
        })
      });
    },

    //取消映射项目
    unMapItem(item) {
        var postData = {
            standardId: item.examItemStandard.id,
            examItemId: item.examItem.id,
            hospitalId: this.hospitalId,
            isRelevance: 2
        }

        this.$Modal.confirm({
          title:'提示',
          content:'是否取消映射?',
          onOk:()=>{

            this.$http.post('/examItem/standardRelationUpdate', JSON.stringify(postData)).then((response) => {
              this.hospitalItemList.map(item => {
                if (item.examItem.id === this.hospitalItem.id) {
                  item.isRelevance = 2;
                  item.examItemStandard = undefined;
                  this.selectHospitalItem(item);
                }
                return item;
              })
            }, (res) => {
              this.$Message.error(res.text);
            });
          }
        });

    },

  },

}

</script>

<style lang="less">
.itemMap
{
  font-size:14px;
}
.itemMap-top
{
	width:100%;
	background: #fff;
  overflow: hidden;
  border:1px solid #eee;
}
.bgf6
{
	background-color: #f6f6f6;
}
.itemMap-top-tab div.tdline
{
   height: 40px;
   border-top: 1px solid #eee;
   padding: 10px 10px;
}
.selectAll
{
  padding:10px 10px;
}
.itemMap-top-tab div.line-1{
   height:80px;
}
.itemMap-top-tab div.line{
	height:80px;
}
.line-1-title
{
	display:block;
  height: 40px;
	padding:10px 10px;
}
.itemMap-top-tab div.p0{
	padding:0;
}
.dlb
{
	display:inline-block;
}
.red
{
  color:red;
  padding-left:10px;
}
.row
{
	background-color:#fff;
  margin-top:0;
}
.hospital-list
{
	height:440px;
	overflow-y:scroll;
}
.hospital-head,.hospital-list table
{
  width:100%;
}
.hospital-list table tr{
	cursor: pointer;
}
.hospital-list table tr:hover{
   background-color:#eef1f6;
}
.ops{
   height:auto;
   overflow:hidden;
   background-color:#fff;
   margin-left:15px;
}
.ops-ul
{
  height:378px;
  overflow-y:scroll;
}
.btn-cancel
{
  margin:0 10px;
}
.ops-ul ul
{
   list-style: none;
   margin:0;
   padding:0;
}
.ops-ul ul li
{
	padding:10px 20px;
  cursor: pointer;
}
.ops-ul ul li:hover{
   background-color:#eef1f6;
}
.selected
{
  background-color:#f5f7f9;
}
.popClass
{
	max-width:200px;
}
.no-data
{
  padding:10px;
  text-align:center;
}
.p5 {
  padding: 5px;
}
</style>
