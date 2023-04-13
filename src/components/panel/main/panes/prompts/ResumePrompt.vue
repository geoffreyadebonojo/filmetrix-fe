<script setup>
  import api from '@/mixins/api'
  import { 
    appStates,
    graphStates, 
    panelStates,
    store 
  } from '@/stores/store.js'
  import graph from '@/mixins/graph'
  import { setFocus } from '@/mixins/helpers'
  import * as d3 from 'd3'
</script>

<template>
  <div class="prompt" id="resume-prompt">
    <p style="margin:5vh">
      or
    </p>
    <router-link to="#details">
      <p class="apply-effect" @click="resume()">
        pick up where you left off
      </p>
    </router-link> 
  </div>
</template>

<script>
  export default {
    name: "ResumePrompt",
    data () {
      return {
        saved: this.$attrs.saved
      }
    },
    methods: {
      async resume () {
        store.isLocked = true
        graphStates.existing = this.$data.saved
        
        await api.fetchGraphData(graphStates.existing.unique().map(d => d[0]))
        await api.fetchDetails(graphStates.existing.last()[0])

        let data
        let nodes = []
        let links = []

        graphStates.existing.forEach((d) => {
          data = graphStates.graphData[d[0]]
          nodes = nodes.concat(data.nodes.slice(0,d[1]+1))
          links = links.concat(data.links.slice(0,d[1]))
        })

        // const graph = new Graph()
        // const graph.draw()

        graph.draw({
          nodes: nodes.uniqueById(),
          links: links,
          type: "main"
        })      

        panelStates.currentFocus = 'search'

        d3.select("#lock-button").classed("unlocked", false).classed("locked", true)
        setFocus('details')
      }
    }
  }
</script>
