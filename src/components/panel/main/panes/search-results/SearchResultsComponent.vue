<script setup>
  import ResultPosterTile from './ResultPosterTile.vue'
  import graph from "@mixins/graph"
  import api from "@mixins/api"
  import { 
    appStates,
    panelStates,
    store
  } from '@/stores/store.js'
  import * as d3 from 'd3'
</script>

<template>
  <div class="result-component">
    <div id="first-time-instruction" class="apply-effect">
      <p>
        choose one to get started
      </p>
      <div id="fade-top-1"></div>
    </div>
    <div v-if="panelStates.currentFocus !== 'noResult'"
          v-bind:id="panelStates.currentFocus + '-results'"
          class="result-container">
      <result-poster-tile v-for="result in resultsWithPosters" :result="result"></result-poster-tile>
    </div>

    <div v-else>
      <p>No result found.</p>
      <p style="margin-top:30px">Did you get the spelling right?</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: "SearchResultsComponent",
    data () {
      return {
        newHere: JSON.parse(localStorage.getItem("newHere"))
      }
    },
    mounted () {
      d3.select(".result-component").transition().delay(0).duration(200).style("right", "0%")
      d3.select("#first-time-instruction").style("display", () => {
        return this.$data.newHere ? "block" : "none"
      })
      d3.select("#panel-panes").on("scroll", async (e) => {        
        let scrollBottom = (e.target.scrollTop + e.target.clientHeight)// -5
        
        const atBottom = scrollBottom > e.target.scrollHeight

        // if ( atBottom && !d3.select(".result-component").classed("lock-scroll") ){
        if ( atBottom){
          // const rc = d3.select(".result-component")
          // rc.append("p").text("add final").style("height", "100px").style("width", "100px")
          // rc.classed("lock-scroll", "true")
          // setTimeout((d) => {
          //   const ls = d3.select(".lock-scroll").classed("lock-scroll", "false")
          //   ls.remove()
          // },3000)

          // const nextPageData = await api.fetchSearchNext(store.searchTerm)
          // store.searchResults = store.searchResults.concat(nextPageData)
          console.log("call for new")
        }
      })
    },
    computed: {
      filteredSearchResults: () => {
        return store.searchResults.filter(r => r.entity == panelStates.currentFocus)
      },
      resultsWithPosters: () => {
        return store.searchResults.filter((r) => {
          return r.entity == panelStates.currentFocus && r.poster != ''
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  #fade-top-1 {
    width: 100%;
    height: 0px;
  }
  
  #fade-top-1::before {
    position: absolute;
    right: 0px;
    content: '';
    background: linear-gradient(to top, transparent 29%, #333 100%);
    width: 100%;
    height: 25px;
  }
.result-container {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 50px 20px;
    justify-content: center;
    padding: 20px;
  }
  
  #no-result, #first-time-instruction {
    text-transform: uppercase;
    font-family: $global-font;
    font-weight: bold;
    font-size: 40px;
    text-align: center;
  }
  
  #first-time-instruction {
    position: sticky;
    opacity: 0.5;
    top: 0px;
    padding: 30px 10px 0px;
    background: $panel-body-grey;
    z-index: 1000;
    text-transform: uppercase;
    font-family: "Dosis", sans-serif;
    font-weight: 100;
    font-size: 2em;
    text-align: center;
  }
</style>
