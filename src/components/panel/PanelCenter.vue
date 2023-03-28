<script setup>
  import SearchResultComponent from '@panel/sections/SearchResultComponent.vue'
  import DetailsComponent from '@panel/sections/DetailsComponent.vue'
  import CommandsComponent from '@panel/sections/CommandsComponent.vue'
  import api from '@/mixins/api'
  import helpers from '@/mixins/helpers'
  import graph from '@/mixins/graph'
  import { store } from '@/stores/store.js'
  import * as d3 from 'd3'
</script>

<template>
  <div id="panel-center" style="height:142%;zoom:100%">
      <!-- use search result data? later -->
    <details-component class="details-component" v-if="store.currentFocus === 'details' && store.currentDetailId !== false">
    </details-component>

    <commands-component v-else-if="store.currentFocus === 'commands'">
    </commands-component>
    
    <div id="empty-field" v-else-if="store.currentFocus === 'empty'" @click="focusSearchBar()">
      <div id="search-prompt">
        <p>search for a movie or actor.</p>
        <p style="margin-top:40px">please.</p>
        <div v-if="this.$data.newHere">
          <p style="margin-top:40px">
            if you're new here, i can show you around
          </p>
        </div>
        <div id="resume-prompt" v-else-if="this.$data.hasSavedGraph" @click="resume()">
          <p style="margin-top:40px">
          or<br>
          pick up where you left off</p>

          //maybe put saved graph names here
        </div>
        <div v-else></div>
      </div>
    </div>

    <search-result-component v-else class="result-component">
    </search-result-component>
  </div>
</template>

<style scoped lang="scss">
  .result-component {
    height: 100%;
    right: 100%;
  }  
  .details-component {
    height: 100%;
    width: 100%;
  }
  #empty-field {
    height: 100%;
    display: flex;
  }
  #search-prompt {
    margin: 4vh 40px;
    text-transform: uppercase;
    font-family: 'Dosis', sans-serif;
    font-weight: 600;
    font-size: 2em;
    text-align: center;
    opacity: 0;
  }
  #resume-prompt {
    transform: scale(1);
    
    p {
      font-weight: 600;

      &:hover {
        cursor: pointer;
        animation-name: pulsate;
        animation-duration: 1.5s;
        animation-iteration-count: infinite;
        animation-timing-function: linear;
      }
    }
  }

  @keyframes pulsate {
    0% {
      transform: scale(1);
      font-weight: 100
    }
    50% {
      transform: scale(1.05);
      font-weight: 900
    }
    100% {
      transform: scale(1);
      font-weight: 100
    }
  }


  @media screen and (max-width: 400px) {
    .details-component {
      padding: 2%;
    }
  }

  #panel-center {
    grid-area: panel-center;
    overflow-y: auto;
  }
</style>

<script>
  export default {
    name: "PanelCenter",
    components: {
      SearchResultComponent,
      DetailsComponent,
      CommandsComponent
    },
    data () {
      return {
        currentDetailSubjectId: '',
        hasSavedGraph: false,
        newHere: JSON.parse(localStorage.getItem("newHere"))
      }
    },
    mounted () {
      d3.select("#search-prompt").transition().delay(200).duration(200).style("opacity", 1)
      const saved = localStorage.getItem("savedGraph")
      if (saved !== null) {
        this.$data.hasSavedGraph = true
      }
    },
    methods: {
      focusSearchBar() {
        document.querySelector('#search-text').focus()
      },

      async resume () {
        const saved = localStorage.getItem("savedGraph")

        if (saved !== null) {
          store.existing = JSON.parse(saved)
          await api.fetchGraphData(
            store.existing.unique().map(d => d[0])
          )

          let data
          let nodes = []
          let links = []

          store.existing.forEach((d) => {
            data = store.graphData[d[0]]
            nodes = nodes.concat(data.nodes.slice(0,d[1]+1))
            links = links.concat(data.links.slice(0,d[1]))
          })

          store.graphTypes =  helpers.getTypes(nodes)
          store.currentFocus = 'search'

          graph.methods.draw({
            nodes: nodes.uniqueById(),
            links: links
          })      
        }
      }
    }
  }
</script>