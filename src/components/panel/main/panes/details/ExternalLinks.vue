<script setup>
  import {
    panelStates
  } from '@/stores/store.js'
</script>

<template>
  <div id="links">
      <a id="imdb" 
         v-bind:href="panelStates.detailsData.imdbId"
         target="_blank">
        <img src="/imdb-icon.png">
      </a>
      <a id="youtube"
          v-if="this.notPerson"
          v-bind:href="this.youtubeRef"
          target="_blank">
        <img src="/youtube-icon.png">
      </a>
    </div>
</template>

<script>
  export default {
    name: "ExternalLinks",
    computed: {
      notPerson: () => {
        return panelStates.detailsData.entity != 'person'
      },
      youtubeRef: () => {
        return 'https://www.youtube.com/results?search_query=' 
               + panelStates.detailsData.name.split(' ').join('+') + ' ' 
               + panelStates.detailsData.year
      }
    }
  }
</script>

<style scoped lang="scss">
  #links {
    grid-area: links;
    display: flex;
    width: 50px;
    justify-content: space-between;

    a:hover {
      cursor: $cursor;
    }

    #imdb {
      grid-area: imdb;
      height: 100%;
    }
  
    #youtube {
      grid-area: youtube;
      height: 100%;  
    }

    img {
      height: 20px;
    }
  }
</style>