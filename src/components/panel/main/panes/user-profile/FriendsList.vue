<template>
  <div>
    <div v-if="$data.friendsList.length > 0" id="friends-container">
      friends
    </div>
    <div v-else>
      you have no friends
    </div>
    <br>
    -> search for friend <br>
    -> create friend group <br>
    -> share a graph <br>
    -> invite friend (by email) <br>
  </div>
  </template>

<script>
  export default {
    data () {
      return {
        friendsList: []
      }
    }
  }
</script>

<style scoped lang="scss">
  #friends-container {
    #no-friends-yet {
      width: 100%;
      display: flex;
      font-family: $global-font;
    }
  }
</style>