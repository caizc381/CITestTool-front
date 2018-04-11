var jobList = {
	name:'jobList',
	data(){
    return {
      loading: false,
      jobList: [],
      keyWords: ''
    }
  },

  mounted(){
  },

  methods: {

    searchHospital(){
      this.$http.get('/examreport/jobDetail?keyWords=' + this.keyWords).then((data) => {
        this.jobList = data.body;
      });
    },

    changeJob(hospitalId, type, status){
      this.loading = true;
      this.$http.post('/examreport/changeJob', {hospitalId:hospitalId, type:type, status:status}).then(() => {
        this.loading = false;
        this.searchHospital();
        this.$message({
          message:"操作成功",
          type:"success"
        });
      }, (err) => {
        this.loading = false;
        this.$message.error(err.text);
      });
    }
  }
}

export default jobList
