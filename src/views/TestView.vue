<template>
    <div id="div-mindMap"></div>
</template>

<style scoped>
.linkMindMap {
    fill: none;
    stroke: #555;
    stroke-opacity: 0.4;
}    
rect {
    fill: white;
    stroke: #3182bd;
    stroke-width: 1.5px;  
 }
</style>

<script>
import * as d3 from 'd3'

const widthMindMap = 700;
const heightMindMap = 700;
let parsedData;

let parsedList = {
  "name": " Stapler",
  "children": [{
      "name": " Bind",
      "children": []
    },
    {
      "name": "   Nail",
      "children": []
    },
    {
      "name": "   String",
      "children": []
    },
    {
      "name": " Glue",
      "children": [{
          "name": "Gum",
          "children": []
        },
        {
          "name": "Sticky Gum",
          "children": []
        }
      ]
    },
    {
      "name": " Branch 3",
      "children": []
    },
    {
      "name": " Branch 4",
      "children": [{
          "name": "   Branch 4.1",
          "children": []
        },
        {
          "name": "   Branch 4.2",
          "children": []
        },
        {
          "name": "   Branch 4.1",
          "children": []
        }
      ]
    },
    {
      "name": " Branch 5",
      "children": []
    },
    {
      "name": " Branch 6",
      "children": []
    },
    {
      "name": " Branch 7",
      "children": []
    },
    {
      "name": "   Branch 7.1",
      "children": []
    },
    {
      "name": "   Branch 7.2",
      "children": [{
          "name": "   Branch 7.2.1",
          "children": []
        },
        {
          "name": "   Branch 7.2.1",
          "children": []
        }
      ]
    }
  ]
}


let svgMindMap = d3.select('#div-mindMap')
  .append("svg")
  .attr("id", "svg-mindMap")
  .attr("width", widthMindMap)
  .attr("height", heightMindMap);


let backgroundLayer = svgMindMap.append('g')
  .attr("width", widthMindMap)
  .attr("height", heightMindMap)
  .attr("class", "background")

let gLeft = backgroundLayer.append("g")
  .attr("transform", "translate(" + widthMindMap / 2 + ",0)")
  .attr("class", "g-left");
let gLeftLink = gLeft.append('g')
  .attr('class', 'g-left-link');
let gLeftNode = gLeft.append('g')
  .attr('class', 'g-left-node');


function loadMindMap(parsed) {
  var data = parsed;
  var split_index = Math.round(data.children.length / 2);

  parsedData = {
    "name": data.name,
    "children": JSON.parse(JSON.stringify(data.children.slice(split_index)))
  };

  var left = d3.hierarchy(parsedData, d => d.children);

  drawLeft(left, "left");
}

// draw single tree
function drawLeft(root, pos) {
  var SWITCH_CONST = 1;
  if (pos === "left") SWITCH_CONST = -1;

  update(root, SWITCH_CONST);
}

