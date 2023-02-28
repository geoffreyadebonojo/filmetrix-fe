<script setup>
  const props = defineProps({
    focus:String,
    searchResults:Array
  })
</script>

<style>

  .result-tile{
    width: 75px;
    height: 115px;
  }
  
  .result-tile > img {
    width: 100%;
    border-radius: 8px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }

  .result-tile:hover{
    cursor: pointer;
    box-shadow: 0 14px 18px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    transform: scale(1.03)
  }

  .result-tile > div {
    font-size: 10px;
    text-transform: uppercase;
    font-family: 'Dosis', sans-serif;
    font-weight: bold;
  }

</style>

<template>
  <div class="result-container" v-bind:id="this.focus + '-results'">
    <div class="result-tile" v-bind:id="result.id"
        v-if="focus !== 'noResult'"
        v-for="result in this.searchResults.filter(r => r['id'].includes(focus))">

        <img v-bind:src="result.poster"/>
        <div>{{result.name}}</div>
    </div>

    <div v-else="focus === 'noResult'">
      No result found. Spelling?
    </div>
  </div>
</template>

<script>
  export default {
    name: "ResultContainer",
    data () {

      return {
      }
    }
  }
</script>