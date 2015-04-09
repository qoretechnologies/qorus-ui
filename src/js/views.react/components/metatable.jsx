define(function (require) {
  var React = require('react'),
      _     = require('underscore');
      
  _.mixin({
    capitalize: function(string) {
      return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
    }
  });
  
  var MetaTableView = React.createClass({
    render: function () {
      var props = this.props.data,
          rows  = _.map(props, function (prop, idx) {
            return (<tr><th>{ _.capitalize(idx) }</th><td>{ prop }</td></tr>);
          });
    
      return (
        <table className="table table-vertical table-condensed table-striped">
          { rows }
        </table>
      );
    }
  });
  
  return MetaTableView;
});