/**
 * @module types/groups/react
 */


const React = require('react');

const Group = React.PropTypes.shape({
  name: React.PropTypes.string.isRequired,
  enabled: React.PropTypes.bool.isRequired,
  size: React.PropTypes.number.isRequired,
});


module.exports = Group;
