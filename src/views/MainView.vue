<script setup>
  import PanelComponent from '@components/PanelComponent.vue'
  import GraphComponent from '@components/GraphComponent.vue'
  import AboutComponent from '@components/AboutComponent.vue'

  // import { setFocus } from '@/mixins/helpers'

  import * as d3 from 'd3'
</script>

<template>
  <div id="viewer-body">
    <graph-component :type="'main'"></graph-component>
    <panel-component :type="'main'"></panel-component>
    <about-component></about-component>
  </div>
</template>

<script>
  export default {
    name: 'MainView',
    data () {
      return {
        type: 'main'
      }
    },
    components: {
      GraphComponent,
      PanelComponent,
      AboutComponent
    },
    mounted () {
      let isMobile = /Android|iPhone/i.test(navigator.userAgent)
      if (isMobile) {
        d3.select('#zoom-buttons').style('display', 'flex')
      } 

      // const focus = this.$route.hash.replace("#", "")
      // setFocus(focus)
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