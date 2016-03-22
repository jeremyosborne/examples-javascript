var objectAssign = require("object-assign");
var Redux = require("redux");
var particle = require("./particle");  // for the css and nothing more at the moment.

var entityCreators = {
    particle: particle,
};

var entityId = (function() {
    var id = 1;
    return function() {
        return id++;
    };
})();

var entity = function(state, action) {
    switch (action.type) {
        case "ENTITY_ADD":
            return entityCreators[action.entity].create(entityId(), action);
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
var entities = function(state, action) {
    state = state || initialParticles;
    switch (action.type) {
        case "ENTITY_ADD":
            return state.concat([entity(null, action)]);

        case "TICK":
            return state.map(function(ent) {
                return entity(ent, action);
            });

        case "ENTITY_BOUNDS_KILL":
            return state.filter(function(ent) {
                return (ent.x > 0 && ent.x < action.x) && (ent.y > 0 && ent.y < action.y);
            });

        default:
            return state;
    }
};



var reducers = Redux.combineReducers({
    entities: entities,
});

module.exports = Redux.createStore(reducers);
