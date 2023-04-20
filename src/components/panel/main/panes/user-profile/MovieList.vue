<script setup>
  import {
    userStates,
    panelStates,
    graphStates
  } from "@/stores/store.js"
  import Draggable from 'vuedraggable'
  import api from '@mixins/api'
  import graph from '@mixins/graph'
</script>

<template>
  <draggable id="my-movie-list"
    :list="$data.movieList"
    :disabled="!enabled"
    item-key="movie"
    @start="dragging=true"
    @end="dragEnd($event)"
    v-bind="dragOptions">

    <template #item="{ element }">
      <div class="my-movie-item" v-bind:id="'my-movie-' + element[0]" type="transition">
        <img class="delete-button" src="/red-x-icon.svg" @click="removeBookmark(element[0])"/>
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
          ghostClass: "ghost",
          removeCloneOnHide: true
        };
      }
    },
    methods: {
      async dragEnd(e) {
        const w = window.innerWidth - panelStates.width
        const dx = e.originalEvent.clientX
        this.$data.dragging = false

        if (dx < w) {
        
          const movieId = e.item.id.replace("my-movie-", "")
          
          // let data
          // let nodes = []
          // let links = []

          // graphStates.existing.forEach((d) => {
          //   data = graphStates.graphData[d[0]]
          //   nodes = nodes.concat(data.nodes.slice(0,d[1]+1))
          //   links = links.concat(data.links.slice(0,d[1]))
          // })

          // graph.draw({
          //   nodes: nodes.uniqueById(),
          //   links: links,
          //   type: "main"
          // })
        }
      },
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