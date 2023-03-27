<script setup>
  import { store } from '@/stores/store.js'
</script>

<template>
  <img src="/disk-empty-white.svg" 
        class="graph-control-button save-buttons" 
        alt="save button"
        @click="this.saveGraph()">
  <img src="/center-graph-icon.svg" 
        class="graph-control-button" 
        id="centering-button" 
        alt="centering button">
</template>

<script>
  export default {
    name: "GraphButtonsComponent",
    data () {
      return {
        isSaved: false,
        attrs: {
          id: `${Math.round(Math.random()*10000000)}`
        }
      }
    },
    methods: {
      saveGraph () {
        this.$data.isSaved = true

        debugger
      }
    }
  }
</script>

<style scoped lang="scss">
  .graph-control-button {
    background: none;
    display: none;
    width: 20px;
    position: absolute;
    z-index: 1;
    cursor: pointer;

    opacity: 0.5;
  
    &:hover {
      opacity: 1;
      transition-property: opacity;
      transition-duration: 0.1.5s;
    }
  
    transition-property: opacity;
    transition-duration: 0.1.5s;
  }

  #centering-button {
    bottom: 10px;
  }
  
  .save-buttons {
    top: 15px;
    transform: translateX(2px)
  }
</style>