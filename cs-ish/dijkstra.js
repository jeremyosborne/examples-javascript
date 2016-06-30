/* jshint unused:true, undef:true, node:true */

// Here is a good question which is very topical to what we’re working on:
//
// Implement Dijkstra’s shortest path in JS:
//
// http://en.wikipedia.org/wiki/Dijkstra%27s_algorithm
//
// Here is some boilerplate to start with:
//
//             /**
//              * Edge
//              */
//             var Edge = function(node, distance) {
//                 this.node = node
//                 this.distance = distance
//             }
//             /**
//              * Node
//              */
//             var Node = function(dom) {
//                 this.dom = dom
//                 this.edges = [] // array of edges
//                 this.source = {
//                     from: null, // node
//                     sum: Infinity
//                 }
//             }
//
// The exercise has two parts and a bonus section.
//
// P1 – build a graph with nodes connected by edges
// P2 – chose two nodes and find shortest path
//
// Bonus - Build application to visualize the exploration.

var Graph = require('./graph').Graph

// Find first, least cost path from source to target.
var dijkstra = function (g, source, target) {
  var i, n, edges, path, backStep
  var sourceNode = g._getNode(source)
  var targetNode = g._getNode(target)
  // Set of id's indicating shortest path for each node.
  // keys are node ids, values are node references providing optimal connection
  // to that node.
  var optimalConnections = {}

  // Get a set of all the nodes.
  var nodes = g.nodes.slice()
  // Find the node still in the set with the shortest value.
  // Return null if that node doesn't exist.
  var nextNode = function () {
    var minValue = Infinity
    var minValueNodeIndex
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i].value < minValue) {
        minValue = nodes[i].value
        minValueNodeIndex = i
      }
    }
    if (minValue < Infinity && typeof (minValueNodeIndex) === 'number') {
      // Pop the node from the unvisited set.
      return nodes.splice(minValueNodeIndex, 1)[0]
    } else {
      return null
    }
  }

  // Initialize with distance values.
  for (i = 0; i < nodes.length; i++) {
    nodes[i].value = Infinity
  }
  sourceNode.value = 0
  // Add source to index of optimalConnections, null being no connector.
  optimalConnections[source] = null

  var updateNeighbor = function (node, edge) {
    var potentialValue = node.value + edge.cost
    if (potentialValue < edge.to.value) {
      // Better path through here.
      edge.to.value = potentialValue
      optimalConnections[edge.to.id] = node
    }
  }
  while (nodes.length) {
    n = nextNode()
    if (!n) {
      // console.log("done, no path to target.")
      return null
    } else if (n.equals(targetNode)) {
      // console.log("reached the target, should return good-enough path here.")
      path = []
      backStep = targetNode
      do {
        // Reference the values of the nodes, not the nodes themselves.
        path.push(backStep.is())
        backStep = optimalConnections[backStep.id]
      } while (backStep)
      return path
    }
    // else, do work on the node.
    edges = n.edges()
    for (i = 0; i < edges.length; i++) {
      updateNeighbor(n, edges[i])
    }
  }
  console.error('y u logic no work above?')
}

// Build a dungeon.
// 1s are passable, 0s are not.
var dungeonGen = function (width, height) {
  var dungeon = [] // length is x
  for (var w = 0; w < width; w++) {
    var column = [] // length is y at each x
    for (var h = 0; h < height; h++) {
      if (w === 0 && h === 0) {
        // first node must be traversable.
        column.push(1)
      } else if (w === width - 1 && h === height - 1) {
        // last node must be traversbable.
        column.push(1)
      } else {
        column.push(Math.random() > 0.25 ? 1 : 0)
      }
    }
    dungeon.push(column)
  }
  return {
    // If exists and is traversible, return id of room, else return null.
    get: function (x, y) {
      return this.grid[x] && this.grid[x][y] && '' + x + ',' + y
    },
    grid: dungeon
  }
}

console.log('working with this dungeon')
console.log('*s are traversable')
console.log('travel is only north, south, east, west')
var width = 10
var height = 10
var dungeon = dungeonGen(width, height)

;(function () {
  console.log('\nview of dungeon.')
  for (var i = 0; i < width; i++) {
    for (var j = 0; j < height; j++) {
      var room = dungeon.get(i, j)
      process.stdout.write('' + (room ? '*' : ' '))
    }
    process.stdout.write('\n')
  }
})()

console.log('\nbuilding graph of dungeon')
var dungeonGraph = (function () {
  var g = new Graph()
  for (var i = 0; i < width; i++) {
    for (var j = 0; j < height; j++) {
      // Only add traversible rooms.
      var room = dungeon.get(i, j)
      if (!room) {
        continue
      }
      // Add connecting rooms.
      if (dungeon.get(i + 1, j)) {
        g.add(room, dungeon.get(i + 1, j))
      }
      if (dungeon.get(i, j + 1)) {
        g.add(room, dungeon.get(i, j + 1))
      }
      if (dungeon.get(i - 1, j)) {
        g.add(room, dungeon.get(i - 1, j))
      }
      if (dungeon.get(i, j - 1)) {
        g.add(room, dungeon.get(i, j - 1))
      }
    }
  }
  return g
})()

// console.log("The origin node:", dungeonGraph._getNode("0,0"))
// console.log("The destination node:", dungeonGraph._getNode("9,9"))

;(function () {
  var i, coord

  console.log('\nfinding path through dungeon from 0,0 to 9,9, if possible')
  var path = dijkstra(dungeonGraph, '0,0', '9,9')
  if (!path) {
    console.log('No path could be found through the dungeon.')
    return
  }

  // Use outer constants for dungeon dimensions.
  var p = new Array(width)
  for (i = 0; i < width; i++) {
    p[i] = new Array(height)
  }
  for (i = 0; i < path.length; i++) {
    // Coordinates come back as "x,y"
    coord = path[i].split(',')
    p[coord[0]][coord[1]] = 1
  }

  console.log('Shortest path through dungeon:')
  // Use outer constants for dungeon dimensions.
  for (i = 0; i < width; i++) {
    for (var j = 0; j < height; j++) {
      var room = p[i][j]
      process.stdout.write('' + (room ? '*' : ' '))
    }
    process.stdout.write('\n')
  }
})()
