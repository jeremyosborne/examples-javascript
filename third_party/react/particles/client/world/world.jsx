var React = require("react");
var particles = require("../particles.jsx");

var Particle = particles.Particle;

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
        var particles = this.props.particles.map(function(p) {
            return (
                <Particle x={p.x} y={p.y} key={p.id}></Particle>
            );
        });
        return (
            <div className="world" onClick={this.click}>
                {particles}
            </div>
        );
    },
});

module.exports = World;
