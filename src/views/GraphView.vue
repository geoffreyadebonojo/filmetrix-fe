<script setup>
  import PanelComponent from '../components/PanelComponent.vue'
  import GraphComponent from '../components/GraphComponent.vue'
  import AboutGraphComponent from '../components/AboutGraphComponent.vue'

  import { store } from '@/stores/store.js'
  import * as d3 from 'd3'
</script>

<template>
  <div id="viewer-body">
    <GraphComponent />
    <PanelComponent />
    <AboutGraphComponent v-if="store.aboutUs"></AboutGraphComponent>
  </div>
</template>

<style scoped>
  #viewer-body {
    height: 100vh;
  }
</style>

<script>
  export default {
    components: {
      GraphComponent,
      PanelComponent,
      AboutGraphComponent
    },
    data () {
      return {
        charge: -1000,
        count: 5
      }
    }
  }
</script>
