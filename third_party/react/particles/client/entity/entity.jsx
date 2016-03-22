require("./entity.css");
var classNames = require("classnames");
var objectAssign = require("object-assign");
var React = require("react");



var Entity = React.createClass({
    propTypes: {
        x: React.PropTypes.number.isRequired,
        y: React.PropTypes.number.isRequired,
        classNames: React.PropTypes.object.isRequired,
    },
    render:  function() {
        var classes = classNames(objectAssign({
            entity: true,
        }, this.props.classNames));

        var position = {
            top: this.props.y + "px",
            left: this.props.x + "px",
        };

        return (
            <div className={classes} style={position}></div>
        );
    },
});
module.exports = Entity;
