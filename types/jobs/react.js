/**
 * @module types/jobs/react
 */


const React = require('react');

const Option = require('../options/react');
const Mapper = require('../mappers/react');
const Alert = require('../alerts/react');
const Group = require('../group/react');

const Job = React.PropTypes.shape({
  jobid: React.PropTypes.number.isRequired,
  name: React.PropTypes.string.isRequired,
  description: React.PropTypes.string.isRequired,
  version: React.PropTypes.integer.isRequired,
  author: React.PropTypes.string.isRequired,
  single_instance: React.PropTypes.bool.isRequired,
  sessionid: React.PropTypes.integer.isRequired,
  run_skipped: React.PropTypes.bool.isRequired,
  month: React.PropTypes.string.isRequired,
  day: React.PropTypes.string.isRequired,
  wday: React.PropTypes.string.isRequired,
  hour: React.PropTypes.string.isRequired,
  minute: React.PropTypes.string.isRequired,
  manually_updated: React.PropTypes.bool.isRequired,
  created: React.PropTypes.string.isRequired,
  modified: React.PropTypes.string.isRequired,
  enabled: React.PropTypes.bool.isRequired,
  source: React.PropTypes.string.isRequired,
  line: React.PropTypes.string.isRequired,
  mappers: React.PropTypes.arrayOf(Mapper),
  vmaps: React.PropTypes.array,
  lib: React.PropTypes.object.isRequired,
  tags: React.PropTypes.object.isRequired,
  groups: React.PropTypes.arrayOf(Group).isRequired,
  offset: React.PropTypes.string.isRequired,
  host: React.PropTypes.string.isRequired,
  user: React.PropTypes.string.isRequired,
  code: React.PropTypes.string.isRequired,
  connections: React.PropTypes.array.isRequired,
  alerts: React.PropTypes.arrayOf(Alert).isRequired,
  db_active: React.PropTypes.bool.isRequired,
  active: React.PropTypes.bool.isRequired,
  options: React.PropTypes.arrayOf(Option),
  sched_type: React.PropTypes.string.isRequired,
  sched_txt: React.PropTypes.string.isRequired,
  COMPLETE: React.PropTypes.integer,
  ERROR: React.PropTypes.integer,
  'IN-PROGRESS': React.PropTypes.integer,
  CRASHED: React.PropTypes.integer,
  TOTAL: React.PropTypes.integer,
});

module.exports = Job;
