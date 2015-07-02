define(function (require, exports, module) {
  var React = require('react');

  var Path = React.createClass({
    render: function () {
      return <path {...this.props} />
    }
  });

  var Rect = React.createClass({
    render: function () {
      return <rect {...this.props} />
    }
  });

  var Ellipse = React.createClass({
    render: function () {
      return <ellipse {...this.props} />
    }
  });

  var Group = React.createClass({
    onClick: function (e) {
      this.props.onClick(e, this.props.step);
    },

    render: function () {
      var props = _.omit(this.props, ['elements', 'onClick']);
      return <g {...props} onClick={ this.onClick }>{ this.props.elements }</g>
    }
  });

  var Mask = React.createClass({
    render: function () {
      return <mask id={ this.props.id }>{ this.props.elements }</mask>
    }
  });

  var Text = React.createClass({
    render: function () {
      var props = _.omit(this.props, 'text');
      return <text {...props} mask={ this.props.mask }>{ this.props.text }</text>;
    }
  });

  var Marker = React.createClass({
    componentDidMount: function () {
      var el = this.getDOMNode();

      el.setAttribute('refX', 20);
      el.setAttribute('refY', 10);
      el.setAttribute('markerUnits', 'strokeWidth');
      el.setAttribute('markerWidth', 10);
      el.setAttribute('markerHeight', 10);
      el.setAttribute('orient', 'auto');
    },

    render: function () {
      return (
        <marker id="Triangle"
          viewBox="0 0 20 20"
          orient="auto">
          <path d="M 0 0 L 20 10 L 0 20 z"/>
        </marker>
      );
    }
  });

  var SVG = {
    Path: Path,
    Rect: Rect,
    Ellipse: Ellipse,
    Group: Group,
    Mask: Mask,
    Text: Text,
    Marker: Marker
  }

  module.exports = SVG;

  return SVG;
});
