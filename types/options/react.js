/**
 * @module types/options/react
 */


const React = require('react');


const Option = React.PropTypes.shape({
  name: React.PropTypes.string.isRequired,
  value: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number,
  ]).isRequired,
});


module.exports = Option;
