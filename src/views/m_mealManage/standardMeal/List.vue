<template>
  <div>
    <div class="header-search">
      <!-- 名称搜索 -->
      <div class="dib">
        <Input placeholder="简拼搜索" icon="ios-search" v-model="keyword" @on-change="filterData()" />
      </div>

      <!-- 性别选择 -->
      <div class="dib">
        <span class="pl-20">性别：</span>
        <div class="dib w200">
          <i-select
            v-model="gender"
            placeholder="请选择性别"
            @on-change="filterData">
            <Option v-for="g in genderList" :value="g.id" :label="g.name" :key="g.id" ></Option>
          </i-select>
        </div>
      </div>

      <!-- 模板套餐选择 -->
      <div class="dib">
        <span class="pl-20">模板类别：</span>
        <div class="dib w200">
          <i-select
            v-model="templateType"
            placeholder="请选择"
            @on-change="filterData">
            <Option v-for="g in templateList" :value="g.id" :label="g.name" :key="g.id" ></Option>
          </i-select>
        </div>
      </div>

      <!-- 新建套餐 -->
      <div class="dib fr mr15">
        <Button type="primary" @click="$router.push('/mealManage/standardMeal/edit')">
          新建标准套餐
        </Button>
      </div>
    </div>

    <div class="body-content">
      <table class="table">
        <tr>
          <th>标准套餐名称</th>
          <th>性别</th>
          <th>模板类别</th>
          <th>已关联平台套餐</th>
          <th>售价</th>
          <th>操作</th>
        </tr>
        <tr v-for="m in mealList" :key="m.id">
          <td>{{m.name}}<div class="gray">ID: {{m.id}}</div></td>
          <td>{{m.gender | gender}}</td>
          <td>
            <div>平台套餐模版: {{m.platformMealTemplate | bool}}</div>
            <div>官方套餐模版: {{m.officeMealTemplate | bool}}</div>
            <div>基础推荐套餐模版: {{m.basicMealTemplate | bool}}</div>
          </td>
          <td>{{m.platformMealSize || 0}}</td>
          <td>{{m.minDisplayPrice | money('￥')}} - {{m.maxDisplayPrice | money('￥')}}</td>
          <td>
            <a class="dib" @click="$router.push('/mealManage/standardMeal/detail?type=1&mealId=' + m.id)">详情</a>
            <a class="dib" @click="toPlatformMealPage(m.id)">查看平台套餐</a>
            <Dropdown trigger="click">
                <a href="javascript:void(0)">
                    更多
                    <Icon type="arrow-down-b"></Icon>
                </a>
                <DropdownMenu slot="list">
                    <DropdownItem @click.native="toCreatePlatformMeal(m.id)">新建平台套餐</DropdownItem>
                    <DropdownItem @click.native="setTempalte(m, 'platformMealTemplate', true)" v-if="!m.platformMealTemplate">设为平台套餐模板</DropdownItem>
                    <DropdownItem @click.native="setTempalte(m, 'platformMealTemplate', false)" v-if="m.platformMealTemplate">取消平台套餐模板</DropdownItem>

                    <DropdownItem @click.native="setTempalte(m, 'officeMealTemplate', true)" v-if="!m.officeMealTemplate">设为官方套餐模板</DropdownItem>
                    <DropdownItem @click.native="setTempalte(m, 'officeMealTemplate', false)" v-if="m.officeMealTemplate">取消官方套餐模板</DropdownItem>

                    <DropdownItem @click.native="setTempalte(m, 'basicMealTemplate', true)" v-if="!m.basicMealTemplate">设为基础推荐套餐模板</DropdownItem>
                    <DropdownItem @click.native="setTempalte(m, 'basicMealTemplate', false)" v-if="m.basicMealTemplate">取消基础推荐套餐模板</DropdownItem>
                </DropdownMenu>
            </Dropdown>
          </td>
        </tr>
      </table>
      <mt-none :show="mealList.length == 0" image-size="large" class="p20" />
    </div>

    <Modal v-model="showCustomCreateModal" title="新建平台套餐">
      <custom-create-modal v-if="showCustomCreateModal" :standard-meal-id="currentStandardMealId" />
      <div slot="footer"></div>
    </Modal>

  </div>
</template>

<script>
import CustomCreateModal from '../components/CustomCreateModal'

export default {
  name: 'StandardMealList',
  components: {
    'custom-create-modal': CustomCreateModal
  },
  data() {
    return {
      keyword: '',
      gender: -1,
      genderList: [
        {id: -1, name: '不限'},
        {id: 2, name: '通用'},
        {id: 0, name: '男'},
        {id: 1, name: '女'}
      ],
      templateType: -111,
      templateList: [
        {id: -111, name: '不限'},
        {id: 0, name: '平台套餐模板'},
        {id: 1, name: '官方套餐模板'},
        {id: 2, name: '基础推荐套餐模板'},
        {id: -1, name: '非模板'}
      ],

      mealList: [],
      mealListBak: [],

      currentStandardMealId: '',
      showCustomCreateModal: false
    }
  },
  filters: {
    gender: function (val) {
      if (val == 0) return "男";
      if (val == 1) return "女";
      return '通用';
    },
    bool: function (val) {
      if (val) return "是";
      return '否';
    }
  },
  mounted () {
    this.getStandardMealList();
  },
  methods: {
    toCreatePlatformMeal (id) {
      this.showCustomCreateModal = true;
      this.currentStandardMealId = id;
    },

    setTempalte (meal, type, asTemplate) {
      let pms = {
        mealId: meal.id,
        setAsTemplate: asTemplate
      };

      if (type == 'platformMealTemplate') {
        pms.templateType = 0;
      } else if (type == 'officeMealTemplate') {
        pms.templateType = 1;
      } else if (type == 'basicMealTemplate') {
        pms.templateType = 2;
      }

      this.$http.post('/meal/standard/updateTemplate', pms).then(() => {
        this.$Message.success('设置成功')
        this.getStandardMealList();
      })
    },

    toPlatformMealPage (id) {
      this.$router.push('/mealManage/platformMeal?standardMealId=' + id);
    },

    getStandardMealList () {
      let url = '/meal/standard/mealList';
      this.$http.get(url).then((res) => {
        this.mealListBak = res.body;
        this.mealList = res.body;

        this.filterData();
      })
    },

    filterData () {
      let list = JSON.parse(JSON.stringify(this.mealListBak));
      if (this.keyword) {
        list = list.filter(item => MyUtil.contain(item.name, this.keyword) || MyUtil.contain(item.pinyin, this.keyword));
      }
      if (this.gender !== -1) {
        list = list.filter(item => item.gender == this.gender);
      }
      if (this.templateType !== -111) {
        list = list.filter(item => {
          if (this.templateType == 0) {
            return item.platformMealTemplate;
          }
          if (this.templateType == 1) {
            return item.officeMealTemplate;
          }
          if (this.templateType == 2) {
            return item.basicMealTemplate;
          }
          if (this.templateType == -1) {
            return !item.platformMealTemplate && !item.officeMealTemplate && !item.basicMealTemplate;
          }
        });
      }
      this.mealList = list;
    }
  }
}
</script>
