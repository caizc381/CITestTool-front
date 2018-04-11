<template>
  <div class="meal-editor-item">
    <Row type="flex">
      <i-col span="8">
        <div class="mt-card">
          <p class="mt-card-title bg-base bdr-b btlr4"><span class="title-text">体检项目</span></p>

          <div class="mt-card-body">
            <mt-group :title="'必选项目(' + basicItemIds.length + ')'" type="info" @click.native="mealItemType = '必选'">
              <mt-cell class="checked-item" v-for="(item, idx) in basicItemIds" :key="item">
                <span>
                  {{idx + 1}}.
                  <i v-if="itemMap[item].gender == 0" class="infofont iconfont icon-man" style="color:#5cd0ed;font-size:14px;"></i>
                  <i v-if="itemMap[item].gender == 1" class="errorfont iconfont icon-woman" style="color:#d24d9b;font-size:14px;"></i>
                  {{item | id2name(itemMap)}}
                </span>
                <span class="fr item-price">{{itemMap[item].price | money}}</span>
                <Icon @click.native="selectItem(item, '必选')" class="deleteicon dn fr errorfont" type="close-circled"></Icon>
              </mt-cell>
              <mt-cell>
                <Row class="search-item-select">
                  <i-col span="3"><Icon class="infofont addicon" type="plus-circled"></Icon></i-col>
                  <i-col span="21">
                    <mt-select placeholder="简拼搜索项目"
                    :options="totalItems"
                    :filters="['name', 'pinyin']"
                    v-model="basicSelect"
                    @on-change="handleBasicSearchSelect" />
                  </i-col>
                </Row>
              </mt-cell>
            </mt-group>

            <mt-group class="mt10" :title="'可选项目(' + checkItemIds.length + ')'" type="success" @click.native="mealItemType = '可选'">
              <mt-cell class="checked-item" v-for="(item, idx) in checkItemIds" :key="item">
                <span>
                  {{idx + 1}}.
                  <i v-if="itemMap[item].gender == 0" class="infofont iconfont icon-man" style="color:#5cd0ed;font-size:14px;"></i>
                  <i v-if="itemMap[item].gender == 1" class="errorfont iconfont icon-woman" style="color:#d24d9b;font-size:14px;"></i>
                  {{item | id2name(itemMap)}}
                </span>
                <span class="fr item-price">{{itemMap[item].price | money}}</span>
                <Icon @click.native="selectItem(item, '可选')" class="deleteicon dn fr errorfont" type="close-circled"></Icon>
              </mt-cell>
              <mt-cell>
                <Row class="search-item-select">
                  <i-col span="3"><Icon class="successfont addicon" type="plus-circled"></Icon></i-col>
                  <i-col span="21">
                    <mt-select placeholder="简拼搜索项目"
                    :options="totalItems"
                    :filters="['name', 'pinyin']"
                    v-model="checkSelect"
                    @on-change="handleCheckSearchSelect" />
                  </i-col>
                </Row>
              </mt-cell>
            </mt-group>

            <mt-group class="mt10" :title="'可变必选项目(' + canChangeItemIds.length + ')'" type="warning" @click.native="mealItemType = '可变必选'">
              <mt-cell class="checked-item" v-for="(item, idx) in canChangeItemIds" :key="item">
                <span>
                  {{idx + 1}}.
                  <i v-if="itemMap[item].gender == 0" class="infofont iconfont icon-man" style="color:#5cd0ed;font-size:14px;"></i>
                  <i v-if="itemMap[item].gender == 1" class="errorfont iconfont icon-woman" style="color:#d24d9b;font-size:14px;"></i>
                  {{item | id2name(itemMap)}}
                </span>
                <span class="fr item-price">{{itemMap[item].price | money}}</span>
                <Icon @click.native="selectItem(item, '可变必选')" class="deleteicon dn fr errorfont" type="close-circled"></Icon>
              </mt-cell>
              <mt-cell>
                <Row class="search-item-select">
                  <i-col span="3"><Icon class="warningfont addicon" type="plus-circled"></Icon></i-col>
                  <i-col span="21">
                    <mt-select placeholder="简拼搜索项目"
                    :options="totalItems"
                    :filters="['name', 'pinyin']"
                    v-model="changeSelect"
                    @on-change="handleChangeSearchSelect" />
                  </i-col>
                </Row>
              </mt-cell>
            </mt-group>
          </div>
        </div>
      </i-col>

      <i-col span="16" class="bdr-l">
        <div class="mt-card">
          <p class="mt-card-title bg-base bdr-b btrr4">
            <span class="title-text">所有项目</span>
            <Input class="w200 fr title-input" icon="ios-search" v-model.trim="keyword" @input="filterItem" placeholder="简拼搜索项目" />
          </p>

          <div class="mt-card-body">
            <!--单项关系验证提示start-->
            <mt-affix :offset-top="50">
              <Alert :type="err.style" v-for="err in errorList" v-if="!err.hide" :key="err">
                <div slot="desc">
                  <Row>
                    <i-col :span="15">
                      <div class="errorfont">{{err.desc}}</div>
        							<div v-for="item in err.relateItems" :key="item.id">{{item.name}} {{item.price/100+"元"}}（{{'ID: ' + item.id}}）</div>
                    </i-col>
                    <i-col :span="9">
                      <Button class="fr ml10" @click="cancelError(err)" v-if="err.cancelBtnName && err.style == 'warning'">{{err.cancelBtnName}}</Button>
                      <Button class="fr ml10" type="primary" @click="cancelError(err)" v-if="err.cancelBtnName && err.style == 'info'">{{err.cancelBtnName}}</Button>
                      <Button class="fr" type="error" @click="confirmError(err)" v-if="err.confirmBtnName">{{err.confirmBtnName}}</Button>
                    </i-col>
                  </Row>
                </div>
              </Alert>
            </mt-affix>
						<!--单项关系验证提示end-->

            <div class="tc">
              <RadioGroup :class="mealItemTypeCls" v-model="mealItemType" type="button">
                <Radio class="pct33" label="必选"></Radio>
                <Radio class="pct33" label="可选"></Radio>
                <Radio class="pct33" label="可变必选"></Radio>
              </RadioGroup>
            </div>

            <div class="mt10">
              <div v-for="s in itemSpecies" :key="s.id">
                <div class="species-name bdr0 mt10"><strong>{{s.name}}</strong></div>
                <div class="item-species">

                  <div v-for="t in s.examItemList" v-if="!t.hide" :key="t.id">
                    <div class="single-item" v-if="!t.groupId">
                      <mt-checkbox
                        class="pct100 pt10 pb10 pl5"
                        :checked="checked(t.id)"
                        @on-check="selectItem(t.id, mealItemType)"
                        :type="getItemType(t.id)">
                        <span v-if="!t.show" class="errorfont">[隐藏项]</span>
                        <i v-if="t.gender == 0" class="infofont iconfont icon-man" style="color:#5cd0ed"></i>
                        <i v-if="t.gender == 1" class="errorfont iconfont icon-woman" style="color:#d24d9b"></i>
                        {{t.name}} <span style="color: #999;">ID:{{t.id}}</span>
                        <Poptip placement="top" width="400" trigger="hover" v-if="t.description || t.fitPeople || t.unfitPeople">
                          <Icon type="help-circled" style="font-size:14px;" color="#2d8cf0"></Icon>
                          <div slot="content">
                            <div v-if="t.description">{{t.description}}</div>
                            <div v-if="t.fitPeople"><span class="successfont"><Icon type="checkmark-circled"></Icon> 适宜人群：</span>{{t.fitPeople}}</div>
                            <div v-if="t.unfitPeople"><span class="errorfont"><Icon type="ios-minus"></Icon> 不适人群：</span>{{t.unfitPeople}}</div>
                          </div>
                        </Poptip>
                        <span class="fr">{{t.price | money}}</span>
                      </mt-checkbox>
                    </div>

                    <div class="group-item" v-if="t.groupId">
                      <div class="single-item" v-for="m in t.members" v-if="!m.hide" :key="m.id">
                        <mt-checkbox
                          class="pct100 pt10 pb10 pl5"
                          :checked="checked(m.id)"
                          @on-check="selectItem(m.id, mealItemType)"
                          :type="getItemType(m.id)">
                          <span v-if="!m.show" class="errorfont">[隐藏项]</span>
                          <i v-if="m.gender == 0" style="font-size:12px;color:#5cd0ed" class="infofont iconfont icon-man"></i>
                          <i v-if="m.gender == 1" style="font-size:12px;color:#d24d9b" class="errorfont iconfont icon-woman"></i>
                          {{m.name}} <span style="color: #999;">ID:{{m.id}}</span>
                          <Poptip placement="top" width="400" trigger="hover" v-if="m.description || m.fitPeople || m.unfitPeople">
                            <Icon type="help-circled" style="font-size:14px;" color="#2d8cf0"></Icon>
                            <div slot="content">
                              <div v-if="m.description">{{m.description}}</div>
                              <div v-if="m.fitPeople"><span class="successfont"><Icon type="checkmark-circled"></Icon> 适宜人群：</span>{{m.fitPeople}}</div>
                              <div v-if="m.unfitPeople"><span class="errorfont"><Icon type="minus-circled"></Icon> 不适人群：</span>{{m.unfitPeople}}</div>
                            </div>
                          </Poptip>
                          <span class="fr">{{m.price | money}}</span>
                        </mt-checkbox>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </i-col>
    </Row>
  </div>
