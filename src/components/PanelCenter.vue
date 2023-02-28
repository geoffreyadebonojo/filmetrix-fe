<script setup>
  import ResultContainer from './ResultContainer.vue'
  import DetailsContainer from './DetailsContainer.vue'
  import CommandsContainer from './CommandsContainer.vue'

  const props = defineProps({
    focus:String,
    searchResults:Array
  })
</script>

<template>
  <div v-if="props.focus === 'details'">
    <DetailsContainer />
  </div>
  
  <div v-else-if="props.focus === 'commands'">
    <CommandsContainer />
  </div>
  
  <div v-else-if="props.focus === 'about'">
    about
  </div>

  <div v-else="props.focus === 'empty'">
    empty
  </div>

  <div v-else>
    <ResultContainer 
      :focus="props.focus"
      :searchResults="searchResults"  
    />
  </div>
  
</template>

<style>

</style>

<script>
  export default {
    name: "PanelCenter"
  }
</script>