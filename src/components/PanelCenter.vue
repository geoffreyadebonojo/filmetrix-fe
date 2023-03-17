<script setup>
  import SearchResult from './SearchResult.vue'
  import Details from './Details.vue'
  import CommandsContainer from './Commands.vue'
  import AboutContainer from './about/AboutContainer.vue'
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
  
  <div v-else-if="store.currentFocus === 'about'">
    <!-- <AboutContainer /> -->
  </div>

  <div v-else-if="store.currentFocus === 'empty'" id="empty-field" @click="$event => focusSearchBar()">
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
    height: 100%
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