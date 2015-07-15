define(function (require) {
  var React           = require('react'),
      PureRenderMixin = React.addons.PureRenderMixin,
      _               = require('underscore'),
      classNames      = require('classnames'),
      Checker;

  Checker = React.createClass({
    mixins: [PureRenderMixin],

    propTypes: {
      checked: React.PropTypes.bool,
      onClick: React.PropTypes.func
    },

    render: function () {
      var cls = classNames({
        'check': true,
        'icon-check-empty': !this.props.checked,
        'icon-check': this.props.checked
      });

      return (
        <i className={cls} onClick={ this.props.onClick.bind(null, this.props.model) }></i>
      );
    }
  });

  return Checker;
});
