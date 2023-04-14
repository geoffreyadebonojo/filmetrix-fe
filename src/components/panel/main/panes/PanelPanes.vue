<script setup>
  import { 
    appStates,
    graphStates,
    panelStates,
    store 
  } from '@/stores/store.js'

  import AboutDetailsComponent from  '@about/AboutDetailsComponent.vue'
  import MainNavArrowsComponent from '@main/panel-utils/MainNavArrowsComponent.vue'

  import CommandsComponent from      '@panes/commands/CommandsComponent.vue'
  import DetailsComponent from       '@panes/details/DetailsComponent.vue'
  import MainPromptContainer from    '@panes/prompts/MainPromptContainer.vue'
  import SearchResultsComponent from '@panes/search-results/SearchResultsComponent.vue'
  import UserProfileComponent from   '@panes/user-profile/UserProfileComponent.vue'
</script>

<template>
  <div id="panel-panes" style="height:142%;zoom:100%">
   
    <about-details-component v-if="appStates.displayingAbout" class="about-details"></about-details-component>
    <details-component v-else-if="panelStates.currentFocus === 'details' && panelStates.detailsData.id != null" class="details-component"></details-component>
    <commands-component v-else-if="panelStates.currentFocus === 'commands'"></commands-component>
    <user-profile-component v-else-if="panelStates.currentFocus === 'profile'"></user-profile-component>

    <div id="empty-field" v-else-if="panelStates.currentFocus === 'empty'">
      <main-prompt-container></main-prompt-container>
    </div>

    <search-results-component v-else class="result-component"></search-results-component>
    <main-nav-arrows-component v-if="this.$attrs.type == 'main'"></main-nav-arrows-component>

  </div>
</template>

<script>
  export default {
    name: "PanelCenter",
    components: {
      AboutDetailsComponent,
      CommandsComponent,
      DetailsComponent,
      MainPromptContainer,
      SearchResultsComponent,
      UserProfileComponent,
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
      // height: 100%;
      right: 100%;
    }  
  }
</style>
