var classNames = require("classnames");
var React = require("react");



var Entity = React.createClass({
    propTypes: {
        x: React.PropTypes.number.isRequired,
        y: React.PropTypes.number.isRequired,
        classNames: React.PropTypes.string.isRequired,
    },
    render:  function() {
        var classes = classNames.apply(classNames, this.props.classNames.split(" "));
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
