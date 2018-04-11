<template>
  <div>
    <Card dis-hover>
      <p slot="title">套餐信息</p>

      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80" :inline="true">
        <FormItem label="套餐名称" prop="name">
          <Input class="w200" :maxlength="30" v-model="formValidate.name" placeholder="输入套餐名称" />
        </FormItem>
        <FormItem label="性别" prop="gender">
          <RadioGroup v-model="formValidate.gender">
            <Radio label="0">男</Radio>
            <Radio label="1">女</Radio>
            <Radio label="2">通用</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="套餐ID:" v-if="formValidate.id">
          {{formValidate.id}}
        </FormItem>
        <br>
        <FormItem label="修改提示" prop="modifyText">
          <Input class="w200" :maxlength="16" v-model="formValidate.modifyText" placeholder="设置修改套餐的提示文案" />
        </FormItem>
        <FormItem label="关键词">
          <Tag v-for="(k, idx) in keywordList" :key="k" :name="k" closable @on-close="deleteTag(idx)">{{k}}</Tag>
          <Poptip placement="top">
            <Button icon="ios-plus-empty" type="dashed" size="small">添加标签</Button>
            <div slot="content" class="h40">
              <i-input class="w200" :maxlength="5" v-model="newKeyword" placeholder="输入标签名称">
                <span slot="append"><a @click="addKeyword">添加</a></span>
              </i-input>
            </div>
          </Poptip>
        </FormItem>
        <br>
        <FormItem label="套餐描述" prop="mail" class="pct100">
          <Input type="textarea" :maxlength="512" v-model="formValidate.description" placeholder="选填" />
        </FormItem>
        <FormItem label="">
          <Checkbox v-model="notAllowChangeItem" @on-change="handleAllowChange"> 不允许下单改项</Checkbox>
        </FormItem>
      </Form>

    </Card>
  </div>
</template>

<script>

export default {
  data () {
    const validateGender = (rule, value, callback) => {
      if (value === '0' || value === '1' || value === '2') {
        callback();
      } else {
        callback(new Error('性别不能为空'));
      }
    };

    return {
      formValidate: {
        id: '',
        name: '',
        gender: '',
        modifyText: '点击修改套餐',
        description: '',
        keyword: '',
        allowChangeItem: true
      },
      newKeyword: '',
      keywordList: [],
      ruleValidate: {
        name: [
          { required: true, message: '套餐名称不能为空', trigger: 'blur' }
        ],
        gender: [
          { validator: validateGender, trigger: 'change' }
        ]
      }
    }
  },

  props: {
    meal: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },

  computed: {  
    notAllowChangeItem: {  
      // getter  
      get: function () {  
        return !this.formValidate.allowChangeItem; 
      },  
      // setter  
      set: function (newValue) {
        return newValue;
      }  
    }  
  },

  methods: {
    handleAllowChange(val) {
      this.formValidate.allowChangeItem = !val;
    },

    deleteTag (idx) {
      this.keywordList.splice(idx, 1);
      this.formValidate.keyword = this.keywordList.join('|');
    },

    addKeyword () {
      if (this.keywordList.length >= 5) {
        this.$Message.warning('最多只能增加5个标签');
        return;
      }
      if (!this.newKeyword || this.newKeyword.trim() === '') {
        this.$Message.warning('标签内容不能为空');
        return;
      }
      this.keywordList.push(this.newKeyword);
      this.newKeyword = '';
      this.formValidate.keyword = this.keywordList.join('|');
    }
  },

  mounted () {
    if (this.meal.id) {
      this.formValidate = JSON.parse(JSON.stringify(this.meal));
      this.formValidate.gender += '';
      this.keywordList = this.meal.keyword ? this.meal.keyword.split('|') : [];
    }

  }
}
</script>
