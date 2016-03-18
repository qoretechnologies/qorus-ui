/**
 * @module types/workflows/react
 */


const React = require('react');

const Option = require('../options/react');


const WorkflowSegment = React.PropTypes.shape({
  steplist: React.PropTypes.arrayOf(React.PropTypes.number).isRequired,
  steps: React.PropTypes.object.isRequired,
});


const WorkflowGroup = React.PropTypes.shape({
  name: React.PropTypes.string.isRequired,
  enabled: React.PropTypes.bool.isRequired,
  size: React.PropTypes.number.isRequired,
});


const Workflow = React.PropTypes.shape({
  workflowid: React.PropTypes.number.isRequired,
  name: React.PropTypes.string.isRequired,
  version: React.PropTypes.string.isRequired,
  description: React.PropTypes.string.isRequired,
  author: React.PropTypes.string.isRequired,
  autostart: React.PropTypes.number.isRequired,
  manual_autostart: React.PropTypes.bool.isRequired,
  enabled: React.PropTypes.bool.isRequired,
  onetimeinit_func_instanceid: React.PropTypes.number.isRequired,
  deprecated: React.PropTypes.bool.isRequired,
  created: React.PropTypes.string.isRequired,
  modified: React.PropTypes.string.isRequired,
  keylist: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
  stepmap: React.PropTypes.object.isRequired,
  steps: React.PropTypes.object.isRequired,
  segment: React.PropTypes.arrayOf(WorkflowSegment).isRequired,
  options: React.PropTypes.arrayOf(Option).isRequired,
  groups: React.PropTypes.arrayOf(WorkflowGroup).isRequired,
});


module.exports = Workflow;
