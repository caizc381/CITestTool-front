var userList = {
    name: 'userList',
    data() {
        return {
            userList: [],
            keywords: '',
            page: {
                currentPage: 1,
                pageSize: 10,
                totalCount: 1
            },
            newForm: {
                id: '',
                loginName: '',
                employeeNo: '',
                employeeName: '',
                password: '',
                status: '1',
                mobile: '',
                departmentId: '',
                parentDepartmentIdList: [],
                roleIds: []
            },
            editForm: {},
            rules: {
                loginName: [{
                    required: true,
                    message: '请输入登录名',
                    trigger: 'blur'
                }, {
                    min: 3,
                    max: 20,
                    message: '长度在3到20个字符',
                    trigger: 'blur'
                }],
                employeeNo: [{
                    required: true,
                    message: '请输入员工编号',
                    trigger: 'blur'
                }],
                password: [{
                    required: true,
                    message: '请输入登录密码',
                    trigger: 'blur'
                }, {
                    min: 3,
                    max: 15,
                    required: true,
                    message: '长度在3到15个字符',
                    trigger: 'blur'
                }],
                parentDepartmentIdList: [{
                    required: true,
                    type: 'array',
                    message: '请选择部门',
                    trigger: 'change'
                }],
            },
            multipleSelection: [],
            departmentList: [],
            roleList: [],
            modal: {
              new: false,
              modify: false
            }
        }
    },
    mounted() {
        this.getList(this.page.currentPage);
    },
    methods: {
        getList() {
            this.$http.get('/user/list?currPage=' + this.page.currentPage).then((response) => {
                this.userList = response.body.list;
                this.page.totalCount = response.body.totalCount;
                this.page.pageSize = response.body.pageSize;
                this.page.currentPage = response.body.currPage;
            }, (res) => {
                this.$Message.error(res.text);
            });
        },
        getDepartmentList() {
            this.$http.get('/sys/department/treeList').then((response) => {
                this.departmentList = response.body.length > 0 ? this.filterList(response.body) : [];
            });
        },
        getRoleList() {
            this.$http.get('/sys/role/list?isPage=false').then((response) => {
                this.roleList = response.body.list;
            });
        },
        //筛选
        filterList(list){
          var arrList = [];
          for(let i=0;i<list.length;i++){
             var arr = {};
             arr.value = list[i].id;
             arr.label = list[i].departmentName;
             arr.children = this.filterList(list[i].list);
             arrList.push(arr);
          }
          return arrList;
        },
        //分页
        handleCurrentChange(val) {
            this.page.currentPage = val;
            this.getList(val);
        },
        serachUser() {
            this.$http.get('/user/list?employeeName=' + this.keywords).then((response) => {
                this.userList = response.body.list;
                this.page.totalCount = response.body.totalCount;
                this.page.pageSize = response.body.pageSize;
                this.page.currentPage = response.body.currPage;
            });
        },
        newDialog() {
            this.$refs['newModal'].resetFields();
            this.modal.new = true;
            this.getDepartmentList();
            this.getRoleList();
        },
        newUser(form) {
            this.$refs[form].validate((valid) => {
                if (valid) {
                    this.newForm.departmentId = this.newForm.parentDepartmentIdList.pop();
                    this.$http.post('/user/save', JSON.stringify(this.newForm)).then((response) => {
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
          this.$http.get('/user/info/' + id).then((response) => {
              this.editForm = response.body;
              if (!this.editForm.roleIds) {
                  this.editForm.roleIds = [];
              }
              if (!this.editForm.parentDepartmentIdList) {
                  this.editForm.parentDepartmentIdList = [];
              }
              this.editForm.status = this.editForm.status.toString();
          });
          this.getDepartmentList();
          this.getRoleList();
        },
        modifyUser(form) {
            this.$refs[form].validate((valid) => {
                if (valid) {
                    this.editForm.departmentId = this.editForm.parentDepartmentIdList.pop();
                    this.$http.post('/user/update', JSON.stringify(this.editForm)).then((response) => {
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
        deleteUser(id) {
            var ids = [];
            if(id){
             ids.push(id);
            }else{
              if (this.multipleSelection.length == 0) {
                this.$Message.warning('请先选择要操作的订单');
                return;
              }
              ids = this.multipleSelection;
            }
            this.delete(ids);
        },
        delete(ids) {
            this.$Modal.confirm({
              title:'提示',
              content:'是否删除当前选中用户?',
              onOk:()=>{
                this.$http.get('/user/delete?employeeIds=' + ids).then((response) => {
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
export default userList
