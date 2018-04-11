<template>
 <div>
   <div class="header-search">
    <span>当前体检中心：</span>
    <span>
      <mt-select
        style="width:200px"
        v-model="hospitalId"
        placeholder="请选择体检中心"
        :filters="['name', 'pinyin']"
        @on-change="selectHospital"
        :options="hospitalList"
        :clearable="false" />
    </span>
    <Button class="fr mr15" type="primary" @click="exportXls()">导出单位不同项</Button>
  </div>
    <Row type="flex" class="m15 bdr-l bdr-b bdr-r">
      <i-col span="16">
        <Row>
          <i-col span="6">
            <div>
              <div class="mth">
                <mt-checkbox :checked="checkAllAttrs" @on-check="toggleCheckAll()">全选</mt-checkbox>
              </div>
              <div class="mth"><br></div>
              <div class="mth">
                <mt-checkbox :checked="mapAttrs.isMappingUnit" @on-check="mapAttrs.isMappingUnit = !mapAttrs.isMappingUnit">覆盖单位</mt-checkbox>
              </div>
              <div class="mth">
                <mt-checkbox :checked="mapAttrs.isMappingMaxResult" @on-check="mapAttrs.isMappingMaxResult = !mapAttrs.isMappingMaxResult">覆盖上限</mt-checkbox>
              </div>
              <div class="mth">
                <mt-checkbox :checked="mapAttrs.isMappingMinResult" @on-check="mapAttrs.isMappingMinResult = !mapAttrs.isMappingMinResult">覆盖下限</mt-checkbox>
              </div>
              <div class="mth line">
                <mt-checkbox :checked="mapAttrs.isMappingDetail" @on-check="mapAttrs.isMappingDetail = !mapAttrs.isMappingDetail">覆盖解释</mt-checkbox>
              </div>
              <div class="mth line">
                <mt-checkbox :checked="mapAttrs.isMappingAdvance" @on-check="mapAttrs.isMappingAdvance = !mapAttrs.isMappingAdvance">覆盖健康建议</mt-checkbox>
              </div>
            </div>
          </i-col>
          <i-col span="9">
            <div>
              <div class="mtr">标准库小项</div>
              <div class="mtr b">{{standardItem.name}}</div>
              <div class="mtr">
                <div v-if="!standardItem.standardUnit"> - </div>
                <div v-else-if="standardItem.relatedUnitStandardList.length == 1">
                  {{standardItem.standardUnit.name}}
                </div>
                <div v-else>
                  <Dropdown trigger="click" placement="bottom-start">
                    <a>{{standardItem.standardUnit.name}} <Icon type="arrow-down-b"></Icon></a>
                    <Dropdown-menu slot="list">
                      <DropdownItem v-for="item in standardItem.relatedUnitStandardList"
                        :name="item.id"
                        :key="item.id"
                        @click.native="changeUnit(item)">{{item.name}}
                      </DropdownItem>
                    </Dropdown-menu>
                  </Dropdown>
                </div>
              </div>
              <div class="mtr">{{standardItem | scope('top')}}</div>
              <div class="mtr">{{standardItem | scope('bottom')}}</div>
              <div class="mtr line">
                <Tooltip :content="standardItem.detail" placement="top">
                  <div class="ell-3">{{standardItem.detail}}</div>
                </Tooltip>
              </div>
              <div class="mtr line">
                <Tooltip :content="standardItem.overAdvice" placement="top" v-if="standardItem.overAdvice">
                  <div class="ell-1">过高：{{standardItem.overAdvice}}</div>
                </Tooltip>
                <Tooltip :content="standardItem.belowAdvice" placement="top" v-if="standardItem.belowAdvice">
                  <div class="ell-1">过低：{{standardItem.belowAdvice}}</div>
                </Tooltip>
                <Tooltip :content="standardItem.standardAdvice" placement="top" v-if="standardItem.standardAdvice">
                  <div class="ell-1">正常：{{standardItem.standardAdvice}}</div>
                </Tooltip>
              </div>
            </div>
          </i-col>
          <i-col span="9">
            <div>
              <div class="mtr">体检中心小项</div>
              <div class="mtr b">
                <Tooltip content="单位不同项" placement="top">
                  <Icon v-if="hospitalItem.hisUnit && hospitalItem.hisUnit.indexOf(',') > -1" type="information-circled" class="errorfont"></Icon>
                </Tooltip>
                {{hospitalItem.name || '-'}}
              </div>
              <div class="mtr">
                <span v-if="hospitalItem.standardUnit && hospitalItem.standardUnit.name">{{hospitalItem.standardUnit.name}}</span>
                ({{hospitalItem.hisUnit || '-'}})
              </div>
              <div class="mtr">{{hospitalItem | scope('top')}}</div>
              <div class="mtr">{{hospitalItem | scope('bottom')}}</div>
              <div class="mtr line">
                <Tooltip :content="hospitalItem.detail" placement="top">
                  <div class="ell-3">{{hospitalItem.detail}}</div>
                </Tooltip>
              </div>
              <div class="mtr line">
                <Tooltip :content="hospitalItem.overAdvice" placement="top" v-if="hospitalItem.overAdvice">
                  <div class="ell-1">
                  过高：{{hospitalItem.overAdvice}}
                  </div>
                </Tooltip>
                <Tooltip :content="hospitalItem.belowAdvice" placement="top" v-if="hospitalItem.belowAdvice">
                  <div class="ell-1">
                  过低：{{hospitalItem.belowAdvice}}
                  </div>
                </Tooltip>
                <Tooltip :content="hospitalItem.standardAdvice" placement="top" v-if="hospitalItem.standardAdvice">
                  <div class="ell-1">
                  正常：{{hospitalItem.standardAdvice}}
                  </div>
                </Tooltip>
              </div>
            </div>
          </i-col>
        </Row>
      </i-col>

      <i-col span="8" class="bdr-l bdr-t">
        <div class="allitem-head bdr-b">体检中心小项
          <i-input type="text" icon="ios-search" size="small" class="w200 ml10" placeholder="输入简拼或汉字搜索"
          v-model.trim="hospitalItemKeyword" @on-change="handleSearchHospitalItem()" />
        </div>
        <div class="allitem-body scrolled">
          <div class="item" v-for="item in hospitalItemList" :key="item.id"
          @click="handleClickHospitalItem(item)"
          v-bind:class="{'selected': hospitalItemId === item.id}">
            {{item.name}}
          </div>
        </div>
      </i-col>
    </Row>

    <div class="ml15">
      <Button type="primary" @click="mapping()">映射并执行</Button>
      <Button class="ml10" @click="next()">下一个</Button>
      <span class="ml10 successfont" v-if="standardItem.isMapped"><Icon type="link" class="f16"></Icon> 已映射</span>
    </div>

    <div class="p15">
      <div>
        <table class="table allitem-body">
          <thead>
            <tr class="bgf6">
              <th width="10%">ID</th>
              <th width="40%">
                <span>
                  标准库小项
                  <i-input type="text" icon="ios-search" size="small" class="w200 ml10" placeholder="输入简拼或汉字搜索"
                    v-model.trim="standardItemKeyword" @on-enter="handleSearchStandardItem()" @on-click="handleSearchStandardItem()" />
                </span>
              </th>
              <th width="30%">
                 <span>映射关系筛选</span>
                 <span class="dlb">
                    <Dropdown trigger="click" placement="bottom-start">
                      <span class="hoverblue"><i style="font-size:12px;" class="iconfont icon-guolvqi"></i></span>
                      <Dropdown-menu slot="list">
                        <DropdownItem name="全部" @click.native="handleChangeMapping('全部')" :selected="mapStatus == '全部'">全部</DropdownItem>
                        <DropdownItem name="已映射" @click.native="handleChangeMapping('已映射')" :selected="mapStatus == '已映射'">已映射</DropdownItem>
                        <DropdownItem name="未映射" @click.native="handleChangeMapping('未映射')" :selected="mapStatus == '未映射'">未映射</DropdownItem>
                      </Dropdown-menu>
                    </Dropdown>
                </span>
              </th>
              <th width="20%">操作</th>
            </tr>
          </thead>
          <tbody v-if="allItemList.length > 0">
            <tr v-for="item in allItemList" class="item" :key="item.id"
            v-bind:class="{'selected': standardItemId === item.id}"
            @click="handleClickStandardItem(item)">
              <td width="10%">{{item.id}}</td>
              <td width="40%">
                {{item.name}}
              </td>
              <td width="30%">
                <span v-if="item.isMapped">{{item.mappedItem.name}}</span></td>
              <td width="20%">
                <a v-if="item.isMapped" @click="cancelMap()">取消映射</a>
              </td>
            </tr>
          </tbody>
        </table>
        <mt-none class="p20" :show="allItemList.length == 0" size="large" />
      </div>

    </div>

  <div>

  </div>

 </div>