</template>

<script>
import { resolveError } from './util'

export default {
  data () {
    return {
      keyword: '',
      items: [],
      mealItemType: '必选',
      basicSelect: '',
      checkSelect: '',
      changeSelect: '',
      errorList: []
    }
  },

  props: {
    itemSpecies: Array,   // 包含全部分类项目的分类
    totalItems: Array,    // 体检中心所有项目
    mealItems: Array,     // 包含套餐项目设置的全部项目
    type: {
      type: String,
      default: ''
    }
  },

  filters: {
    id2name: (value, map) => {
      return map[value] ? map[value].name : '';
    }
  },

  watch: {
  },

  computed: {
    basicItemIds () {
      return this.items.filter(v => v.checkType == '必选').map(t => t.id);
    },
    checkItemIds () {
      return this.items.filter(v => v.checkType == '可选').map(t => t.id);
    },
    canChangeItemIds () {
      return this.items.filter(v => v.checkType == '可变必选').map(t => t.id);
    },
    allMealItemIds () {
      return this.items.map(t => t.id);
    },

    mealItemTypeCls () {
      let cls = 'pct100';
      if (this.mealItemType == '必选') {
        cls += ' item-basic'
      } else if (this.mealItemType == '可选') {
        cls += ' item-selectable'
      } else if (this.mealItemType == '可变必选') {
        cls += ' item-change'
      }
      return cls;
    },

    itemMap () {
      return MyUtil.toMap(this.totalItems, 'id');
    }
  },

  methods: {
    filterItem  () {
      this.itemSpecies.map(s => {
        s.examItemList.map(it => {

          if (it.groupId) {
            it.members.map(gi => {
              gi.hide = !MyUtil.contain(gi.name, this.keyword) && !MyUtil.contain(gi.pinyin, this.keyword);
              return gi;
            })
          } else {
            it.hide = !MyUtil.contain(it.name, this.keyword) && !MyUtil.contain(it.pinyin, this.keyword);
          }
          return it;
        })
        return s;
      })
    },

    getItemType (id) {
      if (this.basicItemIds.indexOf(id) > -1) {
        return 'info'
      } else if (this.checkItemIds.indexOf(id) > -1) {
        return 'success'
      } else if (this.canChangeItemIds.indexOf(id) > -1) {
        return 'warning'
      }
      return ''
    },

    handleBasicSearchSelect (v) {
      if (!v) return;
      this.selectItem(v, '必选')
      this.basicSelect = '';
    },

    handleCheckSearchSelect (v) {
      if (!v) return;
      this.selectItem(v, '可选')
      this.checkSelect = '';
    },

    handleChangeSearchSelect (v) {
      if (!v) return;
      this.selectItem(v, '可变必选')
      this.changeSelect = '';
    },

    checked (id) {
      return this.allMealItemIds.indexOf(id) > -1;
    },

    selectItem (id, type) {
      this.errorList = [];

      let item = this.itemMap[id];
      if (!item.groupId && type == '可变必选') {
        this.$Message.warning('只有组项目可设为 可变必选 项');
        return;
      }

      let existItem = this.items.filter(t => t.id == id);
      if (existItem.length > 0) {
        if (existItem[0].checkType != type) {
          this.changeItemType(id, type);
        } else {
          this.deleteItem(id);
        }
      } else {
        this.addItem(id, type);
      }
    },

    changeItemType (id, type) {
      this.items = this.items.map(it => {
        if (it.id == id) {
          it = this.decodeItemType(it, type);
        }
        return it;
      })
    },

    deleteItem (id) {
      this.validate(undefined, id).then(() => {
        this.items = this.items.filter(t => t.id != id);
        this.$emit('on-change', this.items)
      }, (error) => {
        this.errorList = resolveError(error, id, this.itemMap);
      })
    },

    addItem (id, type) {
      let item = this.itemMap[id];
      let sameGroupItemId = this.hasSameGroupItem(item);
      if (sameGroupItemId) {
        this.changeGroupItem(id, type, sameGroupItemId)
      } else {
        this.validate(id).then(() => {
          this.items.push(this.decodeItemType(item, type));
          this.$emit('on-change', this.items)
        }, (error) => {
          this.errorList = resolveError(error, id, this.itemMap);
        })
      }

    },

    changeGroupItem (id, type, sameGroupItemId) {
      let item = this.itemMap[id];

      this.validate(undefined, sameGroupItemId).then(() => {  // 验证已经被选中的组项目，是否可取消
        this.validate(id, undefined, sameGroupItemId).then(() => {  // 验证切换的组项目，是否可添加
          this.items = this.items.filter(t => t.id != sameGroupItemId);
          this.items.push(this.decodeItemType(item, type));
          this.$emit('on-change', this.items)
        }, (error) => {
          this.errorList = resolveError(error, id, this.itemMap, sameGroupItemId);
        })
      }, (error) => {
        this.errorList = resolveError(error, id, this.itemMap);
      })
    },

    // 已选项目列表中 有 同一个组的项目
    hasSameGroupItem (item) {
      let sameGroupItemId;
      this.items.forEach(it => {
        if (item.groupId && it.groupId == item.groupId) {
          sameGroupItemId = it.id;
        }
      })
      return sameGroupItemId;
    },

    validate (addId, deleteId, sameGroupItemId) {
      let pms = { selectedIds: this.items.filter(t => t.id != sameGroupItemId).map(it => it.id) };
      if (addId) pms.addId = addId;
      if (deleteId) pms.cancelId = deleteId;

      let validateUrl = (this.type == 'standardMeal' ? '/meal/standard' : '/meal/platform');
      return this.$http.post(`${validateUrl}/validateItemRelation`, pms).then((res) => {
        return res.data;
      })
    },

    decodeItemType (ite, type) {
      let item = JSON.parse(JSON.stringify(ite))
      item.checkType = type;
      if (type == '可变必选') {
        item.basic = true;
        item.enableSelect = true;
        item.show = true;
      } else if (type == '必选') {
        item.basic = true;
        item.enableSelect = false;
        item.show = true;
      } else if (type == '可选') {
        item.basic = false;
        item.enableSelect = true;
        item.show = true;
      }
      return item
    },

    /*
     * 冲突处理部分 start
     * 处理关系报错信息
     * 1. 当有依赖项的时候，选中依赖的项目
     * 2. 当项目被依赖的时候，取消所有依赖项
     * (一键全选/都不选择)
     */
    confirmError(error) {
      if (error.type == 'DEPEND') {
        this.items.push(this.decodeItemType(error.currItem, this.mealItemType));
        for (let i = 0; i < error.relateItems.length; i++) {
          this.items.push(this.decodeItemType(error.relateItems[i], this.mealItemType == '可变必选' ? '可选' : this.mealItemType));
        }
      } else if (error.type == 'DEPENDED') {
        this.removeAllRelationItem(error);
        if (error.rollbackItem) {
          this.items.push(this.decodeItemType(error.rollbackItem, this.mealItemType));
        }
      } else if (error.type == 'HIDDEN') {
        for (let i = 0; i < error.relateItems.length; i++) {
          this.deleteItem(error.relateItems[i].id);
        }
      }
      this.closeErrorFeedback(error);
      this.$emit('on-change', this.items)
    },

    cancelError(err) {
      if (err.type == 'DEPEND') {
        this.removeAllRelationItem(err);
      } else if (err.type == 'HIDDEN') {

      }
      this.closeErrorFeedback(err);
    },

    closeErrorFeedback(err) {
      err.hide = true;
    },

    removeAllRelationItem(error) {
      let removeId = [ error.currItem.id, ...error.itemIds ]
      this.items = this.items.filter(it => removeId.indexOf(it.id) == -1)
    },
    // 冲突处理部分 end

    initSelectItem () {
      this.items = this.mealItems.filter(it => it.mealId && it.show && it.selected).map(v => {
        if (v.basic && v.enableSelect && v.groupId) {
          v.checkType = '可变必选'
        } else if (v.basic) {
          v.checkType = '必选'
        } else if (v.mealId && v.selected) {
          v.checkType = '可选'
        }
        return v;
      })
    }
  },

  mounted () {
    if (this.mealItems.length > 0) {
      this.initSelectItem()
    }
  }
}
</script>

