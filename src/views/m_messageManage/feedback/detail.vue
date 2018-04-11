<template>
  <div>
    <div class="header-search">
      <Breadcrumb>
        <BreadcrumbItem style="cursor: pointer;" @click.native="$router.go(-1)">返回</BreadcrumbItem>
        <BreadcrumbItem>反馈详情</BreadcrumbItem>
      </Breadcrumb>
    </div>
    <div class="p20">
      <Card>
        <p slot="title">手机端用户反馈详情</p>
        <Form :model="feedbackWarp" label-position="left" :label-width="120" ref="feedbackWarp" inline>
          <FormItem label="用户姓名：" class="pct30">
            {{feedbackWarp.username || '匿名'}}
          </FormItem>
          <FormItem label="手机号：" class="pct30">
            {{feedbackWarp.feedback.mobile || '-'}}
          </FormItem>
          <FormItem label="身份证号：" class="pct30">
            {{feedbackWarp.feedback.idCard || '-'}}
          </FormItem>
          <br>
          <FormItem label="来源站点：" class="pct30">
            {{feedbackWarp.feedback.hospitalName}}
          </FormItem>
          <FormItem label="留言时间：" class="pct30">
            {{feedbackWarp.feedback.saveTime | date('yyyy-MM-dd hh:mm:ss')}}
          </FormItem>
          <br>
          <FormItem label="用户留言：">
            {{feedbackWarp.feedback.content || '无'}}
          </FormItem>
        </Form>
      </Card>

      <Card class="mt20">
        <p slot="title">处理结果
          <a class="fr" @click="toEdit()">{{editing ? '取消' : '处理'}}</a>
        </p>
        <Form class="bdr-b" label-position="left" :label-width="120" inline v-for="item in feedbackWarp.feedback.feedbackDeals" :key="item.gmtCreated">
          <FormItem label="处理状态：" class="pct30">
            {{item.dealStatus | statusFilter}}
          </FormItem>
          <FormItem label="处理人：" class="pct30">
            {{item.operator}}
          </FormItem>
          <FormItem label="处理时间：" class="pct30">
            {{item.gmtCreated | date('yyyy-MM-dd hh:mm:ss')}}
          </FormItem>
          <br>
          <FormItem label="备注：">
            {{item.dealContent || '无'}}
          </FormItem>
        </Form>

        <div v-if="editing" class="pt20" id="editFeedback">
          <Form :model="feedbackResultForm" label-position="left" :label-width="120" ref="feedbackResultForm" inline>
            <FormItem label="处理状态：" class="pct50">
              <RadioGroup v-model="feedbackResultForm.status">
                <Radio label="已处理">
                  <span>已处理</span>
                </Radio>
                <Radio label="忽略">
                  <span>忽略</span>
                </Radio>
              </RadioGroup>
            </FormItem>
            <br>
            <FormItem label="备注：" class="pct100">
              <Input class="pct50" type="textarea" v-model="feedbackResultForm.remark" :maxlength="500" placeholder="填写备注信息" />
            </FormItem>
            <br>
            <FormItem>
              <Button type="primary" @click="save()">保存</Button>
              <Button class="ml20" type="text" @click="cancel()">取消</Button>
            </FormItem>
          </Form>
        </div>

      </Card>

    </div>
  </div>
</template>

<script>
const statusCont = {
  已处理: 1,
  忽略: -1
}

export default {
  name: 'feedbackDetail',
  components: {},

  data() {
    return {
      feedbackWarp: {
        feedback: {}
      },
      feedbackResult: {},

      editing: false,
      feedbackResultForm: {
        status: '已处理',
        remrak: ''
      }
    }
  },

  filters: {
    statusFilter: value => {
      let sta = {
        '0': '未处理',
        '1': '已处理',
        '-1': '忽略'
      }
      return sta[value + '']
    }
  },

  methods: {
    getFeedbackById() {
      this.$http
        .get('/queryFeedBackById?feedbackId=' + this.$route.query.feedbackId)
        .then(res => {
          this.feedbackWarp = res.body
        })
    },

    toEdit() {
      this.editing = !this.editing
      this.feedbackResultForm = {
        status: '已处理',
        remrak: ''
      }
      setTimeout(() => { window.scrollTo(0, document.getElementById('editFeedback').offsetTop); })
    },

    save() {
      let pms = {
        feedBackId: this.$route.query.feedbackId,
        dealStatus: statusCont[this.feedbackResultForm.status],
        dealContent: this.feedbackResultForm.remark
      }
      this.$http.post('/dealFeedback', JSON.stringify(pms)).then(res => {
        this.cancel()
        this.getFeedbackById()
        this.$Message.success('保存成功')
      })
    },

    cancel() {
      this.editing = !this.editing
    }
  },

  computed: {},

  mounted() {
    this.getFeedbackById()
  }
}
</script>
