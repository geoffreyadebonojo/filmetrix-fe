<script setup>
  import PanelComponent from '../components/PanelComponent.vue'
  import GraphComponent from '../components/GraphComponent.vue'
</script>

<template>
  <div id="viewer-body">
    <!-- <div id="instructions">Instruction</div> -->
    <graph-component></graph-component>
    <panel-component></panel-component>
    <!-- <AboutGraph v-if="store.aboutUs"></AboutGraph> -->
  </div>
</template>

<script>
  export default {
    name: 'GraphView',
    components: {
      GraphComponent,
      PanelComponent
    },
    data () {
      return {
        charge: -1000,
        count: 5
      }
    }
  }
</script>

<style>
  #viewer-body {
    height: 100vh;
    overflow: hidden;
  }
  #instructions {
    position : absolute;
    top: 40%;
    right: 0%;
    z-index: 2
  }
</style>