function update(source, SWITCH_CONST) {
  var tree = d3.tree()
    .size([heightMindMap, SWITCH_CONST * (widthMindMap - 150) / 2]);
  var root = tree(source);

  console.log(root)

  var nodes = root.descendants();
  var links = root.links();

  console.log(nodes)
  console.log(links)
  // Set both root nodes to be dead center vertically
  nodes[0].x = heightMindMap / 2

  //JOIN new data with old elements
  var link = gLeftLink.selectAll(".link-left")
    .data(links, d => d)
    .style('stroke-width', 1.5);

  var linkEnter = link.enter().append("path")
    .attr("class", "linkMindMap link-left")
    .attr("d", d3.linkHorizontal()
      .x(d => d.y)
      .y(d => d.x));

  var linkUpdate = linkEnter.merge(link);

  linkUpdate.transition()
    .duration(750)
  var linkExit = link.exit()
    .transition()
    .duration(750)
    .attr('x1', function(d) {
      return root.x;
    })
    .attr('y1', function(d) {
      return root.y;
    })
    .attr('x2', function(d) {
      return root.x;
    })
    .attr('y2', function(d) {
      return root.y;
    })
    .remove();

  //JOIN new data with old elements
  var node = gLeftNode.selectAll(".nodeMindMap-left")
    .data(nodes, d => d);

  console.log(nodes);


  //ENTER new elements present in new data
  var nodeEnter = node.enter().append("g").merge(node)
    .attr("class", function(d) {
      return "nodeMindMap-left " + "nodeMindMap" + (d.children ? " node--internal" : " node--leaf");
    })
    .classed("enter", true)
    .attr("transform", function(d) {
      return "translate(" + d.y + "," + d.x + ")";
    })
    .attr("id", function(d) {
      let str = d.data.name;
      str = str.replace(/\s/g, '');
      return str;
    });

  nodeEnter.append("circle")
    .attr("r", function(d, i) {
      return 2.5
    });

  var addLeftChild = nodeEnter.append("g")
    .attr("class", "addHandler")
    .attr("id", d => {
      let str = d.data.name;
      str = "addHandler-" + str.replace(/\s/g, '');
      return str;
    })
    .style("opacity", "1")
    .on("click", (d, i, nodes) => addNewLeftChild(d, i, nodes));

  addLeftChild.append("line")
    .attr("x1", -74)
    .attr("y1", 1)
    .attr("x2", -50)
    .attr("y2", 1)
    .attr("stroke", "#85e0e0")
    .style("stroke-width", "2");

  addLeftChild.append("rect")
    .attr("x", "-77")
    .attr("y", "-7")
    .attr("height", 15)
    .attr("width", 15)
    .attr("rx", 5)
    .attr("ry", 5)
    .style("stroke", "#444")
    .style("stroke-width", "1")
    .style("fill", "#ccc");

  addLeftChild.append("line")
    .attr("x1", -74)
    .attr("y1", 1)
    .attr("x2", -65)
    .attr("y2", 1)
    .attr("stroke", "#444")
    .style("stroke-width", "1.5");

  addLeftChild.append("line")
    .attr("x1", -69.5)
    .attr("y1", -3)
    .attr("x2", -69.5)
    .attr("y2", 5)
    .attr("stroke", "#444")
    .style("stroke-width", "1.5");

  // .call(d3.drag().on("drag", dragged));;

  nodeEnter.append("foreignObject")
    .style("fill", "blue")
    .attr("x", -50)
    .attr("y", -7)
    .attr("height", "20px")
    .attr("width", "100px")
    .append('xhtml:div')
    .append('div')
    .attr("class", 'clickable-node')
    .attr("id", function(d) {
      let str = d.data.name;
      str = "div-" + str.replace(/\s/g, '');
      return str;
    })
    .attr("ondblclick", "this.contentEditable=true")
    .attr("onblur", "this.contentEditable=false")
    .attr("contentEditable", "false")
    .style("text-align", "center")
    .text(d => d.data.name);

  //TODO: make it dynamic
  nodeEnter.insert("rect", "foreignObject")
    .attr("ry", 6)
    .attr("rx", 6)
    .attr("y", -10)
    .attr("height", 20)
    .attr("width", 100)
    // .filter(function(d) { return d.flipped; })
    .attr("x", -50)
    .classed("selected", false)
    .attr("id", function(d) {
      let str = d.data.name;
      str = "rect-" + str.replace(/\s/g, '');
      return str;
    });

  var nodeUpdate = nodeEnter.merge(node);
  // Transition to the proper position for the node
  nodeUpdate.transition()
    .duration(750)
    .attr("transform", function(d) {
      return "translate(" + d.y + "," + d.x + ")";
    });

  // Remove any exiting nodes
  var nodeExit = node.exit()
    .transition()
    .duration(750)
    .attr("transform", function(d) {
      return "translate(" + source.y + "," + source.x + ")";
    })
    .remove();

  // On exit reduce the node circles size to 0
  nodeExit.select('circle').attr('r', 0);
  // node = nodeEnter.merge(node)
}

function addNewLeftChild(d, i, nodes) {
  console.log("make new child");
  event.stopPropagation();
  var newNodeObj = {
    // name: new Date().getTime(),
    name: "New Child",
    children: []
  };

  console.log("this is ", parsedData)
  //Creates new Node
  var newNode = d3.hierarchy(newNodeObj);
  newNode.depth = d.depth + 1;
  newNode.height = d.height - 1;
  newNode.parent = d;
  newNode.id = Date.now();

  console.log(newNode);
  console.log(d)

  // if (d.data.children.length == 0) {
  //   console.log("i have no children")
  //   d.children = []
  // }
  d.children.push(newNode)
  // d.data.children.push(newNode.data)

  console.log(d)
  let foo = d3.hierarchy(parsedData, d => d.children) 
  drawLeft(foo, "left");
}


loadMindMap(parsedList);

</script>