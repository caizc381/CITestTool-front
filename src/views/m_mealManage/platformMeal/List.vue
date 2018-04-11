<template>
  <div class="">
    <div class="header-search">
      <!-- 地区选择 -->
      <div class="dib">
        <span>地区：</span>
        <Cascader class="dib w200"
            :data="areaList"
            placeholder="请选择地区"
            change-on-select
            @on-change="onAddressChange">
        </Cascader>
      </div>

      <!-- 体检中心选择 -->
      <div class="dib">
        <span class="pl-20">体检中心：</span>
        <div class="dib w200">
          <mt-select
            v-model="hospitalId"
            placeholder="请选择体检中心"
            @on-change="onHospitalChange"
            @on-clear="onHospitalClear"
            :loading="getHosLoading"
            :filters="['name', 'pinyin']"
            :disabled="!this.hosList.length"
            :options="hosList" />
        </div>
      </div>

      <!-- 体检中心选择 -->
      <div class="dib">
        <span class="pl-20">标准套餐：</span>
        <div class="dib w200">
          <mt-select
            v-model="tblParams.standardMealId"
            placeholder="请选择关联的标准套餐"
            @on-change="onStandardMealChange"
            @on-clear="onStandardMealClear"
            :filters="['name', 'pinyin']"
            :options="standardMealList.filter(m => m.id != -1)" />
        </div>
      </div>

      <!-- 新建套餐 -->
      <div class="dib fr mr15">
        <Dropdown trigger="click" style="margin-left: 20px" @on-click="onChooseMeal" v-permission="'mealManage:platformMeal:new'">
          <Button type="primary">
            新建平台套餐
            <Icon type="arrow-down-b"></Icon>
          </Button>
          <DropdownMenu slot="list">
            <DropdownItem name="copyAlready">复制医院已有套餐</DropdownItem>
            <DropdownItem name="customCreate">自定义创建</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>

    <!-- 列表 -->
    <div class="body-content">
      <Row type="flex" class="mb10">
        <i-col span="8" style="line-height: 32px;">
          <Checkbox
          v-model="selectAllState"
          :indeterminate="selectAllState && cancelMealIds.length > 0"
          @on-change="onSelectAll">全选</Checkbox>
          <span>已选择 <strong>{{selectAllState ? (totalPage - cancelMealIds.length) : selectionData.length }}</strong> 项</span>
        </i-col>
        <i-col span="8" offset="8" class="tr">
          <Button type="ghost" @click.native="onExportMealList">导出Excel</Button>
        </i-col>
      </Row>
      <Table ref="mealListTbl"
        @on-selection-change="onTblSelectChange"
        @on-select-cancel="onSelectCancel"
        :columns="tblColumns"
        :data="tblData"
        :loading="tblLoading"></Table>
      <div class="tc pt15" v-show="totalPage > 1">
        <Page :total="totalPage" :current="tblParams.page.currentPage" :page-size="20" show-total @on-change="onPageChange"></Page>
      </div>
    </div>

    <!-- 弹出层 复制套餐 -->
    <Modal v-model="showCopyMealModal" title="复制套餐">
      <Row>
        <i-col span="14">
          <div class="dib w300">
            <mt-select
              v-model="modalHospitalId"
              placeholder="简拼搜索体检中心"
              @on-change="onModalSelectChange"
              @on-clear="onModalSelectClear"
              :filters="['name', 'pinyin']"
              :options="allHospital" />
          </div>
        </i-col>
        <i-col span="10 tr">
          <RadioGroup v-model="mealType" type="button">
            <Radio :label="3" @click.native="onChangeMealType(3)">官方套餐</Radio>
            <Radio :label="2" @click.native="onChangeMealType(2)">收藏套餐</Radio>
          </RadioGroup>
        </i-col>
      </Row>
      <div class="platform-meal-meal-list">
        <div class="platform-meal-meal-list-inner">
          <CheckboxGroup v-model="checkedMeal">
            <Row type="flex" class="platform-meal-meal-list-item" v-for="item in mealList" :key="item.id">
              <i-col span="20">
                <Checkbox :label="item.id" size="large">
                  <i class="iconfont icon-woman" v-if="item.gender === 1" style="color:#d24d9b"></i>
                  <i class="iconfont icon-man" v-if="item.gender === 0" style="color:#5cd0ed"></i>
                  <div class="dib ell" style="max-width: 24em; vertical-align: middle;" :title="item.name">{{item.name}}</div>
                </Checkbox>
              </i-col>
              <i-col span="4" class="tr">{{item.price | money('￥')}}</i-col>
            </Row>
          </CheckboxGroup>
          <Spin size="large" fix v-if="modalListLoading"></Spin>
          <div class="mt-list-empty-tip" v-if="!mealList.length && modalHospitalId">暂未找到可用的套餐</div>
          <div class="mt-list-empty-tip" v-if="!modalHospitalId">请先选择体检中心再选择套餐进行复制</div>
        </div>
        <div class="tc pt15" v-show="modalListTotal>1">
          <Page :total="modalListTotal" :current="modalPage.currentPage" :page-size="modalPage.pageSize" show-total @on-change="onModalPageChange"></Page>
        </div>
      </div>

      <div slot="footer">
        <Button type="text" @click.native="showCopyMealModal = false">取消</Button>
        <Button type="primary" @click.native="onCopyMeal" :disabled="!this.checkedMeal.length" :loading="copyBtnLoading">复制</Button>
      </div>
    </Modal>

    <Modal v-model="showRelateStandardMeal" title="关联标准套餐">
      <div class="p5">
        <Input icon="ios-search" v-model="keyword" @input="filterItem(keyword)" placeholder="搜索标准套餐" />
        <RadioGroup v-model="checkedStandardMeal" class="pct100">
          <div class="pt10 pb10 bdr-b" v-for="m in standardMealList" v-show="!m.hide" :key="m.id">
            <Tag v-if="m.relevancePlatformMeal">已关联</Tag>
            <Radio :label="m.id" :disabled="m.relevancePlatformMeal">{{m.name}}</Radio>
            <span class="c-9 fr" v-if="m.platformMealTemplate">模板</span>
          </div>
        </RadioGroup>
      </div>

      <div slot="footer">
        <Button type="text" @click.native="showRelateStandardMeal = false">取消</Button>
        <Button type="primary" @click.native="confirmRelate">确定</Button>
      </div>
    </Modal>

    <Modal v-model="showCustomCreateModal" title="新建平台套餐">
      <custom-create-modal v-if="showCustomCreateModal" />
      <div slot="footer"></div>
    </Modal>
  </div>
