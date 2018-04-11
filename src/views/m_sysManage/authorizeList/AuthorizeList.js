var authorizeList = {
    name: 'authorizeList',
    data() {
        return {
            authorizeList: [],
            permissionName: '',
            departmentName: '',
            roleName: '',
            page: {
                currentPage: 1,
                pageSize: 10,
                totalCount: 1
            },
            form: {
                id: '',
                permissionName: '',
                departmentId: '',
                roleId: '',
                menuIdList: []
            },
            rules: {
                departmentId: [{
                    required: true,
                    message: '请选择部门',
                    trigger: 'change'
                }],
                roleId: [{
                    required: true,
                    message: '请选择角色',
                    trigger: 'change'
                }]
            },
            modal:{
                new:false,
                modify:false
            },
            dialogNew: false,
            multipleSelection: [],
            departmentList: [],
            defaultTree: {
                children: 'list',
                label: 'departmentName'
            },
            roleList: [],
            menuList: [],
            menuTree: {
                children: 'list',
                label: 'menuName'
            },
            departmentIds: [],
            depErrorInfo: undefined
        }
    },
    mounted() {
        this.getList();
    },
    methods: {
        getList() {
            this.$http.get('/sys/grant/list?currPage=' + this.page.currentPage+'&permissionName=' + this.permissionName + '&departmentName=' + this.departmentName + '&roleName=' + this.roleName).then((response) => {
                this.getMenuList();
                this.authorizeList = response.body.list;
                this.page.totalCount = response.body.totalCount;
                this.page.pageSize = response.body.pageSize;
                this.page.currentPage = response.body.currPage;
            }, (res) => {
                this.$Message.error(res.text);
            });
        },
        //获取部门列表
        getDepartmentList() {
            this.$http.get('/sys/department/treeList').then((response) => {
                this.departmentList = response.body;
            });
        },
        //获取角色列表
        getRoleList() {
            this.$http.get('/sys/role/list?isPage=false').then((response) => {
                this.roleList = response.body.list;
            });
        },
        //获取菜单列表
        getMenuList() {
            this.$http.get('/sys/menu/permsInfo').then((response) => {
                this.menuList = response.body;
            });
        },
        //分页
        handleCurrentChange(val) {
            this.page.currentPage = val;
            this.getList();
        },
        //获取下拉部门选项
        getDepartmentId(data) {
            this.form.departmentId = data.id;
        },
        //获取下拉菜单选项
        getMenuId() {
          this.form.menuIdList = this.$refs.treeTwo.getCheckedKeys();
        },
        //打开新建窗口
        newDialog() {
            this.$refs['newModal'].resetFields();
            this.modal.new = true;
            this.getDepartmentList();
            this.getRoleList();
            this.getMenuList();
        },
        newAuthorize(form) {
            if(!this.form.departmentId){
                this.depErrorInfo = '请选择部门';
                return false;
            }
            this.$refs[form].validate((valid) => {
                if (valid) {
                    this.$http.post('/sys/grant/save', JSON.stringify(this.form)).then((response) => {
                        this.$Message.success('操作成功!');
                        this.modal.new = false;
                        this.depErrorInfo = undefined;
                        this.getList();
                    }, (res) => {
                        this.$Message.error(res.text);
                    });
                } else {
                    return false;
                }
            });
        },
        //打开修改窗口
        modifyDialog(id) {
          this.$refs['modifyModal'].resetFields();
          this.modal.modify = true;
          this.$http.get('/sys/grant/info/' + id).then((response) => {
              this.form = response.body;
              this.form.roleId = this.form.roleId +'';
              this.departmentIds.splice(0, this.departmentIds.length);
              this.departmentIds.push(this.form.departmentId);
              if (!this.form.menuIdList) {
                  this.form.menuIdList = [];
              }
          });
          this.getDepartmentList();
          this.getRoleList();
          this.getMenuList();
        },
        modifyAuthorize(form) {
            this.form.departmentId = this.form.departmentId.toString();
            this.$refs[form].validate((valid) => {
                if (valid) {
                    this.$http.post('/sys/grant/update', JSON.stringify(this.form)).then((response) => {
                        this.$Message.success('操作成功!');
                        this.modal.modify = false;
                        this.getList();
                    }, (res) => {
                        this.$Message.error(res.text);
                    });
                } else {
                    this.$Message.warning('校验失败!');
                    return false;
                }
            });
        },
        deleteAuthorize(id) {
            var ids = [];
            if(id){
               ids.push(id);
            }else{
              if (this.multipleSelection.length == 0) {
                this.$Message.warning('请选择你要删除的授权');
                return;
              }
              ids = this.multipleSelection.map(item => {
                  return item;
              });
            }
            this.delete(ids);
        },
        delete(ids) {
            this.$Modal.confirm({
              title:'提示',
              content:'是否删除当前选中权限?',
              onOk:()=>{
                this.$http.get('/sys/grant/delete?roleDepartmentIds=' + ids).then((response) => {
                    this.$Message.success('操作成功!');
                    this.getList();
                }, (res) => {
                    this.$Message.error(res.text);
                });
              }
            })
        },
        handleReset () {
          this.modal.new = false;
          this.modal.modify = false;
        }
    }
}
export default authorizeList
