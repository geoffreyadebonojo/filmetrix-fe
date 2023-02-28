<script setup>
  import NavBar from './NavBar.vue'
  import PanelCenter from './PanelCenter.vue'

  const props = defineProps({
    focus:String,
    searchOpen:Boolean,
    searchResults:Array,
    setFocus: Function,
    default() {
      return {}
    },
    toggleOrSubmit: Function,
    default() {
      return {}
    },
    submitSearch: Function,
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
        :searchResults="searchResults"
        :setFocus="setFocus"
        :toggleOrSubmit="toggleOrSubmit"
        :submitSearch="submitSearch"
      />
    </div>

    <div id="panel-center">
      <PanelCenter 
        :focus="props.focus" 
        :searchResults="searchResults"
      />
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
      ". panel-center ."
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

  #panel-center {
    grid-area: panel-center;
    background: #333333;
  }

  #controls {
    grid-area: controls;
    background: #333333;
  }
</style>

<script>
  export default {
    name: "PanelComponent",
    components: {
      NavBar,
      PanelCenter
    },
    data () {
      return {}
    }
  }
</script>