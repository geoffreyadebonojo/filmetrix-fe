<script setup>
  import {
    graphStates,
    panelStates,
    userStates
  } from '@/stores/store.js'
  import Draggable from 'vuedraggable'
  import api from '@/mixins/api'
  import * as d3 from "d3"
  import GraphManager from "@/models/GraphManager.js"
</script>

<template>
  <div id="graph-stacks">
    <draggable id="my-graphs-list"
      :list="$data.graphList"
      :disabled="!enabled"
      item-key="stack"
      @start="dragging=true"
      @end="dragEnd($event)"
      v-bind="dragOptions">

      <template #item="{ element }" >
        <div class="stack collapsed" v-bind:id="'group-' + element.slug" @click="toggleExpand($event)">
          <div v-for="(poster, i) in element.posters" :style="{ 'z-index': i, 'right': i*$data.posterOffset+'px' }" class="poster">
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
    computed: {
      dragOptions() {
        return {
          animation: 300,
          disabled: false,
          ghostClass: "ghost",
          removeCloneOnHide: true,
          revertClone: true
          // forceFallback: false,  // ignore the HTML5 DnD behaviour and force the fallback to kick in
          // fallbackClass: "sortable-fallback",  // Class name for the cloned DOM Element when using forceFallback
          // fallbackOnBody: false,  // Appends the cloned DOM Element into the Document's Body
        };
      }
    },
    methods: {
      async dragEnd(e) {
        const w = window.innerWidth - panelStates.width
        const dx = e.originalEvent.clientX
        this.$data.dragging = false

        if (dx < w) {
          // dupe in graphcomponent & MovieList
          await api.findBySlug(e.item.id.split("-")[1])
          new GraphManager().generate()
        }
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
    .ghost {
      opacity: 0;
    }

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