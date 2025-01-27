<script setup>
  import MainGraphButtonsComponent from '@main/graph-buttons/MainGraphButtonsComponent.vue'
  import PanelPanes from '@main/panel-body/PanelPanes.vue'
  import NavBarComponent from '@main/panel-body/NavBarComponent.vue'
  import MainResizeBarComponent from '@main/panel-utils/MainResizeBarComponent.vue'
  import { 
    appStates,
    panelStates,
    graphStates,
    store 
  } from '@/stores/store.js'
  import { setFocus, openField } from '@mixins/helpers'
  import * as d3 from 'd3'
</script>

<template>

  <div id="panel-body" v-if="$attrs.isMobile">
    <main-graph-buttons-component 
      v-if="$attrs.type == 'main' && showButtons">
    </main-graph-buttons-component>

    <main-resize-bar-component 
      v-if="$attrs.type == 'main'">
    </main-resize-bar-component>

    <nav-bar-component :type="$attrs.type">
    </nav-bar-component>

    <panel-panes :type="$attrs.type"></panel-panes>
  </div>

</template>

<script>
  export default {
    name: "PanelComponent",
    components: {
      MainGraphButtonsComponent,
      MainResizeBarComponent,
      NavBarComponent,
      PanelPanes
    },
    computed: {
      showButtons () {
        return graphStates.existing.length > 0
      }
    },
    mounted () {
      d3.select("#panel-body").transition().duration(200).ease(d3.easeLinear).style("width", "300px")//.style("min-width", "270px")
      setFocus('search')

      panelStates.currentFocus = 'empty'
    }
  }
</script>

<style scoped lang="scss">
  #panel-body {
    height: 100vh;
    width: 0px;
    min-width: 300px;

    &.mobile {
      min-width: 10vw;
      max-width: 90vw;
    }

    display: grid;
    grid-template-columns: 30px 1fr 27px;
    grid-template-rows: 2vh 28px 10fr 5vh;
    grid-template-areas:
      "resize-bar flash ."
      "resize-bar navbar navbar"
      "resize-bar panel-panes ."
      "resize-bar . ."
      "resize-bar . ."
      "resize-bar . .";
    background: $panel-body-grey;
    position: absolute;
    top: 0px;
    right: 0px;
    left: null;
    z-index: 2;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }
</style>
