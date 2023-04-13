<script setup>
  import {
    userStates
  } from "@/stores/store.js"
</script>

<template>
  <div id="my-movie-list">
    <div v-if="this.showMovieList" 
         v-for="movie in userStates.userMovieList"
         class="my-movie-item">
      <img v-bind:src="'https://image.tmdb.org/t/p/w185_and_h278_bestv2' + movie[2]"/>
      <div>{{  movie[1] }}</div>
    </div>
    <div v-else id="no-movies-yet">
      <p>
        Add some movies!
      </p>
    </div>
  </div>
</template>

<script>
  export default {
    name: "MovieList",
    computed: {
      showMovieList: () => {
        if (userStates.userMovieList == null) { return }
        return userStates.userMovieList.length > 0
      }
    }
  }
</script>

<style scoped lang="scss">
  #my-movie-list {
    grid-area: movie-list;

    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 50px 20px;
    justify-content: center;
    padding: 20px;
    overflow-y: scroll;

    #no-movies-yet {
      width: 100%;
      display: flex;
    }
    .my-movie-item {
      @include poster-tile
    }
  }
</style>