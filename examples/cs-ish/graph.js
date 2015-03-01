/* jshint unused:true, undef:true, node:true */



var Edge = function(from, to, cost) {
    /* jshint eqnull:true */
    // Node
    this.from = from;
    // Node
    this.to = to;
    // mixed
    this.cost = cost != null ? parseInt(cost, 10) : 1;
};



var Node = function(x, value) {
    this.id = Node.prototype.id++;
    this._x = x;
    // Node[]
    this._edges = [];
    this.value = value || Infinity; // Assumed usage for routing.
};
Node.prototype.id = 1;
Node.prototype.isNode = true;
Node.prototype.setEdge = function(y, cost) {
    /* jshint eqnull:true */
    var edge = this.getEdge(y);
    if (!edge) {
        this._edges.push(new Edge(this, y, cost));
    } else if (cost != null) {
        edge.cost = cost;
    } // else no op.
};
Node.prototype.getEdge = function(y) {
    for (var i = 0; i < this._edges.length; i++) {
        if (this._edges[i].to.equals(y)) {
            return this._edges[i];
        }
    }
    return null;
};
Node.prototype.deleteEdge = function(y) {
    this._edges = this._edges.filter(function(e) {
        return !e.to.equals(y);
    });
};
Node.prototype.edges = function() {
    return this._edges.slice();
};
// For testing other nodes, not raw values.
Node.prototype.equals = function(o) {
    return this.is() === (o && o.is && o.is());
};
// For testing against raw values of the node.
Node.prototype.is = function() {
    return this._x;
};
Node.prototype.isAlone = function() {
    return !this._edges.length;
};



var Graph = function() {
    this.nodes = [];
};
// Get a node which item is x, where x is not a node.
Graph.prototype._getNode = function(x) {
    for (var i = 0; i < this.nodes.length; i++) {
        if (this.nodes[i].is() === x) {
            return this.nodes[i];
        }
    }
    return null;
};
// So not to be confused with JavaScript naming semantics, specifically
// named createNode, even though most other methods the Node is implicit.
Graph.prototype.createNode = function(x) {
    x = new Node(x);
    this.nodes.push(x);
    return x;
};
// adds to G the edge from x to y, if it is not there.
Graph.prototype.add = function(x, y, cost, twoWay) {
    var xNode = this._getNode(x) || this.createNode(x);
    var yNode = this._getNode(y) || this.createNode(y);

    xNode.setEdge(yNode, cost);
    if (twoWay) {
        yNode.setEdge(xNode, cost);
    }
};
// tests whether there is an edge from node x to node y
// returns Boolean
Graph.prototype.adjacent = function(x, y) {
    var xNode = this._getNode(x);
    var yNode = this._getNode(y);

    return xNode && !!xNode.getEdge(yNode) || false;
};
// Returns edges for a particular node.
Graph.prototype.neighbors = function(x) {
    var xNode = this._getNode(x);
    return xNode.edges();
};
// removes the edge from x to y, if it is there.
Graph.prototype.delete = function(x, y, twoWay) {
    var xNode = this._getNode(x);
    var yNode = this._getNode(y);
    if (xNode && yNode) {
        xNode.deleteEdge(yNode);
        if (twoWay) {
            yNode.deleteEdge(xNode);
        }
    }
    // TODO: Remove nodes with no edges?
};
// Get or set the value of a particular node.
Graph.prototype.value = function(x, v) {
    var xNode = this._getNode(x);
    if (xNode && arguments.length === 1) {
        return xNode && xNode.value;
    } else if (xNode && arguments.length > 1) {
        xNode.value = v;
    }
};
// Get or set the value associated with an edge from x -> y.
Graph.prototype.edgeCost = function(x, y, c) {
    var xNode = this._getNode(x);
    var yNode = this._getNode(y);
    var edge = xNode && xNode.getEdge(yNode);
    if (edge && arguments.length === 2) {
        return edge && edge.cost;
    } else if (edge && arguments.length > 2) {
        edge.cost = c;
    }
};


// Public API
module.exports.Graph = Graph;



// Tests
if (require.main === module) {
    (function() {
        var assert = require("assert");
        console.log("Running tests.");

        var g = new Graph();
        // Set two-way
        g.add("hello", "world", 1, true);
        // one direction only
        g.add("world", "universe", 2);

        assert.strictEqual(g.neighbors("world").length, 2, "world has two neighbors");
        assert.strictEqual(g.neighbors("world").filter(function(edge) {
            return edge.to.is().indexOf("hello") !== -1 || edge.to.is().indexOf("universe") !== -1;
        }).length, 2, "world has two neighbors, and we're getting unwrapped items back");

        assert.strictEqual(g.adjacent("world", "hello"), true, "path from world to hello");
        assert.strictEqual(g.adjacent("universe", "world"), false, "no path from universe to world");

        assert.strictEqual(g.edgeCost("world", "hello"), 1, "cost from x to y");
        assert.strictEqual(g.edgeCost("hello", "world"), 1, "cost from x to y");
        assert.strictEqual(g.edgeCost("world", "universe"), 2, "cost from x to y");
        assert.strictEqual(g.edgeCost("universe", "world"), undefined, "cost from x to y");
    })();
}
