<script setup>
  const props = defineProps({
    focus:String
  })
</script>

<template>
  <div v-if="focus === 'person'">
    Person Result
  </div>

  <div v-else-if="focus === 'movie'">
    Movie Result
  </div>

  <div v-else-if="focus === 'tv'">
    TV result
  </div>

  <div v-else-if="focus === 'noResult'">
    No result found. Spelling?
  </div>

</template>

<script>
  export default {
    name: "ResultContainer",
    data () {
      return {}
    },
    props: {
      setFocus: Function,
      default() {
        return {}
      }
    }
  }
</script>