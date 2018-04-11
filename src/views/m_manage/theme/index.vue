<template>
  <div>
    <Row>
      <Col :span="24" class="header-search">
        主题设置
      </Col>
    </Row>

    <div class="body-content">
      <Tabs value="rule">
        <TabPane label="颜色规则" name="rule">
          <Row class="mng-theme bdr">
            <Col span="12" class="mng-theme-code">
              <div class="mng-theme-code-inner">
                  <Input v-model.trim="ruleCode" type="textarea" class="mng-theme-code-txtarea"></Input>
              </div>
            </Col>
            <Col span="12" class="mng-theme-tbl">
              <div class="f16 p15">颜色变量</div>
              <Table :columns="columns_rule" size="small" :data="data_rule"></Table>
            </Col>
          </Row>
          <div class="pt15 pl20"><Button type="primary" 
          @click.native="updateRule"
          :disabled="initRuleCode === ruleCode">保存</Button></div>
        </TabPane>

        <TabPane label="模板管理" name="tpl">
            <Row class="mng-tpl">
            <Col span="6" class="mng-tpl-tbl">
              <div class="mng-tpl-inner">
                <Table :columns="columns_tpl" :height="490" size="small" :row-class-name="rowClassName" :data="data_tpl" @on-row-click="changeCurrTpl"></Table>
                <div class="tc mt15">
                  <Button type="ghost" size="large" @click="createTpl">添加模板</Button>
                </div>
              </div>
            </Col>
            <Col span="18" class="mng-tpl-frm">
              <div class="pl15" style="width: 400px">
                <Form :label-width="120">
                  <FormItem label="模板名称">
                    <Input v-model.trim="currTpl.name" ref="tplName"></Input>
                  </FormItem>
                  <FormItem label="颜色设置">
                    <Input v-for="item in colors" v-model.trim="item.color" :key="item.id" class="mb10">
                      <span slot="prepend"><div class="dib tc" style="width: 60px;">{{item.alias}}</div></span>
                      <span slot="append"><div class="mng-tpl-color" :style="{backgroundColor: item.color}"></div></span>
                    </Input>
                  </FormItem>
                </Form>
                <div class="mt15" style="margin-left: 120px;">
                  <Button type="primary" @click.native="updateTpl">保存</Button>
                  <Button @click.native="resetTpl">重置</Button>
                  <Button type="warning" @click.native="delTpl">删除</Button>
                </div>
              </div>
            </Col>
          </Row>
        </TabPane>
      </Tabs>
      <Spin size="large" fix v-if="spinShow"></Spin>
    </div>
  </div>
</template>

<script>
  import _ from 'lodash'
  import Api from '../api'

  export default {
    data () {
      return {
        spinShow: false,
        isCreate: false,
        colors: [],

        initRuleCode: '',
        ruleCode: '',

        currTpl: {},
        initTpl: {},

        columns_rule: [
          {
            title: 'ID',
            key: 'id',
          },
          {
            title: '颜色变量',
            key: 'name',
          },
          {
            title: '颜色变量名称',
            key: 'alias',
          },
        ],
        columns_tpl: [
          {
            title: 'ID',
            key: 'id',
          },
          {
            title: '模板管理',
            key: 'name',
          },
        ],
        data_rule: [],
        data_tpl: [],
      }
    },

    mounted () {
      this.loadColorRule()
      this.loadWebCss()
    },

    methods: {
      // 单行选中
      rowClassName (row, index) {
        return this.currTpl.id === row.id ? 'mng-tpl-tbl-row_active' : ''
      },

      // 获取样式规则
      loadColorRule () {
        Api.getColorRule({ stateName: 'spinShow', context: this }).then(res => {
          const { color, rule } = res
          this.data_rule = color
          this.initRuleCode = rule || ''
          this.ruleCode = rule || ''
        })
      },

      // 更新样式规则
      updateRule () {
        const { initRuleCode, ruleCode } = this
        if (!ruleCode) {
          return this.$Message.warning('换色规则不能为空')
        }

        if (initRuleCode !== ruleCode) {
          Api.updateColorRule({ data: { cssRule: ruleCode }, stateName: 'spinShow', context: this }).then(res => {
            this.$Message.success('保存成功')
          })
        }
      },

      // 获取 模板
      loadWebCss () {
        Api.getWebCss({ stateName: 'spinShow', context: this }).then(res => {
          const { css, color } = res
          this.isCreate = false
          this.data_tpl = css
          this.currTpl = css[0] || {}
          this.initTpl = css[0] || {}
          this.colors = Object.keys(color).map(v => {
            return {
              name: color[v].name,
              alias: color[v].alias,
              id: color[v].id,
              color: this.currTpl[color[v].name.slice(1)] || '',
            }
          }).sort((a, b) => a.id - b.id)
        })
      },

      // 选择 当前 模板
      changeCurrTpl (tpl) {
        this.currTpl = tpl
        this.initTpl = tpl
        this.isCreate = false
        this.colors = this.colors.map(v => {
          v.color = tpl[v.name.slice(1)] || ''
          return v
        })
      },

      // 新增 模板
      createTpl () {
        this.currTpl = {}
        this.initTpl = {}
        this.isCreate = true
        this.colors = this.colors.map(v => {
          v.color = ''
          return v
        })
      },

      // 删除 模板
      delTpl (id) {
        Api.delTpl({ urlData: { id }, stateName: 'spinShow', context: this }).then(res => {
          this.$Message.success('模板删除成功')
          this.loadWebCss()
        })
      },

      // 更新 模板
      updateTpl () {
        const colors = this.colors.map((v, i) => {
          return { key: 'color' + (++i), value: v.color }
        })

        const pms = this.isCreate ? {} : _.clone(this.currTpl)

        this.isCreate && (pms.name = this.currTpl.name)

        colors.forEach(v => {
          v.value && (pms[v.key] = v.value)
        })

        // 名称不能为空
        if (!pms.name) {
          this.$refs.tplName.focus()
          return this.$Message.warning('请输入模板名称')
        }

        Api.updateTpl({ data: { ...pms }, stateName: 'spinShow', context: this }).then(res => {
          this.$Message.success('模板更新成功')
          this.loadWebCss()
        })
      },

      // 重置 模板
      resetTpl () {
        this.currTpl = JSON.parse(JSON.stringify(this.initTpl))
        this.colors = this.colors.map(v => {
          v.color = this.currTpl[v.name.slice(1)] || ''
          return v
        })
      },
    },
  }
</script>

<style lang="less">
  .mng-theme.ivu-row {
    height: 490px;
    &-code {
      height: 100%;
      position: relative;
      &-inner {
        background-color:#F6F7F8;
        position: absolute;
        left: 0; right: 0; bottom: 0; top: 0;
        overflow-y: scroll;
        padding: 15px;
      }
    }
  }
  .mng-theme-code-txtarea textarea.ivu-input {
    height: 490px;
    border: none;
    background: #eee;
    border-radius: 0;
    padding: 20px;
  }
  .mng-tpl-color {
    display: inline-block;
    width: 15px;
    height: 15px;
    border-radius: 50%;
  }
  .ivu-table .mng-tpl-tbl-row_active td {
    background-color: #F2F3F4;
  }
</style>
