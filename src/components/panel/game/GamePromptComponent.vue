<script setup>
  import * as d3 from 'd3'
  import api from "@/mixins/api.js"
  import { 
    gameStates,
    graphStates,
    store 
  } from '@/stores/store.js'
  import graph from "@mixins/graph"

</script>

<template>
  <div id="game-prompt">
    <p style="height:90px"></p>
    <!-- <input id="game-search-bar"
           style="display:none"
           type="text"
           placeholder="start"
           tabindex="-1"
           @keyup.enter="submitSearch($event.target.value)">
    
    <div id="choice-container" style="display:none">
      <div v-for="result in withPoster" class="choice-tile">
        <img v-bind:src="result.poster" @click="submitChoice(result)"/>
      </div>
    </div> -->
  </div>
  <div id="reply">
    <p class="button" id="no" @click="reply('no')"></p>
    <p class="button" id="yes" @click="reply('yes')"></p>
  </div>
  <router-link id="back-to-graphs-link" to="/graph" style="display:none">
    <p class="button">back to graphs</p>
  </router-link>
</template>

<script>
  export default {
    name: "GamePromptComponent",
    data () {
      return {
        latestChoice: {}
      }
    },
    computed: {
      withPoster () {
        return store.searchResults.filter(d => d.poster != '')
      }
    },
    mounted () {
      const gamePrompts = [
        {
          prompt: "you are about to begin a fantastic journey into the bowels of cinema.<br><br>are you ready?",
          no: "n-no. I'm not ready",
          yes: "you bet your bacon!"
        },
        {
          prompt: "kevin bacon's fate is in your hands.<br><br>he will fade into obscurity-<br>unless you can save him!",
          no: "I don't really care about the fate of kevin bacon",
          yes: "I care very much about the fate of kevin bacon"
        },
        {
          prompt: "if you do not act, the name <br><br> kevin bacon <br><br> will be buried under the sands of time",
          no: "all things must pass",
          yes: "not if i have anything to say about it!"
        }
      ]

      const opts = gamePrompts.random(1)[0]
      d3.select("#game-prompt p").html(opts.prompt)
      d3.select("#no").html(opts.no)
      d3.select("#yes").html(opts.yes)
    },
    
    methods: {
      async submitChoice(d) {
        const turnElem = d3.select(`#card-${gameStates.turn}`) 
        const nextTurnElem = d3.select(`#card-${gameStates.turn+1}`) 
        
        d3.selectAll(".guess-tile").classed("active", false)
        
        nextTurnElem.classed("active", true)
        turnElem.select("p").remove()
        turnElem.select("img").attr("src", d.poster)
        
        gameStates.turn += 1
        
        /////
      },
      
      async submitSearch(value) {
        const val = value.toUpperCase()
        if (val == '' || val == null) { 
          return false
        }
        await api.fetchSearchData(val)
        d3.select("#game-prompt p").transition().duration(500).style("opacity", "0").remove()

        this.$data.latestChoice = store.searchResults[0]
        d3.select("#choice-tile img").attr("src", this.$data.latestChoice.poster)
      },

      reply(t) {
        const affirmatives = [
          "i honor your courage. <br><br>",
          "you have the heart of a warrior. <br><br>",
        ]
        const negatives = [
          "coward",
          "if not now, <br> then when?",
          "kevin bacon forgives your cowardice,<br> but will you forgive yourself?",
          "if you will not help him, who will? <br><br> also, did you know he never won an oscar? crazy right?",
          "very well. <br> you may return to the graph page if you wish"
        ]

        if (t == 'yes') {
          let promptText = d3.select("#game-prompt p")
          promptText.html(affirmatives.random(1))
          promptText.transition().duration(1000).delay(500).style("opacity", 0)

          setTimeout(() => {
          promptText.html("Now choose")
          },1500)

          promptText.transition().duration(1000).delay(1500).style("opacity", 0.75)

          d3.select("#game-search-bar").style("display", "block")
          d3.select("#choice-container").style("display", "block")
        } else if (t == 'no') {
          d3.select("#game-prompt p").html(negatives.random(1))
        }

        d3.select("#reply").remove()

        if (t == 'no') { 
          d3.select("#back-to-graphs-link").style("display", "block")
          return
        }

        const baseDelay = 100;

        // d3.select("#guesses").transition().duration(baseDelay).style("left", "0px")

        const gt = d3.selectAll(".guess-tile")
        gt.each(function(d, i) {
          d3.select(this).transition().duration(() => {
            return i * 100
          }).delay(() => {
            return  baseDelay + (i * 100)
          }).style("left", () => {
            return `${100 + (80 * i)}px`
          })

          // stable, even
          // d3.select(this).transition().duration(() => {
          //   return 1000
          // }).delay(() => {
          //   return 100
          // }).style("left", (d) => {
          //   return `${i*50}px`
          // })
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  #game-search-bar {
    width: 100%;
    height: 55px;
    text-transform: uppercase;
    font-family: $global-font;
    color: white;
    font-weight: 100;
    font-size: 2em;
    text-align: center;
    background: $panel-body-grey;
    border: none;
    border-radius: 40px;

    position: sticky;
    top: 0px;
    z-index: 100;

    &:focus {
      animation-name: none;
      outline: none;
      color: black;
      background: #EEE;
    }
    
    &:hover {
      animation-name: none;
      background: #EEE;
      cursor: $cursor;
      // transform: scale(1.2);
    }
    
    // animation-name: pulsate;
    // animation-duration: 1.4s;
    // animation-iteration-count: infinite;
    // animation-timing-function: linear;
  }

  // @keyframes pulsate {
  //   0% {
  //     // transform: scale(1);
  //     font-size: 2em;
  //     // opacity: 0.5;
      
  //   }
  //   50% {
  //     // transform: scale(1.1);
  //     font-size: 2.2em;
  //     // opacity: 0.8;
  //   }
  //   100% {
  //     // transform: scale(1);
  //     font-size: 2em;
  //     // opacity: 0.5;
  //   }
  // }

  #back-to-graphs-link,
  #game-prompt,
  #reply {
    transform: scale(1);
      
    p {
      opacity: 0.5;
      // margin: 4vh 40px;
      text-transform: uppercase;
      font-family: $global-font;
      font-weight: 100;
      font-size: 2em;
      text-align: center;
      &:hover {
        cursor:default
      }
    }
  }

  #reply {
    top: 250px;
  }

  #back-to-graphs-link,
  #reply {
    font-size: 10px;
    display: flex;
    margin: 10px;
    justify-content: space-around;

    #yes, #no {
      width: 50%;
    }

    p {
      margin: 5px;
      padding: 10px;
      border: grey solid 1px;
      border-radius: 8px;

      &:hover {
        cursor: $cursor;
        font-weight: 900;
        background: grey;
        border: $panel-body-grey solid 1px;
        color: $panel-body-grey;
      }
    }
  }

  #choice-container {
    display: block;

    .choice-tile {
      width: 140px;
      height: 210px;
      border-radius: 8px;
      border: 1px solid;
      margin: 40px auto;
      background: $graph-body-grey;
      
      img {
        cursor: $cursor;
        width: 100%;
        border-radius: 8px;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
      }
    }
  }

</style>