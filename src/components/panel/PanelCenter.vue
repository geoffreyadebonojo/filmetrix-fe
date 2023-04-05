<script setup>
  import SearchResultComponent from '@panel/sections/SearchResultComponent.vue'
  import DetailsComponent from '@panel/sections/DetailsComponent.vue'
  import CommandsComponent from '@panel/sections/CommandsComponent.vue'
  import api from '@/mixins/api'
  import helpers from '@/mixins/helpers'
  import focusHelper from '@/mixins/focusHelper'
  import graph from '@/mixins/graph'
  import { store } from '@/stores/store.js'
  import * as d3 from 'd3'
</script>

<template>
  <div id="panel-center" style="height:142%;zoom:100%">
      <!-- use search result data? later -->
    <div v-if="store.displayingAbout" class="about-details">
      <img id="poster" src=""/>
      <div id="name-container">
        <div id="name"></div>
        <div id="job"></div>
      </div>
      <div id="links">
        <a id="linked-in" href="" target="_blank">
          <!-- img -->
        </a>
      </div>
      <div id="description"></div>
    </div>

    <details-component class="details-component" v-else-if="store.currentFocus === 'details' && store.currentDetailId !== false">
    </details-component>

    <commands-component v-else-if="store.currentFocus === 'commands'">
    </commands-component>
    
    <div id="empty-field" v-else-if="store.currentFocus === 'empty'" @click="focusSearchBar()">
      <div id="search-prompt">
        <p class="apply-effect">search for a movie or actor</p>
      </div>

      <div id="show-you-around-prompt" v-if="$data.newHere">
        <p style="margin:5vh">
          or
        </p>
        <p class="apply-effect">
          have a look around
        </p>
      </div>

      <div id="resume-prompt" v-else-if="$data.hasSavedGraph">
        <p style="margin:5vh">
          or
        </p>
        <router-link to="#details">
          <p class="apply-effect" @click="resume()">
            pick up where you left off
          </p>
        </router-link> 
      </div>
      <div v-else></div>
    </div>

    <search-result-component v-else class="result-component">
    </search-result-component>

    <div id="nav-arrows" v-if="showNavArrows">
      <div id="left-arrow">
        <img v-if="showLeftArrow"
        src="/angle-double-small-left.svg" 
        @click="adjustId(-1)">
      </div> 
      <div id="right-arrow">
        <img v-if="showRightArrow"
        src="/angle-double-small-right.svg" 
        @click="adjustId(1)">
      </div>
    </div>
    <div v-else></div>
  </div>
</template>

<script>
  export default {
    name: "PanelCenter",
    components: {
      SearchResultComponent,
      DetailsComponent,
      CommandsComponent
    },
    data () {
      return {
        currentDetailSubjectId: '',
        hasSavedGraph: false,
        newHere: JSON.parse(localStorage.getItem("newHere"))
      }
    },
    computed: {
      showNavArrows: () => {
        return store.currentFocus === 'details' && store.currentDetailId !== false && store.displayingAbout == false
      },
      showLeftArrow: () => {
        return store.existing.length > 1 && store.existing[0][0] !== store.currentDetailId
      },
      showRightArrow: () => {
        return store.existing.length > 1 && store.existing.last()[0] !== store.currentDetailId
      }
    },
    mounted () {
      d3.select("#search-prompt").transition().delay(200).duration(200).style("opacity", 1)
      const saved = JSON.parse(localStorage.getItem("lockedGraph"))
      
      if (saved == null || saved.length == []) {
        this.$data.hasSavedGraph = false
      } else {
        this.$data.hasSavedGraph = true
      }
      
    },
    methods: {
      focusSearchBar() {
        document.querySelector('#search-text').focus()
      },

            
      async adjustId(i) {
        const dc = d3.selectAll(".details-component")
        
        dc
        .style("left", () => {
          return `${i*100}%`
        })
        
        let ids = store.existing.map(d => d[0])
        let currentIndex = ids.indexOf(store.currentDetailId)
        let changeId
        
        changeId = ids[currentIndex + i]
        
        await api.fetchDetails(changeId)
        
        dc.transition()
        .duration(500)
        .style("left", "0%")
      },

      async resume () {
        const saved = localStorage.getItem("lockedGraph")

        store.isLocked = true

        if (saved !== null) {
          store.existing = JSON.parse(saved)
          await api.fetchGraphData(
            store.existing.unique().map(d => d[0])
          )

          await api.fetchDetails(store.existing.last()[0])

          let data
          let nodes = []
          let links = []

          store.existing.forEach((d) => {
            data = store.graphData[d[0]]
            nodes = nodes.concat(data.nodes.slice(0,d[1]+1))
            links = links.concat(data.links.slice(0,d[1]))
          })

          store.graphTypes =  helpers.getTypes(nodes)
          store.currentFocus = 'search'

          graph.draw({
            nodes: nodes.uniqueById(),
            links: links,
            type: "main"
          })      

          const lockButton = d3.select("#lock-button")
          lockButton.classed("unlocked", false).classed("locked", true)
          focusHelper.methods.set('details')
        }
      }
    }
  }
</script>


<style scoped lang="scss">


  #filmetrix {
    #poster {
      width: 108px;
      left: -3px;
      bottom: 8px;
    }
    #name {
      margin: 100px 0px 0px -14px;
    }
  }

  #geoff, #pierce {
    #poster {
      width: 168px;
      right: 37px;
      bottom: 7px;
    }

    #job {
      // font-family: $global-font;
      font-size: 12px;
      line-height: 12px;
      margin-top: 12px;
    }

    #name {
      left: 20px;
      top: 25px;
    }
  }

  .about-details {
    font-family: $global-font;
    
    #links {
      right: 30px;
      top: 10px;

      #linked-in > img {
        width: 20px;
      }
    }
  }

  #nav-arrows {
    grid-area: arrows;

    display: flex;
    justify-content: space-between;

    // top: 175px;
    z-index: 7;

    img {
      height: 25px;
    }
    
    #left-arrow, #right-arrow {
      opacity: 0.5;
      
      &:hover {
        cursor: $cursor;
        opacity: 1;
      }
    } 
  }
  

  .result-component {
    height: 100%;
    right: 100%;
  }  

  #empty-field {
    height: 100%;

    #search-prompt, 
    #show-you-around-prompt, 
    #resume-prompt {
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
      .apply-effect:hover {
        cursor: $cursor;
        animation-name: pulsate;
        animation-duration: 1.4s;
        animation-iteration-count: infinite;
        animation-timing-function: linear;
      }
    }
  }

  @keyframes pulsate {
    0% {
      transform: scale(1);
      opacity: 0.5;

    }
    50% {
      transform: scale(1.005);
      opacity: 0.8;
    }
    100% {
      transform: scale(1);
      opacity: 0.5;
    }
  }


  @media screen and (max-width: 400px) {
    .details-component {
      padding: 2%;
    }
  }

  #panel-center {
    grid-area: panel-center;
    overflow-y: auto;
  }

</style>
