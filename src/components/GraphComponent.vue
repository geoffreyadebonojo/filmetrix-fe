<script setup>
  import {
    panelStates
  } from '@/stores/store.js'
  import GraphManager from "@/models/GraphManager.js"
  import api from "@mixins/api"
</script>

<template>
  <div class="graph-container" v-bind:id="$attrs.type + '-graph-component'">
    <svg class="graph-container" v-bind:id="$attrs.type + '-graph-container'" v-bind:viewBox="$data.vb">
      <g class="outer-wrapper" v-bind:id="$attrs.type + '-outer-wrapper'">
      </g>
    </svg>
  </div>
</template>

<script>
  export default {
    name: "GraphComponent",
    data() {
      return {
        vb: `${-350} ${-window.innerHeight/2} ${window.innerWidth*2} ${window.innerHeight*2}`
      }
    },

    async created () {
      const gid = this.$route.query.gid
      if (gid == null) { return }
      await this.loadFromSlug(gid)
    },
    
    methods: {
      async loadFromSlug (gid) {
        await api.findBySlug(gid)
        new GraphManager().generate()
      }
    }
  }
</script>

<style lang="scss">
  .graph-container {
    display: block;
    width: 100%;

    .hover {
      .outline, 
      .node-label, 
      .text-container {

      .node-label {
        // fill: lightgreen;
        stroke: none;
      }
      }
    }

    .alt-hover {
      .outline, .node-label, .text-container {
        stroke: rgb(241, 241, 156);
      }

      .node-label {
        stroke: none;
      }
    }

    .root {
      .outline, .node-label, .text-container {
        stroke: red;
      }

      .node-label {
        stroke: none;
      }
    }

    .poster-highlight {
      .outline, .node-label, .text-container {
        stroke: gold;
        stroke-width: 2;
      }

      .node-label {
        stroke: none;
      }
    }


    .shift-hover {
      .outline, .node-label, .text-container {
        stroke: rgba(22, 99, 187, 0.634);

        animation-name: pulse;
        animation-duration: 0.75s;
        animation-iteration-count: infinite;
        animation-timing-function: linear;
      }

      .node-label {
        stroke: none;
      }
    }
    
    .visited {
      .outline {
        stroke: #65a765;
        stroke-width: 1.2;
      }

      .node-label {
        fill: lightgreen;
        stroke: none;
      }
    }
  }

  @keyframes pulse {
    0% {
      stroke-width: 1,
    }
    50% {
      stroke-width: 3,
    }
    100% {
      stroke-width: 1,
    }
  }

  .inst {
    animation-name: rotateLabel;
    animation-duration: 8s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
  }

  .node {
    &:focus {
      outline: none;
    }
    &:hover {
      cursor: $cursor;
    }
    &.scissors:hover {
      cursor: $scissors;
    }
  }

  @keyframes rotateLabel {
    0% {
      transform: rotate(0deg);
    } 
    100% {
      transform: rotate(-360deg);
    }
  }
</style>
