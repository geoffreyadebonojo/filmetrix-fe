

<template>
    <!-- Not sure if these should live in the navbar or a separate component -->
    <!-- <img src="/settings-white.svg" class="icon" id="settings-icon" @click="this.toggleControls()"> -->
    <!-- img v-else src="assets/settings-black.svg" class="icon" id="settings-icon" @click="this.toggleControls()"-->
</template>

<script>
  export default {
    name: "SettingsToggleButton",
    methods: {
      toggleControls () {
        if (store.showControls) {
          //close
          store.showControls = false

          d3.select("#controls")
          .transition().duration(this.transitionTimer)
          .style("transform", "scaleY(0)")
          .style("bottom", "-50%")

          d3.select("#panel-center")
          .transition().duration(this.transitionTimer)
          .style("height", "142%")
          
        } else {
          //open
          store.showControls = true

          d3.select("#controls")
          .transition().duration(this.transitionTimer)
          .style("transform", "scaleY(1)")
          .style("bottom", "-0%")

          d3.select("#panel-center")
          .transition().duration(this.transitionTimer)
          .style("height", "100%")
        }
      }
    }
  }
</script>

<style lang="scss">
  #settings-icon {
    grid-area: setting;
    height: 20px;
    position: absolute;
    top: 7vh;
    right: -1px;
  }

  #settings-icon:hover {
    cursor: pointer;
  }
</style>