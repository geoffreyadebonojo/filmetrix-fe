<script setup>
  import { RouterView } from 'vue-router'
  import { 
    appStates,
    graphStates,
    userStates,
    panelStates,
    store
   } from '@/stores/store.js'
  import api from "@mixins/api"
  import graph from "@mixins/graph"
  import { setFocus } from '@mixins/helpers'
  import manageGlobalState from "@mixins/manageGlobalState"
  import { d3zoom } from '@mixins/zoom'
  import * as d3 from 'd3'

</script>

<template>
  <div id="app-wrapper" class="dark-theme">
    <RouterView></RouterView>
  </div>
</template>

<style lang="scss">
  .dark-theme {
    background: $graph-body-grey;
  }
</style>

<script>
  export default {
    data () {
      return {
        isMobile: /Android|iPhone/i.test(navigator.userAgent),
        newHere: JSON.parse(localStorage.getItem("newHere")),
      }
    },
    
    async created () {
      if (this.$data.newHere == null) {
        localStorage.setItem("newHere", true)
      }
      
      if (localStorage.getItem("lockedGraph") == null) {
        localStorage.setItem("lockedGraph", "[]")
      }

      graphStates.existing = JSON.parse(localStorage.getItem("lockedGraph"))

      const zoom = d3zoom(d3.select("#main-outer-wrapper"))

      d3.select("body").on("keydown", function(event) {
        if (event.key === "Shift") {
          appStates.shiftKeyIsPressed = true
        
        } else if (event.key == "Meta") {
          appStates.metaKeyIsPressed = true
        
        } else if (event.key == "q") {
          d3.select(`#${panelStates.detailsData.id}`).classed("poster-highlight", true)
        
        }
      }).on("keyup", function(event) {        
        if (event.key === "Shift") {
          appStates.shiftKeyIsPressed = false
        
        } else if (event.key == "Meta") {
          appStates.metaKeyIsPressed = false
        
        } else if (event.key == "q") {
          d3.select(`#${panelStates.detailsData.id}`).classed("poster-highlight", false)
        }
      })

    },

    async mounted () {
      if (graphStates.existing != null) {
        if (graphStates.existing.length > 0) {
          await this.loadSavedGraph()
        }
      }
    },
    
    methods: {
      async loadSavedGraph () {
        if (graphStates.existing == null) { return }
        if (graphStates.existing.length < 1) { return }

        store.isLocked = true

        await api.fetchGraphData(graphStates.existing.map(d => d[0]))
        await api.fetchDetails(graphStates.existing[0])

        let data
        let nodes = []
        let links = []
        
        graphStates.existing.forEach((d) => {
          data = graphStates.graphData[d[0]]
          nodes = nodes.concat(data.nodes.slice(0,d[1]))
          // NODE SENDCOUNT
          // watch how you slice, you'll get an error
          // if num links >= num nodes
          links = links.concat(data.links.slice(0,d[1]-1))
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
          .duration(1000)
          .attr("transform", d3.zoomIdentity)
          .on("start", () => {
            if (JSON.parse(localStorage.getItem("lockedGraph")) == []){
              setFocus("empty")
            } else {
              setFocus("details")
              // graphStates.visited = [graphStates.existing[0][0]]
            }
        })
        .on("end", () => {
          d3.select(this).call(
            zoom1.transform, 
            d3.zoomIdentity
          )
        })
      }
    }
  }
</script>
