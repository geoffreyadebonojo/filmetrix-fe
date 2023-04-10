<script setup>
  import { RouterView } from 'vue-router'
  import { appStates } from '@/stores/store.js'
  import * as d3 from 'd3'
</script>

<template>
  <div id="app-wrapper" v-bind:class="appStates.theme + '-theme'">
    <RouterView></RouterView>
  </div>
</template>

<style lang="scss">
  .dark-theme {
    background: $graph-body-grey;
  }
  .light-theme {
    background: #AAAAAA;
  }
</style>

<script>
  export default {
    created () {
      appStates.theme = localStorage.getItem('theme')
      
      let x = localStorage.getItem("newHere")
      if (x == null) {
        localStorage.setItem("newHere", true)
      }
    }
  }
</script>
