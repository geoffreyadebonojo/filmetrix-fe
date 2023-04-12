<script setup>
 import {
    appStates,
    graphStates,
    userStates
  } from '@/stores/store.js'

  import api from '@/mixins/api'
</script>

<template>
  <div id="bookmark" v-if="this.isMovie" @click="addBookmark()">
    <img v-if="this.bookmarksContainsId" id="filled-bookmark" src="/bookmark-filled.svg"/>  
    <img v-else id="empty-bookmark" src="/bookmark-empty.svg"/>  
  </div>
</template>

<script>

  export default {
    name: 'BookmarkButton',
    computed: {
      isMovie: () => {
        return panelStates.detailsData.entity == "movie"
      },
      bookmarksContainsId: () => {
        return userStates.userMovieList
      }
    },
    methods: {
      async addBookmark() {
        const movieId = panelStates.detailsData.id
        if (userStates.userMovieList.map(d => d[0]).includes(movieId)) {

          userStates.userMovieList = await api.removeFromMovieList({
            userId: userStates.currentUser.id, 
            movieId: movieId
          })
        } else {

          userStates.userMovieList = await api.addToMovieList({
            userId: userStates.currentUser.id, 
            movieId: movieId
          })
        }
        this.$data.userMovieList = userStates.userMovieList.map(d => d[0])
      }
    }
  }
</script>

<style scoped lang="scss">
  #bookmark {
    grid-area: bookmark;
    width: 50px;
    height: 50px;
    display: flex;
    opacity: 0.65;
    
    img {
      height: 20px;
      margin: 0 auto auto auto;
      transform: scaleY(1.6);
      position: relative;
      top: 10px;
    }
        
    &:hover {
      cursor: $cursor;
      opacity: 1;
    }
  }
</style>