<script setup>
  import AboutDetailsComponent from '@panel/AboutDetailsComponent.vue'
  import DetailsComponent from '@panel/sections/DetailsComponent.vue'
  import CommandsComponent from '@panel/sections/CommandsComponent.vue'
  
  import GamePromptComponent from '@panel/GamePromptComponent.vue'
  import MainPromptComponent from '@panel/MainPromptComponent.vue'
  
  import SearchResultComponent from '@panel/sections/SearchResultComponent.vue'
  import NavArrowsComponent from '@panel/NavArrowsComponent.vue'

  import api from '@/mixins/api'
  import helpers from '@/mixins/helpers'
  import focusHelper from '@/mixins/focusHelper'
  import graph from '@/mixins/graph'
  import { store } from '@/stores/store.js'
  import * as d3 from 'd3'
</script>

<template>
  <div id="panel-center" style="height:142%;zoom:100%">
   
    <about-details-component v-if="store.displayingAbout" class="about-details"></about-details-component>
    <details-component v-else-if="store.currentFocus === 'details' && store.currentDetailId !== false" class="details-component"></details-component>
    <commands-component v-else-if="store.currentFocus === 'commands'"></commands-component>
    
    <div id="empty-field" v-else-if="store.currentFocus === 'empty'">
      <game-prompt-component v-if="this.$attrs.type == 'game'"></game-prompt-component>
      <main-prompt-component v-else-if="this.$attrs.type == 'main'"></main-prompt-component>
    </div>

    <search-result-component v-else class="result-component"></search-result-component>
    <nav-arrows-component v-if="this.$attrs.type == 'main'"></nav-arrows-component>

  </div>
</template>

<script>
  export default {
    name: "PanelCenter",
    components: {
      AboutDetailsComponent,
      DetailsComponent,
      CommandsComponent,
      GamePromptComponent,
      MainPromptComponent,
      SearchResultComponent,
      NavArrowsComponent
    }
  }
</script>

<style scoped lang="scss">
  #panel-center {
    grid-area: panel-center;
    overflow-y: auto;
    
    #empty-field {
      height: 100%;
    }
    
    .result-component {
      height: 100%;
      right: 100%;
    }  
  }
</style>
