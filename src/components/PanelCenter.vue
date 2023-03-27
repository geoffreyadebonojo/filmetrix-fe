<script setup>
  import SearchResultComponent from './SearchResultComponent.vue'
  import DetailsComponent from './DetailsComponent.vue'
  import CommandsComponent from './CommandsComponent.vue'
  import { store } from '@/stores/store.js'
  import * as d3 from 'd3'
</script>

<template>
  <div id="panel-center" style="height:142%;zoom:100%">
    <div v-if="store.currentFocus === 'details' && store.currentDetailId !== false" class="details-component">
      <!-- use search result data? later -->
      <details-component></details-component>
    </div>

    <commands-component v-else-if="store.currentFocus === 'commands'"></commands-component>
    
    <div id="empty-field" v-else-if="store.currentFocus === 'empty'" @click="focusSearchBar()">
      <div id="search-prompt">
        <p >search for a movie or actor.</p>
        <p style="margin-top:40px">please.</p>
      </div>
    </div>

    <div v-else class="result-component">
      <search-result-component></search-result-component>
    </div>
  </div>
</template>

<style>
  .result-component {
    height: 100%;
    left: 100%;
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
    margin: 40% 40px;
    text-transform: uppercase;
    font-family: 'Dosis', sans-serif;
    font-weight: 600;
    font-size: 2em;
    text-align: center;
    opacity: 0;
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
        currentDetailSubjectId: ''
      }
    },
    mounted () {
      d3.select("#search-prompt").transition().delay(200).duration(200).style("opacity", 1)
    },
    methods: {
      focusSearchBar() {
        document.querySelector('#search-text').focus()
      }
    }
  }
</script>