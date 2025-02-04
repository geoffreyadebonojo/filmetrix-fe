import { 
  panelStates,
  graphStates 
} from '@/stores/store.js'
import GraphNode from '@models/GraphNode'
import GraphEvents from '@models/GraphEvents'
import NewHereInstruction from '@models/NewHereInstruction.js'
import { drawArc } from '@mixins/helpers'
import api from '@mixins/api.js'

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
      }
    }
    
    this.image = { 
      offsetX: -39,
      offsetY: -35,
      width: 60,
      height: 70,
      clipPath: "inset(0% 16px round 12px)"
    }
  }
  
  attachMouseEvents(node) {
    if (this.newHere) {
      const instructionLabel = new NewHereInstruction(node, this)
      instructionLabel.addInstructionHover()
      
    } else {
      node.on("mouseenter", (_e, d) => {      
        new GraphEvents(d.id).mouseEnterNode()
      })
      .on("mouseleave", (_e, d) => {
        new GraphEvents(d.id).mouseLeaveNode()
      })
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
    const zoom = d3.zoom().on('zoom', (e) => {
      d3.select("#main-outer-wrapper").attr("transform", e.transform)
    })
    .on('end', (e) => {
      // localStorage.setItem('currentZoom', e.transform)
    })

    const er = this.viewerBody
    let d

    let anchors = graphStates.existing.map((n) => n[0])
    let currentIndex = anchors.indexOf(panelStates.detailsData.id)
    let currentAnchor
    let zoomLevel = 2.5
    let centering = { x: window.innerWidth *  0.5, 
                      y: window.innerHeight * 0.4 }

    let prevAnchor, prevLinks, prevTargs
    
    d3.select("body").on("keydown.nav", async function(event) {
      if (["ArrowUp", "ArrowDown"].includes(event.key)) {
        if (event.key == "ArrowUp" && zoomLevel < 5) {
          zoomLevel -= 0.5
        } else if (event.key == "ArrowDown" && zoomLevel > 0.5) {
          zoomLevel += 0.5
        }

        currentAnchor = anchors[ currentIndex % anchors.length ]
        let node = d3.select(`#${currentAnchor}`)
        d = node.data()[0]
        er.transition().duration(500).call(
          zoom.transform, 
          d3.zoomIdentity.translate(centering.x, centering.y)
                         .scale(zoomLevel)
                         .translate(-d.x, -d.y))

      } else if (["ArrowRight", "ArrowLeft"].includes(event.key)) {
        if (event.key == "ArrowRight") {
          currentIndex += 1
        } else if (event.key == "ArrowLeft") {
          currentIndex -= 1
        }

        if (currentIndex < 0) {
          currentIndex = anchors.length-1
        } else if (currentIndex > anchors.length-1) {
          currentIndex = 0
        }

        if (graphStates.pageSearchActive) {
          anchors = graphStates.matching
        } else {
          anchors = graphStates.existing.map((n) => n[0])
        }

        currentAnchor = anchors[ currentIndex ]

        d3.selectAll(".node").classed("poster-highlight", false)
        let gn = new GraphNode(currentAnchor)

        if (prevAnchor) { prevAnchor.circle.style("stroke", "#7A7879").style("stroke-width", "1")}
        if (prevLinks) {  prevLinks.selectAll(".line").style("stroke", "#7A7879").style("stroke-width", "1")}
        if (prevTargs) {  prevTargs.select("circle").style("stroke", "#7A7879").style("stroke-width", "1")}
        
        gn.circle.style("stroke", "gold")
        gn.allLinks.selectAll(".line").style("stroke", "lightgreen").style("stroke-width", "2")
        gn.connections.select("circle").style("stroke", "lightgreen")

        gn.node.moveToFront()
        d = gn.node.data()[0]
        er.transition().duration(500).call(
          zoom.transform, 
          d3.zoomIdentity.translate(centering.x, centering.y)
                         .scale(zoomLevel)
                         .translate(-d.x, -d.y))

        gn.node.classed("poster-highlight", true)

        const dc = d3.selectAll(".details-component")
        dc.style("left", () => { return `${currentIndex*100}%`})
        dc.transition().duration(500).style("left", "0%")

        prevAnchor = gn
        prevLinks = gn.allLinks
        prevTargs = gn.connections

        await api.fetchDetails(currentAnchor) 

      }
    })
    
    if (this.graphControlButtons) {
      this.graphControlButtons.style("display", "block")
      .transition().duration(30).style("left", "-30px")

      d3.select("#centering-button").on("click", (e) => {
        const duration = 1000
        d3.selectAll(".node").classed("poster-highlight", false)
        d3.select(e.target).style("opacity", "1")
        d3.select(e.target).transition().duration(duration).style("opacity", "0.5")
        this.viewerBody.transition().duration(duration)
        .call(zoom.transform, () => {
          return d3.zoomIdentity
            .translate(0,0)
            .scale(1)
          });
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
    this.appendActorLabel(node)
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
      .attr("id", (d) => d.id)
      .attr("source", (d => d.source.id))
      .attr("target", (d => d.target.id))
      .append("line")
      .attr("class", "line")
      .style("stroke", this.graph.colors.stroke)

    link
    .attr("stroke-width", "1px")
    .attr("vector-effect", "non-scaling-stroke")
    .style("display", "block")
    return link
  }

  buildNode(parent, nodes) {
    let node = parent.append("g")
      .attr("class", "nodes")
      .attr("stroke-linecap", "round")
      .attr("stroke-linejoin", "round")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("tabindex", (_d, i) => i)
      .attr("class", (d) => d.genre)
      .attr("id", d => d.id)
      .attr("name", (d) => d.name)
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
    .style("font-size", (d) => {
      return d.r/5
    })
    .style("font-family", "Dosis, sans-serif")
    .style("text-transform", "uppercase")
    .style("transform", (d, i, a) => {
      let theta = (i- (a.length/2))* 7
      return `rotate(${theta}deg)translateY(${-d.r + (d.r/10) }px)`
    })
  }

  appendImage(node) {
    node.append("svg:image")
      .attr("class", "poster")
      .attr('x', this.image.offsetX)
      .attr('y', this.image.offsetY)
      .attr('width', this.image.width)
      .attr('height', this.image.height)
      .attr("xlink:href", d => d.poster)
      .style("transform", (d) => {
        return `scale(${d.r/50})`
      })
      .style("clip-path", this.image.clipPath)
    return node
  }

}