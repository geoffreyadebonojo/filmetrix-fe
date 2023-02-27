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
    width: 104px;
    margin: 0 10px 0 0;
    display: flex;
    justify-content: space-between;
    position: absolute;
    right: 0px;
  }

  #search-text {
    width: 62%;
    padding: 0px;
    border: 0px;
    left: 0%;
    height: 26px;
    border-radius: 30px 30px 30px 30px
  }

  #search-icon, #about-us-icon {
    height: 21px;
    top: 2px;
  }

  #details-icon, #commands-icon {
    height: 26px;
  }
  .icon:hover {
    cursor: pointer;
  }
</style>

<template>
  <input type="text" name="Search" id="search-text">
  
  <div class="nav-button-container">
    <div class="nav-button" @click="toggleSearchBar()">
      <img src="../assets/search-icon-333333.png" class="icon" id="search-icon">
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