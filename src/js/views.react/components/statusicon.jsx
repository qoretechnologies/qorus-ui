define(function (require) {
  var React      = require('react'),
      classNames = require('classnames');

  return React.createClass({
    render: function () {
      var cls = classNames({
        icon: true,
        'icon-ok-sign': this.props.value,
        'icon-minus-sign': !this.props.value,
        'icon-success': this.props.value,
        'icon-error': !this.props.value
      });

      return (
        <i className={ cls } />
      );
    }
  });
});
