define(function (require) {
  var React     = require('react'),
      PropTypes = React.PropTypes;
  
  var Component = React.createClass({
    propTypes: {
      obj: PropTypes.object,
      name: PropTypes.string,
      version: PropTypes.string,
      id: PropTypes.string
    },
  
    render: function () {
      var name, version, id, props = this.props;

      if (this.props.obj) {
        name = props.obj.getName();
        version = props.obj.getVersionPatch();
        id = props.obj.id;
      } else {
        name = props.name;
        version = props.version;
        id = props.id;
      }
    
      return (
        <span>
          {name} <small>{version} ({ id })</small>
        </span>
      );
    }
  });
  
  return Component;
});