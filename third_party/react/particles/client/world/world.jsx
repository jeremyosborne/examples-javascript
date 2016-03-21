var React = require("react");
var particles = require("../particles.jsx");

var particleStore = particles.store;
var explosionAction = particles.explosionAction;
var Particle = particles.Particle;

var World = React.createClass({
    getInitialState: function() {
        particleStore.on("particles:change", this.updateParticles);
        return {
            particles: [],
        };
    },
    click: function(ev) {
        explosionAction.add(ev.pageX, ev.pageY);
    },
    updateParticles: function(particles) {
        this.setState({
            "particles": particles,
        });
    },
    render: function() {
        var particles = this.state.particles.map(function(p) {
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
