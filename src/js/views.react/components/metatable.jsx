define(function (require) {
  var React = require('react'),
      _     = require('underscore');
      
  _.mixin({
    capitalize: function(string) {
      return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
    }
  });
  
  function replacer(key, value) {
    if (value) {
      return value.replace('\"', '');
    }
  }
  
  var MetaTableView = React.createClass({
    render: function () {
      var props = this.props.data,
          rows  = _.map(props, function (prop, idx) {
            var value = _.isObject(prop) ? <pre>{ JSON.stringify(prop, null, 4) }</pre> : prop;
            return (<tr key={ idx }><th>{ _.capitalize(idx) }</th><td>{ value }</td></tr>);
          });
    
      return (
        <table className="table table-vertical table-condensed table-striped">
          <tbody>
            { rows }
          </tbody>
        </table>
      );
    }
  });
  
  return MetaTableView;
});