define(function (require) {
  var React = require('react');
  
  return React.createClass({
    render: function () {
      var cls = React.addons.classSet({
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