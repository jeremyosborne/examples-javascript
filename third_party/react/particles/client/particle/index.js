require("./particle.css");
// module.exports = require("./particle.jsx");

module.exports.create = function(id, data) {
    return {
        id: id,
        classNames: {
            particle: true,
        },
        x: data.x || 0,
        y: data.y || 0,
        dx: data.dx || 0,
        dy: data.dy || 0,
    };
};
