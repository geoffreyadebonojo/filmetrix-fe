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
  #search-text {
    width: 50%;
    padding: 0px;
    border: 0px;
    left: 0px;
    height: 30px;
    border-radius: 30px 0px 0px 30px
  }

  .nav-buttons {
    width: 100%;
    margin: auto 0 auto auto
  }

  .icon {
    height: 21px;
  }
  .icon:hover {
    cursor: pointer;
  }
</style>

<template>
  <input type="text" name="Search" id="search-text">
  
  <div class="nav-buttons">
    <button @click="toggleSearchBar()">
      <img src="../assets/search-icon-333333.png" class="icon" id="search-icon">
    </button>

    <button @click="setFocus('details')">
      <img src="../assets/details-icon-333333.svg" class="icon" id="details-icon">
    </button>

    <button @click="setFocus('commands')">
      <img src="../assets/command-icon-6E6E6E.svg" class="icon" id="commands-icon">
    </button>

    <button @click="setFocus('about')">
      <img src="../assets/about-us-icon-222222.svg" class="icon" id="about-us-icon">
    </button>
  </div>
</template>



<script>
  export default {
    name: "NavBar"
  }
</script>