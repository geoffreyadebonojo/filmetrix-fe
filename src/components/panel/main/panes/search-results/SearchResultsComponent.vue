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
    <div id="first-time-instruction" class="apply-effect" v-if="panelStates.currentFocus !== 'noResult'">
      <p>
        choose one to get started
      </p>
      <div id="fade-top-1"></div>
    </div>
    <div v-else></div>

    <div v-if="panelStates.currentFocus !== 'noResult'"
          v-bind:id="panelStates.currentFocus + '-results'"
          class="result-container">
      <result-poster-tile v-for="result in resultsWithPosters" :result="result"></result-poster-tile>
    </div>

    <div id="no-result-text" v-else>
      <p>No result found.</p>
      <p style="font-size:1.75em;margin:30px 0px">
        {{  store.searchTerm }}
      </p>
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
        let scrollBottom = (e.target.scrollTop + e.target.clientHeight)+1
        const atBottom = scrollBottom > e.target.scrollHeight

        if (atBottom) {
          const nextPageData = await api.fetchSearchNext(store.searchTerm)
          store.searchResults = store.searchResults.concat(nextPageData)
        }
      })
    },

    computed: {
      filteredSearchResults: () => {
        return store.searchResults.filter(r => r.entity == panelStates.currentFocus)
      },
      resultsWithPosters: () => {
        return store.searchResults.uniqueById().filter((r) => {
          const hasPoster = (r.entity == panelStates.currentFocus && r.poster != '')
          return hasPoster
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
  
  #no-result-text, #first-time-instruction {
    top: 0px;
    padding: 30px 10px 0px;
    background: $panel-body-grey;
    z-index: 1000;
    
    p {
      text-transform: uppercase;
      font-family: $global-font;
      font-weight: bold;
      font-size: 1.5em;
      text-align: center;
      opacity: 0.5;
    }
  }
  
  #first-time-instruction {
    position: sticky;
  }
</style>
