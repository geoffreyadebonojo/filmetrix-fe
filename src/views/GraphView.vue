<script setup>
  import PanelComponent from '../components/PanelComponent.vue'
  import GraphComponent from '../components/GraphComponent.vue'

  import { store } from '@/stores/store.js'
  import * as d3 from 'd3'
</script>

<template>
  <RouterView />
  <GraphComponent />
  <PanelComponent />
</template>

<style scoped>
  .graph-wrapper {
    color: #222222;
    width: 65%;
    height: 100vh;
  }
  svg {
    /* height: 100%; */
    /* width: 70%; */
    overflow: hidden;
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
