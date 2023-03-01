<script setup>
  import apiService from "../mixins/apiService"
  import { store } from '@/stores/store.js'
</script>

<template>
  <div class="details-container" v-bind:id="store.detailsData.id + '-details'">
    <div class="details-poster" >
      <img v-bind:src="store.detailsData.poster">
    </div>
  </div>

</template>

<style>
  /* .details-container {
      height: 100vh;
      width: 350px;
      display: grid;

  } */
</style>

<script>
  export default {
    name: "DetailsContainer",
    props: {},
    async created () {
      await apiService.methods.fetchDetails(store.currentDetailId.split("-")[1])
    }
  }
</script>