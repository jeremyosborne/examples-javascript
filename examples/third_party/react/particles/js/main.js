
var React = require("react/addons");
var EventEmitter = require("events").EventEmitter;
var objectAssign = require("object-assign");



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
            /* jshint ignore:start */
            <div className={classes} style={position}></div>
            /* jshint ignore:end */
        );
    }
});



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
                /* jshint ignore:start */
                <Particle x={p.x} y={p.y} key={p.id}></Particle>
                /* jshint ignore:end */
            );
        });
        return (
            /* jshint ignore:start */
            <div className="world" onClick={this.click}>
                {particles}
            </div>
            /* jshint ignore:end */
        );
    },
});


React.render(
    /* jshint ignore:start */
    <World></World>,
    /* jshint ignore:end */
    document.getElementById("page")
);
