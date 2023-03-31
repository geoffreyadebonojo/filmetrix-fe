<script setup>
  import GraphButtonsComponent from '@panel/GraphButtonsComponent.vue'
  import NavBarComponent from '@panel/NavBarComponent.vue'
  import PanelCenter from '@panel/PanelCenter.vue'
  import ResizeBarComponent from '@panel/ResizeBarComponent.vue'
  import focusHelper from "@/mixins/focusHelper"
  import { store } from '@/stores/store.js'
  import * as d3 from 'd3'
</script>

<template>
  <div id="panel-body">
    <graph-buttons-component></graph-buttons-component>
    <resize-bar-component></resize-bar-component>
    <nav-bar-component></nav-bar-component>
    <panel-center></panel-center>
  </div>
</template>

<script>
  export default {
    name: "PanelComponent",
    components: {
      GraphButtonsComponent,
      ResizeBarComponent,
      NavBarComponent,
      PanelCenter
    },
    data () {
      return {
        transitionTimer: 500
      }
    },
    mounted () {
      d3.select("#panel-body").transition().duration(200).ease(d3.easeLinear).style("width", "350px").style("min-width", "270px")
      focusHelper.methods.set('search')
      focusHelper.methods.openField()
      store.currentFocus = 'empty'
    }
  }
</script>

<style scoped lang="scss">
  #panel-body {
    height: 100vh;
    width: 0px;
    display: grid;
    grid-template-columns: 30px 1fr 30px;
    grid-template-rows: 2vh 1.8em 4vh 10fr 1vh 4fr 4vh;
    grid-template-areas:
      "resize-bar flash ."
      "resize-bar navbar navbar"
      "resize-bar . ."
      "resize-bar panel-center ."
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
