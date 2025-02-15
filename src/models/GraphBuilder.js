import GraphEvents from '@models/GraphEvents'
import NewHereInstruction from '@models/NewHereInstruction.js'
import { drawArc } from '@mixins/helpers'
import keyFunctions from '@mixins/keyFunctions.js'
import centeringFunction from '@mixins/centeringFunction.js'

import * as d3 from 'd3'

export default class GraphBuilder {
  constructor(args, simulation) {
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

    this.simulation = simulation
  }
  
  attachMouseEvents(node) {
    if (this.newHere) {
      const instructionLabel = new NewHereInstruction(node, this)
      instructionLabel.addInstructionHover()
    } else {
      node.on("mouseenter", (e, d) => {      
        new GraphEvents(d.id).mouseEnterNode(e)
      })
      .on("mouseleave", (e, d) => {
        new GraphEvents(d.id).mouseLeaveNode(e)
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

    keyFunctions.attachNavKeyFunctions(this.viewerBody, zoom)
    
    if (this.graphControlButtons) {
      this.graphControlButtons.style("display", "block").transition().duration(30).style("left", "-30px")
      
      centeringFunction.attachNavLockEffect(d3.select("#nav-lock-button"))
      centeringFunction.attachCenteringEffect(d3.select("#centering-button"), this.viewerBody, zoom)
    }

    this.viewerBody.call(zoom)
                   .call(zoom).on("dblclick.zoom", null)
    
    return this.viewerBody
  }

  //////////////////

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

  /////////////////

  buildLinks(parent, links) {
    let link = parent.append("g")
      .attr("class", "links")
      .selectAll("g")
      .data(links)
      .enter()
      .append("g")
      .attr("class", "link")
      .attr("id", d => d.id)
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

    const drag = simulation => {
      function dragstarted(event, d) {
        if (event.sourceEvent.shiftKey) {
          if (!event.active) simulation.alphaTarget(0.8).restart();
          d.fx = d.x;
          d.fy = d.y;
        }
      }
      
      function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
      }
      
      function dragended(event, d) {
        let es = event.sourceEvent
        if (!event.active) simulation.alphaTarget(0);
        if (es.shiftKey && es.getModifierState('CapsLock')) {
          d.x = d.fx;
          d.y = d.fy;
        } else if (es.shiftKey) {
          d.fx = null;
          d.fy = null;
        }
      }
      
      return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }

    let node = parent.append("g")
      .attr("class", "nodes")
      .attr("stroke-linecap", "round")
      .attr("stroke-linejoin", "round")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("tabindex", (_d, i) => i)
      .attr("class", (d) => {
        return ['node', d.entity, d.genre].join(" ")
      })
      .attr("id", d => d.id)
      .attr("name", (d) => d.name)
      .call(drag(this.simulation))
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
    const imageProps = { 
      offsetX: -39,
      offsetY: -35,
      width: 60,
      height: 70,
      clipPath: "inset(0% 16px round 12px)"
    }

    let posterless = node.filter((n) => {
      return n.poster == ""
    })

    posterless.append("text").text((n) => {
      return n.name.split(" ").map(m => m[0]).first(2).join("")
    })
      .attr("text-anchor", "middle")
      .attr("y", "15")
      .style("font-size", `40px`)
      .style("font-family", "Dosis, sans-serif")
      .style("text-transform", "uppercase")
      .style("fill", "#7A7879")

    
      let posterful = node.filter((n) => {
      return n.poster != ""
    })

    posterful.append("svg:image")
      .attr("class", "poster")
      .attr('x', imageProps.offsetX)
      .attr('y', imageProps.offsetY)
      .attr('width', imageProps.width)
      .attr('height', imageProps.height)
      .attr("xlink:href", d => d.poster)
      .style("transform", (d) => {
        return `scale(${d.r/50})`
      })
      .style("clip-path", imageProps.clipPath)
    return node
  }

}