<script setup>
  import PanelComponent from '../components/PanelComponent.vue'
  import GraphComponent from '../components/GraphComponent.vue'
  import apiService from "../mixins/apiService"
</script>

<template>
  <RouterView />
  <GraphComponent />
  <PanelComponent 
    :focus="focus"
    :searchOpen="searchOpen"
    :searchResults="searchResults"
    :setFocus="setFocus"
    :toggleOrSubmit="toggleOrSubmit"
    :submitSearch="submitSearch"
   />
</template>

<style scoped>
  .graph-wrapper {
    color: #222222;
    width: 65vw;
    height: 100vh;
  }
  svg {
    height: 100%;
    width: 100%;
    overflow: hidden;
  }
</style>

<script>
  import * as d3 from 'd3'

  export default {
    components: {
      GraphComponent,
      PanelComponent
    },

    mixin: [apiService],

    data () {
      response: null
      return {
        focus: 'empty',
        searchOpen: true,
        pids: [],
        mids: [],
        charge: -1000,
        count: 5,
        searchResults: []
      }
    },
    
    methods: {
      moveHighlightCircle(x) {

        // still a little bouncy
        d3.select("#highlight")
        .style("left", null)
        .transition()
        .duration(100)
        .style("right", x)
      },

      closeField(d) {
        d.transition().duration(0)
        .style("width", "0px")
        .style("left", "62%")
      },

      openField(d) {
        d.transition().duration(0).delay(100)
          .style("width", "60%")
          .style("left", "7%")

        d3.select("#highlight").transition().duration(100)
          .style("left", "-1px")
      },

      toggleOrSubmit() {
        this.focus = 'search'
        const d = d3.select("#search-text") 

        if (this.searchOpen) {
          const val = d.node().value
          this.submitSearch(val)
          //transition to details

        } else {
          this.searchOpen = true
          this.openField(d)
        }
      },

      setFocus(focus) {
        const d = d3.select("#search-text") 
        //fix later
        const xCord = {
          person: '112px',
          movie: '85px',
          details: '56px',
          commands: '27px',
          about: '0px'
        }

        this.closeField(d)
        
        this.moveHighlightCircle(xCord[focus])
        this.focus = focus

        this.searchOpen = false
      },

      async submitSearch(value) {
        const val = value.toUpperCase()

        if (val == '' || val == null) { 
          // maybe a helpful tip?
          return false
        }
        await this.fetchSearchData(val)

        this.searchResults = this.response.data.search
        const tab = this.searchResults[0].id.split("-")[0]
        
        this.setFocus(tab)
      },

      querySearch(term) {
        return `query {
          search(term:"${term}") {
            id
            name
            poster
          }
        }`
      },

      async fetchSearchData(term) {
        const API_URL = `http://localhost:3000/graphql`

        this.response = await (
          fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: this.querySearch(term) })
          }).then((response) => {
            const x = response.json()
            return x
          })
        )
      },

      queryAll(pids, mids, count) {
        return `query {
          nodes(personIds: ${JSON.stringify(pids)}, movieIds: ${JSON.stringify(mids)}, count: ${count}) {
            id
            name
            poster
          }
          links(personIds: ${JSON.stringify(pids)}, movieIds: ${JSON.stringify(mids)}, count: ${count}) {
            source
            target
            roles
          }
        }`
      },

      async fetchGraphData(pids, mids, count) {
        this.response = await (
          fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: this.queryAll(pids, mids, count) })
          }).then((response) => {
            return response.json()
          })
        )
      }
    }
  }
</script>
