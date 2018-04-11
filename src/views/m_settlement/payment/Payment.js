const Payment = {
  name: 'payment',
  data() {
    return {
      queryList: {
        organizationId: '',
        provinceId: '',
        cityId: '',
        districtId: ''
      },
      hosList: [],
      areaList: [],
      area: [],
      paymentTime: '',
      paymentList: [],
      examine: {
        sn: '',
        discountAmount: 0,
        acturallyPayAmount: '',
        platformDiscount: '',
        platformActurallyPayAmount: '',
        remark: ''
      },
      payment: {
        snList: [],
        organizationId: '',
        imageUrl: '',
        remark: ''
      },
      bill: {
        sn: '',
        acturallyPayAmount: '',
        discountAmount: 0,
        platformDiscount: '',
        platformActurallyPayAmount: '',
        remark: ''
      },
      dialogExamine: false,
      dialogPay: false,
      dialogEdit: false,
      selectArr: [],

      payLoading: false,
      errorInfo: undefined
    }
  },

  watch: {
    queryList: {
      handler: function() {
        this.getPaymentList()
      },
      deep: true
    }
  },

  mounted() {
    this.getPaymentList()
    this.getHosList()
    this.getAreaList()
  },

  filters: {
    billStatus: function(value) {
      if (value == 4) return '平台审核中'
      else if (value == 5) return '付款中'
      else if (value == 7) return '医院审核中'
    },
    img: function(value) {
      if (value) {
        var arr = value.split('/')
        return arr[arr.length - 1]
      } else {
        return ''
      }
    }
  },
  methods: {
    //获取账单列表
    getPaymentList() {
      this.payLoading = true
      this.$http
        .post(
          '/settlement/getHospitalPlatformSummaryBillList',
          JSON.stringify(this.queryList)
        )
        .then(
          response => {
            this.paymentList = this.addCheckOne(response.body)
            this.selectArr = []
            this.payLoading = false
          },
          res => {
            this.$Message.error(res.text)
            this.payLoading = false
          }
        )
    },

    //初始化选中
    addCheckOne(list) {
      for (let i = 0; i < list.length; i++) {
        list[i].isCheckedAll = false
        for (let j = 0; j < list[i].tradeHospitalPlatformBillList.length; j++) {
          list[i].tradeHospitalPlatformBillList[j].isCheck = false
          list[i].allPayment = 0
          list[i].allDiscountAmount = 0
          list[i].allConsumeQuotaAmount = 0
          list[i].allPayableTotalAmount = 0
        }
      }
      return list
    },

    // 点击全选/取消全选
    handleCheckAll(payment) {
      if (payment.isCheckedAll) {
        this.checkAll(payment)
      } else {
        this.clearCheck(payment)
      }
    },

    // 取消全选
    clearCheck(payment) {
      this.selectArr = []
      var plist = payment.tradeHospitalPlatformBillList
      this.clearSelection(payment)
      for (let i = 0; i < plist.length; i++) {
        plist[i].isCheck = false
      }
    },

    //全选
    checkAll(payment) {
      this.clearSelection(payment)
      var plist = payment.tradeHospitalPlatformBillList
      for (let i = 0; i < plist.length; i++) {
        if (plist[i].status == 5) {
          plist[i].isCheck = true
          this.selectArr.push(plist[i])
          payment.allPayment += plist[i].platformChargedAmount
          payment.allDiscountAmount += plist[i].discountAmount
          payment.allConsumeQuotaAmount += plist[i].consumeQuotaAmount
          payment.allPayableTotalAmount += plist[i].platformActurallyPayAmount
        }
      }
    },

    //单个选择
    handleCheckOne(item, payment) {
      if (item.isCheck) {
        this.selectArr.push(item)
        payment.allPayment += item.platformChargedAmount
        payment.allDiscountAmount += item.discountAmount
        payment.allConsumeQuotaAmount += item.consumeQuotaAmount
        payment.allPayableTotalAmount += item.platformActurallyPayAmount

        payment.isCheckedAll = true
        var plist = payment.tradeHospitalPlatformBillList
        for (let i = 0; i < plist.length; i++) {
          if (!plist[i].isCheck) {
            payment.isCheckedAll = false
          }
        }
      } else {
        payment.isCheckedAll = false
        payment.allPayment -= item.platformChargedAmount
        payment.allDiscountAmount -= item.discountAmount
        payment.allConsumeQuotaAmount -= item.consumeQuotaAmount
        payment.allPayableTotalAmount -= item.platformActurallyPayAmount

        for (let i = 0; i < this.selectArr.length; i++) {
          if (item.sn == this.selectArr[i].sn) {
            this.selectArr.splice(i, 1)
          }
        }
      }
    },

    clearSelection(payment) {
      payment.allPayment = 0
      payment.allDiscountAmount = 0
      payment.allConsumeQuotaAmount = 0
      payment.allPayableTotalAmount = 0
    },

    pay(payment) {
      this.payment.snList = []
      if (this.selectArr.length == 0) {
        this.$Message.warning('请选择付款账单')
        return
      }
      for (let i = 0; i < this.selectArr.length; i++) {
        if (this.selectArr[i].status == 4 || this.selectArr[i].status == 7) {
          this.$Message.warning('请选择付款中的账单付款')
          return
        } else {
          this.payment.snList.push(this.selectArr[i].sn)
        }
      }
      this.payment.organizationId = payment.organizationId
      this.payment.allPayableTotalAmount = payment.allPayableTotalAmount
      this.$refs['payForm'].resetFields()
      this.dialogPay = true
    },

    payBill() {
      this.$http
        .post(
          '/settlement/addSettlementPayRecord',
          JSON.stringify(this.payment)
        )
        .then(
          response => {
            this.$Message.success('操作成功!')
            this.dialogPay = false
            this.getPaymentList()
          },
          res => {
            this.$Message.error(res.text)
          }
        )
    },

    //获取医院列表
    getHosList() {
      var qureyValue = {
        provinceId: this.queryList.provinceId,
        cityId: this.queryList.cityId,
        districtId: this.queryList.districtId,
        orgType: 1
      }
      this.$http.post('/hospital/queryOrg', JSON.stringify(qureyValue)).then(
        response => {
          this.hosList = response.body
        },
        res => {
          this.$Message.error(res.text)
        }
      )
    },

    //获取地址列表
    getAreaList() {
      this.$http.get('/hospital/queryArea').then(
        response => {
          this.areaList = response.body.provinces
        },
        res => {
          this.$Message.error(res.text)
        }
      )
    },

    //获取省市区id
    getDetailId(val) {
      this.queryList.provinceId = val[0]
      this.queryList.cityId = val[1]
      this.queryList.districtId = val[2]
      this.getHosList()
    },

    action() {
      var files = document.getElementById('fileNew').files[0]
      var formData = new FormData()
      formData.append('file', files)
      this.$http.post('/settlement/uploadImage', formData).then(
        response => {
          this.payment.imageUrl = response.bodyText
        },
        res => {
          this.$Message.error(res.text)
        }
      )
    },

    handleReset(name) {
      this.dialogPay = false
      this.dialogExamine = false
      this.dialogEdit = false
      this.errorInfo = undefined
    },

    //下载详单
    download(sn) {
      this.$http
        .get(
          '/settlement/downloadSettlementBill?hospitalPlatformBillSns=' + [sn]
        )
        .then(
          response => {
            this.$Message.success('正在下载中....')
            window.location.href = response.url
          },
          res => {
            this.$Message.error(res.text)
          }
        )
    },

    //审核
    review(item, payment) {
      this.$refs['examineForm'].resetFields()
      this.examine.sn = item.sn
      this.examine.platformChargedAmount = (
        item.platformChargedAmount / 100.0
      ).toFixed(2)
      this.examine.discountAmount = (
        item.platformChargedAmount *
        item.platformDiscount /
        100.0
      ).toFixed(2)
      this.examine.platformDiscount = item.platformDiscount
      this.examine.remark = item.remark
      this.examine.minValue = (
        payment.hospitalConsumeQuotaAmount / 100.0
      ).toFixed(2)
      var platformActurallyPayAmount = (
        (item.platformChargedAmount * item.platformDiscount -
          payment.hospitalConsumeQuotaAmount) /
        100.0
      ).toFixed(2)
      this.examine.platformActurallyPayAmount = item.platformActurallyPayAmount
        ? (item.platformActurallyPayAmount / 100.0).toFixed(2)
        : platformActurallyPayAmount > 0 ? platformActurallyPayAmount : 0
      this.dialogExamine = true
    },

    //编辑
    editPayment(item, payment) {
      this.$refs['billForm'].resetFields()
      this.bill.sn = item.sn
      this.bill.platformChargedAmount = (
        item.platformChargedAmount / 100.0
      ).toFixed(2)
      this.bill.discountAmount = (item.discountAmount / 100.0).toFixed(2)
      this.bill.platformDiscount = item.platformDiscount
      this.bill.minValue = (payment.hospitalConsumeQuotaAmount / 100.0).toFixed(
        2
      )
      this.bill.consumeQuotaAmount = (item.consumeQuotaAmount / 100.0).toFixed(
        2
      )
      this.bill.remark = item.remark
      this.bill.platformActurallyPayAmount = (
        item.platformActurallyPayAmount / 100.0
      ).toFixed(2)
      this.dialogEdit = true
    },

    reviewBill(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          var examine = {
            sn: this.examine.sn,
            consumeQuotaAmount: (
              this.examine.platformActurallyPayAmount * 100 -
              this.examine.discountAmount * 100
            ).toFixed(),
            discountAmount: (this.examine.discountAmount * 100).toFixed(),
            platformActurallyPayAmount: (
              this.examine.platformActurallyPayAmount * 100
            ).toFixed(),
            remark: this.examine.remark
          }

          //平台实付不能小于最小值
          if (
            this.examine.platformActurallyPayAmount -
              (this.examine.discountAmount - this.examine.minValue) <
            0
          ) {
            this.errorInfo = '平台实付不能小于最小值'
            return
          }
          //限定不能为负数
          if (!examine.discountAmount && examine.discountAmount != 0) {
            this.errorInfo = '折扣应付不能为空'
            return
          }
          if (
            !examine.platformActurallyPayAmount &&
            examine.platformActurallyPayAmount != 0
          ) {
            this.errorInfo = '平台实付不能为空'
            return
          }
          this.errorInfo = undefined
          this.$http
            .post('/settlement/reviewBill', JSON.stringify(examine))
            .then(
              response => {
                this.$Message.success('操作成功!')
                this.dialogExamine = false
                this.getPaymentList()
              },
              res => {
                this.$Message.error(res.text)
              }
            )
        } else {
          this.$Message.error('表单验证失败!')
        }
      })
    },

    confirmEdit(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          var examine = {
            sn: this.bill.sn,
            consumeQuotaAmount: (
              this.bill.platformActurallyPayAmount * 100 -
              this.bill.discountAmount * 100
            ).toFixed(),
            discountAmount: (this.bill.discountAmount * 100).toFixed(),
            platformActurallyPayAmount: (
              this.bill.platformActurallyPayAmount * 100
            ).toFixed(),
            remark: this.bill.remark
          }

          //平台实付不能小于最小值
          if (
            this.bill.consumeQuotaAmount < 0 &&
            this.bill.platformActurallyPayAmount -
              (this.bill.discountAmount -
                (this.bill.minValue - this.bill.consumeQuotaAmount)) <
              0
          ) {
            this.errorInfo = '平台实付不能小于最小值'
            return
          }
          if (
            this.bill.consumeQuotaAmount >= 0 &&
            this.bill.platformActurallyPayAmount -
              (this.bill.discountAmount - this.bill.minValue) <
              0
          ) {
            this.errorInfo = '平台实付不能小于最小值'
            return
          }
          //限定不能为负数
          if (!examine.discountAmount && examine.discountAmount != 0) {
            this.errorInfo = '折扣应付不能为空'
            return
          }
          if (
            !examine.platformActurallyPayAmount &&
            examine.platformActurallyPayAmount != 0
          ) {
            this.errorInfo = '平台实付不能为空'
            return
          }
          this.errorInfo = undefined
          this.$http
            .post('/settlement/reviewBill', JSON.stringify(examine))
            .then(
              response => {
                this.$Message.success('操作成功!')
                this.dialogEdit = false
                this.getPaymentList()
              },
              res => {
                this.$Message.error(res.text)
              }
            )
        } else {
          this.$Message.error('表单验证失败!')
        }
      })
    },

    verifyLenEdit(number) {
      var value = this.bill[number].toString()
      if (value.indexOf('.') > -1) {
        this.bill[number] = parseFloat(
          value.substring(0, value.indexOf('.') + 3)
        )
        console.log(this.bill[number])
      }
    },

    verifyLenExamine(number) {
      var value = this.examine[number].toString()
      if (value.indexOf('.') > -1) {
        this.examine[number] = parseFloat(
          value.substring(0, value.indexOf('.') + 3)
        )
      }
    }
  }
}

export default Payment
