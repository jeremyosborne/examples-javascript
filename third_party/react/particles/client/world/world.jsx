var Entity = require("../entity");
var objectAssign = require("object-assign");
var React = require("react");
var store = require("../store");

var explosion = function(x, y) {
    for (var i = 0; i < 9; i++) {
        // x, y, dx, dy
        store.dispatch({
            type: "PARTICLE_ADD",
            x: x,
            y: y,
            dx: (i % 3 - 1) * 5,
            dy: (Math.floor(i / 3 % 3) - 1) * 5,
        });
    }
};


var World = React.createClass({
    propTypes: {
        particles: React.PropTypes.array.isRequired,
    },
    click: function(ev) {
        explosion(ev.pageX, ev.pageY);
    },
    render: function() {
        var entities = this.props.particles.map(function(p) {
            var props = objectAssign({}, {
                x: p.x,
                y: p.y,
                classNames: p.classNames,
            });
            return (
                <Entity {...props} key={p.id}/>
            );
        });
        return (
            <div className="world" onClick={this.click}>
                {entities}
            </div>
        );
    },
});

module.exports = World;
