import { 
  panelStates
} from '@/stores/store.js'
import * as d3 from 'd3'

export function getTypes(nodes) {
  let types = []
  nodes.forEach((node) => {
    if (node.entity === "person") {
      // node.type.forEach((type) => {
      //   types.pushUnique(type)
      // })
    } else if (["movie", "tv"].includes(node.entity)) {
      node.type.forEach((type) => {
        types.pushUnique(type)
      })
    }
  })

  return types
}

export function settings(type) {
  return {
    graphType: type,
    containerId: `${type}-graph-container`,
    outerWrapperId: `${type}-outer-wrapper`,
    innerWrapperId: `${type}-inner-wrapper`
  }
}

export function drawArc(d) {
  const degrees = d.name.length * 7

  // const noder = 50
  // const ir = 50-6
  // const or = 50+14

  const arc = d3.arc()
    .innerRadius(d.r -4)
    .outerRadius(d.r + 14)
    .startAngle((-degrees -12 )* Math.PI/180 / 2) //converting from degs to radians
    .endAngle(degrees * Math.PI/180 / 2) //just radians

  return arc()
}

export function angle(cx, cy, ex, ey) {
  var dy = ey - cy;
  var dx = ex - cx;
  var theta = Math.atan2(dy, dx); // range (-PI, PI]
  theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
  return theta;
}

export function angle360(cx, cy, ex, ey) {
  var theta = angle(cx, cy, ex, ey); // range (-180, 180]
  if (theta < 0) theta = 360 + theta; // range [0, 360)
  return theta;
} 

export function setFocus(focus) {  
  const navButtons = d3.selectAll(".nav-button").nodes().reverse()
  navButtons.unshift()
  closeField()
  const buttonMap = navButtons.map(x => x.id.split("-")[0]);
  const displacement = [
    1,
    28,
    56,
    84,
    112,
    141
  ]
  // can be adjusted to be vertical
  const index = buttonMap.indexOf(focus)
  moveHighlightCircle(displacement[index], "right")

  panelStates.currentFocus = focus
  
  if (focus == 'profile') {
    d3.select("#highlight")
    .style("border", "solid 0.05em white")
    .style("background", "none")
  } else {
    if (focus == 'search') {
      openField()
    }
    d3.select("#highlight")
      .style("display", "block")
      .style("border", "none")
      .style("background", "white")
  }
}

export function openField() {
  d3.select("#highlight").style("display", "block")
  d3.select("#search-text").transition().duration(0).delay(100).style("width", "100%").style("left", "15px")
  d3.select("#highlight").transition().duration(100).style("left", "-1px")
}

function moveHighlightCircle(x, direction) {
  let d = direction == "bottom" ? x-113 : x
  d3.select("#highlight")
    .style("left", null)
    .transition()
    .duration(100)
    .style(direction, `${d}px`)
}

function closeField() {
  d3.select("#search-text").transition().duration(0).style("left", "100%")
}
