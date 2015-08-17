define(function (require, module, exports) {
  var React      = require('react'),
      _          = require('underscore'),
      classNames = require('classnames');

  var SwitchButton = React.createClass({
    getDefaultProps: function () {
      return {
        labelOn: 'I',
        labelOff: 'O',
        setValue: _.noop
      };
    },

    propTypes: {
      setValue: React.PropTypes.func
    },

    render: function () {
      var btnState = this.props.value,

          btnOnCss = classNames(['btn', 'btn-mini'], { 'btn-success': btnState, 'active': btnState }),
          btnOffCss = classNames(['btn', 'btn-mini'], { 'btn-danger': !btnState, 'active': !btnState });

      return (
        <span className="btn-group btn-mini">
          <button className={ btnOnCss } onClick={ this.props.setValue.bind(null, true) }>{ this.props.labelOn }</button>
          <button className={ btnOffCss } onClick={ this.props.setValue.bind(null, false) }>{ this.props.labelOff }</button>
        </span>
      );
    }
  });

  module.exports = SwitchButton;

  return SwitchButton;
});
