<script setup>
  import ResultPosterTile from './ResultPosterTile.vue'
  import manageGlobalState from "@mixins/manageGlobalState"
  import SearchPrompt from '@panel/main/panes/prompts/SearchPrompt.vue'
  import graph from "@mixins/graph"
  import api from "@mixins/api"
  import { 
    appStates,
    panelStates,
    store
  } from '@/stores/store.js'
  import { setFocus } from '@mixins/helpers'
  import * as d3 from 'd3'
</script>

<template>
  <div class="result-component">
    <div v-if="store.searchTerm == ''">
      <search-prompt></search-prompt>
    </div>

    <div v-else>
      <!-- fuck my life -->
      <div v-if="store.searchResults.length > 0" 
        v-bind:id="panelStates.currentFocus + '-results'"
        class="result-container">
        <result-poster-tile v-for="result in resultsWithPosters" :result="result"></result-poster-tile>
      </div>

      <div v-else id="no-results" style="opacity:0">
        <p>No result found:</p>
        <p id="term">
          {{ store.searchTerm }}
        </p>
        <p style="margin-top:30px">Did you get the spelling right? Make sure to get the spelling right</p>
        <p style="margin-top:30px">Its important to spell thigns corectly</p>
      </div>
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
    updated () {
      if (store.searchResults.length > 0) {

        // setFocus(store.searchResults[0].entity)
        // This is causing the nav buttons to stick
        
      } else {
        d3.select("#no-results").transition().duration(300).style("opacity", 1)
      }
    },
    mounted () {
      // d3.select(".result-component").transition().delay(0).duration(200).style("right", "0%")
      // d3.select("#first-time-instruction").style("display", () => {
        //   return this.$data.newHere ? "block" : "none"
      // })
      d3.select("#panel-panes").on("scroll", async (e) => {        
        let scrollBottom = (e.target.scrollTop + e.target.clientHeight)+1
        const atBottom = scrollBottom > e.target.scrollHeight

        if (atBottom) {
          console.log("at bottom")
          // const nextPageData = await api.fetchSearchNext(store.searchTerm)
          // store.searchResults = store.searchResults.concat(nextPageData)
        }
      })
    },

    computed: {
      resultsWithPosters: () => {
        return store.searchResults.uniqueById().filter((r) => {
          return r.entity == panelStates.currentFocus && r.poster != ''
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .result-component {
    right: 0%;
    margin-top: 30px;
  }

.result-container {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 50px 20px;
    justify-content: center;
    padding: 20px;
  }
  
  #no-results, #first-time-instruction {
    text-transform: uppercase;
    font-family: $global-font;
    font-weight: bold;
    font-size: 1.25em;
    text-align: center;
    font-weight: 100;
    padding: 30px 10px 0px;
    
    #term {
      font-size: 1.75em;
      font-weight: 900;
      margin: 30px 0px;
    }
  }

  #first-time-instruction {
    position: sticky;
    top: 0px;
    background: $panel-body-grey;
    z-index: 1000;
  }

  .hidden {
    display: none;
  }

  .shown {
    display: block;
  }
</style>
