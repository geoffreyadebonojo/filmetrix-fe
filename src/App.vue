<script setup>
  import { RouterView } from 'vue-router'
  import { 
    appStates,
    graphStates,
    userStates,
    panelStates,
    graphData,
    store
   } from '@/stores/store.js'
  import GraphNode from '@models/GraphNode'
  import GraphManager from '@models/GraphManager.js'
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
    <div id="filters"></div>
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

  #filters {
    position: absolute; 
    top: 85px; 
    left: 10px; 
    width: 0px;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-content: flex-start;
    
    .filter {
      font-family: $global-font;
      font-size: 20px;
      stroke-width: 2;
      color: #7A7879;

      text:hover {
        cursor: $cursor;
        color: lightblue;
      }
    }

    .locked > text {
      color: lightblue;
    }
  }

  // .node.locked {
  //   circle {
  //     stroke: red
  //   }
  // }

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
        loading: graphStates.loading
      }
    },
    
    async created () {
      if (this.$data.newHere == null) { localStorage.setItem("newHere", true) }
      if (localStorage.getItem("lockedGraph") == null) { localStorage.setItem("lockedGraph", "[]") }     
      if (localStorage.getItem("genres") == null) { localStorage.setItem("genres", graphStates.genres) }
      if (localStorage.getItem("lockedNodes") == null) { localStorage.setItem("lockedNodes", "[]") }
      // if (localStorage.getItem("dragLockOn") == null) { localStorage.setItem("dragLockOn", "false") }

      graphStates.existing = JSON.parse(localStorage.getItem("lockedGraph"))

      let pageSearchString = ''
      const performStringMatching = this.performStringMatching
      const deselectPageSearch = this.deselectPageSearch
      const filterByGenres = this.filterByGenres

      d3.select("body").on("keydown.click", function(event) {
        const searchTextElem = d3.select("#name-search")

        if (event.key == "`") {
          graphStates.genreSearchActive = !graphStates.genreSearchActive

          if (!graphStates.genreSearchActive) { 
            d3.select("#filters").selectAll("g").remove()
          } else {
            let filter = d3.selectAll(".movie").data().map((n) => n.genre).join(" ").split(" ").unique()

            function setClass(d) {
              let activeGenres = JSON.parse(localStorage.getItem("genres"))
              // let activeGenres = graphStates.genres
              let active = activeGenres.includes(d) ? "locked" : ""
              return ['filter', active].join(" ")
            }

            let textContainer = d3.select("#filters").selectAll("g")
                                  .data(filter).enter()
                                  .append("g")
                                  .attr("class", d => setClass(d))
            
            function mouseover(e, d) {
              let nonMatches = d3.selectAll(`.movie:not(.${d})`)
              nonMatches.style("display", "none")  
              nonMatches.each((n) => {
                let id = n.id
                d3.selectAll(".link").filter(l => l.id.includes(id)).style("display", "none")
              })
            }                     
            
            function mouseout(e, d) {
              d3.selectAll(`.node`).style("display", "block")
              d3.selectAll(".link").style("display", "block")
            }

            function filterClick(e) {
              const thisFilterClassed = d3.select(e.currentTarget).classed("locked")
              d3.select(e.currentTarget).classed("locked", !thisFilterClassed)
              const activeFilters = d3.selectAll(".filter.locked").data()
              localStorage.setItem('genres', JSON.stringify(activeFilters))

              let nodes = []

              graphData.active.nodes.forEach((n) => {
                if (n.type.overlapsWith(activeFilters).any() || n.entity == "person") {
                  nodes.push(n)
                }
              })

              function filt(l, nids) {
                return l.id.split("--").overlapsWith(nids).length > 1
              }

              let links = graphData.active.links.filter((l) => filt(l, nodes.map(n => n.id)))

              new GraphManager().generate({nodes, links})
            }
            
            textContainer.on("mouseenter", (e, d) => mouseover(e, d))                   
                         .on("mouseleave", (e, d) => mouseout(e, d))
                         .on("click", (e) => filterClick(e))
                         .append("text").text((d) => d)  
          }
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
          performStringMatching(pageSearchString)

        } else {
          pageSearchString = ''
        }

      }).on("keyup", function(event) {        
        if (event.key === "Shift") {    appStates.shiftKeyIsPressed = false } 
        else if (event.key == "Meta") { appStates.metaKeyIsPressed =  false }
      })

    },

    mounted () {
      if (graphStates.existing != null) {
        if (graphStates.existing.length > 0) {
          this.loadSavedGraph()
        }
      }
    },

    methods: {
      async loadSavedGraph () {
        d3.select("#app-wrapper").transition().delay(0)
        .on("end", () => {
          if (JSON.parse(localStorage.getItem("lockedGraph")) == []){
            setFocus("empty")
          } else {
            setFocus("details")
          }
        })
        
        new GraphManager().generate()
      },

      deselectPageSearch (pageSearchString, searchTextElem) {
        graphStates.pageSearchActive = false
        searchTextElem.node().innerHTML = ""
        d3.selectAll(".node").style("opacity", 1)
      },

      performStringMatching (pageSearchString) {
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
