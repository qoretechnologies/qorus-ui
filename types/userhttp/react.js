/**
 * @module types/system/userhttp/react
 */


const React = require('react');

const UserHttp = React.PropTypes.shape({
  group: React.PropTypes.string.isRequired,
  title: React.PropTypes.string.isRequired,
  url: React.Proptypes.string.isRequired,
  service: React.Proptypes.string.isRequired,
  serviceid: React.Proptypes.number.isRequired,
  version: React.Proptypes.string.isRequired,
});


module.exports = UserHttp;
