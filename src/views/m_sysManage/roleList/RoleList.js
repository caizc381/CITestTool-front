var roleList = {
    name: 'roleList',
    data() {
        return {
            roleList: [],
            keywords: '',
            page: {
                currentPage: 1,
                pageSize: 10,
                totalCount: 1
            },
            form: {
                roleName: '',
                description: '',
                menuIdList: ''
            },
            rules: {
                roleName: [{
                    required: true,
                    message: '请输入角色名称',
                    trigger: 'blur'
                }]
            },
            modal:{
              new: false,
              modify: false
            },
            multipleSelection: [],
            menuIdlist: []
        }
    },
    mounted() {
        this.getList(this.page.currentPage);
    },
    methods: {
        getList() {
            this.$http.get('/sys/role/list?isPage=true&currPage=' + this.page.currentPage).then((response) => {
                this.roleList = response.body.list;
                this.page.totalCount = response.body.totalCount;
                this.page.pageSize = response.body.pageSize;
                this.page.currentPage = response.body.currPage;
            }, (res) => {
                this.$Message.error(res.text);
            });
        },
        getMenuList() {
            this.$http.get('/sys/menu/permsInfo').then((response) => {
                this.menuIdlist = response.body;
            });
        },
        //分页
        handleCurrentChange(val) {
            this.page.currentPage = val;
            this.getList(val);
        },
        serachRole() {
            this.$http.get('/sys/role/list?roleName=' + this.keywords).then((response) => {
                this.roleList = response.body.list;
                this.page.totalCount = response.body.totalCount;
                this.page.pageSize = response.body.pageSize;
                this.page.currentPage = response.body.currPage;
            });
        },
        newDialog() {
            this.$refs['newModal'].resetFields();
            this.modal.new = true;
            this.getMenuList();
        },
        newRole(form) {
            this.$refs[form].validate((valid) => {
                if (valid) {
                    this.$http.post('/sys/role/save', JSON.stringify(this.form)).then((response) => {
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
          this.$refs['modifyModal'].resetFields();
          this.modal.modify = true;
          this.$http.get('/sys/role/info/' + id).then((response) => {
              this.form = response.body;
          });
          this.getMenuList();
        },
        modifyRole(form) {
            this.$refs[form].validate((valid) => {
                if (valid) {
                    this.$http.post('/sys/role/update', JSON.stringify(this.form)).then((response) => {
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
        deleteRole(id) {
            var ids = [];
            if(id){
              ids.push(id);
            }else{
              if (this.multipleSelection.length == 0) {
                this.$Message.warning('请选择你要删除的角色!');
                return;
              }
              ids = this.multipleSelection;
            }
            this.delete(ids);
        },
        delete(ids) {
            this.$Modal.confirm({
              title:'提示',
              content:'是否删除当前选中角色?',
              onOk:()=>{
                this.$http.get('/sys/role/delete?roleIds=' + ids).then((response) => {
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
        }
    }
}
export default roleList
