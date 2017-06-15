/**
 * @module types/alerts/react
 */


const RPT = require('react').PropTypes;

const Alert = RPT.shape({
  type: RPT.string.isRequired,
  id: RPT.string.isRequired,
  alerttype: RPT.string.isRequired,
  local: RPT.bool.isRequired,
  alert: RPT.string.isRequired,
  alertid: RPT.number.isRequired,
  reason: RPT.string.isRequired,
  who: RPT.string.isRequired,
  source: RPT.string.isRequired,
  object: RPT.string.isRequired,
  instance: RPT.string.isRequired,
  name: RPT.string,
  version: RPT.string,
  auditid: RPT.number,
  first_raised: RPT.string,
});

module.exports = Alert;