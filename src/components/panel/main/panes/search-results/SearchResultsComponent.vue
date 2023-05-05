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
      <div v-if="store.currentFocus != 'noResult'" 
        v-bind:id="panelStates.currentFocus + '-results'"
        class="result-container">
        <result-poster-tile v-for="result in resultsWithPosters" :result="result"></result-poster-tile>
      </div>

      <div v-else id="no-results">
        <p>No result found:</p>
        <p id="term">
          {{ store.searchTerm }}
        </p>
        <p style="margin-top:30px">Did you get the spelling right? Make sure to get the spelling right.</p>
        <p style="margin-top:30px">Its important to spell things corectly.</p>
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
    mounted () {
      // d3.select(".result-component").transition().delay(0).duration(200).style("right", "0%")
      d3.select("#first-time-instruction").style("display", () => {
        return this.$data.newHere ? "block" : "none"
      })

      // if (store.searchResults.length > 0) {
        // debugger
      //   setFocus(store.searchResults[0].entlity)
      // }

      d3.select("#panel-panes").on("scroll", async (e) => {        
        let scrollBottom = (e.target.scrollTop + e.target.clientHeight)+1
        const atBottom = scrollBottom > e.target.scrollHeight

        if (atBottom) {
          console.log("at bottom")
            const nextPageData = await api.fetchSearchNext(store.searchTerm)
            store.searchResults = store.searchResults.concat(nextPageData)
          // },3000)
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
  #fade-top-1 {
    width: 10 0%;
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