<style scoped lang="less">
@import '~assets/style/param.less';

.meal-editor-item {
  border: 1px solid #e9eaec;
  border-radius: 6px;
}

.mt-card {
  background: #fff;
  border-radius: 4px;
  font-size: 14px;
  position: relative;
  -webkit-transition: all 0.2s ease-in-out;
  transition: all 0.2s ease-in-out;
  .mt-card-title {
    padding: 14px 16px;
    .title-text {
      font-size: 14px;
      color: #1c2438;
      font-weight: bold;
    }
    .title-input {
      position: relative;
      top: -5px;
    }
  }
  .mt-card-body {
    padding: 16px;
  }
}
.btlr4 {
  border-top-left-radius: 4px;
}
.btrr4 {
  border-top-right-radius: 4px;
}

.species-name {
  padding: 10px 0px;
}
.group-item {
  .single-item {
    padding-left: 20px;
    &:not(:first-child) {
      border: none;
    }
  }
}
.single-item {
  border-top:1px solid #e6e6e8;
  &:hover {
    background: @table-td-hover-bg;
  }
  .ivu-checkbox-group-item {
    width: 100%;
  }
}
.search-item-select .addicon{
  position: relative;
  margin-right: 5px;
  top: 6px;
  font-size: 18px;
}
.checked-item:hover {
  .deleteicon {
    display: block;
    cursor: pointer;
    font-size: 18px;
  }
  .item-price {
    display: none;
  }
}

.item-basic {
  label.ivu-radio-wrapper-checked:nth-child(1) {
    color: @info-color;
    border-color: @info-color;
    -webkit-box-shadow:  0  0  0 -1px @info-color;
    box-shadow:  0  0 0 -1px @info-color;

  }
}
.item-selectable {
  label.ivu-radio-wrapper-checked:nth-child(2) {
    color: @success-color;
    border-color: @success-color;
    -webkit-box-shadow: -1px 0 0 0 @success-color;
    box-shadow: -1px 0 0 0 @success-color;
  }
}
.item-change {
  label.ivu-radio-wrapper-checked:nth-child(3) {
    color: @warning-color;
    border-color: @warning-color;
    -webkit-box-shadow: -1px 0 0 0 @warning-color;
    box-shadow: -1px 0 0 0 @warning-color;
  }
}

</style>
