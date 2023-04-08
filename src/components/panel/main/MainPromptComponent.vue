<script setup>
  import api from '@/mixins/api'
  import { 
    appStates,
    graphStates, 
    panelStates,
    store 
  } from '@/stores/store.js'
  import graph from '@/mixins/graph'
  import { getTypes, setFocus } from '@/mixins/helpers'
  import * as d3 from 'd3'
</script>

<template>
  <div id="search-prompt" @click="focusSearchBar()">
    <p class="apply-effect">search for a movie or actor</p>
  </div>

  <div id="show-you-around-prompt" v-if="$data.newHere">
    <p style="margin:5vh">
      or
    </p>
    <p class="apply-effect">
      have a look around
    </p>
  </div>

  <div id="resume-prompt" v-else-if="$data.hasSavedGraph">
    <p style="margin:5vh">
      or
    </p>
    <router-link to="#details">
      <p class="apply-effect" @click="resume()">
        pick up where you left off
      </p>
    </router-link> 
  </div>

  <div v-else></div>
</template>

<script>
  export default {
    name: "MainPromptComponent",
    data () {
      return {
        currentDetailSubjectId: '',
        hasSavedGraph: false,
        newHere: JSON.parse(localStorage.getItem("newHere"))
      }
    },
    mounted () {
      d3.select("#search-prompt").transition().delay(200).duration(200).style("opacity", 1)
      const saved = JSON.parse(localStorage.getItem("lockedGraph"))
      
      if (saved == null || saved.length == []) {
        this.$data.hasSavedGraph = false
      } else {
        this.$data.hasSavedGraph = true
      }
    },
    methods: {
      focusSearchBar() {
        document.querySelector('#search-text').focus()
      },
      async resume () {
        const saved = localStorage.getItem("lockedGraph")

        store.isLocked = true

        if (saved !== null) {
          graphStates.existing = JSON.parse(saved)
          await api.fetchGraphData(
            graphStates.existing.unique().map(d => d[0])
          )

          await api.fetchDetails(graphStates.existing.last()[0])

          let data
          let nodes = []
          let links = []

          graphStates.existing.forEach((d) => {
            data = graphStates.graphData[d[0]]
            nodes = nodes.concat(data.nodes.slice(0,d[1]+1))
            links = links.concat(data.links.slice(0,d[1]))
          })

          // store.graphTypes = getTypes(nodes)
          panelStates.currentFocus = 'search'

          graph.draw({
            nodes: nodes.uniqueById(),
            links: links,
            type: "main"
          })      

          const lockButton = d3.select("#lock-button")
          lockButton.classed("unlocked", false).classed("locked", true)
          setFocus('details')
        }
      }
    }
  }
</script>

<style scoped lang="scss">
    #search-prompt,
    #show-you-around-prompt, 
    #resume-prompt {
      transform: scale(1);
      
      p {
        opacity: 0.5;
        margin: 4vh 40px;
        text-transform: uppercase;
        font-family: $global-font;
        font-weight: 100;
        font-size: 2em;
        text-align: center;
        &:hover {
          cursor:default
        }
      }
      .apply-effect:hover {
        cursor: $cursor;
        animation-name: pulsate;
        animation-duration: 1.4s;
        animation-iteration-count: infinite;
        animation-timing-function: linear;
      }
    }

    @keyframes pulsate {
    0% {
      transform: scale(1);
      opacity: 0.5;

    }
    50% {
      transform: scale(1.005);
      opacity: 0.8;
    }
    100% {
      transform: scale(1);
      opacity: 0.5;
    }
  }
</style>