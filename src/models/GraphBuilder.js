import GraphEvents from '@models/GraphEvents'
import GraphNode from '@models/GraphNode'
import NewHereInstruction from '@models/NewHereInstruction.js'
import { 
  drawArc,
  setFocus 
} from '@mixins/helpers'
import keyFunctions from '@mixins/keyFunctions.js'
import centeringFunction from '@mixins/centeringFunction.js'
import { 
  graphStates,
  panelStates
} from '@/stores/store.js'
import api from '@mixins/api.js'

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
      node.on("mouseenter", async (e, d) => {
        new GraphNode(d.id).mouseEnter(e)
      })
      .on("mouseleave", (e, d) => {
        new GraphNode(d.id).mouseLeave(e)
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

    keyFunctions.attachNavKeyFunctions(this.viewerBody, zoom, this.simulation)
    
    if (this.graphControlButtons) {
      this.graphControlButtons.style("display", "block").transition().duration(30).style("left", "-30px")
      centeringFunction.attachNavLockEffect(d3.select("#nav-lock-button"), this.simulation)
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
        graphStates.inMotion = true
        d3.selectAll(".character-label").remove()

        if (!event.active) simulation.alphaTarget(1).restart();
        d.fx = d.x;
        d.fy = d.y;

        let thisNode = d3.select(`#${d.id}`)
        thisNode.select("circle").style("stroke", "red")
        thisNode.classed("dragging", true)
      }
      
      function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
      }
      
      function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        
        let thisNode = d3.select(`#${d.id}`)
        thisNode.select("circle").style("stroke", "#7A7879")
        thisNode.classed("dragging", false)

        let lockedNodes = JSON.parse(localStorage.getItem("lockedNodes"))
        let index = lockedNodes.indexByAttr(d, "id")

        if (JSON.parse(localStorage.getItem("sticky"))) {
          let nodeData = { id: d.id, fx: d.fx, fy: d.fy }
          if (index > -1) {
            lockedNodes[index] = nodeData
          } else {
            lockedNodes.pushUniqueByAttr(nodeData, 'id')
          }
          d.x = d.fx;
          d.y = d.fy;
        } else {
          lockedNodes.splice(index, 1)
          d.fx = null;
          d.fy = null;
        }

        localStorage.setItem("lockedNodes", JSON.stringify(lockedNodes))
      }
      
      return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }

    let ln = JSON.parse(localStorage.getItem('lockedNodes'))

    function applySavedCoords(n, ln) {
      if (ln.includesByAttr(n, "id")) {
        let v = ln.filter(d => d.id == n.id)[0]
        n.fx = v.fx;
        n.fy = v.fy;
      }
      return n
    }

    nodes = nodes.map(n => applySavedCoords(n, ln))

    let node = parent.append("g")
      .attr("class", "nodes")
      .attr("stroke-linecap", "round")
      .attr("stroke-linejoin", "round")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("tabindex", (_d, i) => i)
      .attr("class", (d) => {
        let hidden = d.hidden ? "hidden" : ""
        return ['node', d.entity, d.genre, hidden].join(" ")
      })
      .attr("id", d => d.id)
      .attr("name", (d) => d.name)

    // has to be something else
    // if (localStorage.getItem('sticky') == 'true') {
    node.call(drag(this.simulation))
    // } else if (localStorage.getItem('sticky') == 'false') {
      // node.call(drag).on("drag", null)
    // }

    return node
  }

  appendCircle(node) {
    node.append("circle")
      .attr("class", "outline")
      .attr("stroke", this.graph.colors.stroke)
      .attr("stroke-width", 1)
      .attr("r", d => d.r)
      .attr('fill', (d) => {
        // if (d.poster == "") {
        //   return "#7A7879"
        // } else {
          return this.graph.colors.fill
        // }
      })
      .attr("vector-effect", "non-scaling-stroke")
    return node
  }

  appendActorLabel(node){
    const actorLabel = node.append("g")
    .attr("class", "node-label")
    .attr("fill", this.graph.colors.text)
    .attr("text-anchor", "middle")
    
    // if (node.poster != "") {
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
    // }
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
    .attr("class", "initials")
    .attr("text-anchor", "middle")
    .attr("y", (d) => {
      return 15 * (d.r/40)
    })
    .style("font-size", (d) => {
      return `${d.r}px`
    })
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
      // .style("transform", (d) => {
      //   return `scale(${d.r/50})`
      // })
      .style("clip-path", imageProps.clipPath)
    return node
  }

}