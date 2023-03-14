import api from './api.js'
import { settingsModule } from './settingsModule.js'
import helpers from './helpers.js'
import { store } from '@/stores/store.js'
import * as d3 from 'd3'

let timer;
let alreadyClicked = false

export default {
  updated () {
    // let panelWidth = +d3.select('#panel-body').style("width").replace("px", "")
    // let graph = d3.select('#graph-container').node()
    // graph.style.width = `${window.innerWidth - panelWidth}px`
    // debugger
  },
  methods: {
    draw (responseData) {

      d3.select("#inner-wrapper").remove()

      var slider = document.getElementById("myRange");

      var links = responseData.links
      var nodes = responseData.nodes

      var simulation = d3.forceSimulation(nodes, links)
  
      const width = window.innerWidth
      const height = window.innerHeight

      simulation
        .force("link", d3.forceLink(links).id(d => d.id).distance((d) => {
          // by popularity?
          return settingsModule.defaults.link.length
        }))
        .force("charge", d3.forceManyBody().strength(() => {
          return settingsModule.defaults.node.charge
        }))
        .force('collide', d3.forceCollide((d) => {
          return settingsModule.defaults.node.collide
        }))
        .force("center", d3.forceCenter(0, 0))
        .force('x', d3.forceX().x(width * 0.3))
        .force('y', d3.forceY().y(height * 0.5))
        .alpha(1)
        .alphaMin(0.2)
        .alphaTarget(0.01)


      const outerWrapper = d3.select("#outer-wrapper")
      const viewerBody = d3.select("#graph-container")
      let int = false
      let j = 0
      let mouseDownTarget
     
      let zoom = d3.zoom().on('zoom', (e) => {
        outerWrapper.attr("transform", e.transform)
      })
      // .on('end', (e) => {
      //   if (!int || j < 4 || !dbl) { return false }
      //   clearInterval(int)
      //   int = false
      //   let d = mouseDownTarget
      //   // const c = store.existing.filter((y) => {
      //   //   return y[0] === d.id
      //   // })
      //   // const t = c[0][1]
      //   // const n = t + j
      //   // c[0][1] = n
      //   //call for method
      //   let vals
      //   let nodes = []
      //   let links = []
      //   store.existing.forEach(function(key) {
      //     vals = store.graphData[key[0]]
      //     vals.nodes.slice(0,key[1]+1+j).forEach((node) => {
      //       if (nodes.map(d => d.id).excludes(node.id)){
      //         nodes.push(node)
      //       }
      //     })
      //     links = vals.links.slice(0,key[1]+j)
      //   })
      //   this.draw({
      //     nodes: nodes,
      //     links: links
      //   })
      //   j = 0
      //   mouseDownTarget = null
      //   // d3.select('#person-500 circle').transition().duration(500).attr("r", 50)
      //   // method for mouseup here
      // })

      d3.select("#centering-button").style("display", "block").transition().duration(30).style("left", "-30px")
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

      let link = helpers.createLinks(innerWrapper, links)
      let node = helpers.createNodes(innerWrapper, nodes)
  

      const v=  Object.assign(d3.select("#inner-wrapper").node(), {
        update({nodes, links}) {

          const old = new Map(node.data().map(d => [d.id, d]));
          nodes = nodes.map(d => Object.assign(old.get(d.id) || {}, d));
          links = links.map(d => {
            return Object.assign({}, d)
          });

          simulation.nodes(nodes)
          simulation.force("link", d3.forceLink(links).id(d => d.id).distance((d) => {
            return settingsModule.defaults.link.length
          }))
          simulation.force("charge", d3.forceManyBody().strength(() => {
            return settingsModule.defaults.node.charge
          }))
          .force('collide', d3.forceCollide((d) => {
            return settingsModule.defaults.node.collide
          }))
          .force("center", d3.forceCenter(0, 0))
          .force('x', d3.forceX().x(width * 0.3))
          .force('y', d3.forceY().y(height * 0.5))
          
          simulation
          .alpha(1)
          .alphaMin(0.2)
          .alphaTarget(0.01)
          .restart()
    
          // link = helpers.createLinks(innerWrapper, links)
          // node = helpers.createNodes(innerWrapper, nodes)
        }
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
            let vals
            let nodes = []
            let links = []
      
            store.existing.forEach(function(key) {
              vals = store.graphData[key[0]]
              vals.nodes.slice(0,key[1]+1).forEach((node) => {
                if (nodes.map(d => d.id).excludes(node.id)){
                  nodes.push(node)
                }
              })
              links = links.concat(vals.links.slice(0,key[1]))
            })
            // double-click existing node to
            // add new nodes
            this.draw({
              nodes: nodes,
              links: links
            })
            console.log("double click on existing node")
          } else {
            // double-click on new node
            console.log("double click to call new node")
            await this.callForNodes(d.id)
          }
          alreadyClicked = false;
          clearTimeout(timer);
        } else {
          timer = setTimeout(async function () {
            alreadyClicked = false;
            // single click
            if (store.currentDetailId !== d.id) {
              await api.methods.fetchDetails(d.id)
              store.currentDetailId = d.id
            }
            console.log("single click to fetch details ", d.id)
          }, doubleClickDelay);
          alreadyClicked = true;
        }
      })

      // node
      // .on("mousedown", (e, d) => {
      //   mouseDownTarget = d
      //   int = setInterval(() => {
      //     j+=1
      //     console.log(j)
      //   }, 200);
      // })

      const linkArc = d =>`M${d.source.x},${d.source.y}A0,0 0 0,1 ${d.target.x},${d.target.y}`
      
      let i = 0
      let elem;

      simulation
      .on("tick", () => {
        i += 1
        link.attr("d", linkArc)
        node.attr("transform", d => `translate(${d.x},${d.y})`); //scale(${(i/20)})`);
      })
      .on("end", (t) => {
        node.transition().duration(500).delay(100).ease(d3.easeBounceOut).attr("transform", (d) => {
          return `translate(${d.x},${d.y})`//scale(0.9)`
        })
        
        d3.selectAll(".sel").on("click", (e) => {
          elem = d3.select(`#${e.target.id}`)
          
          if (elem.classed("on")) {
            elem.classed("off", true)
            elem.classed("on", false)
          } else {
            elem.classed("off", false)
            elem.classed("on", true)
          }

          let links = []
          let nodes = []
          let data
          
          store.existing.forEach((d) => {
            data = store.graphData[d[0]]
            nodes = nodes.concat(data.nodes.slice(0,d[1]+1))
            links = links.concat(data.links.slice(0,d[1]))
          })
          
          store.graphTypes = helpers.getTypes(nodes)
          
          nodes = nodes.uniqueById().filter((d) => {
            return d.type.excludes(e.target.id)
          })

          const nids = nodes.ids()

          links = links.filter((d) => {
            return nids.includes(d.source.id)
          })

          // v.update({
          //   links: links,
          //   nodes: nodes
          // })

          this.draw({
            nodes: nodes,
            links: links
          })

        })
      })

      return innerWrapper.node();
    },

    restart() {
      this.draw(store.graphData)
    },

    async callForNodes(id) {
      await api.methods.fetchDetails(id)

      if (store.existing.map((d) => d[0]).excludes(id) ) {
        store.existing.push([id, 5])
        const ext = store.existing.unique().map((d) => d[0])
        await api.methods.fetchGraphData(ext)
      }

      store.currentDetailId = id

      let data
      let nodes = []
      let links = []

      store.existing.forEach((d) => {
        data = store.graphData[d[0]]
        nodes = nodes.concat(data.nodes.slice(0,d[1]+1))
        links = links.concat(data.links.slice(0,d[1]))
      })

      store.graphTypes =  helpers.getTypes(nodes)
      
      this.draw({
        nodes: nodes.uniqueById(),
        links: links
      })

      store.currentFocus = 'details'
    }
  }
}