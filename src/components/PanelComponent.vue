<script setup>
  import MainGraphButtonsComponent from '@main/MainGraphButtonsComponent.vue'
  import MainResizeBarComponent from '@main/MainResizeBarComponent.vue'
  import NavBarComponent from '@panel/NavBarComponent.vue'
  import PanelPanes from '@panel/PanelPanes.vue'
  import { 
    appStates,
    panelStates,
    store 
  } from '@/stores/store.js'
  import { setFocus, openField } from '@mixins/helpers'
  import * as d3 from 'd3'
</script>

<template>

  <div id="panel-body">
    <main-graph-buttons-component 
      v-if="this.$attrs.type == 'main'">
    </main-graph-buttons-component>

    <main-resize-bar-component 
      v-if="this.$attrs.type == 'main'">
    </main-resize-bar-component>

    <nav-bar-component :type="this.$attrs.type">
      <!-- v-if="this.$attrs.type == 'main'"> -->
    </nav-bar-component>

    <panel-panes :type="this.$attrs.type"></panel-panes>
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
    mounted () {
      d3.select("#panel-body").transition().duration(200).ease(d3.easeLinear).style("width", "350px")//.style("min-width", "270px")
      setFocus('search')
      // helpers.openField()
      panelStates.currentFocus = 'empty'
    }
  }
</script>

<style scoped lang="scss">
  #panel-body {
    height: 100vh;
    width: 0px;
    min-width: 300px;
    display: grid;
    grid-template-columns: 30px 1fr 30px;
    grid-template-rows: 2vh 1.8em 4vh 10fr 1vh 4fr 4vh;
    grid-template-areas:
      "resize-bar flash ."
      "resize-bar navbar navbar"
      "resize-bar . ."
      "resize-bar panel-panes ."
      "resize-bar . ."
      "resize-bar . ."
      "resize-bar . .";
    background: $panel-body-grey;

    
    position: absolute;

    
    top: 0px;
    // simply by turning this off, we can float the panel to the left
    // still have to account for everything else though...
    right: 0px;
    left: null;
    z-index: 2;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }
</style>
