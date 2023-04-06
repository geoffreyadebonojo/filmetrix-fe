<script setup>
  import * as d3 from 'd3'
</script>

<template>
  <div id="game-prompt">
    <p></p>
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
      reply(t) {
        const affirmatives = [
          "i honor your courage. <br><br> let's begin",
          "you have the heart of a warrior. <br><br> let's begin",
        ]
        const negatives = [
          "coward",
          "if not now, <br> then when?",
          "kevin bacon forgives your cowardice,<br> but will you forgive yourself?",
          "if you will not help him, who will? <br><br> also, did you know he never won an oscar? crazy right?",
          "very well. <br> you may return to the graph page if you wish"
        ]

        if (t == 'yes') {
          d3.select("#game-prompt p").html(affirmatives.random(1))
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
          }).style("left", (d) => {
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
  #back-to-graphs-link,
  #game-prompt,
  #reply {
    transform: scale(1);
      
    p {
      opacity: 0.5;
      margin: 4vh 40px;
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
</style>