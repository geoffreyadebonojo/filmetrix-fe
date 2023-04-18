<script setup>
  import {
    userStates
  } from "@/stores/store.js"
  import Draggable from 'vuedraggable'
  import api from '@mixins/api'
</script>

<template>
  <draggable id="my-movie-list"
    :list="this.$data.movieList"
    :disabled="!enabled"
    item-key="movie"
    @start="dragging=true"
    @end="dragging=false"
    v-bind="dragOptions">

    <template #item="{ element }">
      <div class="my-movie-item" v-bind:id="'my-movie-' + element[0]" type="transition">
        <img class="delete-button" src="/red-x-icon.svg" @click="this.removeBookmark(element[0])"/>
        <img v-bind:src="'https://image.tmdb.org/t/p/w185_and_h278_bestv2' + element[2]"/>
        <div>{{ element[1] }}</div>
      </div>
    </template>

  </draggable>
</template>

<script>
  export default {
    name: "MovieList",
    data () {
      return {
        enabled: true,
        dragging: false,
        movieList: userStates.userMovieList
      }
    },
    components: {
      Draggable
    },
    computed: {
      dragOptions() {
        return {
          animation: 300,
          disabled: false,
          ghostClass: "ghost"
        };
      },
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
        
        this.$data.movieList = userStates.userMovieList
      }
    }
  }
</script>

<style scoped lang="scss">
  .ghost {
    opacity: 0;
  }

  #my-movie-list {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 50px 20px;
    padding: 20px 10px 61px;
    overflow-y: scroll;

    #no-movies-yet {
      width: 100%;
      display: flex;
    }
    .my-movie-item {
      @include poster-tile;

      height: 81.75px;
      width: 54.75px;

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