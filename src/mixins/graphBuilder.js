import { settingsModule } from './settingsModule.js'
import { store } from '@/stores/store.js'
import * as d3 from 'd3'

export default {
  data () {
    return {
      settings: settingsModule,
      doubleClickInterval: 300,
      strokeColor: "#7A7978",
      bodyGrey: "#222222",
      first: false //
    }
  },

  createLinks(parent, links) {
    const link = this.buildLinks(parent, links)
    return link
  },

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
      .attr("stroke", this.data().strokeColor)
      .attr("stroke-width", "1px")
      .attr("vector-effect", "non-scaling-stroke")
    return link
  },

  createNodes(parent, nodes) {
    const node = this.buildNode(parent, nodes)
    this.appendCircle(node)
    this.appendImage(node)
    this.appendActorLabel(node)
    this.attachMouseEvents(node)
    return node
  },

  buildNode(parent, nodes) {
    let node = parent.append("g")
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
    return node
  },

  appendCircle(node) {
    node.append("circle")
      .attr("class", "outline")
      .attr("stroke", this.data().strokeColor)
      .attr("stroke-width", 1)
      .attr("r", (d) => {
        return this.data().settings.defaults.node.circle.r
      })
      .attr('fill', this.data().bodyGrey)
      .attr("vector-effect", "non-scaling-stroke")
    return node
  },

  appendActorLabel(node){
    const r = -this.data().settings.defaults.node.circle.r

    const actorLabel = node.append("g")
    .attr("class", "node-label")
    .attr("fill", "white")
    .attr("text-anchor", "middle")

    actorLabel.append("path")
    .attr("d", (f) => {
     return this.drawArc(f)
    })
    .attr("fill", this.data().bodyGrey)

    actorLabel.append("g").attr("class", "text-container").selectAll("text")
    .data((d) => {
      return d.name.split("").slice(0,50)
    })
    .enter()
    .append("text")
    .text(d => d)
    .style("font-size", "12px")
    .style("font-family", "Dosis, sans-serif")
    .style("text-transform", "uppercase")
    .style("transform", (d, i, a) => {
      let theta = (i- (a.length/2))* 7
      return `rotate(${theta}deg)translateY(${r+2}px)`
    })
  },

  drawArc(d){
    const degrees = d.name.length * 7
    const arc = d3.arc()
      .innerRadius(44)
      .outerRadius(64)
      .startAngle((-degrees -12 )* Math.PI/180 / 2) //converting from degs to radians
      .endAngle(degrees * Math.PI/180 / 2) //just radians

    return arc()
  },

  appendImage(node) {
    node.append("svg:image")
      .attr("class", "poster")
      .attr('x', () => {
        return this.data().settings.defaults.image.offset.x
      })
      .attr('y', () => {
        return this.data().settings.defaults.image.offset.y
      })
      .attr('width', () => {
        return this.data().settings.defaults.image.position.x
      })
      .attr('height', () => {
        return this.data().settings.defaults.image.position.y
      })
      .attr("xlink:href", d => d.poster)
      .attr("clip-path", () => {
        return `inset(${this.data().settings.defaults.image.clipPath})`
      })
    return node
  },

  attachMouseEvents(node) {
    if (localStorage.getItem("newHere") === "true" || localStorage.getItem("newHere") === undefined) {
      this.instructionLabel(node)
    } else {
      node.on("mouseenter", (e) => {
        node.moveToFront()
        this.nodeTransformer(e.target, "scale(1.03)", "aliceblue", "white")

        if (!store.inMotion) {
          this.linkHighlighter(e.target)
        }
      })
      .on("mouseleave", (e) => {
        this.nodeTransformer(e.target, "scale(1)", this.data().strokeColor, "none")

        if (!store.inMotion) {
          d3.selectAll(".character-label").remove()
        }
      })
    }
  },
  
  linkHighlighter(node) {
    let merged = d3.selectAll(`.link[target='${node.id}'], .link[source='${node.id}']`)
    let linkholder = merged.append("g").attr("class", "character-label")
    let start = 65
    let fs = 10

    linkholder.append("rect")
    .attr('fill', this.data().bodyGrey)
    .attr("x", -2)
    .attr("y", start)
    .attr("width", 4)
    .attr("height", (d) => {
      let c = d.roles.join().split("").length
      return c*4
    })
    .attr("transform", (d) => {
      let theta = this.angle360(
        d.source.x,
        d.source.y,
        d.target.x,
        d.target.y
      )
      return `translate(${d.source.x},${d.source.y})rotate(${theta-90})`
    })

    linkholder.append("text")
    .text(d => d.roles.join(", "))
    .attr("x", start)
    .attr("y", 2)
    .attr("stroke", "#FFF")
    .style("font-family", "Dosis, sans-serif")
    .style("font-size", (d) => {
      return `${fs}px`
    })
    .attr("transform", (d) => {
      let theta = this.angle360(
        d.source.x,
        d.source.y,
        d.target.x,
        d.target.y
      )
      return `translate(${d.source.x},${d.source.y})rotate(${theta})`
    })
  },

  angle(cx, cy, ex, ey) {
    var dy = ey - cy;
    var dx = ex - cx;
    var theta = Math.atan2(dy, dx); // range (-PI, PI]
    theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
    return theta;
  },

  angle360(cx, cy, ex, ey) {
    var theta = this.angle(cx, cy, ex, ey); // range (-180, 180]
    if (theta < 0) theta = 360 + theta; // range [0, 360)
    return theta;
  },

  instructionLabel(node) {
    node.on("mouseenter", (e, d) => {
      let letters = "Double click me  double click me  double click me  "
      let r = -50

      let label = d3.select(`#${d.id}`).select(".node-label")
  
      label.attr("class", "node-label inst")
      label.select("path").style("display", "none")
      label.select(".text-container").style("display", "none")

      function tempArc() {
        const arc = d3.arc()
        .innerRadius(44)
        .outerRadius(64)
        .startAngle(0) //converting from degs to radians
        .endAngle(Math.PI * 2) //just radians

        return arc()
      }
      label.append("path")
      .attr("class", "instruction")
      .attr("d", f => tempArc(f))
      .attr("fill", this.data().bodyGrey)

      label.selectAll("text")
      .exit()
      .data(letters.split(""))
      .enter()
      .append("text")
      .attr("class", "instruction")
      .text((d) => {
        return d
      })
      .style("font-size", "12px")
      .style("font-family", "Dosis, sans-serif")
      .style("font-weight", "900")
      .style("text-transform", "uppercase")
      .style("transform", (d, i, a) => {
        let theta = (i- (a.length/2))* 7.1
        return `rotate(${theta}deg)translateY(${r+2}px)`
      })

    })
    .on("mouseleave", (e, d) => {
      d3.selectAll(".instruction").remove()
      let n = d3.select(`#${d.id}`).select('.node-label').classed("inst", false)
      n.select("path").style("display", "block")
      n.select(".text-container").style("display", "block")
      this.nodeTransformer(e.target, "scale(1)", this.data().strokeColor, "none")
    })
  },

  nodeTransformer(target, scale, highlightColor, textStroke) {
    let node = d3.select(target)

    let elems = {
      circle: node.select('circle'),
      label: node.select('.node-label'),
      poster: node.select('.poster'),
      sources: d3.selectAll(`.link[source='${target.id}']`),
      targets: d3.selectAll(`.link[target='${target.id}']`)
    }

    let x = elems.sources.nodes().map((d)=>d.__data__.target.id)
    let z = elems.targets.nodes().map((d)=>d.__data__.source.id)
    let y = d3.selectAll('.node').filter((d) => {
      return x.includes(d.id) || z.includes(d.id)
    })

    y.select('circle').style("stroke", highlightColor)
    y.selectAll("text").style("stroke", highlightColor)
    y.select(".poster").attr("transform", scale)

    let scaleElem = [elems.circle, elems.label, elems.poster]
    scaleElem.forEach((d) => {
      d.attr("transform", scale)
    })

    let highlightElems = [
      elems.circle, 
      elems.sources.select(".line"), 
      elems.targets.select(".line")
    ]
    highlightElems.forEach((d) => {
      d.style("stroke", highlightColor)
    })

    elems.label.selectAll("text").style("stroke", textStroke)
  },

  attachClickListeners(node) {
    const onSingleClick = this.onSingleClick
    let alreadyClicked = false
    let timer = null

    node.on('click', async () => {
      if (alreadyClicked) { 

        this.onDoubleClick()

        alreadyClicked = false;
        clearTimeout(timer);
      } else {
        timer = setTimeout(async function () {
          alreadyClicked = false;

          onSingleClick()

        }, 200)
        alreadyClicked = true;
      }
    })
  },
  
  createViewerBody(args) {
    const viewerBody = d3.select("#graph-container")
  
    let zoom = d3.zoom().on('zoom', (e) => {
      args.outerWrapper.attr("transform", e.transform)
    })
  
    // out of place here...
    args.centeringButton.style("display", "block").transition().duration(30).style("left", "-30px")
    args.centeringButton.on("click", (e) => {
      const duration = 1000
      
      d3.select(e.target).style("opacity", "1")

      var transform = d3.zoomIdentity
        .translate(0,0)
        .scale(1)
      
      d3.select(e.target).transition().duration(duration).style("opacity", "0.5")
      
      viewerBody.transition().duration(duration)
        .call(zoom.transform, transform);
      return viewerBody
      
    })
  
    
    viewerBody.call(zoom)
              .call(zoom).on("dblclick.zoom", null)
    
    return viewerBody
  } 
}