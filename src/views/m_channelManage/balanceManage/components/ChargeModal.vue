<template>
  <div>
    <Modal
      title="充值"
      v-model="show"
      @on-cancel="closeModal"
      :mask-closable="false">
        <Form
         :model="chargeBill"
         :rules="rules"
         ref="newForm"
         :label-width="100"
         :inline="true"
         class="demo-form-inline">

          <FormItem class="dib" label="渠道商:" prop="hosName">
            <span>{{chargeBill.hosName}}</span>
          </FormItem>
          <br>
          <FormItem class="dib" label="充值账号:" prop="account">
            <span>{{chargeBill.account}}</span>
            <span class="gray">(账户号)</span>
          </FormItem>
          <br>
          <FormItem class="dib" label="充值金额:" prop="amount">
            <Input style="width: 300px;" v-model.number="chargeBill.amount" :maxlength="7" autofocus @input="handleInput" />
          </FormItem>
          <br>
          <FormItem class="dib" label="充值后余额:" prop="balance">
            <span class="redfont">{{finalBalance | money('￥')}}</span>
          </FormItem>
          <br>
          <FormItem class="dib" label="备注:" prop="remark">
            <Input style="width: 300px;" v-model="chargeBill.remark" type="textarea" :maxlength="100"></Input>
          </FormItem>

        </Form>
        <div slot="footer">
            <Button @click="closeModal">取消</Button>
            <Button type="primary" @click="charge">确认</Button>
        </div>
    </Modal>

  </div>
</template>

<script>
export default {
  name: 'chargeModal',
  data() {
    return {
      finalBalance: 0,
      rules: {
        amount: [
           { required: true, message: '金额不能为空'},
           { type: 'number', message: '金额必须为数字值'}
        ]
      }
    };
  },

  props: {
    chargeBill: Object,
    chargeBillShow: Boolean,
    onClose: Function,
    onSuccess: Function
  },

  methods: {
    handleInput () {
      this.finalBalance = (this.chargeBill.amount || 0) * 100 + this.chargeBill.balance;
    },

    closeModal () {
      this.onClose()
    },

    charge () {
      this.$refs['newForm'].validate((valid) => {
        if (valid) {
          let params = {
            orgId: this.chargeBill.id,
            amount: this.chargeBill.amount * 100,
            remark: (this.chargeBill.remark || '')
          }
          this.$http.post('/amount/rech', params).then((response) => {
            this.$Notice.success({desc: '充值成功'});
            this.onClose()
            this.onSuccess()
          });
        }
      })
    }

  },

  computed: {
    show: {
      set: function (value) {
      },
      get: function () {
        return this.chargeBillShow;
      }
    }
  },

  mounted(){
    this.finalBalance = this.chargeBill.balance;
  }
};
</script>
