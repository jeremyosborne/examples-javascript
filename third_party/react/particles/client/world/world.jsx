require("./world.css");
var Entity = require("../entity");
var objectAssign = require("object-assign");
var React = require("react");

var World = React.createClass({
    propTypes: {
        entities: React.PropTypes.array.isRequired,
        click: React.PropTypes.func.isRequired,
    },
    render: function() {
        var entities = this.props.entities.map(function(p) {
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
            <div className="world" onClick={this.props.click}>
                {entities}
            </div>
        );
    },
});

module.exports = World;
