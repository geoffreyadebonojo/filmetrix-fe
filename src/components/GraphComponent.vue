<script setup>
  import { 
    appStates,
    graphStates,
    panelStates
  } from '@/stores/store.js'
  import { getTypes } from "@mixins/helpers"
  import api from "@mixins/api"
  import graph from "@mixins/graph"
  import GraphManager from "@/models/GraphManager.js"
</script>

<template>
  <div class="graph-container" v-bind:id="this.$attrs.type + '-graph-component'">
    <svg class="graph-container" v-bind:id="this.$attrs.type + '-graph-container'">
      <g class="outer-wrapper" v-bind:id="this.$attrs.type + '-outer-wrapper'"></g>
    </svg>
  </div>
</template>

<style lang="scss">
  .graph-container {
    display: block;
    width: 100%;
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

<script>
  export default {
    name: "GraphComponent",
    data() {
      return {
        graph:null
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
