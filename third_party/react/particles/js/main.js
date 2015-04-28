/* jshint undef:true, node:true, browser:true */

var classNames = require("classnames");
var React = require("react/addons");
var EventEmitter = require("events").EventEmitter;
var objectAssign = require("object-assign");
var Dispatcher = require('flux').Dispatcher;

var dispatcher = new Dispatcher();



// Sort of mimic Flux, minus the separation of store and actions.
var particleStore = objectAssign({}, EventEmitter.prototype, {
    particles: [],
    particleId: 0,
    dimensions: {
        width: 0,
        height: 0,
    },
    init: function() {
        dispatcher.register(this.dispatchCallback.bind(this));
    },
    dispatchCallback: function(action) {
        var self = this;
        var i;

        if (action.type == "PARTICLE_ADD") {
            // The action is the particle.
            action.particle.id = this.particleId++;
            this.particles.push(action.particle);
            this.sendChange();
        } else if (action.type == "TICK") {
            // We're cheating a bit.
            // Handle velocity change and particle depth.
            this.particles = this.particles.filter(function(p) {
                // Change velocity (fake gravity).
                p.dy += 0.5;
                // change position
                p.x += p.dx;
                p.y += p.dy;
                // If particles do more than fall, change this test.
                return p.x < self.dimensions.width && p.x > 0 &&
                    p.y < self.dimensions.height && p.y > 0;
            });
            this.sendChange();
        } else if (action.type == "SCREEN_SIZE") {
            this.dimensions.width = action.width;
            this.dimensions.height = action.height;
        }
    },
    sendChange: function() {
        this.emit("particles:change", this.particles);
    }
});
particleStore.init();



var particleAction = {
    add: function(x, y, dx, dy) {
        dispatcher.dispatch({
            type: "PARTICLE_ADD",
            particle: {
                x: x,
                y: y,
                dx: dx,
                dy: dy,
            }
        });
    },
};
var explosionAction = {
    add: function(x, y) {
        for (var i = 0; i < 9; i++) {
            // x, y, dx, dy
            particleAction.add(x, y, (i%3 - 1) * 5, (Math.floor(i/3 % 3) - 1) * 5);
        }
    }
};



// Should be called on screen size changes.
var screenSizeAction = {
    set: function(w, h) {
        dispatcher.dispatch({
            type: "SCREEN_SIZE",
            width: w || window.innerWidth,
            height: h || window.innerHeight,
        });
    }
};
// Initialize
screenSizeAction.set();



// Ticks happen for animation.
(function() {
    var prevTime = Date.now();

    setInterval(function() {
        var currentTime = Date.now();

        dispatcher.dispatch({
            type: "TICK",
            delta: currentTime - prevTime
        });

        prevTime = currentTime;

    }, 20);
})();



var Particle = React.createClass({
    propTypes: {
        x: React.PropTypes.number.isRequired,
        y: React.PropTypes.number.isRequired,
    },
    render:  function() {
        var classes = classNames({
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
        particleStore.on("particles:change", this.updateParticles);
        return {
            particles: []
        };
    },
    click: function(ev) {
        explosionAction.add(ev.pageX, ev.pageY);
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
