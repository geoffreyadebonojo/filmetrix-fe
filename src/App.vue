<script setup>
  import { RouterView } from 'vue-router'
  import { 
    appStates,
    graphStates,
    userStates,
    panelStates,
    store
   } from '@/stores/store.js'
  import GraphNode from '@models/GraphNode'
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
      const performMatching = this.performMatching
      const deselectPageSearch = this.deselectPageSearch
      const filterByGenres = this.filterByGenres

      d3.select("body").on("keydown.click", function(event) {
        const searchTextElem = d3.select("#name-search")

        if (event.key == "`") {
          let k = Object.keys(graphStates.movieGenreCounts)

          let res = filterByGenres(['comedy', 'mystery'], "not")
          
        }
        if (event.key === "Shift") {
          appStates.shiftKeyIsPressed = true

        } else if (event.key == "Meta") {
          appStates.metaKeyIsPressed =  true

        } else if (event.metaKey && event.shiftKey && event.key == 'f') {

          if (graphStates.pageSearchActive) {
            pageSearchString = ""
            deselectPageSearch(pageSearchString, searchTextElem)
          } else {
            graphStates.pageSearchActive = true
            searchTextElem.node().innerHTML = ">"
          }

        } else if (graphStates.pageSearchActive) {
          let validKeys = 'qwertyuiopasdfghjklzxcvbnm'.split("")
          validKeys.push("Backspace")
          
          if (!validKeys.includes(event.key)) { return false }
          if (event.key == "Backspace") { 
            pageSearchString = pageSearchString.slice(0, -1) 
          } else { 
            pageSearchString += event.key
          }

          searchTextElem.node().innerHTML = `> ${pageSearchString}`
          performMatching(pageSearchString)

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
      },

      deselectPageSearch (pageSearchString, searchTextElem) {
        graphStates.pageSearchActive = false
        searchTextElem.node().innerHTML = ""
        d3.selectAll(".node").style("opacity", 1)
      },

      filterByGenres (genres, filterType) {
        let nodes

        if (filterType == "or") {
          nodes = d3.selectAll(`.${genres.join(",.")}`)
        } else if (filterType == "and") {
          nodes = d3.selectAll(`.${genres.join(".")}`)
        } else if (filterType == "not") {
          nodes = d3.selectAll(`.node:not(.${genres.join(",.")})`)
        } else {
          nodes = []
        }

        return nodes
      },
      
      performMatching (pageSearchString) {
        let nws, nwos, pslc, pslcwos, gn
        // interesting question of how to handle anchors...
        // let nonAnchors = d3.selectAll(".node").filter((n) => {
        //   return graphStates.existing.map((d) => d[0]).excludes(n.id)
        // })
        const allNodes = d3.selectAll(".node")

        const nonMatching = allNodes.filter((n) => {
          nws =  n.name.toLowerCase()
          nwos = n.name.toLowerCase().replace(/ /g, "")
          pslc =    pageSearchString.toLowerCase()
          pslcwos = pageSearchString.toLowerCase().replace(/ /g, "")

          return !(nws.includes(pslc) || nwos.includes(pslcwos))
        })
        
        nonMatching.each((d) => {
          gn = new GraphNode(d.id)
          gn.node.classed("hidden", true)
          gn.allLinks.classed("hidden", true)
        })

        const matching = allNodes.filter((n) => {
          nws =  n.name.toLowerCase()
          nwos = n.name.toLowerCase().replace(/ /g, "")
          pslc =    pageSearchString.toLowerCase()
          pslcwos = pageSearchString.toLowerCase().replace(/ /g, "")
          
          return (nws.includes(pslc) || nwos.includes(pslcwos))
        })
        
        matching.each((d) => {
          gn = new GraphNode(d.id)
          gn.node.classed("hidden", false)
          gn.allLinks.classed("hidden", false)
        })

        graphStates.matching = matching.data().map((n) => n.id)
      }
    }
  }
</script>
