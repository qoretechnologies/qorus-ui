define(function (require) {
  var React = require('react'),
      _     = require('underscore');
      
  return {
    shouldComponentUpdate: function (nextProps) {
      return !_.isEqual(this.props.model.hash, nextProps.model.hash) || !nextProps.model.hash;
    }
  };
});