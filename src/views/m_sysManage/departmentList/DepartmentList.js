var departmentList = {
    name: 'departmentList',
    data() {
        return {
            departmentList: [],
            departments:[],
            defaultTree: {
                children: 'list',
                label: 'departmentName'
            },
            form: {
                id: '',
                departmentName: '',
                parentId: '',
                areaId: '',
                provinceId: '',
                parentIdList: []
            },
            rules: {
                departmentName: [{
                    required: true,
                    message: '请输入部门名称',
                    trigger: 'blur'
                }, {
                    min: 3,
                    max: 20,
                    message: '长度在3到20个字符',
                    trigger: 'blur'
                }]
            },
            ids: [],
            areaList: [],
            provinceList: [],
            modal:{
              new:false,
              modify:false
            },
            defaultCascader: {
                children: 'list',
                label: 'departmentName',
                value: 'id'
            }
        }
    },
    mounted() {
        this.getList();
    },
    methods: {
        getList() {
            this.$http.get('/sys/department/treeList').then((response) => {
                this.departmentList = response.body;
                this.departments = response.body.length > 0 ? this.filters(response.body) : [];
            }, (res) => {
                this.$message({
                    message: res.text,
                    type: 'warning'
                });
            });
        },
        //获取区域信息
        getAreaList() {
            this.$http.get('/site/areaList').then((response) => {
                this.areaList = response.body;
            });
        },
        //根据区域ID获取省份信息
        getProvinceListById(id) {
            this.$http.get('/site/areaProvinces/' + id).then((response) => {
                this.provinceList = response.body;
            });
        },
        //获取部门信息
        getDepartmentInfo(id) {
            this.$http.get('/sys/department/info/' + id).then((response) => {
                this.form = response.body;
                this.getAreaList();
            });
        },
        //筛选(Cascader)
        filters(list){
          var arrList = [];
          for(let i=0;i<list.length;i++){
             var arr = {};
             arr.value = list[i].id;
             arr.label = list[i].departmentName;
             arr.children = this.filters(list[i].list);
             arrList.push(arr);
          }
          return arrList;
        },
        // 获取下拉地区id
        selectionChangeA(val) {
            this.form.areaId = val;
            if (val) {
                this.getProvinceListById(val);
            }
        },
        //获取父级菜单
        handleChange(value) {
            this.form.parentIdList = value;
        },
        //获取树节点
        getNode() {
            this.ids = this.$refs.tree.getCheckedKeys();
        },
        newDialog() {
            this.$refs['newModal'].resetFields();
            this.modal.new = true;
            this.getAreaList();
        },
        newDepartment(form) {
            if (this.form.parentIdList) {
                this.form.parentId = this.form.parentIdList.pop();
            }
            this.$refs[form].validate((valid) => {
                if (valid) {
                    this.$http.post('/sys/department/save', JSON.stringify(this.form)).then((response) => {
                        this.$Message.success('操作成功!');
                        this.modal.new = false;
                        this.getList();
                    }, (res) => {
                        this.$Message.error(res.text);
                    });
                } else {
                    return false;
                }
            });
        },
        modifyDialog() {
            this.$refs['modifyModal'].resetFields();
            if (this.ids.length == 1) {
                this.modal.modify = true;
                this.form.id = this.ids[0];
                this.getDepartmentInfo(this.form.id);
            } else {
                this.$Message.warning('请选择你要修改的一条数据!');
            }
        },
        modifyDepartment(form) {
            if (this.form.parentIdList) {
                this.form.parentId = this.form.parentIdList.pop();
            }
            this.$refs[form].validate((valid) => {
                if (valid) {
                    this.$http.post('/sys/department/update', JSON.stringify(this.form)).then((response) => {
                        this.$Message.success('操作成功!');
                       this.modal.modify = false;
                        this.getList();
                    }, (res) => {
                       this.$Message.error(res.text);
                    });
                } else {
                    return false;
                }
            });
        },
        deleteDepartment() {
            if (this.ids.length == 0) {
                this.$Message.warning('请选择你要删除的部门编号!');
                return;
            }
            this.delete(this.ids);
        },
        delete(ids) {
           this.$Modal.confirm({
                title:'提示',
                content:'是否删除当前选中部门?',
                onOk: ()=>{
                    this.$http.get('/sys/department/delete?departmentIds=' + ids).then((response) => {
                        this.$Message.success('操作成功!');
                        this.$refs.tree.setCheckedKeys([]);
                        this.getList();
                        console.log(this.ids);
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
export default departmentList
