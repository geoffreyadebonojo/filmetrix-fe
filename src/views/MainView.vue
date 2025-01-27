<script setup>
  import PanelComponent from '@components/PanelComponent.vue'
  import MobilePanelComponent from '@components/MobilePanelComponent.vue'
  import GraphComponent from '@components/GraphComponent.vue'
  import AboutComponent from '@components/AboutComponent.vue'

  import { 
    appStates, 
  } from '@/stores/store.js'
  // import { setFocus } from '@/mixins/helpers'

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
      
      // WIP
      const counter = d3.select("#main-graph-component")
        .append("g")
        .attr("id", "count-holder")
        .style("position", "absolute")
        .style("color", "red")
        .style("left", "20px")
        .style("top", "20px")
        .style("width", "20px")
        .style("height", "20px")
        
      counter.append("text")
        .text("")

      d3.select("body")
      .on("keydown", function(event) {
        if (event.key === "Shift") {

          if (!appStates.shiftKeyIsPressed) {
            appStates.shiftKeyIsPressed = true;
            // counter.text(() => {
            //   return appStates.nodeAddCount
            // })
            // console.log(appStates.shiftKeyIsPressed)
          }
        }
      })
      .on("keyup", function(event) {
        appStates.shiftKeyIsPressed = false;
        // console.log(appStates.shiftKeyIsPressed)
        // d3.select("#count-holder").remove()
      });
      // WIP

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

    #counter-holder {
      // font-family: $global-font
      // position: absolute;
      // font-size: 20px;
      // font-weight: normal;
      // color: red;
      // left: 20px;
      // top: 20px;
      // width: 20px;
      // height: 20px;
    }
  }

</style>