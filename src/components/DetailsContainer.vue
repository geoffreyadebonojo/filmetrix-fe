<script setup>
  import apiService from "../mixins/apiService"

  const props = defineProps({
    focus:String,
    currentDetailSubjectId:String,
    setFocus: Function,
    default() {
      return {}
    }
    })
</script>

<template>
  <div class="details-container" v-bind:id="this.currentDetailSubjectId + '-details'">
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