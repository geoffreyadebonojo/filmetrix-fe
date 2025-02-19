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
    <div id="filters">
      <div id="movie-filters-container">
        <g class="all" id="all-movies"><text>ALL</text></g>
        <g id="movie-filters"></g>
        <g class="none" id="no-movies"><text>NONE</text></g>
      </div>
      <div id="person-filters-container">
        <g class="all" id="all-persons"><text>ALL</text></g>
        <g id="person-filters"></g>
        <g class="none" id="no-persons"><text>NONE</text></g>
      </div>
    </div>
    <div id="degrees-kevin"></div>
  </div>
</template>

<style lang="scss">
  .dark-theme {
    background: $graph-body-grey;
  }

  .hidden {
    display: none;
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
    // display: grid;
    display: none;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 20px 1fr 20px;
    position: absolute; 
    top: 85px; 
    left: 10px; 
    width: 0px;
    // height: 100%;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-content: flex-start;

    #person-filters-container, #movie-filters-container{
      width: 90px;
      height: 100%;
      display: grid;
      grid-template-rows: 20px 1fr 20px;

      #movie-filters, #person-filters {
        display: grid;
      }

      .all, .none, .filter {
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
      if (localStorage.getItem("genres") == null) { localStorage.setItem("genres", `[]`)}
      if (localStorage.getItem("lockedNodes") == null) { localStorage.setItem("lockedNodes", "[]") }
      // if (localStorage.getItem("dragLockOn") == null) { localStorage.setItem("dragLockOn", "false") }

      graphStates.existing = JSON.parse(localStorage.getItem("lockedGraph"))

      let pageSearchString = ''
      const performStringMatching = this.performStringMatching
      const deselectPageSearch = this.deselectPageSearch
      const filterByGenres = this.filterByGenres
      const resetGraphWithFilters = this.resetGraphWithFilters

      d3.select("body").on("keydown.click", function(event) {
        const searchTextElem = d3.select("#name-search")

        // if (event.key == "`") {
        //   graphStates.genreSearchActive = !graphStates.genreSearchActive

        //   if (!graphStates.genreSearchActive) { 
        //     d3.select("#filters").style("display", "none")
        //   } else {
        //     d3.select("#filters").style("display", "grid")
        //     let movies = d3.selectAll(".movie, .tv").data().map((n) => n.genre).join(" ").split(" ").unique()
        //     let people = d3.selectAll(".person").data().map((n) => n.type.join(" ")).join(" ").split(" ").unique().remove("&")

        //     // let filter = movies.concat(people)
        //     function setClass(d) {
        //       let activeGenres = JSON.parse(localStorage.getItem("genres"))
        //       let active = activeGenres.includes(d) ? "locked" : ""
        //       return ['filter', active].join(" ")
        //     }

        //     let pplTextContainer = d3.select("#person-filters").selectAll("g")
        //                           .data(people).enter()
        //                           .append("g")
        //                           .attr("class", d => setClass(d))

        //     let movTextContainer = d3.select("#movie-filters").selectAll("g")
        //                           .data(movies).enter()
        //                           .append("g")
        //                           .attr("class", d => setClass(d))
            
        //     function mouseover(e, d) {
        //       let matches = d3.selectAll(`.movie${d}, person${d}`)
        //       // matches.classed("hidden", true)  

        //       matches.each((n) => {
        //         let id = n.id
        //         d3.select(`#${id}`).select("circle").style("stroke", "red")
        //         // d3.selectAll(".link").filter(l => l.id.includes(id)).classed("hidden", true)
        //       })
        //     }                     
            
        //     function mouseout(e, d) {
        //       // d3.selectAll(`.node`).classed("hidden", false)
        //       // d3.selectAll(".link").classed("hidden", false)
        //       d3.selectAll("circle").style("stroke", "#7A7879")
        //       // let nonmatches = d3.selectAll(`.movie:not(.${d}), .person:not(.${d})`)
        //       // matches.classed("hidden", true)  

        //       // nonmatches.each((n) => {
        //       //   let id = n.id
        //       // })
        //     }

        //     function filterClick(e) {
        //       let prev = JSON.parse(localStorage.getItem('genres'))
        //       let activeFilters = prev.togglePresence(e.target.innerHTML)
        //       localStorage.setItem('genres', JSON.stringify(activeFilters))

        //       let current = d3.select(e.target.parentElement).classed("locked")
        //       d3.select(e.target.parentElement).classed("locked", !current)

        //       resetGraphWithFilters(activeFilters)
        //     }
            
        //     pplTextContainer.on("mouseenter", (e, d) => mouseover(e, d))                   
        //                  .on("mouseleave", (e, d) => mouseout(e, d))
        //                  .on("click", (e) => filterClick(e))
        //                  .append("text").text((d) => d)  

     
        //     movTextContainer.on("mouseenter", (e, d) => mouseover(e, d))                   
        //                  .on("mouseleave", (e, d) => mouseout(e, d))
        //                  .on("click", (e) => filterClick(e))
        //                  .append("text").text((d) => d)
        //   }

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
      d3.select("#all-persons")
      .on("click", (e) => {
        let filters = d3.select("#person-filters").selectAll(".filter")
        filters.classed("locked", true)

        let allFilters = d3.selectAll(".filter.locked").data()
        localStorage.setItem("genres", JSON.stringify(allFilters))
                
        this.resetGraphWithFilters(allFilters)
      })

      d3.select("#all-movies")
      .on("click", (e) => {
        let filters = d3.select("#movie-filters").selectAll(".filter")
        filters.classed("locked", true)

        let allFilters = d3.selectAll(".filter.locked").data()
        localStorage.setItem("genres", JSON.stringify(allFilters))        
        
        this.resetGraphWithFilters(allFilters)
      })

      d3.select("#no-persons")
      .on("click", (e) => {
        let filters = d3.select("#person-filters").selectAll(".filter")
        filters.classed("locked", false)

        let allFilters = d3.selectAll(".filter.locked").data()
        localStorage.setItem("genres", JSON.stringify(allFilters))

        this.resetGraphWithFilters(allFilters)
      })

      d3.select("#no-movies")
      .on("click", (e) => {
        let filters = d3.select("#movie-filters").selectAll(".filter")
        filters.classed("locked", false)

        let allFilters = d3.selectAll(".filter.locked").data()
        localStorage.setItem("genres", JSON.stringify(allFilters))

        this.resetGraphWithFilters(allFilters)
      })

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
          gn.GraphLinks.links.classed("hidden", true)
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
          gn.GraphLinks.links.classed("hidden", false)
        })

        graphStates.matching = matching.data().map((n) => n.id)
      },

      resetGraphWithFilters(activeFilters) {
        let am = []
        let ap = []
        let lm = []
        
        graphStates.existing.forEach((d) => {
          let allNodes = graphStates.graphData[d[0]].nodes
          
          let [matching, nonMatching] = allNodes.filter((n) => {
            return (n.type.overlapsWith(activeFilters).any())
          }).splitAt(d[1]-1)

          am.push(matching)
          // nonMatching.forEach((n) => {n.hidden = true})
          // am.push(nonMatching.first(20))
        })

        let nodes = am.flatten().uniqueById()

        graphStates.existing.forEach((d) => {
          let allLinks = graphStates.graphData[d[0]].links

          allLinks.forEach((l) => {
            let nids = nodes.ids()
            if ((nids.includes(l.source.id) && nids.includes(l.target.id)) || 
                (nids.includes(l.source) && nids.includes(l.target))) {
              lm.push(l)
            }
          })
        })

        let links = lm

        debugger
        console.log({links, nodes})

        new GraphManager().generateFiltered({links, nodes})
      }
    }
  }
</script>
