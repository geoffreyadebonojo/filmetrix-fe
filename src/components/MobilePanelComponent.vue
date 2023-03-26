<script setup>
  import NavBarComponent from './NavBarComponent.vue'
  import PanelContentsComponent from './PanelContentsComponent.vue'
  import { store } from '@/stores/store.js'
  import * as d3 from 'd3'
</script>

<template>
  <div id="mobile-panel-body">
    <!-- <div id="resize-bar" class="main-panel-component">
      <div id="left-line"></div>
      <div id="right-line"></div>
    </div> -->
    <div id="navbar">
      <nav-bar-component></nav-bar-component>
    </div>

    <div id="panel-center" style="height:142%;zoom:100%">
      <panel-center></panel-center>
    </div>
  </div>
</template>

<script>
  export default {
    name: "MobilePanelComponent",
    data () {
      return {
        transitionTimer: 500
      }
    },
    components: {
      NavBarComponent
    }
  }
</script>

<style scoped>
  #mobile-panel-body {
    width: 100vw;
    padding-top: 15px;
    /* background: #333333; */
    position: absolute;
    top: 0px;
    right: 0px;
    z-index: 2;
    /* box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19); */
  }

  #navbar {
    transform: scale(1.25);
    right: 35px;
    width: 80%;
    background: none;
  }

  /* #search-text {
    left: 30px;
  } */

  #panel-center {
    /* margin-top: 50px; */
  }
</style>
