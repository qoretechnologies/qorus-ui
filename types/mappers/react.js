/**
 * @module types/mappers/react
 */

const RPT = require('react').PropTypes;

const Mapper = RPT.shape({
  napperid: RPT.number.isRequired,
  name: RPT.string.isRequired,
  version: RPT.string.isRequired,
  type: RPT.string.isRequired,
});

module.exports = Mapper;
