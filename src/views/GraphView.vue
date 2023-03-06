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
