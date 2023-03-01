<script setup>
  const props = defineProps({
      focus:String,
      searchResults:Array,
      setFocus: Function,
      default() {
        return {}
      }
    })
</script>

<template>
  <div class="details-container" v-bind:id="'-details'">
    <div class="details-poster" >

    </div>
  </div>

</template>

<style>
  .details-container {
    display: grid;
  }
</style>

<script>
  export default {
    name: "DetailsContainer",
    props: {}
  }
</script>