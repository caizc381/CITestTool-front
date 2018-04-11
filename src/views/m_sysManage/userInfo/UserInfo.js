var userInfo = {
    name: 'user',
    data() {
        return {
            userInfo: {},
            showPsdInput: false,
            password: {
                old: '',
                new: ''
            },
            rules: {
                old: [{
                    required: true,
                    message: '请输入原密码',
                    trigger: 'blur'
                }],
                new: [{
                    required: true,
                    message: '请输入新密码',
                    trigger: 'blur'
                }, {
                    min: 6,
                    max: 20,
                    message: '长度在 6 到 20 个字符',
                    trigger: 'blur'
                }],
            }
        }
    },
    mounted() {
        this.$http.get('/user/getEmployeeInfo').then((response) => {
            this.userInfo = response.body;
        });
    },
    methods: {
        submitPsd: function(form) {
            this.$refs[form].validate((valid) => {
                if (valid) {
                    this.$http.get('/user/updatePwd?password=' + this.password.old + "&passwordNew=" + this.password.new).then((response) => {
                        this.$message({
                            message: "操作成功",
                            type: "success"
                        });
                        this.$router.push('/');
                    }, (res) => {
                        this.$message({
                            message: res.text,
                            type: 'warning'
                        });
                    });
                } else {
                    return false;
                }
            });
        }
    }
}
export default userInfo