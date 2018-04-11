var menuList = {
    name: 'menuList',
    data() {
        return {
            menuList: [],
            page: {
                currentPage: 1,
                pageSize: 10,
                totalCount: 1
            },
            form: {
                id: '',
                menuName: '',
                menuType: '1',
                perms: '',
                menuUrl: '',
                menuIcon: '',
                description: '',
                parentId: '',
                parentName: '',
                seq: '',
                parentIds: [],
            },
            rules: {
                menuName: [{
                    required: true,
                    message: '请输入名称',
                    trigger: 'blur'
                }],
                perms: [{
                    required: true,
                    message: '请输入标识',
                    trigger: 'blur'
                }],
                menuUrl: [{
                    required: true,
                    message: '请输入地址',
                    trigger: 'blur'
                }],
                parentId: [{
                    required: true,
                    message: '请选择角色',
                    trigger: 'change'
                }]
            },
            modal:{
              new: false,
              modify: false
            },
            multipleSelection: [],
            menuIdlist: [],
            buttonIdList: [],
            allMenuList: [],
            keywords: undefined,
        }
    },
    watch: {
        keywords: function(val){
           if(val){
             this.menuList = this.allMenuList.filter((item)=>{
               return item.menuName.indexOf(this.keywords) > -1;
             })
           }else{
             this.menuList = this.allMenuList;
           }
        }
    },
    mounted() {
        this.getList(this.page.currentPage);
    },
    methods: {
        getList() {
            this.$http.get('/sys/menu/list?currPage=' + this.page.currentPage).then((response) => {
                this.menuList = response.body.list;
                this.allMenuList = response.body.list;
                this.page.totalCount = response.body.totalCount;
                this.page.pageSize = response.body.pageSize;
                this.page.currentPage = response.body.currPage;
            }, (res) => {
                this.$Message.error(res.text);
            });
        },
        getMenuList() {
            this.$http.get('/sys/menu/select').then((response) => {
                this.menuIdlist = response.body;
                //添加无分类项
                this.menuIdlist.unshift({
                    id: 0,
                    menuName: '无'
                });
                this.buttonIdList = this.filterList(response.body);
            });
        },
        //格式化Cascader的数据
        filterList(list){
          var arrList = [];
          for(let i=0;i<list.length;i++){
             var arr = {};
             arr.value = list[i].id;
             arr.label = list[i].menuName;
             if(list[i].list){
               arr.children = this.filterList(list[i].list);
             }
             arrList.push(arr);
          }
          return arrList;
        },
        //分页
        handleCurrentChange(val) {
            this.page.currentPage = val;
            this.getList(val);
        },
        //选择父级id
        selectionChange(val) {
            this.form.parentId = val.toString();
        },
        newDialog() {
            this.modal.new = true;
            this.form = {
                id: '',
                menuName: '',
                menuType: '1',
                perms: '',
                menuUrl: '',
                menuIcon: '',
                description: '',
                parentId: '',
                parentName: '',
                seq: '',
            },
            this.getMenuList();
        },
        newMenu(form) {
            if(this.form.menuType == 3){
              this.form.parentId = this.form.parentIds[this.form.parentIds.length - 1];
            }else{
              this.form.parentId = '0'; 
            }
            this.$refs[form].validate((valid) => {
                if (valid) {
                    this.$http.post('/sys/menu/save', JSON.stringify(this.form)).then((response) => {
                        this.$Message.success('操作成功!');
                        this.modal.new = false;
                        this.getList(this.page.currentPage);
                    }, (res) => {
                        this.$Message.error(res.text);
                    });
                } else {
                    return false;
                }
            });
        },
        modifyDialog(id) {
          this.getMenuList();
          this.$http.get('/sys/menu/info/' + id).then((response) => {
              this.form = response.body;
              this.modal.modify = true;
          });    
        },
        modifyMenu(form) {
            this.$refs[form].validate((valid) => {
                if (valid) {
                    this.$http.post('/sys/menu/update', JSON.stringify(this.form)).then((response) => {
                        this.$Message.success('操作成功!');
                        this.modal.modify = false;
                        this.getList(this.page.currentPage);
                    }, (res) => {
                        this.$Message.error(res.text);
                    });
                } else {
                    return false;
                }
            });
        },
        deleteMenu(id) {
            var ids = [];
            if(id){
              ids.push(id);
            }else{
              if (this.multipleSelection.length == 0) {
                this.$Message.warning('请选择你要删除的菜单!');
                return;
              }
              ids = this.multipleSelection;
            }

            this.delete(ids);
        },
        delete(ids) {
            this.$Modal.confirm({
              title:'提示',
              content:'是否删除当前选中菜单?',
              onOk:()=>{
                this.$http.get('/sys/menu/delete?menuIds=' + ids).then((response) => {
                    this.$Message.success('操作成功!');
                    this.getList(this.page.currentPage);
                }, (res) => {
                    this.$Message.error(res.text);
                });
              }
            });
        },
        handleReset () {
          this.modal.new = false;
          this.modal.modify = false;
          this.$refs['modifyModal'].resetFields();
        }
    }
}
export default menuList
