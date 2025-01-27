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

  <div class="mobile" id="mobile-panel-body" v-if="$attrs.isMobile">
    <img class="chevron" src="/chevron.svg" id="mobile-resizer"/>
    <nav-bar-component :type="$attrs.type"></nav-bar-component>
    <panel-panes :type="$attrs.type"></panel-panes>
  </div>

</template>

<script>
  export default {
    name: "MobilePanelComponent",
    components: {
      MainGraphButtonsComponent,
      MainResizeBarComponent,
      NavBarComponent,
      PanelPanes
    },
    data () {
      return {
        expanded: true
      }
    },
    computed: {
      showButtons () {
        return graphStates.existing.length > 0
      }
    },
    created () {
    },
    mounted () {
      d3.select("#mobile-resizer").on("click", (e) => {
        this.resize(e)
      })

      setFocus('search')
      panelStates.currentFocus = 'empty'
    },
    methods: {
      resize(e) {
        if (this.expanded) {
          d3.select("#mobile-panel-body").transition()
          .delay(300)
          .duration(200)
          .style("height", "40vh")
          d3.select(e.srcElement).transition().duration(200).style("transform", "rotate(90deg)")
          this.expanded = false

        } else {
          d3.select("#mobile-panel-body").transition()
          .delay(300)
          .duration(200)
          .style("height", "80vh")
          d3.select(e.srcElement).transition().duration(200).style("transform", "rotate(270deg)")
          this.expanded = true
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  #mobile-resizer {
    grid-area: mr;
    margin: 15px auto 0;
    transform: rotate(270deg);
  }

  #mobile-panel-body {
    position: absolute;
    bottom: 0px;
    width: 100vw;
    height: 80vh;
    display: grid;
    grid-template-columns: 5% 90% 5%;
    grid-template-rows: 40px 27px 10fr 1fr;
    grid-template-areas:
      ". mr    ."
      ". navbar navbar"
      ". panel-panes ."
      " . . .";
    background: $panel-body-grey;
    z-index: 2;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }
</style>
