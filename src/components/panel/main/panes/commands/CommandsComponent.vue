<script setup>
  import EffectExplanation from './EffectExplanation.vue'
  import * as d3 from 'd3'
</script>

<template>
  <div  id="commands-container">
    <div id="commands" class="column">
      <div class="header">Cause</div>
      <hr class="line" style="margin:20px 0">
      
      <div class="item search-info" style="height:3.8em">
        <img src="/search-icon-light.svg" style="opacity:0.5"/>
      </div>

      <div class="item double-click" style="display:flex; height:2.8em">
        <img src="/cursor-finger.svg" style="opacity:0.5"/> <p id="superscript">x2</p>
      </div>

      <div class="item single-click" style="height:2.8em">
        <img src="/cursor-finger.svg" style="opacity:0.5"/>
      </div>

      <div class="item link-to" style="height:3em">
        <img src="/link-alt.svg" style="opacity:0.5"/>
      </div>

      <div class="item centering" style="height:3em">
        <img src="/center-graph-icon.svg"/>
      </div>

      <div class="item clear-graph" style="height:3em">
        <img src="/clear-graph.svg"/>
      </div>
    </div>

    <div id="centerline" class="line"></div>

    <div id="effects" class="column">
      <div class="header">Effect</div>
      <hr class="line" style="margin:20px 0">

      <effect-explanation 
        :section="'search-info'"
        :main="'search for actors, movies, or tv shows'"
        :secondary="'you can search and add nodes to an existing graph'"
        :expandedHeight="'6.7em'"
        style="height:3.8em"/>

      <effect-explanation
        :section="'double-click'"
        :main="'add mode nodes!'"
        :secondary="'double click a node to add more!'"
        :expandedHeight="'5.5em'"
        style="height:2.8em"
      />

      <effect-explanation
        :section="'single-click'"
        :main="'get details'"
        :secondary="'single click on any node to view details for that person, movie, or tv show'"
        :expandedHeight="'6.2em'"
        style="height:2.8em"
      />

      <effect-explanation
        :section="'link-to'"
        :main="'generate link'"
        :secondary="'generate a url to share this graph with your friends... or enemies'"
        :expandedHeight="'5.5em'"
        style="height:3em"
      />

      <effect-explanation
        :section="'centering'"
        :main="'re-center graph'"
        :secondary="'this will reset the graph to its original zoom and scale; good for if you get lost'"
        :expandedHeight="'7em'"
        style="height:3em"
      />

      <effect-explanation
        :section="'clear-graph'"
        :main="'clear graph'"
        :secondary="'this will reset the graph'"
        :expandedHeight="'7em'"
        style="height:3em"
      />
    </div>
  </div>
</template>

<script>
  export default {
    name: "CommandsContainer",
    data () {
      return {
        sizeMatch: {}
      }
    },
    mounted () {
      d3.select("#commands-container").transition().duration(200).style("left", "0%")
    }
  }
</script>

<style scoped lang="scss">
  #commands-container {
    height: 100%;
    display: grid;
    grid-template-columns: 2fr 10px 4fr;
    grid-template-areas:
      "commands centerline effects";
    left: 100%;
    padding-right: 15px;
  }

  #commands {
    grid-area: commands;
    text-align: right;
    margin: 10px;

    img {
      height: 25px;
      display: flex;
      margin: auto 0 auto auto;
    }

    .double-click {
      img {
        margin-top: 0;
      }
      #superscript {
        margin: 0;
        font-size: 12px;
        position: absolute;
        right: -5px;
        top: -7px;
      }
    }

    .search-info > img {
      top: 7px;
      right: 3px;
      height: 20px;
    }

    .centering > img {
      height: 20px;
      opacity: 0.5;
      top: 2px;
      right: 2px;
    }

    p {
      margin: auto 0 auto auto
    }

    .save > img {
      right: 2px;
      height: 21px;
      opacity: 0.5;
    }

    .profile > img {
      height: 23px;
      opacity: 0.5;
    }

    .clear-graph > img {
      opacity: 0.5;
    }
  }

  #effects {
    grid-area: effects;
    text-align: left;
    margin: 10px;
  }

  .column {
    .item {
      height: 3em;
      display: block;
    }
  }

  #centerline {
    grid-area: centerline;
    margin: auto;
    position: relative;
    border-left: 1px solid white;
    height: 100%;
  }

  .header, .item {
    font-family: "Dosis", sans-serif;
  }

  .line {
    opacity: 0.5;
  }
</style>