</template>

<script>
function parseLimit(item, top, bottom) {
  if (item.type == 1) {
    top = item.maxResult ? (top + ('男：' + item.maxResult)) : ''
    bottom = item.minResult ? (bottom + ('男：' + item.minResult)) : ''
  } else if (item.type == 2) {
    top = item.maxResult ? (top + (' 女：' + item.maxResult)) : ''
    bottom = item.minResult ? (bottom + (' 女：' + item.minResult)) : ''
  } else {
    top += item.maxResult || ''
    bottom += item.minResult || ''
  }
  return {top: top, bottom: bottom}
}

export default {
  data() {
    return {
      hospitalId: sessionStorage.getItem("selectHospitalId"),
      hospitalList: [],
      hospitalItemKeyword: '',
      standardItemKeyword: '',

      standardItem: {},
      standardItemId: '',
      allItemList: [],
      mapStatus: '全部',

      mappedItems: {},

      hospitalItem: {},
      hospitalItemId: '',
      hospitalItemList: [],
      searchItemTiming: undefined,

      mapAttrs: {
        isMappingUnit: false,
        isMappingMaxResult: false,
        isMappingMinResult: false,
        isMappingDetail: false,
        isMappingAdvance: false
      }
    }
  },

  filters: {
    scope(val, attr) {
      let top = '', bottom = '';
      if (val && val.resultList && val.resultList.length > 0) {
        val.resultList.forEach(item => {
          let res = parseLimit(item, top, bottom);
          top = res.top;
          bottom = res.bottom;
        })
      }
      return attr == 'top' ? (top || '-') : (bottom || '-');
    }
  },

  methods: {
    exportXls() {
      const href = `${this.$http.options.root}/exportHisItemUnit?hospitalId=${this.hospitalId}`;
      window.location.href = href
    },

    handleClickStandardItem(item) {
      if (item.id == this.standardItemId) {
        return;
      }
      this.selectStandardItem(item);
    },

    handleClickHospitalItem(item) {
      if (item.id == this.hospitalItemId) {
        return;
      }
      this.selectHospitalItem(item)
    },

    next() {
      if (this.standardItemId && this.allItemList && this.allItemList.length > 0) {
        for (let i=0; i<this.allItemList.length; i++) {
           if (this.allItemList[i].id == this.standardItemId && this.allItemList[i + 1]) {
            this.selectStandardItem(this.allItemList[i + 1]);
            break;
          }
        }
      }
    },

    handleSearchStandardItem() {
      this.getPageInfo();
    },

    handleSearchHospitalItem() {
      if (!this.searchItemTiming) {
        this.searchItemTiming = setTimeout(() => {
          if (!this.hospitalItemKeyword && this.selectStandardItem) {
            this.getSimilarItems(this.standardItem.name);
          } else if (this.hospitalItemKeyword) {
            this.getHospitalItems(this.hospitalItemKeyword, true);
          }
          this.searchItemTiming = undefined;
        }, 500)
      }
      
    },

    handleChangeMapping(status) {
      this.mapStatus = status;
      this.getPageInfo();
    },

    changeUnit(item) {
      if (item.id == this.standardItem.standardUnit.id) {
        return;
      }
      let url = '/unitConvert?standardId=' 
        + this.standardItem.id + '&sourceUnitId=' 
        + this.standardItem.standardUnit.id 
        + '&targetUnitId=' + item.id;
        
      this.$http.get(url).then((res) => {
        this.standardItem.resultList = res.body;
        this.standardItem.standardUnit = JSON.parse(JSON.stringify(item));
      })
      
    },

    recalculate() {
      this.standardItem.resultList.map(item => {
        item.maxResult = (item.maxResult * this.standardItem.standardUnit.rate);
        item.minResult = (item.minResult * this.standardItem.standardUnit.rate);
        return item;
      })
    },

    toggleCheckAll() {
      let currAttr = JSON.parse(JSON.stringify(this.checkAllAttrs));
      for (let attr in this.mapAttrs) {
        this.mapAttrs[attr] = !currAttr;
      }
    },

    cancelMap() {
      this.$Modal.confirm({
        title: '提示',
        content: `确定取消映射吗？`,
        onOk: ()=>{
          let pms = {
            hisItemStandardId: this.standardItem.id,
            hospitalId: this.hospitalId
          }
          this.$http.post('/cancelMappingHisItem', JSON.stringify(pms)).then((response) => {
            this.$Message.success('取消映射成功');
            this.hospitalItem = {};
            this.getPageInfo(this.standardItemId);
          })
        }
      });
    },

    mapping() {
      if (!this.hospitalItemId || !this.standardItemId) {
        this.$Message.warning('必须选择 标准项目 和 体检中心项目');
        return;
      }
      let pms = {
        hisItemId: this.hospitalItemId,
        hisItemStandardId: this.standardItemId,
        hospitalId: this.hospitalId,
        unitId: this.standardItem.standardUnit ? this.standardItem.standardUnit.id : ''
      }
      pms = Object.assign(pms, this.mapAttrs);
      this.$http.post('/mappingHisItem', JSON.stringify(pms)).then((response) => {
        this.$Message.success('映射成功');
        this.getPageInfo(this.standardItemId);
      })
      
    },

    getPageInfo(currentStandardItemId) {
      let mapStatus = {
        '全部': '',
        '已映射': true,
        '未映射': false
      }
      this.$http.get('/reloadHisitemPage?hospitalId=' + this.hospitalId + '&isRelevance=' + mapStatus[this.mapStatus] + '&keywords=' + encodeURIComponent(this.standardItemKeyword)).then((res) => {
        this.mappedItems = res.body.hisItemMap || {};
        this.allItemList = this.combineMappingInfo(this.mappedItems, res.body.standardList);

        if (this.allItemList && this.allItemList.length > 0) {
          this.defaultSelectItem(this.allItemList, currentStandardItemId);
        }
      })
    },

    defaultSelectItem(list, currentStandardItemId) {
      if (currentStandardItemId) {
        list.forEach(item => {
          if (item.id === currentStandardItemId) {
            this.selectStandardItem(item)
          }
        })
      } else {
        this.selectStandardItem(list[0]);
      }
    },

    combineMappingInfo(map, list = []) {
      if (map) {
        list.map(item => {
          if (map[item.id]) {
            item.mappedItem = map[item.id];
            item.isMapped = true;
          }
          return item;
        })
      }
      return list;
    },

    isValidSearchWord(word) {
      return word && word.length > 1;
    },

    getSimilarItems(name = '') {
      this.hospitalItemList = [];
      let word1 = name.substr(0, 2);
      let word2 = name.substr(1, 2);
      let word3 = name.substr(2, 2);
      let word4 = name.substr(3, 2);

      // 第一次的搜索相对精确一点，把它放到其它搜索之后，以便搜索之后默认选中
      this.isValidSearchWord(word1) && this.getHospitalItems(word1).then(() => {
        var p2 = this.isValidSearchWord(word2) && this.getHospitalItems(word2);
        var p3 = this.isValidSearchWord(word3) && this.getHospitalItems(word3);
        var p4 = this.isValidSearchWord(word4) && this.getHospitalItems(word4);

        var p = Promise.all([p2, p3, p4]).then(() => {
          if (this.hospitalItemList && this.hospitalItemList.length > 0 || this.standardItem.mappedItem) {
            this.selectHospitalItem(this.standardItem.mappedItem || this.hospitalItemList[0])
          } else {
            this.hospitalItem = {};
            this.hospitalItemId = undefined;
          }
        });
      })

    },

    getHospitalItems(keyword = '', isInputSearch = false) {

      return this.$http.get('/listHisItem?hospitalId=' + this.hospitalId + '&keywords=' + encodeURIComponent(keyword)).then((res) => {
        this.hospitalItemList = isInputSearch ? res.body : this.combineResult(res.body);
        return res;
      })
    },

    // 合并几次搜索的结果，扩大搜索范围
    combineResult(list) {
      let appendList = list.filter((item) => {
        let exist = false;
        this.hospitalItemList.forEach((ei) => {
          if (ei.id == item.id) {
            exist = true;
          }
        })
        return !exist;
      })
      return this.hospitalItemList.concat(appendList);
    },

    getStandardItem(id) {
      this.$http.get('/hisItemStandardInfo?hisItemStandardId=' + id).then((res) => {
        this.standardItem = res.body;
        this.standardItemId = this.standardItem.id;
        if (this.mappedItems[this.standardItem.id]) {
          this.standardItem.mappedItem = this.mappedItems[this.standardItem.id];
          this.standardItem.isMapped = this.mappedItems[this.standardItem.id];
        }

        this.getSimilarItems(this.standardItem.name);
      })
    },

    getHospitalItem(id) {
      if (!id) {
        return;
      }
      this.$http.get('/hisItemInfo?hisItemId=' + id).then((res) => {
        this.hospitalItem = res.body
      })
    },

    selectStandardItem(item) {
      this.hospitalItemKeyword = '';
      this.getStandardItem(item.id);
    },

    selectHospitalItem(item) {
      this.hospitalItem = item;
      this.hospitalItemId = item.id;
      this.getHospitalItem(item.id);
    },

    selectHospital(id) {
      if (!id) { return };

      this.mapAttrs = {
        isMappingUnit: false,
        isMappingMaxResult: false,
        isMappingMinResult: false,
        isMappingDetail: false,
        isMappingAdvance: false
      }

      this.hospitalId = id;
      sessionStorage.setItem("selectHospitalId", this.hospitalId)
      this.mapStatus = '全部'
      this.getPageInfo();
    },

    getHospitalList() {
      this.$http.post('/hospital/listHospital', JSON.stringify({})).then((response) => {
        this.hospitalList = response.body.filter(item => { return item.orgType == 1; });

        if (this.hospitalList && this.hospitalList.length > 0) {
          this.selectHospital(this.hospitalId || this.hospitalList[0].id);
        }
      })
    },
  },

  mounted() {
    this.getHospitalList();
  },

  computed: {
    checkAllAttrs() {
      return this.mapAttrs.isMappingUnit
      && this.mapAttrs.isMappingMaxResult
      && this.mapAttrs.isMappingMinResult
      && this.mapAttrs.isMappingDetail
      && this.mapAttrs.isMappingAdvance
    }
  }

}
</script>

<style scoped lang="less">
.mth {
  padding: 10px;
  line-height: 25px;
  background: #f6f6f6;
  border-top: 1px solid #eee;
}
.mtr {
  padding: 10px;
  line-height: 25px;
  border-top: 1px solid #eee;
}
.allitem-head {
  padding: 10px;
  line-height: 25px;
  background: #f6f6f6;
}
.allitem-body .item {
  padding: 10px;
  line-height: 25px;
  border-bottom: 1px solid #fff;
  &.selected { background-color:#f5f7f9; }
  &:hover { background-color:#eef1f6; }
}
.scrolled {
  height:378px;
  overflow-y:scroll;
}
.line {
  height: 90px;
}
</style>
