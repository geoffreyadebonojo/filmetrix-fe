<script setup>
  import api from '@/mixins/api'
  import { 
    appStates,
    graphStates, 
    panelStates,
    store 
  } from '@/stores/store.js'
  import graph from '@/mixins/graph'
  import GraphManager from "@/models/GraphManager.js"
  import { setFocus } from '@/mixins/helpers'
  import * as d3 from 'd3'
</script>

<template>
  <!-- <div class="prompt" id="resume-prompt">
    <p style="margin:5vh">
      or
    </p>
    <router-link to="#details">
      <p class="apply-effect" @click="resume()">
        pick up where you left off
      </p>
    </router-link> 
  </div> -->
</template>

<script>
  export default {
    name: "ResumePrompt",
    data () {
      return {
        saved: this.$attrs.saved
      }
    },
    async mounted () {
      store.isLocked = true
      graphStates.existing = this.$data.saved
      
      // tried to use the new Graph().generate fucks it up so whatever. this works.
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

      graph.draw({
        nodes: nodes.uniqueById(),
        links: links,
        type: "main"
      })

      var g1 = d3.select("#main-outer-wrapper")
      var zoom1 = d3.zoom().on("zoom", (e) => {
        g1.attr("transform", e.transform);
      });

      const [translate, scale] = localStorage.getItem("currentZoom").split(" ")
      const [x, y] = translate.split(",")
      const xInt = +x.replace("translate(", "").replace(")", "")
      const yInt = +y.replace(")", "")
      const kInt = +scale.replace("scale(", "").replace(")", "")

      g1.call(
        zoom1.transform, 
        d3.zoomIdentity
          .translate(xInt, yInt)
          .scale(kInt)
      )

      g1.transition()
      .duration(3000)
      .attr("transform", d3.zoomIdentity)
      .on("start", () => {
        setFocus('details')
      })
      .on("end", () => {
        d3.select(this).call(
          zoom1.transform, 
          d3.zoomIdentity
        )
      })

    }
  }
</script>
