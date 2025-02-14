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
      if (localStorage.getItem("genres") == null) { localStorage.setItem("genres", "[]") }

      graphStates.existing = JSON.parse(localStorage.getItem("lockedGraph"))

      let pageSearchString = ''
      const performStringMatching = this.performStringMatching
      const deselectPageSearch = this.deselectPageSearch
      const filterByGenres = this.filterByGenres

      d3.select("body").on("keydown.click", function(event) {
        const searchTextElem = d3.select("#name-search")

        // if (event.key == "`") {
        //   let genres = d3.selectAll(".movie").data().map((n) => n.genre).join(" ").split(" ").unique()
        //   // let roles =  d3.selectAll(".person").data().map((n) => n.genre).join(" ").split(" ").unique()
        //   // let filter = genres.concat(roles)
        //   let filter = genres

        //   let textContainer = d3.select("#filters").selectAll("g")
        //                         .data(filter).enter()
        //                         .append("g")
        //                         .attr("class", (d) => {
        //                           let activeGenres = JSON.parse(localStorage.getItem("genres"))
        //                           let active = activeGenres.includes(d) ? "locked" : ""
        //                           return ['filter', active].join(" ")
        //                         })
          
        //   textContainer.on("mouseenter", (e, d) => {
        //     let nonMatches = d3.selectAll(`.node:not(.${d})`)
        //     nonMatches.style("display", "none")
        //   })                   
          
        //   textContainer.on("mouseleave", (e, d) => {
        //     d3.selectAll(".node").style("display", "block")
        //   })

        //   textContainer.on("click", (e, d) => {
        //     let thisFilterClassed = d3.select(e.currentTarget).classed("locked")
        //     d3.select(e.currentTarget).classed("locked", !thisFilterClassed)
        //     let activeFilters = d3.selectAll(".filter.locked").data()
        //     localStorage.setItem('genres', JSON.stringify(activeFilters))
            
        //     let data = {links: [], nodes: []}
            
        //     Object.values(graphStates.graphData).map((ge) => {
        //       data.links.push(ge.links)
        //       data.nodes.push(ge.nodes)
        //     })

        //     function xfilter(filters, n) {
        //       let x
        //       if (n.entity == "person") {
        //         x = true
        //       } else {
        //         x = activeFilters.overlapsWith(n.type).any()
        //       }
        //       return x
        //     }
            
        //     let nodes = data.nodes.flatten().filter(n => xfilter(activeFilters, n))

        //     function yfilter(nodeIds, l) {
        //       let x
        //       if (l.index != undefined) {
        //         x = nodeIds.includes(l.source.id) && nodeIds.includes(l.target.id)
        //       } else {
        //         x = nodeIds.includes(l.source) && nodeIds.includes(l.target)
        //       }
        //       return x
        //     }

        //     let ids = nodes.map(n => n.id)
        //     let links = data.links.flatten().filter(l => yfilter(ids, l))

        //     // debugger

        //     graph.draw({
        //       nodes: nodes.uniqueById(),
        //       links: links,
        //       type: "main"
        //     })
            
        //   })

        //   textContainer.append("text").text((d) => d)

        // }
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
      d3.select("#loading").transition().duration(5000).attr("width", 500)
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
