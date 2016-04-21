/**
 * @module types/services/react
 */


const React = require('react');

const Option = require('../options/react');
const Mapper = require('../mappers/react');
const Method = require('../methods/react');
const Group = require('../groups/react');

const Service = React.PropTypes.shape({
  serviceid: React.PropTypes.number.isRequired,
  type: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired,
  version: React.PropTypes.string.isRequired,
  description: React.PropTypes.string.isRequired,
  author: React.PropTypes.string.isRequired,
  parse_options: React.PropTypes.string.isRequired,
  autostart: React.PropTypes.number.isRequired,
  manual_autostart: React.PropTypes.bool.isRequired,
  enabled: React.PropTypes.bool.isRequired,
  deprecated: React.PropTypes.bool.isRequired,
  created: React.PropTypes.string.isRequired,
  modified: React.PropTypes.string.isRequired,
  mappers: React.PropTypes.arrayOf(Mapper).isRequired,
  vmaps: React.PropTypes.array.isRequired,
  latest: React.PropTypes.bool.isRequired,
  methods: React.PropTypes.arrayOf(Method).isRequired,
  groups: React.PropTypes.arrayOf(Group).isRequired,
  resource_files: React.PropTypes.array.isRequired,
  status: React.PropTypes.string.isRequired,
  threads: React.PropTypes.number.isRequired,
  resources: React.PropTypes.array.isRequired,
  log_url: React.PropTypes.string.isRequired,
  options: React.PropTypes.arrayOf(Option).isRequired,
  connections: React.PropTypes.array.isRequired,
  alerts: React.PropTypes.array.isRequired,
});


module.exports = Service;
