<script setup>
  import ResultContainer from './ResultContainer.vue'
  import DetailsContainer from './DetailsContainer.vue'
  import CommandsContainer from './CommandsContainer.vue'
  import { store } from '@/stores/store.js'
</script>

<template>
  <div v-if="store.currentFocusocus === 'details'">
    <!-- use search result data? later -->
    <DetailsContainer />
  </div>
  
  <div v-else-if="store.currentFocusocus === 'commands'">
    <CommandsContainer />
  </div>
  
  <div v-else-if="store.currentFocusocus === 'about'">
    about
  </div>

  <div v-else="store.currentFocusocus === 'empty'">
    empty
  </div>

  <div v-else class="result-component">
    <ResultContainer />
  </div>
  
</template>

<style>
  .result-component {
    height: 100%;
  }
</style>

<script>
  export default {
    name: "PanelCenter",
    data () {
      return {
        currentDetailSubjectId: ''
      }
    }
  }
</script>