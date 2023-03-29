<script setup>
  // import SettingsToggleComponent from './SettingsToggleComponent.vue'

  import { store } from '@/stores/store.js'
  import helpers from '../mixins/helpers.js'
  import graph from '../mixins/graph.js'
</script>

<template>
    <!-- <div class="slidecontainer">
      <input type="range" min="1" max="100" value="50" class="slider" id="myRange">
    </div> -->
  <div id="controls" class="main-panel-component" style="transform: scale(1, 0); bottom: -50%;">
    <div v-if="store.graphTypes.length > 0">
      <div class="checkbox"
        v-for="genre in store.graphTypes"
        :key="genre">
        <div class='sel off' v-bind:id="genre">{{ genre }}</div>
      </div>
    </div>
    <div v-else></div>
    <!-- <div class='sel' id="clear">clear</div> -->

    <!-- <settings-toggle-button></settings-toggle-button> -->

  </div>
</template>

<script>
  export default {
    name: "ControlsComponent",
    components: {
      SettingControlsComponent
    },
    mixins: [helpers, graph],
    methods: {
    // APPEND AFTER GRAPH STOPS MOVING
    //
    // d3.selectAll(".sel").on("click", (e) => {
    //   let data
    //   let nodes =[]
    //   let links =[]

    //   elem = d3.select(`#${e.target.id}`)
    //   if (elem.classed("on")) {
    //     elem.classed("off", true)
    //     elem.classed("on", false)
    //   } else {
    //     elem.classed("off", false)
    //     elem.classed("on", true)
    //   }

    //   store.existing.forEach((d) => {
    //     data = store.graphData[d[0]]
    //     nodes = nodes.concat(data.nodes.slice(0,d[1]+1))
    //     links = links.concat(data.links.slice(0,d[1]+1))
    //   })
      
    //   store.graphTypes =panel helpers.getTypes(nodes)

    //   if (e.target.id == "clear") {
    //     store.appliedFilters = []
    //     d3.selectAll(".sel").classed("off", true)
    //     d3.selectAll(".sel").classed("on", false)
    //   } else {
    //     store.appliedFilters.togglePresence(e.target.id)
    //   }
      
    //   nodes = nodes.uniqueById().filter((d) => {
    //     if (d.type.overlapsWith(store.appliedFilters).length === 0) {
    //       return d.type.excludes(e.target.id) 
    //     } else {
    //       return false
    //     }
    //   })
      
    //   links = links.filter((d) => {
    //     let x = nodes.map((n) => {
    //       return n.id == d.target.id
    //     })
    //     return x.includes(true)
    //   })

    // })
    // .on("mouseenter", (e, f) => {
    //   d3.selectAll(`.${e.target.id}`).nodes().forEach((d) => {
    //     helpers.nodeTransformer(`#${d.id}`, "scale(1.05)", "aliceblue", "white")
    //   })
      
    // }).on("mouseout", (e) => {
    //   d3.selectAll(`.${e.target.id}`).nodes().forEach((d) => {
    //     helpers.nodeTransformer(`#${d.id}`, "scale(1)", helpers.props().strokeColor, "none")
    //   })
    // })
    }
  }
</script>

<style>
  #controls {
    grid-area: controls;
    /* border: 3px dashed black; */
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    transform: scaleY(0);
    position: relative;
    bottom: 0%;
  }
  .sel {
    font-family: $global-font;
  }
  .sel, .off {
    border: solid 1px aliceblue;
    background: none;
    color: aliceblue;
  }
  .sel:hover, .on {
    cursor: pointer;
    border: solid 1px  none;
    background: aliceblue;
    color: #222;
  }
</style>