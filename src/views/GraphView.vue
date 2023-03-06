<script setup>
  import PanelComponent from '../components/PanelComponent.vue'
  import GraphComponent from '../components/GraphComponent.vue'

  import { store } from '@/stores/store.js'
  import * as d3 from 'd3'
</script>

<template>
  <RouterView />
  <div id="viewer-body">
    <GraphComponent />
    <PanelComponent />
  </div>
</template>

<style scoped>
  #viewer-body {
    height: 100vh;
    display: flex;
  }
</style>

<script>
  export default {
    components: {
      GraphComponent,
      PanelComponent
    },

    data () {
      return {
        charge: -1000,
        count: 5
      }
    }
  }
</script>
