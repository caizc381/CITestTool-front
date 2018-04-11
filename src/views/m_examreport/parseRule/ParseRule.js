var parseRule = {
	name:'parseRule',
	data(){
    return {
      hospitalList: [],
      parseRule: {
        id: null,
        hospitalId: null, 
        rule: ""
      },
      report: "",
      parseOutput: "",
      parseLoading: false,
      ruleReadonly: true
    }
  },

  mounted(){
    this.loadInfo();
  },

  methods: {

    loadInfo(){
      this.$http.get('/examreport/rulePage?type=1').then((data) => {
        this.hospitalList = data.body.hospitalList;
        if(data.body.rule){
          this.parseRule = data.body.rule;
        } else {
          this.parseRule.hospitalId = this.hospitalList[0].id;
        }
        this.report = data.body.report;
      });
    },

    selectHospital(hospitalId){
      this.$http.get('/examreport/infoByHospital?hospitalId=' + hospitalId + '&type=1').then((data) => {
        if(data.body.rule){
          this.parseRule = data.body.rule;
        } else {
          this.parseRule.id = null;
          this.parseRule.rule = "";
        }
        this.parseOutput = '';
        this.report = data.body.report;
      });
    },

    getRandomText(){
      this.$http.get('/examreport/randomExamReport?hospitalId=' + this.parseRule.hospitalId + '&type=1')
      .then((data) => {
        this.report = data.body;
      });
    },
    //保存规则
    saveRule(){
      if(!this.parseRule.rule || this.parseRule.rule == ''){
        return;
      }
      this.parseRule.type = 1;
      this.$http.post('/examreport/saveRule', JSON.stringify(this.parseRule)).then(() => {
        this.$message({
          message: '保存成功',
          type: 'success'
        });
      });
    },
    //解析
    parse (){
      if(!this.parseRule.rule || !this.report){
        this.$message.error('请保证规则或者代解析的内容不为空');
        return;
      }
      this.parseOutput = '';
      let param = {rule: this.parseRule.rule, parsedText: this.report};
      this.parseLoading = true;
      this.$http.post('/examreport/parse', JSON.stringify(param))
      .then((data) => {
        this.parseLoading = false;
        for(var text in data.body){
          let title = data.body[text].title;
          if(title){
             this.parseOutput += '解析头：\r\n------------------------------------------------\r\n' + 
             title + '\r\n==================================================\r\n';
          }
          let content = data.body[text].content;
          if(content){
            this.parseOutput += '解析内容：\r\n------------------------------------------------\r\n' + 
            content + '\r\n==================================================\r\n';
          }
        }
      }, (err) => {
        this.parseLoading = false;
        this.parseOutput = err.text;
      })
    }
  }
}

export default parseRule