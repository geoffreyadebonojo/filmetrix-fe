import apiService from './apiService.js'
import { store } from '@/stores/store.js'
import * as d3 from 'd3'

let timer;
let alreadyClicked = false

export default {
  updated () {
    // let panelWidth = +d3.select('#panel-body').style("width").replace("px", "")
    // let graph = d3.select('#graph-container').node()
    // graph.style.width = `${window.innerWidth - panelWidth}px`
  },
  methods: {
    chart (responseData) {
      d3.select("#inner-wrapper").remove()

      const links = responseData.links
      const nodes = responseData.nodes

      var simulation = d3.forceSimulation(nodes, links)
  
      const width = window.innerWidth
      const height = window.innerHeight
  
      const charge = store.graphSettings.charge
  
      simulation
        .force("link", d3.forceLink(links).id(d => d.id).distance((d) => {
          return 100
        }))
        .force("charge", d3.forceManyBody().strength(charge))
        .force('collide', d3.forceCollide((d) => {
          d.r = 50
          return d.r
        }))
        .force("center", d3.forceCenter(0, 0))
        // .force("x", d3.forceX(100))
        // .force("y", d3.forceY())
        .force('x', d3.forceX().x(width * 0.3))
        .force('y', d3.forceY().y(height * 0.5))
        .alpha(1.3)
        .alphaMin(0.8)
        // .alphaTarget(0.81)

      const outerWrapper = d3.select("#outer-wrapper")
      const viewerBody = d3.select("#graph-container")
     
      let zoom = d3.zoom().on('zoom', (e) => {
        outerWrapper.attr("transform", e.transform)
      })

      d3.select("#centering-button").style("z-index", "1").transition().duration(30).style("left", "-30px")
      d3.select("#centering-button").on("click", (e) => {
        var transform = d3.zoomIdentity
        .translate(0,0)
        .scale(1)
        viewerBody.transition().duration(1000).call(zoom.transform, transform);

        // simulation
        // .alpha(1)
        // .alphaMin(0.3)
        // .restart()
        // .on("tick", () => {
        //   link.attr("d", linkArc);
        //   node.attr("transform", d => `translate(${d.x},${d.y})`);
        // })
        // .on("end", () => {
        //   node.transition().duration(500).delay(100).ease(d3.easeBounceOut).attr("transform", (d) => {
        //     return `translate(${d.x},${d.y})scale(0.9)`
        //   })
        // })
      })
      
      viewerBody
        .call(zoom)
        .call(zoom).on("dblclick.zoom", null)
       
      const innerWrapper = d3.select("#outer-wrapper").append("g").attr("id", "inner-wrapper")

      const color = "#FFF"
  
      const link = innerWrapper.append("g")
          .attr("class", "links")
          .attr("fill", "none")
          .attr("stroke-width", 1.5)
          .selectAll("path")
          .data(links)
          .join("path")
          .attr("source", (d) => {
            return d.source.id
          })
          .attr("target", (d) => {
            return d.target.id
          })
          .attr("stroke", color)
  
      const node = innerWrapper.append("g")
          .attr("class", "nodes")
          .attr("fill", "currentColor")
          .attr("stroke-linecap", "round")
          .attr("stroke-linejoin", "round")
          .selectAll("g")
          .data(nodes)
          .join("g")
          .attr("id", d => d.id)

      ///////////////////////////////////////
  
      node.append("circle")
          .attr("stroke", "white")
          .attr("stroke-width", 1.5)
          .attr("r", (d) => {
            return d.r * 0.75
          })
          .attr('fill', d => '#6baed6');
  
      node.append("svg:image")
          .attr('x', (d) => {
            return - d.r * 0.75
          })
          .attr('y', (d) => {
            return - d.r * 0.75
          })
          .attr('width', (d) => {
            return d.r * 1.5
          })
          .attr('height', (d) => {
            return d.r * 1.5
          })
          .attr("xlink:href", d => d.poster)
          .attr("clip-path", (d) => {
            return `inset(3% round ${d.r * 0.75}px)`
          })
  
      node.on('click', async (e, d) => {
        const doubleClickDelay = 300
        if (alreadyClicked) { 

          if (store.existing.map(x => x[0]).includes(d.id)){
            const c = store.existing.filter((y) => {
              return y[0] === d.id
            })

            const t = c[0][1]

            const n = t + 3
            c[0][1] = n

            //call for method
            let vals
            let nodes = []
            let links = []
      
            store.existing.forEach(function(key) {
              vals = store.graphData[key[0]]
              
              vals.nodes.slice(0,key[1]+1).forEach((node) => {
                if (!nodes.map(d => d.id).includes(node.id)){
                  nodes.push(node)
                }
              })

              links = links.concat( vals.links.slice(0,key[1]) )
            })

            this.chart({
              nodes: nodes,
              links: links
            })

          } else {

            await this.callForNodes(d.id)
          }
          
          alreadyClicked = false;
          clearTimeout(timer);
        } else {
          timer = setTimeout(async function () {
            alreadyClicked = false;
            if (store.currentDetailId !== d.id) {
              await apiService.methods.fetchDetails(d.id)
              store.currentDetailId = d.id
            }
          }, doubleClickDelay);
          alreadyClicked = true;
        }
      })

      const linkArc = d =>`M${d.source.x},${d.source.y}A0,0 0 0,1 ${d.target.x},${d.target.y}`
  
      let i = 0

      simulation
      .on("tick", () => {
        i += 1
        link.attr("d", linkArc);
        node.attr("transform", d => `translate(${d.x},${d.y})scale(${(i/20)})`);
      })
      .on("end", () => {
        node.transition().duration(500).delay(100).ease(d3.easeBounceOut).attr("transform", (d) => {
          return `translate(${d.x},${d.y})scale(0.9)`
        })
      })
  
      return innerWrapper.node();
    },

    restart() {
      this.chart(store.graphData)
    },

    async callForNodes(id, i=5) {
      await apiService.methods.fetchDetails(id)

      if ( !store.existing.map((d) => {d[0]} ).includes(id) ) {
        store.existing.push([id, i])
        await apiService.methods.fetchSingle(id)
      }

      // await apiService.methods.fetchGraphData(
      //   store.existing.map(d => d[0]), "no-var"
      // )

      store.currentDetailId = id

      // let li = []
      // let no = []

      // const currentGraph = store.existing.map((d) => {
      //   let data = store.graphData[d[0]]
      //   let count = d[1]
      //   li = li.concat(data.links.slice(0, count))
      //   no = no.concat(data.nodes.slice(0, count+1))
      // })

      // var links = li.filter((v,i,a) => {
      //   return a.indexOf(v)==i
      // })

      // var nodes = no.filter((v,i,a)=> {
      //   return a.map(d => d.id).indexOf(v.id)==i
      // })

      let vals
      let nodes = []
      let links = []

      store.existing.forEach(function(key) {
        vals = store.graphData[key[0]]
        
        vals.nodes.slice(0,key[1]+1).forEach((node) => {
          if (!nodes.map(d => d.id).includes(node.id)){
            nodes.push(node)
          }
        })

        links = links.concat( vals.links.slice(0,key[1]) )
      })

      this.chart({
        nodes: nodes,
        links: links
      })

      store.currentFocus = 'details'
    }
  }
}
