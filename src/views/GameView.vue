<script setup>
  import GraphComponent from '@components/GraphComponent.vue'
  import { store } from '@/stores/store.js'
  import graph from "@mixins/graph"
  import api from "@mixins/api"

  import * as d3 from 'd3'
</script>

<template>
  <div id="viewer-body">
    <graph-component :type="this.$data.type"></graph-component>
  </div>
</template>

<script>
  export default {
    name: 'GameView',
    data () {
      return {
        type: 'game'
      }
    },
    components: {
    },
    async mounted () {
      await api.fetchGraphData('person-4724')

      const kevinNode = store.graphData['person-4724'].nodes[0]

      graph.draw({
        nodes: [kevinNode],
        links: [],
        type: this.$data.type
      })
    }
  }
</script>

<style scoped lang="scss">
  #viewer-body {
    display: flex;
    height: 100vh;
    overflow: hidden;
  }
</style>