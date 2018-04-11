<template>
  <div>
    <my-header></my-header>

    <div class="ops-body" :class="menuStatus" v-bind:style="{'min-height': height}">

      <my-nav></my-nav>

      <div class="ops-body-content">

        <slot></slot>
      </div>

    </div>

    <!-- <my-footer></my-footer> -->

  </div>
</template>
<script>
import Header from 'components/Header'
import LeftNav from 'components/LeftNav'
import Footer from 'components/Footer'

export default {
  components: {
    'my-header': Header,
    'my-nav': LeftNav,
    'my-footer': Footer
  },

  data(){
    return {
      height: ''
    }
  },

  mounted(){
    this.height = (window.innerHeight - 50) + "px";
  },

  computed: {
    menuStatus() {
      return this.$store.state.isOpenMenu ? '' : 'hideLeftMenu';
    },
  },

  methods: {

  }

}
</script>
<style scoped>
</style>
