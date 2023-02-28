<script setup>
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

<style scoped>
  .nav-button-container {
    height: 100%;
    width: 110px;
    padding: 0 6px 0 5px;
    display: flex;
    justify-content: space-between;
    position: absolute;
    right: 0px;
    background: #6e6e6e;
    border-radius: 15px 0 0 15px;
  }

  #search-text {
    width: 60%;
    padding: 0px;
    border: 0px;
    left: 0%;
    height: 26px;
    border-radius: 15px 0 0 15px
  }

  #search-icon {
    height: 17px;
    top: 4px;
  }

  #about-us-icon {
    height: 17px;
    top: 4px;
    right: 1px;
  }

  #details-icon {
    height: 24px;
    top: 1px;
  }

  #commands-icon {
    height: 24px;
    top: 1px;
  }
  .icon:hover {
    cursor: pointer;
  }

  #highlight {
    position: absolute;
    height: 100%;
    width: 27px;
    background: white;
    border-radius: 50%;
    left: -1%;
  }
</style>

<template>
  <input type="text" name="Search" id="search-text">
  
  <div class="nav-button-container">
    <div id="highlight"></div>

    <div class="nav-button" @click="toggleSearchBar()">
      <img src="../assets/search-icon-inactive.png" class="icon" id="search-icon">
    </div>

    <div class="nav-button" @click="setFocus('details')">
      <img src="../assets/details-icon-222222-trans.svg" class="icon" id="details-icon">
    </div>

    <div class="nav-button" @click="setFocus('commands')">
      <img src="../assets/command-icon-FFFFFF.svg" class="icon" id="commands-icon">
    </div>

    <div class="nav-button" @click="setFocus('about')">
      <img src="../assets/about-us-icon-222222.svg" class="icon" id="about-us-icon">
    </div>
  </div>
</template>



<script>
  export default {
    name: "NavBar"
  }
</script>