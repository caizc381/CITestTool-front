<template>
  <div class="mt-uploader-wrap">
    <div class="mt-uploader">
      <label>
        <input type="file" @change="handleChange($event)"/>
        <Button type="ghost" icon="ios-cloud-upload-outline">{{buttonText || '上传图片'}}</Button>
      </label>
      <div>
        <div v-for="f in files" class="mt-uploader-file" v-show="!f.isDelete">
          <Icon type="link" style="font-size:14px;"></Icon>
          <a :href="f.path" target="_blank">{{f.name}}</a>
          <Icon class="mt-uploader-delete" type="close" @click.native="handleRemove(f)"></Icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'mt-uploader',
  data() {
    return {
    }
  },

  mounted() {
  },

  props: {
    buttonText: String,
    files: Array,
    onChange: Function,
  },

  watch: {

  },

  methods: {
    handleChange(event) {
      if (event.target.files.length > 0) {
        this.$emit('on-change', event);
      }
    },

    handleRemove(f) {
      this.$emit('on-remove', f);
    },

  }
}
</script>

<style scoped lang="less">
.mt-uploader-wrap {
  display: inline-block;
  .mt-uploader {
    position:relative;
    input {
     opacity: 0;
     position:absolute;
    }
    .mt-uploader-file {
      position: relative;
      width: 300px;
      &:hover {
        background: #eee;
      }
      padding: 2px 5px;
    }
  }
  .mt-uploader-delete {
    position: absolute;
    line-height: 30px;
    right: 10px;
    &:hover {
      color: red;
      cursor: pointer;
    }
  }
}

</style>
