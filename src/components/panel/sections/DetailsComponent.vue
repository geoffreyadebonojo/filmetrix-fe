<script setup>
  import api from "@mixins/api"
  import focusHelper from '@mixins/focusHelper'
  import helpers from '@mixins/helpers'
  import graphBuilder from '@mixins/graphBuilder'
  import { settingsModule } from '@mixins/settingsModule'
  import { store } from '@/stores/store.js'
  import NodeElem from '@mixins/NodeElem'
  import * as d3 from 'd3'
</script>

<template>
  <div v-bind:id="store.detailsData.id + '-details'"
       v-if="store.detailsData.id != null">
    
    <img id="poster" 
      v-bind:src="store.detailsData.poster"
      @click="lockHighlight(store.detailsData.id)"
      @mouseenter="highlightNodes(store.detailsData.id)"
      @mouseleave="unhighlightNodes(store.detailsData.id)"
    >
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
    mixins: [api, focusHelper, helpers, graphBuilder, settingsModule],
    mounted () {
      focusHelper.methods.set('details')
      d3.selectAll(".details-component").transition().delay(100).duration(500).style("left", "0%")
    },
    methods: {
      lockHighlight(id) {
        store.lockedHighlights.togglePresence(id)
        const d = d3.select(`#${id}`).node()
        const n  = new NodeElem(d)
        n.connections.classed("locked", true)
        console.log(store.lockedHighlights)
      },
      highlightNodes(id) {
        const target = d3.select(`#${id}`)
        const tNode = target.node()
        if (tNode == undefined) { return }

        graphBuilder.nodeTransformer(tTnode, "scale(1.05)", "aliceblue", "white")
      },
      unhighlightNodes(id) {
        const target = d3.select(`#${id}`)
        const tNode = d3.select(`#${id}`)

        if (tNode == undefined) { return }
        // if (this.$data.highlightLocked) { return }
        if (target.classed("locked")) { return }
        //??
        const defaultColor = settingsModule.strokeColor
        graphBuilder.nodeTransformer(tNode, "scale(1)", defaultColor, "none")
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

  // @media screen and (max-width: 400px) {
  //   .details-container {
  //     grid-template-columns: 36% 10px 17% 17% 1fr;
  //     grid-template-rows: 23% 5% 20px 1fr;
  //     grid-template-areas:
  //       "poster . name name name"
  //       ". . . ."
  //       "poster . birthday links links"
  //       "desc desc desc desc desc"
  //   }
  //   #poster {
  //     width: 100%;
  //   }
  //   #name {
  //     font-size: 20px;
  //     line-height: unset;
  //   }

  //   #imdb {
  //     width: 22px;
  //   }
  // }

  .details-component {
    height: 80vh;
    width: 100%;
    display: grid;
    grid-template-columns: 79px 10px 55px 50px 1fr;
    grid-template-rows: 95px 21px 10px 1fr 17fr;
    padding: 10px;
    /* gap: 10px; */
    grid-template-areas:
      "poster . name name name"
      "poster . birthday links ."
      ". . . . ."
      "ft ft ft ft ft"
      "desc desc desc desc desc";
    overflow: hidden;

    left: 0%;
  }

  #poster {
    grid-area: poster;
    width: 79px;
    border-radius: 8px;
  }

  #poster:hover {
    cursor: $cursor;
    box-shadow: 0em 0em 5px 5px rgb(240 248 255 / 5%);
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
