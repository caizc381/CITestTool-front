const channelList = {
	name: 'channelList',
	data(){
      return {
         channelList: [],
         loading: false,
      	}
	},
    
  mounted(){
    this.getChannelList();
  },

	methods: {
		getChannelList(){
      this.loading = true;
			this.$http.get('/organizationList?orgType=2').then((response) => {
           this.channelList = response.body;
           this.loading = false;
        }, (res) => {
            this.$Message.error(res.text);
            this.loading = false;
       })
		}
	}
}

export default channelList