</template>


<script>
import { getColumns } from './data'
import  _union from 'lodash/union'
import  _without from 'lodash/without'
import  _ from 'lodash'
import { mapState } from 'vuex'
import CustomCreateModal from '../components/CustomCreateModal'

export default {
  name: 'PlatformMeal',
  components: {
    'custom-create-modal': CustomCreateModal
  },
  data() {
    return {
      showCopyMealModal: false,
      selectAllState: false,
      areaList: [],
      cancelMealIds: [],
      selectAllTotal: 0,

      // table 配置
      totalPage: 0,
      tblColumns: getColumns(this),
      tblData: [],
      tblLoading: true,

      // table 查询列表参数
      tblParams: {
        page: {
          currentPage: 1,
          pageSize: 20
        },
        standardMealId: this.$route.query.standardMealId || '',
        types: [5],
        hospitals:[],
        isSelectedAddress: false,
      },
      selectionData: [],

      hosList: [],
      hospitalId: '',
      allHospital: [],

      // 查询体检中心参数
      queryList: {
        provinceId: '',
        cityId: '',
        districtId: '',
        orgType: 1,
        hospitals: []
      },

      checkedMeal: [],
      mealList: [],
      mealType: 3,
      modalPinyin: '',

      firstGetHos: true,
      checkedTblMeals: [],

      modalHospitalId: '',
      modalListLoading: false,
      modalListTotal: 0,
      modalPage: {
        pageSize: 20,
        currentPage: 1
      },
      copyBtnLoading: false,
      getHosLoading: true,

      showCustomCreateModal: false,  // 自定义创建弹框

      keyword: '',
      showRelateStandardMeal: false,
      standardMealList: [],
      checkedStandardMeal: -1
    }
  },

  mounted() {
    // 获取地址信息
    this.getAreaList()
    // 获取体检中心列表
    this.getHosList()
    // 获取表格数据
    this.getTblData()
    // 获取标准套餐列表
    this.getStandardMealList();
  },

  methods: {
    filterItem (keyword) {
      this.standardMealList.map(meal => {
        if (MyUtil.contain(meal.name, keyword) || MyUtil.contain(meal.pinyin, keyword)) {
          meal.hide = false
        } else {
          meal.hide = true
        }
        return meal;
      })
    },

    getStandardMealList (hospitalId) {
      let url = hospitalId ? ('/meal/standard/mealList?hospitalId=' + hospitalId) : '/meal/standard/mealList';
      this.$http.get(url).then((res) => {
        res.body = _.sortBy(res.body, ['platformMealTemplate', 'gmtCreated']).reverse();
        res.body.unshift({id: -1, name: '不关联标准套餐', templateType: '000'});
        this.standardMealList = res.body;
      })
    },

    //获取机构列表
    getHosList() {
      this.getHosLoading = true
      this.tblParams.isSelectedAddress = !!this.queryList.provinceId
      this.$http.post('/hospital/queryOrg', JSON.stringify(this.queryList)).then(res => {
        this.hosList = res.body

        if(this.firstGetHos){
          this.allHospital = res.body
          this.firstGetHos = false
        }else{
          this.getTblData({bySearch: true})
        }
        this.getHosLoading = false
      }, err => {
        this.getHosLoading = false
        this.$Message.error(err.text)
      })
    },

    //获取地址列表
    getAreaList() {
      this.$http.get('/hospital/queryArea').then(res => {
        this.areaList = res.body.provinces
      }, err => this.$Message.error(err.text))
    },

    //地址 变动重新获取 tbl 数据
    onAddressChange(val, s) {
      this.hospitalId = ''

      // 清空地址
      if(!val.length){
        const allHos = JSON.parse(JSON.stringify(this.allHospital))
        this.hosList = allHos
        this.queryList.provinceId = ''
        this.queryList.cityId = ''
        this.queryList.districtId = ''
        this.tblParams.hospitals = allHos.map(v => v.id)
        // 获取 table 列表
        this.getTblData({bySearch: true})
      }else{
        this.queryList.provinceId = val[0]
        this.queryList.cityId = val[1] || ''
        this.queryList.districtId = val[2] || ''
        this.getHosList()
      }
    },

    // 显示弹出层
    onChooseMeal(name) {
      this.showCopyMealModal = name === 'copyAlready'
      this.showCustomCreateModal = name === 'customCreate'
      if (this.showCopyMealModal) {
        this.modalHospitalId = this.hospitalId
        this.getMealList({ bySearch: true })
      } else if (this.showCustomCreateModal) {

      }
    },

    // 获得列表
    getTblData (options) {
      const { byPage=false, bySearch=false } = options || {}
      if (bySearch) {
        this.tblParams.page.currentPage = 1
        this.modalHospitalId = ''
        this.selectionData = []
        this.selectAllState = false
        this.cancelMealIds = []
      }

      this.tblLoading = true
      this.$http.post('/meal/platform/mealsBasicInfo', this.tblParams, {emulateJSON: false}).then(res => {
        this.tblLoading = false
        this.tblData = res.body.mealVOList.map(v => {
          const isCancelId = this.cancelMealIds.indexOf(v.id) > -1
          v._checked = this.selectAllState ? !isCancelId : this.selectionData.indexOf(v.id) > -1
          return v
        })
        // console.log(this.tblData)
        this.totalPage = res.body.page.rowCount
      }, err => {
        this.tblLoading = false
      })
    },

    // 体检中心下拉变化事件
    onHospitalChange () {
      this.tblParams.hospitals = this.hospitalId ? [this.hospitalId] : []
      this.getTblData({bySearch: true})
    },

    // 清空 体检中心选择事件
    onHospitalClear () {
      this.hospitalId = ''
      // this.tblParams.hospitals = this.hosList.map(v => v.id)
      this.getTblData({bySearch: true})
    },

    onStandardMealChange () {
      this.getTblData({bySearch: true})
    },

    onStandardMealClear () {
      this.tblParams.standardMealId = '';
      this.getTblData({bySearch: true})
    },

    // 分页 表格点击分页时
    onPageChange (page) {
      this.tblParams.page.currentPage = page
      this.getTblData({ byPage: true})
    },

    // 弹出层 下拉选择事件
    onModalSelectChange () {
      this.getMealList({bySearch: true})
    },

    // 弹出层 获取套餐列表
    getMealList (options) {
      const { byPage, bySearch } = options || {}

      if(bySearch){
        this.modalPage.currentPage = 1
        this.checkedMeal = []
      }

      let pms = {
        hospitals: [this.modalHospitalId],
        types: [this.mealType],
        page: this.modalPage
      }
      this.modalListLoading = true
      this.$http.post('/meal/platform/mealList', pms, {emulateJSON: false})
        .then(res => {
          this.modalListLoading = false
          this.mealList = res.body.records
          this.modalListTotal = res.body.page.rowCount
        },err => {
          this.modalListLoading = false
          this.$Message.error(err.text)
        })
    },

    // 更改套餐类型
    onChangeMealType(type){
      this.mealType = type
      // 重新获取套餐
      this.getMealList({ bySearch: true })
    },

    // 复制套餐
    onCopyMeal () {
      let pms = {
        orgnizationId: this.modalHospitalId,
        sourceMealIdList: this.checkedMeal.join(','),
      }

      this.copyBtnLoading = true
      this.$http.post('/meal/platform/copyMealList', pms)
        .then(res => {
          this.$Message.success('套餐成功复制')
          this.copyBtnLoading = false
          this.showCopyMealModal = false
          this.getTblData({bySearch: true})
        }, err => {
          this.copyBtnLoading = false
          this.$Message.error(err.text)
        })
    },

    // 全选所有
    onSelectAll (b) {
      this.selectionData = []
      this.cancelMealIds = []
      this.$nextTick(()=>this.$refs.mealListTbl.selectAll(b))
    },

    // 列表数据选择事件监听，返回选中的数据rows
    onTblSelectChange (data) {
      const currIds = data.length ? data.map(v => v.id) : this.tblData.map(v => v.id)

      if(this.selectAllState){
        this.cancelMealIds = data.length
          ? _without(this.cancelMealIds, ...currIds)
          : _union(this.cancelMealIds, currIds)
      }else{
        this.selectionData = data.length
          ? _union(this.selectionData, currIds)
          : _without(this.selectionData, ...currIds)
      }
      // console.log('cancelIds:', this.cancelMealIds)
      // console.log('selectIds: ',this.selectionData)
    },

    // 单项 取消 事件
    onSelectCancel (selection, row) {
      // 全选状态下记录取消的ID
      if(this.selectAllState) {
        this.cancelMealIds.push(row.id)
      }else{
        this.selectionData = _without(this.selectionData, row.id)
      }
    },

    // 弹出层 分页点击
    onModalPageChange (page) {
      this.modalPage.currentPage = page
      this.getMealList({byPage: true})
    },

    // 弹框中选择体检中心事件
    onModalSelectClear () {
      this.modalHospitalId = ''
      this.mealList = []
      this.modalListTotal = 0
      this.modalPage.currentPage = 1
    },

    relateStandardMeal (platformMeal) {
      this.platformMeal = platformMeal;
      this.showRelateStandardMeal = true;
      this.keyword = '';
      this.checkedStandardMeal = -1;
      // 获取标准套餐列表
      this.getStandardMealList(platformMeal.hospitalId)
    },

    confirmRelate () {
      let pms = {
        platformMealId: this.platformMeal.id,
        hospitalId: this.platformMeal.hospitalId
      }
      if (this.checkedStandardMeal != -1) {
        pms.standardMealId = this.checkedStandardMeal;
      }

      this.$http.post('/meal/platform/addMealMapping', pms).then(() => {
        this.$Message.success('关联成功！');
        this.showRelateStandardMeal = false;
        this.getTblData()
      })
    },

    // 导出 事件
    onExportMealList () {
      let len = this.selectAllState ? (this.totalPage-this.cancelMealIds.length) : this.selectionData.length
      if(!len) return this.$Message.warning('请选择需要导出的套餐')

       this.$Modal.confirm({
        title: '提示',
        content: `您确定要导出所选的 ${len} 个套餐详情吗?`,
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          let pms = {
            hospitalIdList: this.hospitalId ? this.hospitalId : this.hosList.map(v =>v.id).join(','),
            isExportAll: this.selectAllState,
            mealIds: this.selectAllState ? '' : this.selectionData.join(','),
            cancelMealIds: this.cancelMealIds.join(',')
          }
          if(!pms.mealIdList) delete pms.mealIdList

          const href = `${this.$http.options.root}/meal/platform/exportMeals?${MyUtil.obj2UrlPms(pms)}`
          // console.log(href)
          window.location.href = href
        }
      })
    }
  }
}
</script>

<style lang="less">
.platform-meal-meal-list {
  &-inner {
    border:1px solid #dfe6ec;
    margin-top: 15px;
    padding: 5px 0;
    height: 300px;
    overflow-y: scroll;
  }
  &-item {
    padding: 5px 10px;
    &:hover {
      background: #eef1f6;
    }
  }
}

</style>
