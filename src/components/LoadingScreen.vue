<script setup>
  import { 
    appStates,
    panelStates,
    store 
  } from "@/stores/store.js"
  import * as d3 from 'd3'
  import GraphBuilder from '@models/GraphBuilder.js'
  import Simulation from '@models/Simulation.js'
  import { settings, setFocus } from "@/mixins/helpers"
  import { graphStates } from '@/stores/store.js'
</script>

<template>
  <g id="loading">
    <!-- <rect v-bind:width="100+ loadBar" height="100" style="fill: red"></rect>-->

    <text>loading</text>

    <!-- <g v-for="(letter, i) in this.message" class="letter-node" v-bind:id="'letter-' + i">
    <circle r="45" :cx="0" :cy="-15" id="letter-highlight"></circle>
      <text width="50" height="50" :x="0" :y="0" text-anchor="middle">{{ letter }}</text>
      <line :x1="0" :y1="0" :x2="0" :y2="0"></line>
    </g> -->
  </g>
</template>

<script>

  export default {
    name: "LoadingScreen",

    data() {
      return {
        message: "LOADING",
        loading: this.$attrs.loading
      }
    },
    computed: {
      loadBar () {
        return graphStates.loading * 100
      }
    },
    updated () {
      // this.repeatNodeMove()
      // this.repeatLineMove()
    },
    methods: {
      // repeatNodeMove() {
      //   const letters = this.message.split("")

      //   for (let i=0; i<letters.length; i++) {
      //     let x = Math.sin((2*Math.PI/(letters.length))*i)*140
      //     let y = Math.cos((2*Math.PI/(letters.length))*i)*140
      //     let d = d3.select(`#letter-${i}`).transition().duration(3500/2).style("transform", `translate(${x}px,${y}px)`)
      //                                      .transition().duration(3500/2).style("transform", `translate(${-x}px,${-y}px)`)
      //                                      .on("end", this.repeatNodeMove)
          
      //   }       


      // },
                                        
      // repeatLineMove() {
      //   let nodes = d3.selectAll(".letter-node circle")

      //   let cx = -nodes.node().attributes.cx.value*10
      //   let cy = -nodes.node().attributes.cy.value*10

      //   let x = 0
      //   let y = 0

      //   let lines = d3.selectAll("line")

      //   lines.
      //   transition().delay(3500*0.75).duration(3500/2)
      //   .attr("x1", -cx)
      //   .attr("y1", -cy)
      //   .attr("x2", x)
      //   .attr("y2", y)
      //   .style("transform",(d, i) => {
      //     return `rotate(${ (360/7) * -i}deg)`
      //   })

      //   // .transition().delay(3500/2).duration(3500/2)
      //   // .attr("x1", cx)
      //   // .attr("y1", cy)
      //   // .attr("x2", x)
      //   // .attr("y2", y)
      //   // .style("transform",(d, i) => {
      //   //   return `rotate(${ (360/7) * -i}deg)`
      //   // })

      //   .on("end", this.repeatLineMove)
      // }
    }
  }
</script>

<style lang="scss">
  #loading {
    // display: none;
    // font-family: $global-font;
    // font-size: 50px;
    // stroke-width: 2;
    // stroke: white;
    // transform: translate(450px, 300px);

    text {
      font-family: $global-font;
      font-size: 70px;
      fill: white;
      stroke: white;
      stroke-width: 0.8px;
      opacity: 0;
      text-anchor: middle;
      color: #7A7879;
    }

    // @keyframes progress-highlight {
    //   0% {
    //     transform: translate(0px, 0)
    //   }
    //   14% {
    //     transform: translate(100px, 0)
    //   }
    //   28% {
    //     transform: translate(200px, 0)
    //   }
    //   42% {
    //     transform: translate(300px, 0);
    //   }
    //   56% {
    //     transform: translate(400px, 0)
    //   }
    //   70% {
    //     transform: translate(500px, 0);
    //   }
    //   84% {
    //     transform: translate(600px, 0)
    //   }
    //   98% {
    //     transform: translate(100%, 0)
    //   }
    //   100% {
    //   }
    // }
  }
</style>