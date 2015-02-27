define(function (require, exports, module) {
  var React = require('react');

  var Path = React.createClass({
    render: function () {
      return <path {...this.props} />
    }
  });
  
  module.exports = Path;

  var Rect = React.createClass({
    render: function () {
      return <rect {...this.props} />
    }
  });
  
  module.exports = Rect;

  var Ellipse = React.createClass({
    render: function () {
      return <ellipse {...this.props} />
    }
  });
  
  module.exports = Ellipse;

  var Group = React.createClass({
    onClick: function (e) {
      this.props.onClick(e, this.props.step);
    },

    render: function () {
      var props = _.omit(this.props, ['elements', 'onClick']);
      return <g {...props} onClick={ this.onClick }>{ this.props.elements }</g>
    }
  });

  module.exports = Group;

  var Mask = React.createClass({
    render: function () {
      return <mask id={ this.props.id }>{ this.props.elements }</mask>
    }
  });
  
  module.exports = Mask;

  var Text = React.createClass({
    render: function () {
      var props = _.omit(this.props, 'text');
      return <text {...props} mask={ this.props.mask }>{ this.props.text }</text>;
    }
  });
  
  module.exports = Text;
  
  return {
    Path: Path,
    Rect: Rect,
    Ellipse: Ellipse,
    Group: Group,
    Mask: Mask,
    Text: Text
  }
});