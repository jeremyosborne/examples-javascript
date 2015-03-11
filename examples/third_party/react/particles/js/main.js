
var React = require("../bower_components/react/react-with-addons.js");
var EventEmitter = require("events").EventEmitter;
var objectAssign = require("object-assign");

var Particle = React.createClass({
    propTypes: {
        x: React.PropTypes.number.isRequired,
        y: React.PropTypes.number.isRequired,
    },
    render:  function() {
        var classes = React.addons.classSet({
            particle: true,
        });
        var position = {
            // top: this.state.y + "px",
            // left: this.state.x + "px",
            top: this.props.y + "px",
            left: this.props.x + "px",
        };

        return (
            <div className={classes} style={position}></div>
        );
    }
});



// Sort of mimic Flux, minus the separation of store and actions.
var particleStore = objectAssign({}, EventEmitter.prototype, {
    particles: [],
    particleId: 0,
    add: function(x, y) {
        this.particles.push({
            x: x,
            y: y,
            id: this.particleId++,
        });
        this.sendUpdate();
    },
    sendUpdate: function() {
        this.emit("particles", this.particles);
    }
});
setInterval(function() {
    if (particleStore.particles.length) {
        particleStore.particles = particleStore.particles.map(function(p) {
            p.y += 5;
            return p;
        });
        particleStore.sendUpdate();
    }
}, 20);



var World = React.createClass({
    getInitialState: function() {
        particleStore.on("particles", this.updateParticles);
        return {
            particles: []
        };
    },
    click: function(ev) {
        particleStore.add(ev.pageX, ev.pageY);
    },
    updateParticles: function(particles) {
        this.setState({
            "particles": particles
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


React.render(
    <World></World>,
    document.getElementById("page")
);
