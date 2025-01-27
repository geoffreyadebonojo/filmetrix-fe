<script setup>
  import { 
    appStates,
    panelStates
  } from '@/stores/store.js'
  import { closeField, openField } from '@mixins/helpers'
  import AboutDetailsComponent from  '@about/AboutDetailsComponent.vue'
  import MainNavArrowsComponent from '@main/panel-utils/MainNavArrowsComponent.vue'
  import CommandsComponent from      '@panes/commands/CommandsComponent.vue'
  import DetailsComponent from       '@panes/details/DetailsComponent.vue'
  import MainPromptContainer from    '@panes/prompts/MainPromptContainer.vue'
  import SearchResultsComponent from '@panes/search-results/SearchResultsComponent.vue'
  import UserProfileComponent from   '@panes/user-profile/UserProfileComponent.vue'
  import * as d3 from 'd3'
</script>

<template>
  <div id="panel-panes" style="zoom:100%">

    <about-details-component v-if="appStates.displayingAbout">
    </about-details-component>
    
    <details-component 
      v-else-if="panelStates.currentFocus === 'details' && 
      panelStates.detailsData?.id != null"
      v-bind:class="isMobile ? 'mobile-details-component' : 'details-component'">
    </details-component>
    
    <commands-component 
      v-else-if="panelStates.currentFocus === 'commands'">
    </commands-component>
    
    <user-profile-component 
      v-else-if="panelStates.currentFocus === 'profile'">
    </user-profile-component>
    
    <!-- <main-prompt-container
      v-else-if="panelStates.currentFocus === 'empty'"
      id="empty-field">
    </main-prompt-container> -->
    
    <search-results-component v-else>
    </search-results-component>
    
    <main-nav-arrows-component v-if="$attrs.type == 'main'">
    </main-nav-arrows-component>

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
    },
    data () {
      return {
        isMobile: /Android|iPhone/i.test(navigator.userAgent)
      }
    },
    computed: {
      resultsFocus: () => {
        const resultTypes = ["person", "movie", "tv"]
        return resultTypes.includes(panelStates.currentFocus)
      }
    },
    // updated () {
    //   if (this.isMobile) {
    //     // this.handleMobileTransition()
    //   }
    // },
    // methods: {
    //   handleMobileTransition() {
    //     if (panelStates.currentFocus == "details") {
    //       d3.select("#mobile-panel-body").style("height", "80vh")
    //                                      .transition()
    //                                      .duration(400)
    //                                      .style("height", "40vh")
    //     }
    //   }
    // }
  }
</script>

<style scoped lang="scss">
  #panel-panes {
    grid-area: panel-panes;
    overflow-x: hidden;
    overflow-y: scroll;
    
    #empty-field {
      height: 100%;
    }
  }
</style>
