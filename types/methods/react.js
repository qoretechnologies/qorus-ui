/**
 * @module types/methods/react
 */

const RPT = require('react').PropTypes;

const Method = RPT.shape({
  service_methodid: RPT.number.isRequired,
  name: RPT.string.isRequired,
  description: RPT.string.isRequired,
  author: RPT.string.isRequired,
  locktype: RPT.string.isRequired,
  internal: RPT.bool.isRequired,
  write: RPT.bool.isRequired,
  created: RPT.string.isRequired,
  modified: RPT.string.isRequired,
  tags: RPT.object.isRequired,
  source: RPT.string.isRequired,
  offset: RPT.string.isRequired,
  host: RPT.string.isRequired,
  user: RPT.string.isRequired,
});

module.exports = Method;
