import * as d3 from 'd3'
import { aboutUsData } from "@mixins/aboutUsData.js"
import Graph from '@models/Graph.js'
import Simulation from '@models/Simulation.js'
import { store } from '@/stores/store.js'
import focusHelper from "@/mixins/focusHelper"

export default {
  name: "aboutGraph",
  data () {
    return {
      details: {
        pierce: {
          id: "pierce",
          name: "pierce",
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
          name: "geoff",
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
                    You're using it now! Great work!`,
                    // The data comes from the wonderful TMDb API. 
                    // The visualizations use the D3.js library (v4 if you want to know).,
          media_type: "about",                                         
          poster: "/filmetrix-logo.png",
          role: ""
        }
      }
    }
  },
  draw () {
    store.detailsData = {}
    const links = aboutUsData.links
    const nodes = aboutUsData.nodes
    const graphType = "aboutGraphType"
    const containerId = "about-graph-container"
    const outerWrapperId = "about-outer-wrapper"
    const innerWrapperId = "about-inner-wrapper"

    d3.select(`#${innerWrapperId}`).remove()
    
    const outerWrapper = d3.select(`#${outerWrapperId}`)
    const innerWrapper = outerWrapper.append("g").attr("id", innerWrapperId)

    const simulation = new Simulation({nodes, 
                                        links,
                                        graphType}).body

    const [link, node] = new Graph({links, 
                                    nodes,
                                    containerId,
                                    innerWrapper,
                                    outerWrapper}).build()
    
    d3.select("#save-button").classed("locked", false).classed("unlocked", true)

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
      const details = this.data().details[d.id]

      // store.detailsData = details
      // store.currentDetailId = details.id

      const aboutContainer = d3.selectAll(".about-details")

      aboutContainer.attr("id", details.name)

      aboutContainer.select("#poster").attr("src", details.poster)
      aboutContainer.select("#name").html(details.name)
      aboutContainer.select("#job").html(details.role)
      aboutContainer.select("#linked-in").attr("xlink:href", details.linkedIn)
      aboutContainer.select("#description").html(details.description)

      focusHelper.methods.set('details')
    })
  }
}
