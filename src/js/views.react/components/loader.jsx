define(function (require) {
  var React = require('react');
  
  return React.createClass({
    render: function () { 
      return (
        <p><i className="icon-spinner icon-spin" /> Loading</p>
      );
    }
  });
});