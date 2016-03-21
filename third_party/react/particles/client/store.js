var objectAssign = require("object-assign");
var Redux = require("redux");

var particleId = 1;
// state is particle
var particle = function(state, action) {
    switch (action.type) {
        case "PARTICLE_ADD":
            return {
                id: particleId++,
                x: action.x || 0,
                y: action.y || 0,
                dx: action.dx || 0,
                dy: action.dy || 0,
            };
        case "TICK":
            return objectAssign({}, state, {
                // Change velocity (fake gravity).
                dy: state.dy += 0.5,
                // change position
                x: state.x + state.dx,
                y: state.y + state.dy,
            });
        default:
            return state;
    }
};

var initialParticles = [];
// state is array of particles
var particles = function(state, action) {
    state = state || initialParticles;
    switch (action.type) {
        case "PARTICLE_ADD":
            return state.concat([particle(null, action)]);

        case "TICK":
            return state.map(function(p) {
                return particle(p, action);
            });
        // case "DELETE_PARTICLE":
        //     return state.filter(function(p) {
        //         return p.id !== action.id;
        //     });

        default:
            return state;
    }
};



var reducers = Redux.combineReducers({
    particles: particles,
});

module.exports = Redux.createStore(reducers);
