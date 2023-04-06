<script setup>
  import { store } from '@/stores/store.js'
  import { settingsModule } from '@mixins/settingsModule'
  import focusSetter from '@mixins/focusSetter'
  import NodeElem from '@models/NodeElem'
  import * as d3 from 'd3'
</script>

<template>
  <div v-if="store.detailsData.id != null" v-bind:id="store.detailsData.id + '-details'">
    <img class="poster"
      v-bind:id="store.lockedHighlights.includes(store.detailsData.id) ? 'poster-locked' : 'poster-unlocked'"
      v-bind:src="store.detailsData.poster"
      @click="toggleHighlightLock($event, store.detailsData.id)"
      @mouseenter="highlightNodes(store.detailsData.id)"
      @mouseleave="unhighlightNodes(store.detailsData.id)">
    <div id="name">{{ store.detailsData.name }}</div>
    <div id="birthday">{{ store.detailsData.year }}</div>
    <div id="links">
      <a id="imdb" 
        v-bind:href="store.detailsData.imdbId"
        target="_blank">
        <img src="/imdb-icon.png">
      </a>
      <a id="youtube"
        v-if="store.detailsData.id.split('-')[0] !== 'person'"
        v-bind:href="'https://www.youtube.com/results?search_query=' + store.detailsData.name.split(' ').join('+') + ' ' + store.detailsData.year"
        target="_blank">
        <img src="/youtube-icon.png">
      </a>
    </div>
    
    <div v-if="store.detailsData.summary != ''" id="description">
      {{  store.detailsData.summary }}
    </div>
    <div v-else id="no-summary-available">
      <p style="letter-spacing:0.2em; margin-bottom:5vh">¯\_(ツ)_/¯</p>
      no summary available
    </div>
    <div id="fade-top"></div>
    <div id="fade-bottom"></div>
  </div>
  <div v-else></div>
</template>

<script>
  export default {
    name: "DetailsComponent",
    mounted () {
      focusSetter.methods.set('details')
      d3.selectAll(".details-component").transition().delay(100).duration(500).style("left", "0%")
    },
    methods: {
      toggleHighlightLock(e, id) {
        store.lockedHighlights.togglePresence(id)

        const n  = new NodeElem(id)

        if (n.connections.classed("locked")) {
          n.connections.classed("locked", false)
        } else {
          n.connections.classed("locked", true)
        }
      },

      highlightNodes(id) {
        const target = d3.select(`#${id}`)
        const tNode = target.node()

        if (tNode == undefined) { return }

        const d = new NodeElem(id)
        d.nodeTransformer("scale(1.05)", "aliceblue", "white")
      },

      unhighlightNodes(id) {
        const target = d3.select(`#${id}`)
        const tNode = target.node()

        if (tNode == undefined) { return }
        if (target.classed("locked")) { return }
        if (store.lockedHighlights.includes(id)) { return }

        const defaultColor = settingsModule.strokeColor

        const d = new NodeElem(id)

        d.nodeTransformer("scale(1)", defaultColor, "none")
      }
    }
  }
</script>

<style scoped lang="scss">
  #fade-top {
    grid-area: ft;
  }
  
  #fade-top::before {
    position: absolute;
    content: '';
    background: linear-gradient(to top, transparent 50%, #333 100%);
    width: 100%;
    bottom: -25px;
    height: 25px;
  }

  #fade-bottom {
    grid-area: fb;
  }
  
  #fade-bottom::before {
    position: absolute;
    content: '';
    background: linear-gradient(to bottom, transparent 0%, #333 100%);
    width: 100%;
    top: -15px;
    height: 15px;
  }
  
  #description, #no-summary-available {
    grid-area: desc;
    font-family: $global-font;
    margin-top: 0px;
    height: 100%;
    width: 100%;
    color: white;
    text-shadow: 1px 0px black;
    overflow-y: auto;
  }

  #description {
    padding-top: 5px;
    padding-bottom: 20px;
    font-size: 16px;
    font-weight: 300;
    line-height: 26px;
    letter-spacing: 0.002em;
  }

  #no-summary-available {
    margin-top: 5vh;
    font-size: 30px;
    font-weight: 300;
    letter-spacing: 0.002em;
    text-transform: uppercase;
  }

  .details-component {
    height: 83vh;
    width: 100%;
    display: grid;
    grid-template-columns: 79px 10px 55px 50px 1fr;
    grid-template-rows: 95px 21px 10px 30px 17fr;
    padding: 10px;
    /* gap: 10px; */
    grid-template-areas:
      "poster . name name name"
      "poster . birthday links ."
      ". . . . ."
      "ft ft ft ft ft"
      "desc desc desc desc desc"
      "fb fb fb fb fb";
    overflow: hidden;

    left: 0%;
  }

  .poster {
    grid-area: poster;
    width: 79px;
    border-radius: 8px;
  }
  
  .poster-unlocked {
    &:hover {
      box-shadow: 0em 0em 5px 5px rgb(240 248 255 / 5%);
      cursor: $cursor;
    }
  }  
  
  .poster-locked {
    box-shadow: 0em 0em 5px 5px rgba(240, 248, 255, 0.35);
    &:hover {
      cursor: $cursor;
    }
  }

  #name {
    grid-area: name;
    font-family: $global-font;
    height: 100%;
    width: 100%;
    
    line-height: 1em;
    margin-top: 0px;
    font-size: 24px;
    line-height: 28px;
    letter-spacing: 3px;
    font-weight: 900;
    text-transform: uppercase;
    color: white;
    text-shadow: 1px 0px black;
  }
  
  #birthday {
    grid-area: birthday;
    font-family: $global-font;
    line-height: 1em;
    font-weight: 900;
    font-size: 24px;
    color: white;
    text-shadow: 1px 0px black;
    position: absolute;
    bottom: 0px;
    left: 0px;
  }

  #links {
    grid-area: links;
    display: flex;
    justify-content: space-between;
    margin: auto 0 0 0;

    a:hover {
      cursor: $cursor;
    }
  }

  #imdb {
    grid-area: imdb;
    height: 100%;
  }

  #imdb > img {
    height: 20px;
  }

  #youtube {
    grid-area: youtube;
    height: 100%;
  }

  #youtube > img {
    height: 20px;
  }
</style>
