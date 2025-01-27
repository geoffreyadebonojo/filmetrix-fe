<script setup>
  import PanelComponent from '@components/PanelComponent.vue'
  import MobilePanelComponent from '@components/MobilePanelComponent.vue'
  import GraphComponent from '@components/GraphComponent.vue'
  import AboutComponent from '@components/AboutComponent.vue'

  import { 
    appStates, 
  } from '@/stores/store.js'

  import * as d3 from 'd3'
</script>

<template>
  <div id="viewer-body">
    <mobile-panel-component :type="'main'" :isMobile="isMobile">
    </mobile-panel-component>

    <graph-component :type="'main'"></graph-component>

    <panel-component :type="'main'" :isMobile="!isMobile">
    </panel-component>

    <about-component></about-component>
  </div>
</template>

<script>
  export default {
    name: 'MainView',
    data () {
      return {
        type: 'main',
        isMobile: /Android|iPhone/i.test(navigator.userAgent)
      }
    },
    components: {
      GraphComponent,
      PanelComponent,
      MobilePanelComponent,
      AboutComponent
    },
    mounted () {
      if (this.isMobile) {
        d3.select('#zoom-buttons').style('display', 'flex')
      } 
    }
  }
</script>

<style scoped lang="scss">
  #viewer-body {
    display: flex;
    height: 100vh;
    overflow: hidden;
  }
  #instructions {
    position : absolute;
    top: 40%;
    right: 0%;
    z-index: 2
  }
  .graph-container {
    &:first-of-type {
      width: 100%
    }
    &:last-of-type {
      width: 0%
    }
  }

</style>