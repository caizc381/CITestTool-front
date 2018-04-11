import ItemImporter from './components/ItemImporter'

const itemManage = {
  name: 'itemManage',
  components: {
    'item-importer': ItemImporter,
  },
  data () {
    return {
      itemList: [],
      filteredData: [],
      showTotalItemCount: false,
      delItem: false,
      dialogNew: false,
      crmList: [],
      clientList: [],
      newForm: {
        name: '',
        gender: '',
        crmClassify: '',
        clientClassify: '',
        fitPeople: '',
        unfitPeople: '',
        detail: '',
        description: '',
      },
      rules: {
        name: [{
          required: true,
          message: '请输入项目名称',
          trigger: 'blur'
        }, {
          max: 50,
          message: '长度少于50个字符',
          trigger: 'blur'
        }],
        fitPeople: [{
          max: 256,
          message: '长度少于256个字符',
          trigger: 'blur'
        }],
        unfitPeople: [{
          max: 256,
          message: '长度少于256个字符',
          trigger: 'blur'
        }],
        detail: [{
          max: 4096,
          message: '长度少于4096个字符',
          trigger: 'blur'
        }],
        description: [{
          max: 512,
          message: '长度少于512个字符',
          trigger: 'blur'
        }]
      },
      editForm: {
        id: '',
        name: '',
        gender: '',
        crmClassify: '',
        clientClassify: '',
        fitPeople: '',
        unfitPeople: '',
        detail: '',
        description: '',
      },
      currentId: '',
      checked: false,
      multipleSelection: [],
      queryList: {
        keywords: '',
        crmClassify: '',
        clientClassify: '',
      },
      showList: [{
        falg: 'crm',
        value: undefined,
        text: undefined
      }, {
        falg: 'client',
        value: undefined,
        text: undefined
      }],
      indeterminate: false,
      checkAll: false,

      height: '',

      importItemModal: false
    }
  },
  mounted () { 
    this.getItemList()
    this.getCrmList()
    this.getClientList()
    this.height = (window.innerHeight - 235) + 'px'
  },
  computed: {
    // 获取废除项数
    delItemConut () {
      var newList = this.itemList.filter(item => {
        return item.status == 2
      });
      return newList.length
    }
  },
  watch: {
    delItem: function (newVal) {
      if (newVal) {
        this.filteredData = this.itemList
      } else {
        var res = this.itemList
        res = res.filter(v => {
          return v.status == 1
        })
        this.filteredData = res
      }
    },
    queryList: {
      handler: function () {
        this.getItemList()
      },
      deep: true
    }
  },
  methods: {
    // 获取单项列表
    getItemList (isUpdateItem = false) {
      this.$http.get('/examItem/standardList?keywords=' + this.queryList.keywords + '&clientClassify=' + this.queryList.clientClassify + '&crmClassify=' + this.queryList.crmClassify).then((response) => {
        this.itemList = response.body.list
        var res = response.body.list
        if (!this.delItem) {
          res = res.filter(v => {
            return v.status == 1;
          })
        }
        if (res.length > 50) {
          this.filteredData = res.slice(0, 50)
          //延迟加载数据
          var _this = this
          setTimeout(function () {
            _this.filteredData = _this.filteredData.concat(res.slice(50))
          }, 500)
        } else {
          this.filteredData = res.slice(0, 20)
        }

        // 如果是更新单项后，不需要设置默认选中
        if (!isUpdateItem) {
          this.currentId = this.filteredData.length > 0 ? this.filteredData[0].id : undefined
          this.getItemDetail(this.currentId)
        }
      }, (res) => {
        this.$Message.error(res.text)
      })
    },
    //获取crmlist
    getCrmList () {
      this.$http.get('/examItem/speciesByType?type=1').then((response) => {
        var newList = []
        response.body.forEach((item) => {
          newList = {
            text: item.name,
            value: item.id
          }
          this.crmList.push(newList)
        })
        this.crmList.push({
          text: '无CRM分类',
          value: '0'
        })
      })
    },
    //获取clientlist
    getClientList () {
      this.$http.get('/examItem/speciesByType?type=2').then((response) => {
        var newList = []
        response.body.forEach((item) => {
          newList = {
            text: item.name,
            value: item.id
          }
          this.clientList.push(newList)
        })
        this.clientList.push({
          text: '无客户分类',
          value: '0'
        })
      })
    },

    //获取单项详情
    getItemDetail (id) {
      if (!id) {
        return false
      }
      this.$http.get('/examItem/standardInfo/' + id).then((response) => {
        this.editForm = response.body
      })
    },

    //选择条件
    getQueryList (item, falg) {
      if (falg == 'crm') {
        this.queryList.crmClassify = item.value
        this.showList[0].value = item.value
        this.showList[0].text = item.text
      } else {
        this.queryList.clientClassify = item.value
        this.showList[1].value = item.value
        this.showList[1].text = item.text
      }
    },

    //清空选择条件
    clearQuery (item) {
      if (item.value == this.queryList.crmClassify) {
        this.queryList.crmClassify = ''
      } else {
        this.queryList.clientClassify = ''
      }
      for (let i = 0; i < this.showList.length; i++) {
        if (this.showList[i].falg == item.falg) {
          this.showList[i].value = undefined
          this.showList[i].text = undefined
          return
        }
      }
    },

    //选中当前行
    selectCurrentRow (item) {
      this.currentId = item.id
      this.getItemDetail(this.currentId)
    },

    newItem (form) {
      //后端无分类id：null
      this.newForm.clientClassify = this.newForm.clientClassify == 0 ? null : this.newForm.clientClassify
      this.newForm.crmClassify = this.newForm.crmClassify == 0 ? null : this.newForm.crmClassify
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.$http.post('/examItem/standardSave', JSON.stringify(this.newForm)).then((response) => {
            this.$Message.success('操作成功！')
            this.dialogNew = !this.dialogNew
            this.multipleSelection = []
            this.getItemList()
          }, (res) => {
            this.$Message.error(res.text)
          })
        } else {
          return false
        }
      })
    },
    //修改crm分类
    updateCrmType (id) {
      this.$http.get('/examItem/standardUpdateClassType?examItemStandardIds=' + this.multipleSelection + '&classType=1&classValue=' + id).then((response) => {
        this.$Message.success('操作成功！')
        this.multipleSelection = []
        this.getItemList()
      }, (res) => {
        this.$Message.error(res.text)
      })
    },

    // 修改客户分类
    updateClientType (id) {
      this.$http.get('/examItem/standardUpdateClassType?examItemStandardIds=' + this.multipleSelection + '&classType=2&classValue=' + id).then((response) => {
        this.$Message.success('操作成功！')
        this.multipleSelection = []
        this.getItemList()
      }, (res) => {
        this.$Message.error(res.text)
      });
    },

    // 修改单项信息
    updateItem () {
      //后端无分类id：null
      this.editForm.clientClassify = this.editForm.clientClassify == 0 ? null : this.editForm.clientClassify
      this.editForm.crmClassify = this.editForm.crmClassify == 0 ? null : this.editForm.crmClassify
      this.$http.post('/examItem/standardUpdate', JSON.stringify(this.editForm)).then((response) => {
        this.$Message.success('操作成功！')
        this.multipleSelection = []
        this.getItemList(true)
      }, (res) => {
        this.$Message.error(res.text)
      })
    },
    // 取消修改，默认选中当前行
    cancelUpdate () {
      this.getItemDetail(this.currentId)
    },
    deleteItem (status) {
      let tip = ''
      if (status == 2) {
        tip = '删除该条单项的同时会删除掉该条单项相关的所有的映射关系，是否确定删除?'
      } else {
        tip = '确定把该单项设为可用吗?'
      }
      this.$Modal.confirm({
        title: '提示',
        content: tip,
        onOk: () => {
          this.$http.get('/examItem/standardUpdateStatus?examItemStandardIds=' + this.multipleSelection + '&status=' + status).then((response) => {
            this.$Message.success('操作成功！')
            this.multipleSelection = []
            this.getItemList()
          }, (res) => {
            this.$Message.error(res.text)
          })
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    },
    //全选
    handleCheckAll () {
      if (this.indeterminate) {
        this.checkAll = false
      } else {
        this.checkAll = !this.checkAll
      }
      this.indeterminate = false

      if (this.checkAll) {
        for (let i = 0; i < this.filteredData.length; i++) {
          this.multipleSelection.push(this.filteredData[i].id)
        }
      } else {
        this.multipleSelection = []
      }
    },
    // 单选
    isChecked (item) {
      return this.multipleSelection.indexOf(item.id) > -1
    },
    handleCheck (item) {
      if (this.multipleSelection.indexOf(item.id) > -1) {
        this.multipleSelection = this.multipleSelection.filter(i => i !== item.id)
      } else {
        this.multipleSelection.push(item.id)
      }
    },

  }
}
export default itemManage
