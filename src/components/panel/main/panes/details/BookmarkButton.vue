<script setup>
 import {
    appStates,
    graphStates,
    panelStates,
    userStates
  } from '@/stores/store.js'

  import api from '@/mixins/api'
</script>

<template>
  <div id="bookmark" v-if="isMovie" @click="toggleBookmark()">
    <img v-if="bookmarksContainsId" id="filled-bookmark" src="/bookmark-filled.svg"/>  
    <img v-else id="empty-bookmark" src="/bookmark-empty.svg"/>  
  </div>
</template>

<script>
  export default {
    name: 'BookmarkButton',
    data () {
      return {
        movieList: [],
      }
    },

    computed: {
      isMovie: () => {
        return panelStates.detailsData.entity == "movie"
      },
      bookmarksContainsId: () => {
        return userStates.userMovieList.map(d => d[0]).includes(panelStates.detailsData.id)
      }
    },

    methods: {
      async toggleBookmark() {

        const args = {
          userId: userStates.currentUser.id, 
          movieId: panelStates.detailsData.id
        }
        
        if (this.bookmarksContainsId) {
          userStates.userMovieList = await api.removeFromMovieList(args)
        } else {
          userStates.userMovieList = await api.addToMovieList(args)
        }
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