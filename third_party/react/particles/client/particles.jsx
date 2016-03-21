var classNames = require("classnames");
var React = require("react");



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
            <div className={classes} style={position}></div>
        );
    },
});
module.exports.Particle = Particle;
