<script setup>
  import NavBar from './NavBar.vue'
  import PanelCenter from './PanelCenter.vue'

  const props = defineProps({
    focus:String,
    searchOpen:Boolean,
    setFocus: Function,
    default() {
      return {}
    },
    toggleSearchBar: Function,
    default() {
      return {}
    }
  })
</script>

<template>
  <div id="panel-body">
    <div id="navbar">
      <NavBar 
        :focus="focus"
        :searchOpen="searchOpen"
        :setFocus="setFocus"
        :toggleSearchBar="toggleSearchBar"
      />
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
    width: 265px;
    background: #333333;
    position: absolute;
    top: 0px;
    right: 0px;
  }

  #navbar {
    grid-area: navbar;
    background: #333333;
    display: flex;
    margin: auto 0 auto auto;
    height: 26px;
    width: 100%;
  }

  #panel-main {
    grid-area: panel-main;
    background: #333333;
  }

  #controls {
    grid-area: controls;
    background: #333333;
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
    }
  }
</script>