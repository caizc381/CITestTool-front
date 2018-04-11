var hospitalListTask = {
    name: 'hospitalListTask',
    data() {
        return {
            hospitalList: [],
            page: {
                currentPage: 1,
                pageSize: 10,
                totalCount: 1
            },
            taskList: [],
            keywords: '',
            errorMsg: '',
            modal: {
              new: false,
              modify: false
            },
            form: {
                hospitalId: '',
                provinceId: ''
            },
            selectHospName: '',
            provinceList: [],
            loading: true,
            rules: {
                saveEnable: false,
                updateEnable: false,
                editEnable: false,
                deleteEnable: false,
            },
            editTaskForm: {
                taskParam: '',
                cronExpression: '',
                taskName: '',
                taskCmd: '',
                hospitalId: '',
                NO_TASK_PARAM: 'noTaskParam'
            },
            tabColumns: [{
                        title: 'ID',
                        key: 'id'
                    },{
                        title: '名称',
                        key: 'name'
                    },{
                        title: '操作',
                        key: '操作'
                    }
                ],
        }
    },
    beforeMount() {
        this.checkPermission("sys:hospitalTask:save", 1);
        this.checkPermission("sys:hospitalTask:update", 2);
        this.checkPermission("sys:hospitalTask:delete", 3);
        this.checkPermission("sys:hospitalTask:edit", 4);
        this.getList(this.page.currentPage);
    },
    methods: {
        getList(currPage) {
            this.$http.get('/task/hospitals?currPage=' + currPage).then((response) => {
                this.loading = false;
                this.hospitalList = response.body.list;
                this.page.totalCount = response.body.totalCount;
                this.page.pageSize = response.body.pageSize;
                this.page.currentPage = response.body.currPage;
            }, (res) => {
                this.loading = false;
                this.$message({
                    message: res.text,
                    type: 'warning'
                });
            });
        },
        showTasks(hospId, name) {
            this.selectHospName = name;
            this.taskList = []; // 先清空
            this.$http.get('/task/list/' + hospId).then((response) => {
                var res = response.body;
                for (var i = 0; i < res.length; i++) {
                    if (res[i].status == 1) { // 开启
                        res[i].status = true;
                    } else {
                        res[i].status = false; // 关闭
                    }
                    // JSON.stringify(response.body[2].newTaskParams)
                    res[i].taskParamsText = res[i].newTaskParams == null ? "" : JSON.stringify(res[i].newTaskParams)
                }
                this.taskList = res;
            }, (res) => {
                this.errorMsg = res.text;
            });
        },

        openOrCloseTask(task) {
            // task.status 为新状态的布尔值
            var param = {};
            param.hospitalId = task.hospitalId;
            param.taskCmd = task.taskCmd;
            param.status = task.status;
            this.$http.post('/task/openOrCloseTask', param).then((response) => {
                // do nothing
            }, (res) => {
                this.$message({
                    message: res.text,
                    type: "warning"
                });
            });
        },
        searchHosp(ev) {
            // TODO 加一个搜索延迟
            console.log("--" + this.keywords);
            this.$http.get('/task/searchHosp?keywords=' + this.keywords).then((response) => {
                this.hospitalList = response.body.list;
                this.page.totalCount = response.body.totalCount;
                this.page.pageSize = response.body.pageSize;
                this.page.currentPage = response.body.currPage;
                this.taskList = []
            }, (res) => {
                this.$message({
                    message: res.text,
                    type: "warning"
                });
            });
        },
        showCreateTask() {
            this.form = {
                hospitalId: '',
                provinceId: ''
            };
            this.getProvinceList();
            this.modal.new = true;
        },
        createHospTask() {
            if (this.form.hospitalId == '') {
                this.$message({
                    message: '请输入医院id',
                    type: 'warning'
                });
                return;
            }
            if (isNaN(this.form.hospitalId.trim())) {
                this.$message({
                    message: '请输入数字',
                    type: 'warning'
                });
                return;
            }
            this.$http.post('/task/addHospTask', this.form).then((response) => {
                this.$message({
                    message: "操作成功",
                    type: "success"
                });
                this.modal.new = false;
                //this.keywords = this.form.hospitalId;
                //this.searchHosp();
            }, (res) => {
                this.$message({
                    message: res.text,
                    type: "warning"
                });
            });
        },
        handleCurrentChange(val) {
            this.page.currentPage = val;
            this.getList(val);
        },
        //根据省份信息
        getProvinceList() {
            this.$http.get('/site/provinceList').then((response) => {
                this.provinceList = response.body.map(item => {
                  item.id = item.provinceId;
                  item.name = item.provinceName;
                  return item;
                });
            });
        },
        checkPermission(permission, type) {
            this.$http.post('/user/hasPermission?permission=' + permission).then((response) => {
                if (type == 1) {
                    this.rules.saveEnable = response.body;
                } else if (type == 2) {
                    this.rules.updateEnable = response.body;
                } else if (type == 3) {
                    this.rules.deleteEnable = response.body;
                } else if (type == 4) {
                    this.rules.editEnable = response.body;
                }
            });
        },
        showEditTaskDialog(task) {
            this.modal.modify = true; // 弹出编辑框
            console.log("json === " + JSON.stringify(task.newTaskParams, null, "\t"));
            var param = JSON.stringify(task.newTaskParams, null, "\t");
            this.editTaskForm.taskParam = param == "null" ? this.editTaskForm.NO_TASK_PARAM : param;
            this.editTaskForm.cronExpression = task.cronExpression;
            this.editTaskForm.taskName = task.taskName;
            this.editTaskForm.taskCmd = task.taskCmd;
            this.editTaskForm.hospitalId = task.hospitalId;
        },
        editTask() {
            this.$http.post('/task/updateTask', this.editTaskForm).then((data) => {
                this.$message({
                    message: "操作成功",
                    type: "success"
                });
                this.modal.modify = false;
                this.showTasks(this.editTaskForm.hospitalId, this.selectHospName);
            }, (res) => {
                this.$message({
                    message: res.text,
                    type: "warning"
                });
            });
        }
    }
}
export default hospitalListTask
