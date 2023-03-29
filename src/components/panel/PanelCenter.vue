<script setup>
  import SearchResultComponent from '@panel/sections/SearchResultComponent.vue'
  import DetailsComponent from '@panel/sections/DetailsComponent.vue'
  import CommandsComponent from '@panel/sections/CommandsComponent.vue'
  import api from '@/mixins/api'
  import helpers from '@/mixins/helpers'
  import focusHelper from '@/mixins/focusHelper'
  import graph from '@/mixins/graph'
  import { store } from '@/stores/store.js'
  import * as d3 from 'd3'
</script>


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

<template>
  <div id="panel-center" style="height:142%;zoom:100%">
      <!-- use search result data? later -->
    <details-component class="details-component" v-if="store.currentFocus === 'details' && store.currentDetailId !== false">
    </details-component>

    <commands-component v-else-if="store.currentFocus === 'commands'">
    </commands-component>
    
    <div id="empty-field" v-else-if="store.currentFocus === 'empty'" @click="focusSearchBar()">
      <div id="search-prompt">
        <p class="apply-effect">search for a movie or actor</p>
      </div>

      <div id="show-you-around-prompt" v-if="this.$data.newHere">
        <p style="margin:5vh">
          or
        </p>
        <p class="apply-effect">
          have a look around
        </p>
      </div>

      <div id="resume-prompt" v-else-if="this.$data.hasSavedGraph">
        <p style="margin:5vh">
          or
        </p>
        <router-link to="#details">
          <p class="apply-effect" @click="resume()">
            pick up where you left off
          </p>
        </router-link> 
        <!-- //maybe put saved graph names here -->
      </div>
      <div v-else></div>
    </div>

    <search-result-component v-else class="result-component">
    </search-result-component>
  </div>
</template>

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
      const saved = JSON.parse(localStorage.getItem("savedGraph"))

      if (saved == null || saved.length == []) {
        this.$data.hasSavedGraph = false
      } else {
        this.$data.hasSavedGraph = true
      }
    },
    updated () {
      // debugger
      // oh nice
    },
    methods: {
      focusSearchBar() {
        document.querySelector('#search-text').focus()
      },

      async resume () {
        const saved = localStorage.getItem("savedGraph")

        store.isSaved = true

        if (saved !== null) {
          store.existing = JSON.parse(saved)
          await api.fetchGraphData(
            store.existing.unique().map(d => d[0])
          )

          await api.fetchDetails(store.existing.last()[0])

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

          const savedButton = d3.select("#save-button")
          savedButton.classed("unlocked", false).classed("locked", true)
          focusHelper.methods.set('details')
        }
      }
    }
  }
</script>