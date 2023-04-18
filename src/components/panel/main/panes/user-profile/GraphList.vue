<script setup>
  import {
    graphStates,
    panelStates,
    userStates
  } from '@/stores/store.js'
  import Draggable from 'vuedraggable'
  import api from '@/mixins/api'
  import * as d3 from "d3"
  import graph from "@/mixins/graph"
</script>

<template>
  <div id="graph-stacks">

    <draggable id="my-graphs-list"
      :list="this.$data.graphList"
      :disabled="!enabled"
      item-key="stack"
      @start="dragging=true"
      @end="dragEnd($event)">

      <template #item="{ element }" 
                @click="toggleExpand($event)">
        <div class="stack collapsed" v-bind:id="element.slug">
          <div v-for="(poster, i) in element.posters" :style="{ 'z-index': i, 'right': i*this.$data.posterOffset+'px' }" class="poster">
            <img v-bind:src="poster"/>
          </div>
        </div>
      </template>
    </draggable>

  </div>
</template>

<script>
  export default {
    name: "GraphStacks",
    data () {
      return {
        posterOffset: 50,
        enabled: true,
        dragging: false,
        graphList: userStates.userGraphList
      }
    },
    components: {
      Draggable
    },
    methods: {
      async dragEnd(e) {
        const w = window.innerWidth - panelStates.width
        const dx = e.originalEvent.clientX
        this.$data.dragging = false
        
        if (dx < w) {

          // dupe in graphcomponent

          await api.findBySlug(e.item.id)


          let data
          let nodes = []
          let links = []

          graphStates.existing.forEach((d) => {
            data = graphStates.graphData[d[0]]
            nodes = nodes.concat(data.nodes.slice(0,d[1]+1))
            links = links.concat(data.links.slice(0,d[1]))
          })

          graph.draw({
            nodes: nodes.uniqueById(),
            links: links,
            type: "main"
          })

        }

      },
      checkMove: function(e) {
        // window.console.log(e.draggedContext);
      },
      toggleExpand(e) {
        const stack = d3.select(e.currentTarget)
        if (stack.classed("collapsed")) {
          stack.selectAll('div').transition().duration(200).style("right", "0px")
          stack.style("overflow-x", "scroll")
          stack.classed("collapsed", false)
        } else {
          stack.selectAll('div').transition().duration(200).style("right", (_d, i, l) => {
           return `${i*this.$data.posterOffset}px`
          })
          stack.style("overflow-x", "hidden")
          stack.classed("collapsed", true)
        }
      },
    }
  }
</script>

<style scoped lang="scss">

  #graph-stacks {

    .stack {
      display: flex; 
      margin: 10px 0;
      width: 100%;
      height: 100px;
      overflow-x: scroll;
      cursor: $cursor;

      .poster {
        position: relative;
        // height: 100px;
        // width: 74px;
        height: 81.75px;
        width: 54.75px;

        border-radius: 5px;
        box-shadow: 0 0px 11px 0 rgba(0, 0, 0, 0.2), 0px 0px 0px 0 rgba(0, 0, 0, 0.19);
        
        img {
          border-radius: 5px;
          height: 100%
        }
      }
    }
  }
</style>