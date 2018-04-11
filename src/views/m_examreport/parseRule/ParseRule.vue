<template>
  <div>
    <div class="header-search">
      <mt-select
       style="width:400px"
       v-model="parseRule.hospitalId"
       placeholder="请选择体检机构"
       @on-change="selectHospital"
       :filters="['name']"
       :options="hospitalList"
       :clearable="false" />
    </div>

    <div class="body-content">
      <Row :gutter="40">
        <Col :span="8">
            <Input type="textarea"
              placeholder="请输入解析规则"
              v-model="parseRule.rule"
              :readonly="ruleReadonly"
              :autosize="{ minRows: 30, maxRows: 30}">   
            </Input>
            <div class="m20">
              <Button @click="ruleReadonly=false">编辑</Button>
              <Button type="primary" @click="saveRule">保存</Button>
            </div>
        </Col>

        <Col :span="8">
          <div class="grid-content bg-purple">
            <Input 
              type="textarea"
              v-model="report"
              readonly
              :autosize="{ minRows: 30, maxRows: 30}">
            </Input>
            <Button 
             type="primary" 
             style="margin-left:160px;margin-top:30px"
             @click="getRandomText">换一条
            </Button>
          </div>
        </Col>

        <Col :span="8">
          <div class="grid-content bg-purple">
            <Input 
              type="textarea" 
              readonly
              placeholder="此处将输出解析结果"
              v-loading="parseLoading"
              element-loading-text="拼命加载中"
              v-model="parseOutput"
              :autosize="{ minRows: 30, maxRows: 30}">
            </Input>
            <Button 
              type="primary" 
              style="margin-left:160px;margin-top:30px"
              @click="parse">测试解析
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  </div>
</template>

<script>
import ParseRule from './ParseRule.js'
export default ParseRule
</script>

<style scoped>
.btn
{
  display: block;
  clear: both;
  padding-bottom: 20px;
  overflow: hidden;
}
.text-input {
  height: 700px;
}
.m20{
  margin-left: 115px;
  margin-top: 30px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>
