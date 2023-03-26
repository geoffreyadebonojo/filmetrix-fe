<script setup>
  import SearchResultComponent from './SearchResultComponent.vue'
  import DetailsComponent from './DetailsComponent.vue'
  import MobileDetailsComponent from './MobileDetailsComponent.vue'
  import CommandsComponent from './CommandsComponent.vue'
  import { store } from '@/stores/store.js'
</script>

<template>
  <div v-if="store.currentFocus === 'details' && store.currentDetailId !== false" class="details-component">
    <mobile-details-component v-if="this.isMobile"></mobile-details-component>
    <details-component v-else></details-component>
  </div>
  
  <div v-else-if="store.currentFocus === 'commands'" id="commands-container">
    <commands-component></commands-component>
  </div>
  
  <div id="empty-field" v-else-if="store.currentFocus === 'empty'" @click="focusSearchBar()">
    <div id="search-prompt">
      <p >search for a movie or actor.</p>
      <p style="margin-top:40px">please.</p>
    </div>
  </div>

  <div v-else class="result-component">
    <search-result-component></search-result-component>
  </div>
</template>

<style>
  .result-component {
    height: 100%;
  }  
  .details-component {
    height: 100%;
    width: 100%;
  }
  #empty-field {
    height: 100%;
    display: flex;
  }
  #search-prompt {
    margin: 40% 40px;
    text-transform: uppercase;
    font-family: 'Dosis', sans-serif;
    font-weight: 600;
    font-size: 2em;
    text-align: center;
  }

  @media screen and (max-width: 400px) {
    .details-component {
      padding: 2%;
    }
  }
</style>

<script>
  export default {
    name: "PanelContentsComponent",
    components: {
      SearchResultComponent,
      DetailsComponent,
      CommandsComponent
    },
    data () {
      return {
        currentDetailSubjectId: '',
        isMobile: /Android|iPhone/i.test(navigator.userAgent)
      }
    },
    methods: {
      focusSearchBar() {
        document.querySelector('#search-text').focus()
      }
    }
  }
</script>