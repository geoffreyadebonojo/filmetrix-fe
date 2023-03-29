<script setup>
  import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView></RouterView>
</template>

<style lang="scss">
  body {
    background: #222222;
  }
</style>

<script>
  export default {
    created () {
      let x = localStorage.getItem("newHere")
      if (x == null) {
        localStorage.setItem("newHere", true)
      }
    }
  }
</script>
