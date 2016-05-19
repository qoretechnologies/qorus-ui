/**
 * @module types/system/remote/react
 */

const React = require('react');

const Remote = React.PropTypes.shape({
  name: React.PropTypes.string.isRequired,
  url: React.PropTypes.string.isRequired,
  'instance-key': React.PropTypes.string.isRequired,
  health: React.PropTypes.string.isRequired,
  error: React.PropTypes.string.isRequired,
  updated: React.PropTypes.string.isRequired,
});

const Health = React.PropTypes.shape({
  transient: React.PropTypes.number.isRequired,
  ongoing: React.PropTypes.number.isRequired,
  health: React.PropTypes.string.isRequired,
  'instance-key': React.PropTypes.string.isRequired,
  remote: React.PropTypes.arrayOf(Remote).isRequired,
});

module.exports = Health;
