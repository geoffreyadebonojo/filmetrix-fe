<script setup>
  import focusHelper from "@/mixins/focusHelper"
  import * as d3 from 'd3'
</script>

<template>
  <div class="details-container" id="about-us-details">
    <img id="about-poster" class="">
    <div id="about-name"></div>
    <div id="about-description"></div>
  </div>
  <svg id="about-graph-container">
    <g id="about-outer-wrapper"></g>
  </svg>
</template>

<script>
  export default {
    name: "AboutView",
    data () {
      return {
        detailsData: {
          nodes: [
            {
              id: 'geoff',
              name: "Geoff",
              poster: "/geoff-pixel.png",
              type: [],
              description: "Rails • React • Ember • SCSS, SASS, CSS,etc. • Javascript/jQuery • RESTful JSON APIs Mysql • A/B Testing • Stripe pay processing • Jenkins CI • RSpec • Redis/ Sidekiq • Git/Github proficient • Kanban/Agile Web-scraping / data extraction DevOping public APIs Gathering and manipulating data Making visual maps Getting D3 to work half the time Finding excuses to use GraphQL Animations / natural simulations",
              r: 50,
              c: 100,
              i: 50
            },
            {
              id: 'pierce',
              name: "Pierce",
              poster: "/pierce-pixel.png",
              type: [],
              description: "Experienced designer specializing in marketing collateral materials and mass emails—internal and external, print and digital. From real estate and the mortgage industry to B2B and eCommerce; be it corporate and clean or something more creative and experimental, I love expanding a company's visual language and bringing the brand to life.",
              r: 50,
              c: 80,
              i: 50
            },
            {
              id: "filmetrix",
              name: "Filmetrix",
              poster: "/filmetrix-logo.png",
              type: [],
              description: "Filmetrix visualizes data for networking movies and their cast and crew. The data comes from the wonderful TMDb API. The visualizations use the D3.js library (v4 if you want to know). So here's how it works. More or less. Click here when you're ready to get graphin'!",
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
        },
        currentDetails: {
          ndoes: []
        }
      }
    },
    mounted () {
      focusHelper.methods.set('about')

      const nodes = this.detailsData.nodes
      const links = this.detailsData.links

      var simulation = d3.forceSimulation(nodes, links)
      simulation
        .force("link", d3.forceLink(links).id(d => d.id).distance(220))
        .force("charge", d3.forceManyBody().strength(200))
        .force('collide', d3.forceCollide(d => d.c))
        .force("center", d3.forceCenter(window.innerWidth/2, window.innerHeight/5))
        .alpha(1)
        .alphaTarget(0.99999)

      const innerWrapper = d3.select("#about-outer-wrapper")
      .append("g")
      .attr("id", "about-inner-wrapper")
      .style("transform", "translateY(40%)")

      const link = innerWrapper.append("g")
          .attr("class", "links")
          .selectAll("path")
          .data(links)
          .join("path")
          .attr("class", "link")
          .attr("source", (d => d.source.id))
          .attr("target", (d => d.target.id))
          .attr("stroke", "#7A7978")
          .attr("stroke-width", 3)
          .attr("vector-effect", "non-scaling-stroke")
  
      const node = innerWrapper.append("g")
          .attr("class", "nodes")
          .attr("fill", "currentColor")
          .attr("stroke-linecap", "round")
          .attr("stroke-linejoin", "round")
          .selectAll("g")
          .data(nodes)
          .join("g")
          .attr("class", (d) => {
            return 'node ' + d.type.join(" ")
          })
          .attr("id", d => d.id)

      ///////////////////////////////////////
  
      node.append("circle")
          .attr("stroke", "#7A7978")
          .attr("stroke-width", 3)
          .attr("r", d => d.r)
          .attr('fill', '$graph-body-grey')
          .attr("vector-effect", "non-scaling-stroke")
  
      node.append("svg:image")
          .attr('x', d => -d.i )
          .attr('y', d => -d.i )
          .attr('width', d => d.i*2)
          .attr('height', d => d.i*2)
          .attr("xlink:href", d => d.poster)

      node.on("click", (_e, d) => {
        d3.select("#about-poster").attr("src", d.poster)
        .style("width", () => {
          if (d.name == "Filmetrix") {
            return "120px"
          } else {
            return "220px"
          }
        })
        .style("margin", () => {
          if (d.name == "Filmetrix") {
            // return "0 0 95px 95px"
          // } else {
            return "40px 0 0 65px"
          }
        })

        d3.select("#about-name").html(d.name)
        // .transition().duration(300)
        .style("transform", "scale(1)")
        .style("left", "0px")
        d3.select("#about-description").html(d.description)
      })

      simulation.on("tick", () => {
        link.attr("d", (d) => {
          return `M${d.source.x},${d.source.y}A0,0 0 0,1 ${d.target.x},${d.target.y}`
        })
        node.attr("transform", d => `translate(${d.x},${d.y})`);
      })
    }
  }
</script>

<style>
  #about-graph-container {
    background: $graph-body-grey;
    width: 100%;
    height: 100vh;
    display: flex;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1
  }

  .details-container {
    height: 100%;
    width: 100%;
    display: grid;
    grid-template-columns: 175px 25px 1fr;
    grid-template-rows: 200px 25px 1fr;
    padding: 10px;
    /* gap: 10px; */
    grid-template-areas:
    "about-poster . about-name"
    ". . ."
    "about-desc about-desc about-desc";

    overflow: hidden;
  }

  #about-poster {
    grid-area: about-poster;
    width: 220px;
    margin: auto;
  }

  #about-name {
    grid-area: about-name;
    position: relative;
    left: -115px;
    transform: scalex(0);
    font-family: $global-font;
    width: 100%;
    margin: auto 0 10px 0;
    font-size: 70px;
    letter-spacing: 3px;
    font-weight: 900;
    text-transform: uppercase;
    color: white;
    text-shadow: 1px 0px black;
    transform-origin: left;
  }

  #about-description {
    grid-area: about-desc;
    font-family: $global-font;
    margin-top: 0px;
    height: 100%;
    width: 100%;
    line-height: 26px;
    letter-spacing: 0.07em;
    color: white;
    text-shadow: 1px 0px black;
    overflow-y: auto;
    font-size: 20px;
    font-weight: 900;
    line-height: 26px;
    letter-spacing: 0.002em;
  }
</style>

