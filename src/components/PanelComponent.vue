<script setup>
  import NavBar from './NavBar.vue'
  import PanelCenter from './PanelCenter.vue'

  const props = defineProps({
    focus:String,
    setFocus: Function,
    default() {
      return {}
    }
  })
</script>

<template>
  <div id="panel-body">
    <div id="navbar">
      <NavBar :setFocus="setFocus" />
    </div>
    <div id="panel-main">
      <PanelCenter :focus="props.focus" />
    </div>
    <div id="controls">
      <!-- <Controls /> -->
    </div>
  </div>
</template>

<style scoped>
  #panel-body {
    height: 100vh;
    display: grid;
    grid-template-columns: 30px 1fr 30px;
    grid-template-rows: 15px 1fr 30px 15fr 30px 5fr 30px;
    grid-template-areas:
      ". . ."
      ". navbar navbar"
      ". . ."
      ". panel-main ."
      ". . ."
      ". controls ."
      ". . .";
    width: 225px;
    background: lightgrey;
    position: absolute;
    top: 0px;
    right: 0px;
  }

  #navbar {
    grid-area: navbar;
    background: grey;
  }

  #panel-main {
    grid-area: panel-main;
    background: grey;
  }

  #controls {
    grid-area: controls;
    background: grey;
  }
</style>

<script>
  export default {
    components: {
      NavBar,
      PanelCenter
    },
    name: "PanelComponent",
    data () {
      return {}
    },
    props: {

    }
  }
</script>