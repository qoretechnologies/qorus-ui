/**
 * @module types/users/react
 */


const React = require('react');


const User = React.PropTypes.shape({
  username: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired,
  permissions: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
});


module.exports = User;
