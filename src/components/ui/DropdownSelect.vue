<template>
	<div class="dlb">
    <Dropdown 
      trigger="click" 
      placement="bottom-start" 
      @on-click="handleCurrent">
      <span class="ivu-dropdown" style="cursor: pointer">
          {{ currentHos.name }}
          <Icon type="arrow-down-b"></Icon>
      </span>

      <Dropdown-menu slot="list">
        <Input 
        class="ml5" 
        v-model="query"
        :placeholder="placeholder"
        v-bind:style="{width: width + 'px'}"
        @on-change="handleInput" />

        <div style="max-height:500px;overflow-y: scroll;">
          <DropdownItem v-for="item in optionList" :name="item.id" v-show="!item.hide" :key="item.id">{{ item.name }}</DropdownItem>
        </div>

      </Dropdown-menu>
    </Dropdown>
  </div>
</template>

<script>
  export default {
  	name: 'serach-select',
  	data() {
	    return {
	      currentHos: {
	      	id: undefined,
	      	name: undefined
	      },
        optionList: [],
        query: '',
	    }
	  },

  	props: {
	    options: Array,
	    selectId: String,
	    filters: {
	      type: Array,
	      default: function () {
	        return [];
	      },
	    },
	    placeholder: {
	    	type:String,
	    	default: '简拼搜索',
	    },
	    keyWord: String,
	    onChange: Function,
	    width: {
	    	type: Number,
	    	default: 300,
	    },
	  },

	 watch: {
    options: function(val, oldValue) {
    	this.optionList = val;
      this.selectId ? this.setCurrentOption(this.selectId) : (val.length > 0 ? this.setCurrentOption(val[0].id) : null);
    },

   },

	  methods: {
      setCurrentOption(id){
      	if(!id){
          this.currentHos={
          	id: undefined,
          	name: undefined
          }
      	}
        for (let i=0; i<this.optionList.length; i++) {
	        if (this.optionList[i].id == id) {
	          this.currentHos = {
	          	id: this.optionList[i].id,
	          	name: this.optionList[i].name
	          };
	          this.$emit('on-change', this.currentHos.id);
	          this.clearSerach();
	          break;
	        }
	      }
      },
      
      getAllList(){
        for (let i=0; i<this.optionList.length; i++) {
           this.optionList[i].hide = false;
	      }
      },

      handleCurrent(value){
      	this.setCurrentOption(value);
      	this.getAllList();
      },

     	handleInput() {
     	  this.filterByKeyword(this.query);
	   	},

	    filterByKeyword(input) {
	      if (this.filters.length > 0) {
	        this.optionList = this.optionList.map((item) => {
	          item.hide = !this.containsKeyword(item, input);
	          return item;
	        })
	      }
	    },

	    containsKeyword(item, input) {
	      return this.filters.some((keyword) => {
	        return item[keyword] && item[keyword].toUpperCase().indexOf(input.toUpperCase()) > -1;
	      })
	    },

	    clearSerach(){
	      this.query = undefined;
	    },

	 },

  }
</script>