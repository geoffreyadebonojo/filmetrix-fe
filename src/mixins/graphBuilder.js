import { settingsModule } from './settingsModule.js'
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
    const link = parent.append("g")
      .attr("class", "links")
      .selectAll("g")
      .data(links)
      .enter()
      .append("g")
      .attr("class", "link")
      .attr("source", (d => d.source.id))
      .attr("target", (d => d.target.id))
      .append("path")
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
    // this.attachClickListeners(node)
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
      // (d) => {
      //   let def = this.data().settings.defaults.node.circle.r
      //   store.existing.forEach((f) => {
      //     if (f[0].includes(d.id)) {
      //       d.r = def + f[1]
      //     } else {
      //       d.r = def
      //     }
      //   })
      // return d
      // })
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
      .attr("stroke-width", 1.5)
      .attr("r", (d) => {
        return this.data().settings.defaults.node.circle.r
        // return d.r
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
    .attr("d", f => this.drawArc(f))
    .attr("fill", this.data().bodyGrey)

    actorLabel.selectAll("text")
    .data((d) => {
      return d.name.split("")
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
      .attr('x', (d) => {
        return this.data().settings.defaults.image.offset.x
      })
      .attr('y', (d) => {
        return this.data().settings.defaults.image.offset.y
      })
      .attr('width', (d) => {
        return this.data().settings.defaults.image.position.x
      })
      .attr('height', (d) => {
        return this.data().settings.defaults.image.position.y
      })
      .attr("xlink:href", d => d.poster)
      .attr("clip-path", (d) => {
        return `inset(${this.data().settings.defaults.image.clipPath})`
      })
    return node
  },

  attachMouseEvents(node) {
    if (this.data().first) {
      node
      .on("mouseenter", (e, d) => {
        let letters = "Double click me  double click me  double click me  "
        let r = -50

        let label = d3.select(`#${d.id}`)
        .select(".node-label")

        label.append("path")
        .attr("d", f => this.drawArc(f))
        .attr("fill", this.data().bodyGrey)

        label.selectAll("text")
        .data(letters.split(""))
        .enter()
        .append("text")
        .text((d) => {
          return d
        })
        .style("font-size", "12px")
        .style("font-family", "Dosis, sans-serif")
        .style("text-transform", "uppercase")
        .style("transform", (d, i, a) => {
          let theta = (i- (a.length/2))* 7
          return `rotate(${theta}deg)translateY(${r+2}px)`
        })

        // this.nodeTransformer(e.target, "scale(1.03)", "aliceblue", "white")
      })
      .on("mouseleave", (e, d) => {
        this.nodeTransformer(e.target, "scale(1)", this.data().strokeColor, "none")
      })
    } else {
      node
      .on("mouseenter", (e) => {
        node.moveToFront()
        this.nodeTransformer(e.target, "scale(1.03)", "aliceblue", "white")
        
        // let conn = d3.selectAll(`.link[target=${d.id}]`)
      })
      .on("mouseleave", (e) => {
        this.nodeTransformer(e.target, "scale(1)", this.data().strokeColor, "none")
      })
    }
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
  
    args.centeringButton.style("display", "block").transition().duration(30).style("left", "-30px")
    args.centeringButton.on("click", (e) => {
      var transform = d3.zoomIdentity
        .translate(0,0)
        .scale(1)
      viewerBody.transition().duration(1000)
        .call(zoom.transform, transform);
      return viewerBody
    })
  
    // args.plusButton.style("display", "block").transition().duration(30).style("left", "-30px")
    // args.plusButton.on("click", (e) => {
    //   var transform = d3.zoomIdentity
    //     .translate(0,0)
    //     .scale(0.5)
    //   viewerBody.transition().duration(1000)
    //     .call(zoom.transform, transform);
    //   return viewerBody
    // })
  
    // args.minusButton.style("display", "block").transition().duration(30).style("left", "-30px")
    // args.minusButton.on("click", (e) => {
    //   var transform = d3.zoomIdentity
    //     .translate(0,0)
    //     .scale(2)
    //   viewerBody.transition().duration(1000)
    //     .call(zoom.transform, transform);
    //   return viewerBody
    // })
  
    viewerBody.call(zoom)
              .call(zoom).on("dblclick.zoom", null)
    
    return viewerBody
  } 

  // onSingleClick () {
  //   console.log('single');
  // },

  // onDoubleClick () {
  //   console.log('double');
  // }

}