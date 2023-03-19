<script setup>
  import SearchResult from './SearchResult.vue'
  import Details from './Details.vue'
  import CommandsContainer from './Commands.vue'
  import { store } from '@/stores/store.js'
</script>

<template>
  <div v-if="store.currentFocus === 'details' && store.currentDetailId !== false" class="details-component">
    <!-- use search result data? later -->
    <Details />
  </div>
  
  <div v-else-if="store.currentFocus === 'commands'" id="commands-container">
    <CommandsContainer />
  </div>
  
  <div id="empty-field" v-else-if="store.currentFocus === 'empty'" @click="$event => focusSearchBar()">
    <div id="search-prompt">
      <p >search for a movie or actor.</p>
      <p style="margin-top:40px">please.</p>
    </div>
  </div>

  <div v-else class="result-component">
    <SearchResult />
  </div>
  
</template>

<style>
  .result-component {
    height: 100%;
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
  }
</style>

<script>
  export default {
    name: "PanelCenter",
    data () {
      return {
        currentDetailSubjectId: ''
      }
    },
    methods: {
      focusSearchBar() {
        document.querySelector('#search-text').focus()
      }
    }
  }
</script>