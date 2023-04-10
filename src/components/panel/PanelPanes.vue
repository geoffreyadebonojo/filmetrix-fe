<script setup>
  import { 
    appStates,
    graphStates,
    panelStates,
    store 
  } from '@/stores/store.js'

  import DetailsComponent from '@panes/DetailsComponent.vue'
  import CommandsComponent from '@panes/CommandsComponent.vue'
  import SearchResultComponent from '@panes/SearchResultComponent.vue'
  import UserSettingsComponent from '@panes/UserSettingsComponent.vue'
  import MainPromptComponent from '@main/MainPromptComponent.vue'
  import MainNavArrowsComponent from '@main/MainNavArrowsComponent.vue'
  import GamePromptComponent from '@game/GamePromptComponent.vue'
  import AboutDetailsComponent from '@about/AboutDetailsComponent.vue'
</script>

<template>
  <div id="panel-panes" style="height:142%;zoom:100%">
   
    <about-details-component v-if="appStates.displayingAbout" class="about-details"></about-details-component>
    <details-component v-else-if="panelStates.currentFocus === 'details' && graphStates.currentDetailId !== false" class="details-component"></details-component>
    <commands-component v-else-if="panelStates.currentFocus === 'commands'"></commands-component>
    <user-settings-component v-else-if="panelStates.currentFocus === 'settings'"></user-settings-component>

    <div id="empty-field" v-else-if="panelStates.currentFocus === 'empty'">
      <game-prompt-component v-if="this.$attrs.type == 'game'"></game-prompt-component>
      <main-prompt-component v-else-if="this.$attrs.type == 'main'"></main-prompt-component>
    </div>

    <search-result-component v-else class="result-component"></search-result-component>
    <main-nav-arrows-component v-if="this.$attrs.type == 'main'"></main-nav-arrows-component>

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
      MainNavArrowsComponent
    }
  }
</script>

<style scoped lang="scss">
  #panel-panes {
    grid-area: panel-panes;
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
