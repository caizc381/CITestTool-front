<template>
 <div>
 	<div class="form-term">
	  <div class="form-header-title mb0">
	    <span class="fl">消息提醒</span>
	    <a v-if="!isEdit" class="fr" @click="clickEdit"><Icon type="edit"></Icon>编辑</a>
	  </div>
    
   	<table class="table">
   	  <thead>
   	  	<tr>
   	  		<td>邮箱</td>
   	  	  <td>套餐变更</td>
   	  	</tr>
   	  </thead>
   	  <tbody v-if="!isEdit">
   	  	<tr v-for="mes in  message">
   	  		<td>
   	  			<span>{{mes.email}}</span>
   	  		</td>
   	  		<td>
   	  			<span v-if="mes.itemMessage" class="successfont">开启</span>
            <span v-else class="redfont">关闭</span>
   	  		</td>
   	  	</tr>
   	  </tbody>
   	  <tbody v-if="isEdit">
   	  	<tr v-for="mes in  messageVo">
   	  		<td>
   	  			<Input v-model="mes.email" placeholder="请输入邮箱"></Input>
   	  		</td>
   	  		<td>
   	  			<Checkbox v-model="mes.itemMessage">套餐变更</Checkbox>
   	  		</td>
   	  	</tr>
   	  </tbody>
   	</table>
  </div>

  <div class="mt20" v-if="isEdit">
    <Button type="primary" @click="save()">保存</Button>
    <Button type="ghost" style="margin-left: 8px" @click="cancel()">取消</Button>
  </div>
 </div>
</template>

<script>
export default {
  name: 'basicInfo',
  data() {
    return {
    	messageVo: [],
    	isEdit: false,
    }
  },

  props: ['message'],

  mounted() {
 
  },

  methods: {

	  getEmptyEmailItem() {
	    return {
	      email:undefined,
	      exportOrderMessage:false,
	      itemMessage:false,
	      contactId:undefined,
	      configId:undefined,
	      groupApplictionMail:undefined
	    };
	  },

  	save(hospitalId=this.$route.params.channelId){
      let reg = /^[\w\-]+(\.[\w\-]+)*@(([a-zA-Z0-9\-]){2,16}\.)+[a-zA-Z0-9\-]{2,4}$/;

      for(let i=0;i<this.messageVo.length;i++){
        if(this.messageVo[i].email && !reg.test(this.messageVo[i].email)){
            this.$Message.success('邮箱格式不正确！');
            return;
        }
      }

      this.$http.post('/addHospitalContactConfigs?hospitalId='+hospitalId,JSON.stringify(this.messageVo)).then((response) => {
        this.$Message.success('操作成功!');
        this.isEdit = false;
        this.$emit('reload');
      }, (res) => {
          this.$Message.error(res.text);
      });

  	},

  	clickEdit(){
  		this.isEdit = true;
      var messageVo = JSON.parse(JSON.stringify(this.message));

      // 如果少于5条，则填充空数据
      let polyfillCount = messageVo.length == 0 ? 5 : (5 - messageVo.length);
        if (polyfillCount > 0) {
          for (let i=1; i<=polyfillCount; i++) {
            messageVo.push(this.getEmptyEmailItem());
          }
        }
      this.messageVo = messageVo;
  	},

  	cancel(){
      this.isEdit = false;
      this.$emit('reload');
    },
  }
}  
</script>

<style scoped lang="less">

</style>