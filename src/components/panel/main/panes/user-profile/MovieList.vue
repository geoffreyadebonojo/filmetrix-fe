<script setup>
  import {
    userStates
  } from "@/stores/store.js"
  import api from '@mixins/api'
</script>

<template>
  <div id="my-movie-list">
    <div v-if="this.showMovieList" 
         v-for="movie in userStates.userMovieList"
         class="my-movie-item">
      <img class="delete-button" src="/red-x-icon.svg" @click="this.removeBookmark(movie[0])"/>
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
    },
    methods: {
      async removeBookmark(movieId) {
        userStates.userMovieList = await api.removeFromMovieList({
          userId: userStates.currentUser.id, 
          movieId: movieId
        })
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
    padding: 20px 10px 61px;
    overflow-y: scroll;

    #no-movies-yet {
      width: 100%;
      display: flex;
    }
    .my-movie-item {
      @include poster-tile;

      .delete-button {
        display: none;
        height: 15px;
        width: 15px;
        position: absolute;
        right: -8px;
        top: -8px;
        z-index: 1;
      }
      &:hover {
        .delete-button {
          display: block
        }

      }
    }

  }
</style>