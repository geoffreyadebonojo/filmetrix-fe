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
  <head>
    <link href=/geoff-pixel.png rel=preload as=image>
    <link href=/pierce-pixel.png rel=preload as=image>
  </head>
  <div class="graph-container" id="about-graph-component">
    <svg v-if="appStates.displayingAbout" id="about-graph-container" viewBox="320 200 600 600">
      <g id="about-outer-wrapper" class="outer-wrapper"></g>
    </svg>
  </div>
</template>

<script>
  export default {
    name: "AboutComponent",
    data () {
      return {
        details: {
          pierce: {
            id: "pierce",
            name: "pierce siebers",
            description: 
                    `Experienced designer specializing in marketing collateral materials and mass emails—internal and external, 
                      print and digital. From real estate and the mortgage industry to B2B and eCommerce; 
                      be it corporate and clean or something more creative and experimental, 
                      I love expanding a company's visual language and bringing the brand to life.`,
            media_type: "about",
            poster: "/pierce-pixel.png",
            linkedIn: "https://www.linkedin.com/in/piercesiebers",
            role: "product designer"
          },
          geoff: {
            id: "geoff",
            name: "geoff adebonojo",
            description: 
                    `Front-end, Back-end, whatever. 
                      Rails • React • Ember • SCSS, SASS, CSS,etc.
                      • Javascript/jQuery • RESTful JSON APIs Mysql • A/B Testing 
                      • Stripe pay processing • Jenkins CI • RSpec 
                      • Redis/ Sidekiq • Git/Github proficient • Kanban/Agile Web-scraping 
                      / data extraction DevOping public APIs Gathering and manipulating 
                      data Making visual maps Getting D3 to work half the time Finding 
                      excuses to use GraphQL Animations / natural simulations`,
            media_type: "about",
            poster: "/geoff-pixel.png",
            linkedIn: "https://www.linkedin.com/in/geoffrey-adebonojo",
            role: "software engineer"
          },
          filmetrix: {
            id: "filmetrix",                                          
            name: "filmetrix",                                          
            description: 
                    `Filmetrix visualizes data for networking movies and their cast and crew.
                      You're using it now! Great work!
                      The data comes from the wonderful TMDb API.`,
                      // The visualizations use the D3.js library (v4 if you want to know).,
            media_type: "about",                                         
            poster: "/filmetrix-logo.png",
            role: ""
          }
        },
        graphData: {
          nodes: [
            {
              id: 'geoff',
              name: "Geoff Adebonojo",
              poster: "/geoff-pixel.png",
              type: [],
              // description: "Rails • React • Ember • SCSS, SASS, CSS,etc. • Javascript/jQuery • RESTful JSON APIs Mysql • A/B Testing • Stripe pay processing • Jenkins CI • RSpec • Redis/ Sidekiq • Git/Github proficient • Kanban/Agile Web-scraping / data extraction DevOping public APIs Gathering and manipulating data Making visual maps Getting D3 to work half the time Finding excuses to use GraphQL Animations / natural simulations",
              r: 50,
              c: 100,
              i: 50
            },
            {
              id: 'pierce',
              name: "Pierce Seibers",
              poster: "/pierce-pixel.png",
              type: [],
              // description: "Experienced designer specializing in marketing collateral materials and mass emails—internal and external, print and digital. From real estate and the mortgage industry to B2B and eCommerce; be it corporate and clean or something more creative and experimental, I love expanding a company's visual language and bringing the brand to life.",
              r: 50,
              c: 80,
              i: 50
            },
            {
              id: "filmetrix",
              name: "Filmetrix",
              poster: "/filmetrix-logo.png",
              type: [],
              // description: "Filmetrix visualizes data for networking movies and their cast and crew. The data comes from the wonderful TMDb API. The visualizations use the D3.js library (v4 if you want to know). So here's how it works. More or less. Click here when you're ready to get graphin'!",
              r: 70,
              c: 70,
              i: 50
            }
          ],
          links: [
            {
              source: "filmetrix",
              target: 'geoff',
              roles: ['Software Engineer']
            },
            {
              source: "filmetrix",
              target: "pierce",
              roles: ['Product Designer']
            }
          ]
        }
      }
    },
    updated () {
      this.draw()
    },

    methods: {
      draw () {
        panelStates.detailsData = {}
        const links = this.$data.graphData.links
        const nodes = this.$data.graphData.nodes
        const s = settings("about")

        const graphType = s.graphType
        const containerId = s.containerId
        const outerWrapperId = s.outerWrapperId
        const innerWrapperId = s.innerWrapperId

        d3.select(`#${innerWrapperId}`).remove()
        
        const outerWrapper = d3.select(`#${outerWrapperId}`)
        const innerWrapper = outerWrapper.append("g").attr("id", innerWrapperId)

        const simulation = new Simulation({ nodes, 
                                            links,
                                            graphType }).body

        const [link, node] = new GraphBuilder({links, 
                                        nodes,
                                        containerId,
                                        innerWrapper,
                                        outerWrapper }).build()
        
        d3.select("#link-to-button").classed("locked", false).classed("unlocked", true)

        this.attachNodeClickActions(node)

        simulation.on("tick", () => {
          link.attr("x1", d => d.source.x)
              .attr("y1", d => d.source.y)
              .attr("x2", d => d.target.x)
              .attr("y2", d => d.target.y)

          node.attr("transform", d => `translate(${d.x},${d.y})`);
        })
        
        return innerWrapper.node();
      },

      attachNodeClickActions(node) {
        node.on('click', async (_e, d) => {
          const details = this.$data.details[d.id]

          const aboutContainer = d3.selectAll(".about-details")

          aboutContainer.attr("id", details.name)
          aboutContainer.select("#poster").attr("src", details.poster)
          aboutContainer.select("#name").html(details.name)
          aboutContainer.select("#job").html(details.role)
          aboutContainer.select("#linked-in").attr("href", () => details.linkedIn)
          aboutContainer.select("#description").html(details.description)
          aboutContainer.select("#linked-in img").style("display", () => {
            return details.name == "filmetrix" ? "none" : "block"
          })

          aboutContainer.select("#tmdb-attribution").style("display", () => {
            return details.name == "filmetrix" ? "block" : "none"
          })
          
          
          setFocus('details')
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  #about-graph-container {
    height: 100vh;
    position: absolute;
    top: 0px;
    right: 0px;
    background: $graph-body-grey;
  }
</style>