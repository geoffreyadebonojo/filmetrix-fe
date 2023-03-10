<script setup>
  import { RouterView } from 'vue-router'
  import PanelComponent from './components/PanelComponent.vue'
</script>

<template>
  <RouterView />
  <PanelComponent />
</template>

<style>
  body {
    background: #222222;
  }
</style>