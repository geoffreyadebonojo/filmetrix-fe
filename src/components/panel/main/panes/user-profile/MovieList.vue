<script setup>
  import {
    userStates
  } from "@/stores/store.js"
  import Draggable from 'vuedraggable'
  import api from '@mixins/api'
</script>

<template>
  <draggable
      id="my-movie-list"
      :list="this.$data.movieList"
      :disabled="!enabled"
      item-key="movie"
      class="list-group"
      ghost-class="ghost"
      :move="checkMove"
      @start="dragging = true"
      @end="dragging = false"
    >
      <template #item="{ element }">
          <div class="my-movie-item" :class="{ 'not-draggable': !enabled }">
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
      draggingInfo() {
        return this.dragging ? "under drag" : "";
      },
      showMovieList: () => {
        if (userStates.userMovieList == null) { return }
        return userStates.userMovieList.length > 0
      }
    },
    methods: {
      add: function() {
        debugger
        // this.list.push({ name: "Juan " + id, id: id++ });
      },
      replace: function() {
        debugger
        // this.list = [{ name: "Edgard", id: id++ }];
      },
      checkMove: function(e) {
        window.console.log("Future index: " + e.draggedContext.futureIndex);
      },
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