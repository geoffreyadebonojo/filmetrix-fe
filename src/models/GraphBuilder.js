import { 
  appStates,
  graphStates 
} from '@/stores/store.js'
import GraphNode from '@models/GraphNode'
import NewHereInstruction from '@models/NewHereInstruction.js'
import { drawArc } from '@mixins/helpers'
import * as d3 from 'd3'


export default class GraphBuilder {
  constructor(args) {
    this.args = args

    this.graphControlButtons = d3.selectAll(".graph-control-buttons")
    this.viewerBody = d3.select(`#${args.containerId}`)
    this.newHere = localStorage.getItem("newHere") === "true" || localStorage.getItem("newHere") === undefined

    this.graph = {
      colors: {
        stroke: "#7A7978",
        fill: "#222222",
        text: "#FFFFFF"
      },
      fontSize: 12
    }
    
    this.node = {
      dimensions: { 
        radius: 50,
        image: {
          offsetX: -39,
          offsetY: -35,
          width: 60,
          height: 70,
          clipPath: "inset(0% 16px round 12px)"
        }
      },
      forces:{
        collide: 60,
        charge: -2700
      }
    }

    this.link = {
      dimensions: {
        length: 200
      }
    }
  }

  build() {
    const link = this.createLinks(
      this.args.innerWrapper, 
      this.args.links)
    const node = this.createNodes(
      this.args.innerWrapper, 
      this.args.nodes)
    this.createViewerBody()
    return [link, node]
  }

  createViewerBody() {
    let zoom = d3.zoom().on('zoom', (e) => {
      this.args.outerWrapper
      .attr("transform", e.transform)
    })
    // out of place here...
    if (this.graphControlButtons) {
      this.graphControlButtons.style("display", "block")
      .transition().duration(30).style("left", "-30px")
      
      d3.select("#centering-button").on("click", (e) => {
        const duration = 1000
        
        d3.select(e.target).style("opacity", "1")
        var transform = d3.zoomIdentity
          .translate(0,0)
          .scale(1)
        
        d3.select(e.target).transition().duration(duration).style("opacity", "0.5")
        this.viewerBody.transition().duration(duration)
          .call(zoom.transform, transform);
        return this.viewerBody
      })
    }
    
    this.viewerBody.call(zoom)
                   .call(zoom).on("dblclick.zoom", null)
    
    return this.viewerBody
  }

  createLinks(parent, links) {
    const link = this.buildLinks(parent, links)
    return link
  }

  createNodes(parent, nodes) {
    const node = this.buildNode(parent, nodes)
    this.appendCircle(node)
    this.appendImage(node)
    // if (graphStates.graphType == "tree") {
    this.appendActorLabel(node)
    // }
    this.attachMouseEvents(node)
    return node
  }

  buildLinks(parent, links) {
    let link = parent.append("g")
      .attr("class", "links")
      .selectAll("g")
      .data(links)
      .enter()
      .append("g")
      .attr("class", "link")
      .attr("source", (d => d.source.id))
      .attr("target", (d => d.target.id))
      .append("line")
      .attr("class", "line")
      .attr("stroke", this.graph.colors.stroke)

    // if (graphStates.graphType == "tree") {
      link
      .attr("stroke-width", "1px")
      .attr("vector-effect", "non-scaling-stroke")
      .style("display", "block")
    // }
    return link
  }

  buildNode(parent, nodes) {
    let node = parent.append("g")
      .attr("class", "nodes")
      .attr("stroke-linecap", "round")
      .attr("stroke-linejoin", "round")
      .selectAll("g")
      .data(nodes,(d) => {
        // also defined in Simulation.js:73
        // if (graphStates.graphType == "tree") {

        /////// Set further upstream?
        d.r = 50
        ////////

        // } else if (graphStates.graphType == "pack") {
        //   d.r = d.popularity * 1.5
        // }
        return d
      })
      .join("g")
      .attr("tabindex", (_d, i) => {
        return i
      })
      .attr("class", (d) => {
        return 'node ' + d.type.join(" ")
      })
      .attr("id", d => d.id)
    return node
  }

  appendCircle(node) {
    node.append("circle")
      .attr("class", "outline")
      .attr("stroke", this.graph.colors.stroke)
      .attr("stroke-width", 1)
      .attr("r", d => d.r)
      .attr('fill', this.graph.colors.fill)
      .attr("vector-effect", "non-scaling-stroke")
    return node
  }

  appendActorLabel(node){
    const actorLabel = node.append("g")
    .attr("class", "node-label")
    .attr("fill", this.graph.colors.text)
    .attr("text-anchor", "middle")
    
    actorLabel.append("path")
    .attr("d", d => drawArc(d))
    .attr("fill", this.graph.colors.fill)
    
    actorLabel.append("g").attr("class", "text-container").selectAll("text")
    .data((d) => {
      return d.name.split("").slice(0,50).map(function (f) {
        return {letter: f, r: d.r}
      }, d)
    })
    .enter()
    .append("text")
    .text(d => d.letter)
    .style("font-size", `${this.graph.fontSize}`)
    .style("font-family", "Dosis, sans-serif")
    .style("text-transform", "uppercase")
    .style("transform", (d, i, a) => {
      let theta = (i- (a.length/2))* 7
      return `rotate(${theta}deg)translateY(${-d.r+2}px)`
    })
  }

  appendImage(node) {
    node.append("svg:image")
      .attr("class", "poster")
      .attr('x', this.node.dimensions.image.offsetX)
      .attr('y', this.node.dimensions.image.offsetY)
      .attr('width', this.node.dimensions.image.width)
      .attr('height', this.node.dimensions.image.height)
      .attr("xlink:href", d => d.poster)
      .style("transform", (d) => {
        return `scale(${d.r/50})`
      })
      .style("clip-path", this.node.dimensions.image.clipPath)
    return node
  }

  attachMouseEvents(target) {
    if (this.newHere) {
      const instructionLabel = new NewHereInstruction(target, this)
      instructionLabel.addInstructionHover()

    } else {
      node.on("mouseenter", (e, d) => {        
        const gn = new GraphNode(d.id)
        gn.nodeTransformer("scale(1.03)", "aliceblue", "white", "#FFFFFF")

        if (!graphStates.inMotion) {
          gn.linkHighlighter()
        }

        // if (e.altKey) {
        //   console.log(e.altKey)
        //   d3.select(`#${d.id}`).classed("scissors", true)
        // }
      })
      .on("mouseleave", (e, d) => {
        
        const gn = new GraphNode(d.id)
        gn.nodeTransformer("scale(1)", this.settings.strokeColor, "none", "#222222")

        if (!graphStates.inMotion) {
          d3.selectAll(".character-label").remove()
        }

        // d3.select(`#${d.id}`).classed("scissors", false)
      })
    }
  }
}