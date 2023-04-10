<script setup>
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

      <div class="item unlock" style="height:3em">
        <img src="/lock-open.svg" style="opacity:0.5"/>
      </div>

      <div class="item lock" style="height:3em">
        <img src="/lock-closed.svg"/>
      </div>

      <div class="item link-to" style="height:3em">
        <img src="/link-alt.svg" style="opacity:0.5"/>
      </div>

      <div class="item save" style="height:3em">
        <img src="/disk-empty-white.svg"/>
      </div>

      <div class="item centering" style="height:3em">
        <img src="/center-graph-icon.svg"/>
      </div>
    </div>

    <div id="centerline" class="line"></div>

    <div id="effects" class="column">
      <div class="header">Effect</div>
      <hr class="line" style="margin:20px 0">

      <div class="item search-info" style="height:3.8em">
        <div @click="elaborateOn('search-info')" style="display:flex">
          <p>
            search for actors, movies, or tv shows
          </p>
          <img class="chevron" src="/chevron.svg"/>
        </div>
        <p class="elaboration" style="display:none">
          you can search and add nodes to an existing graph
        </p>
      </div>

      <div class="item double-click" style="height:2.8em">
        <div @click="elaborateOn('double-click')" style="display:flex">
          <p>
            add more nodes!
          </p>
          <img class="chevron" src="/chevron.svg"/>
        </div>
        <p class="elaboration" style="display:none">
          double click on any node to add more to the graph
        </p>
      </div>

      <div class="item single-click" style="height:2.8em">
        <div @click="elaborateOn('single-click')" style="display:flex">
          <p>
            get details
          </p>
          <img class="chevron" src="/chevron.svg"/>
        </div>
        <p class="elaboration" style="display:none">
          single click on any node to view details for that person, movie or tv show
        </p>
      </div>

      <div class="item unlock" style="height:3em">
        <div @click="elaborateOn('unlock')" style="display:flex">
          <p>
            unlocked
          </p>
          <img class="chevron" src="/chevron.svg"/>
        </div>
        <p class="elaboration" style="display:none">
          graph won't be saved if you navigate away or refresh the page
        </p>
      </div>

      <div class="item lock" style="height:3em">
        <div @click="elaborateOn('lock')" style="display:flex">
          <p>
            locked
          </p>
          <img class="chevron" src="/chevron.svg"/>
        </div>
        <p class="elaboration" style="display:none">
          graph will be saved if you navigate away or refresh
        </p>
      </div>

      <div class="item link-to" style="height:3em">
        <div @click="elaborateOn('link-to')" style="display:flex">
          <p>
            generate link
          </p>
          <img class="chevron" src="/chevron.svg"/>
        </div>
        <p class="elaboration" style="display:none">
          generate a url to share this graph with your friends and enemies
        </p>
      </div>

      <div class="item save" style="height:3em">
        <div @click="elaborateOn('save')" style="display:flex">
          <p>
            save
          </p>
          <img class="chevron" src="/chevron.svg"/>
        </div>
        <p class="elaboration" style="display:none">
          you can so you can play with them later. gotta be logged in though
        </p>
      </div>

      <div class="item centering" style="height:3em">
        <div @click="elaborateOn('centering')" style="display:flex">
          <p>
            re-center graph
          </p>
          <img class="chevron" src="/chevron.svg"/>
        </div>
        <p class="elaboration" style="display:none">
          this will reset the graph to its original zoom and scale, good for if you get lost
        </p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "CommandsContainer",
    data () {
      return {
        sizeMatch: {
          "search-info": "6.7em",
          "double-click": "4.5em",
          "single-click": "5.5em",
          "unlock": "5.6em",
          "lock": "4.7em",
          "link-to": "5.5em",
          "save": "5.5em",
          "centering": "7em"
        }
      }
    },
    mounted () {
      d3.select("#commands-container").transition().duration(200).style("left", "0%")
    },
    methods: {
      async elaborateOn(section) {
        const si = d3.selectAll(`.${section}`)
        const el = d3.select(`#effects .${section} .elaboration`)
        const chev = d3.select(`#effects .${section} .chevron`)
  
        el.style("display", () => {
          if (el.style("display") == "none"){
            si.transition().duration(200).style("height", this.$data.sizeMatch[section])
            chev.transition().duration(200).style("transform", "rotate(270deg)")
            el.transition().delay(100).style("display", "block")
          } else {
            si.transition().duration(200).style("height", "3em")
            chev.transition().duration(200).style("transform", "rotate(90deg)")
            el.transition().delay(100).style("display", "none")
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .chevron {
    height: 10px;
    margin: auto -7px auto auto;
    transform: rotate(90deg);
    opacity: 0.5;
  }

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
  }

  #effects {
    grid-area: effects;
    text-align: left;
    margin: 10px;

    .item {
      &:hover {
        cursor: $cursor;

        p {
          &:hover {
            color: white
          }
        }
        .chevron {
          opacity: 1;
          height: 13px;
        }
      }
    }

    .elaboration {
      display: none;
      font-style: italic;
      font-size: 13px;
      margin: 7px auto auto auto;
    }

    p {
      margin: auto auto auto 0
    }
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