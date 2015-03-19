define(function (require) {
  var React    = require('react'),
      Backbone = require('backbone');

  return React.createClass({
    propTypes: {
      model: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },
  
    render: function () {
      if (this.props.model.get('has_alerts')) {
        return (
          <i className="icon-warning-sign text-error" />
        );      
      }
      
      return <i />;
    }
  });
});