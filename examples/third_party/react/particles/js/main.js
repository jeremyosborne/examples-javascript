/* jshint undef:true, node:true, browser:true */

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
        w: 0,
        h: 0,
    },
    init: function() {
        dispatcher.register(this.dispatchCallback.bind(this));
    },
    dispatchCallback: function(action) {
        var self = this;
        var i;

        if (action.type == "PARTICLE") {
            this.particles.push({
                x: action.x,
                y: action.y,
                id: this.particleId++,
            });
            this.sendChange();
        } else if (action.type == "TICK") {
            // We're cheating a bit.
            this.particles = this.particles.filter(function(p) {
                p.y += 5;
                // If particles do more than fall, change this test.
                return p.y < self.dimensions.h;
            });
            if (this.particles.length) {
                this.sendChange();
            }
        } else if (action.type == "SCREEN_SIZE") {
            this.dimensions.w = action.width;
            this.dimensions.h = action.height;
        }
    },
    sendChange: function() {
        this.emit("particles:change", this.particles);
    }
});
particleStore.init();



var particleAction = {
    add: function(x, y) {
        dispatcher.dispatch({
            type: "PARTICLE",
            x: x,
            y: y,
        });
    },
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
        particleStore.on("particles:change", this.updateParticles);
        return {
            particles: []
        };
    },
    click: function(ev) {
        particleAction.add(ev.pageX, ev.pageY);
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
