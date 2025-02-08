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
  import * as d3 from 'd3'

</script>

<template>
  <div id="app-wrapper" class="dark-theme">
    <RouterView></RouterView>
    <div id="name-search"></div>
    <!-- <div id="genre-search"></div> -->
    <div id="degrees-kevin"></div>
  </div>
</template>

<style lang="scss">
  .dark-theme {
    background: $graph-body-grey;
  }

  #name-search {
    position: absolute; 
    top: 10px; 
    left: 10px; 
    font-family: $global-font;
    font-size: 50px;
    stroke-width: 2;
  }

  #genre-search {
    position: absolute; 
    top: 50px; 
    left: 10px; 
    font-family: $global-font;
    font-size: 50px;
    stroke-width: 2;
  }

  #degrees-kevin {
    position: absolute; 
    bottom: 10px; 
    left: 10px; 
    font-family: $global-font;
    font-size: 50px;
    stroke-width: 2;
    color: gold
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

      let pageSearchString = ''
      
      d3.select("body").on("keydown.click", function(event) {
        if (event.key === "Shift") {
          appStates.shiftKeyIsPressed = true

        } else if (event.key == "Meta") {
          appStates.metaKeyIsPressed =  true

        } else if (event.metaKey && event.shiftKey && event.key == 'f') {
          let nameSearch = d3.select("#name-search")
          // let genreSearch = d3.select("#genre-search")

          if (graphStates.pageSearchActive) {
            graphStates.pageSearchActive = !graphStates.pageSearchActive
            nameSearch.node().innerHTML = ""
            genreSearch.node().innerHTML = ""
            d3.selectAll(".node").style("opacity", 1)
          } else {
            graphStates.pageSearchActive = true
            nameSearch.node().innerHTML = ">"
            genreSearch.node().innerHTML = ">"
            tse.style("color", "white").transition().duration(300).style("color", "#7A7879")
          }

        } else if (graphStates.pageSearchActive) {
          let validKeys = 'qwertyuiopasdfghjklzxcvbnm'.split("")
          validKeys.push("Backspace")
          
          if (!validKeys.includes(event.key)) { return false }
          
          let searchTextElem = d3.select("#name-search")
          // let genreTextElem = d3.select("#genre-search")

          if (event.key == "Backspace") { pageSearchString = pageSearchString.slice(0, -1) }
          else {                          pageSearchString += event.key                    }

          searchTextElem.node().innerHTML = `> ${pageSearchString}`
          // genreTextElem.node().innerHTML = `> ${pageSearchString}`

          let nws, nwos, pslc, pslcwos

          let nonMatching = d3.selectAll(".node").filter((n) => {
            nws = n.name.toLowerCase()
            nwos = n.name.toLowerCase().replace(/ /g, "")
            pslc = pageSearchString.toLowerCase()
            pslc = pageSearchString.toLowerCase().replace(/ /g, "")
            pslcwos = pageSearchString.toLowerCase().replace(/ /g, "")

            return !(nws.includes(pslc) || nwos.includes(pslcwos))
          })
          
          nonMatching.style("opacity", 0)

          let matching = d3.selectAll(".node").filter((n) => {
            nws = n.name.toLowerCase()
            nwos = n.name.toLowerCase().replace(/ /g, "")
            pslc = pageSearchString.toLowerCase()
            pslcwos = pageSearchString.toLowerCase().replace(/ /g, "")
            
            return (nws.includes(pslc) || nwos.includes(pslcwos))
          })
          
          matching.style("opacity", 1)
          
          graphStates.matching = matching.data().map((n) => n.id)

        } else {
          pageSearchString = ''
        }

      }).on("keyup", function(event) {        
        if (event.key === "Shift") {    appStates.shiftKeyIsPressed = false } 
        else if (event.key == "Meta") { appStates.metaKeyIsPressed =  false }
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
          // watch how you slice, you'll get an error
          // if num links >= num nodes
          links = links.concat(data.links.slice(0,d[1]-1))
        })
        
        graph.draw({
          nodes: nodes.uniqueById(),
          links: links,
          type: "main"
        })
        
        d3.select("#main-outer-wrapper").transition()
          .on("start", () => {
            if (JSON.parse(localStorage.getItem("lockedGraph")) == []){
              setFocus("empty")
            } else {
              setFocus("details")
            }
        })
      }
    }
  }
</script>
