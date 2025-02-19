<script setup>
  import {
    panelStates,
    graphStates
  } from '@/stores/store.js'
  import GraphManager from "@/models/GraphManager.js"
  import api from "@mixins/api"
  import LoadingScreen from "@/components/LoadingScreen.vue"
</script>

<template>
  <div class="graph-container" v-bind:id="$attrs.type + '-graph-component'">
    <svg class="graph-container" v-bind:id="$attrs.type + '-graph-container'" v-bind:viewBox="$data.vb">
      <g class="outer-wrapper" v-bind:id="$attrs.type + '-outer-wrapper'">
        <g id="main-inner-wrapper">
          <g v-if="graphStates.existing.length > 0">
            <text id="loading">loading...</text>
          </g>
        </g>
      </g>
    </svg>
  </div>
</template>

<script>
  export default {
    name: "GraphComponent",
    components: {
      LoadingScreen
    },
    data() {
      return {
        vb: `${-350} ${-window.innerHeight/2} ${window.innerWidth*2} ${window.innerHeight*2}`
      }
    },

    created () {
      const gid = this.$route.query.gid
      if (gid == null) { return }
      this.loadFromSlug(gid)
    },
    
    methods: {
      loadFromSlug (gid) {        
        api.findBySlug(gid)
        new GraphManager().generate()
      }
    }
  }
</script>

<style lang="scss">
  #loading {
    font-family: $global-font;
    font-size: 50px;
    fill: white;
    stroke: white;
    stroke-width: 0.8px;
    opacity: 0;
    text-anchor: middle;

    animation-name: pulseLoading;
    animation-duration: 1s;
    animation-iteration-count: infinite;
  }

  @keyframes pulseLoading {
    0% {
      stroke: white;
      fill: white;
      transform: translate(500px, 300px) scale(1);
    }

    50% {
      stroke: skyblue;
      fill: skyblue;
      transform: translate(500px, 300px) scale(1.1);
    }

    100% {
      stroke: white;
      fill: white;
      transform: translate(500px, 300px) scale(1);
    }
  }

  .graph-container {
    display: block;
    width: 100%;

    .dragging {
      circle {
        stroke: red;
      }
    }

    .hover {
      .outline {
        stroke: white;
      }

      .node-label {
        .text-container {
          stroke: white;
        }
      }
    }

    .alt-hover {
      .outline, 
      .node-label, 
      .text-container {
        // stroke: rgb(241, 241, 156);
        stroke-width: 1.2;
      }

      .node-label {
        stroke: none;
      }
    }

    .root {
      .outline, 
      .node-label, 
      .text-container {
        stroke: red;
      }

      .node-label {
        stroke: none;
      }
    }

    .poster-highlight {
      .outline {
        stroke: white;
        stroke-width: 1.4;
      }

      .node-label {
        .text-container {
          stroke: white;
        }
      }
    }


    .shift-hover {
      .outline, 
      .node-label, 
      .text-container {
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
