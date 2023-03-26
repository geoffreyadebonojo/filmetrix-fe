<script setup>
  import GraphComponent from '../components/GraphComponent.vue'
  import MainView from './MainView.vue'
  import MobileView from './MobileView.vue'
  import { store } from '@/stores/store.js'
  import * as d3 from 'd3'
</script>

<template>
  <div id="viewer-body">
    <graph-component></graph-component>
    <main-view></main-view>
  </div>
</template>

<style lang="scss">
  #viewer-body {
    height: 100vh;
    overflow: hidden;
  }
</style>