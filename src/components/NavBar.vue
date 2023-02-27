<template>

  <button @click="setFocus('search')">S</button>
  
  <button @click="setFocus('person')">P</button>
  <button @click="setFocus('movie')">M</button>
  <button @click="setFocus('tv')">TV</button>
  <button @click="setFocus('details')">D</button>
  <button @click="setFocus('commands')">C</button>
  <button @click="setFocus('about')">@</button>
</template>

<style scoped>
  #search-field {
    width: 50%
  }
</style>

<script>
  export default {
    name: "NavBar",
    props: {
      setFocus: Function,
      default() {
        return {}
      }
    }
  }
</script>