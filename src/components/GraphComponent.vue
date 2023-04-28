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
      <g class="outer-wrapper" v-bind:id="$attrs.type + '-outer-wrapper'"></g>
    </svg>
  </div>
</template>

<script>
  export default {
    name: "GraphComponent",
    data() {
      // const storedScale = localStorage.getItem("currentZoom").split(" ")[1].replace("scale(", "").replace(")", "")
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
