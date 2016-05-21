/**
 * @module types/orders/react
 */

const React = require('react');

const Order = React.PropTypes.shape({
  name: React.PropTypes.string.isRequired,
  version: React.PropTypes.string.isRequired,
  author: React.PropTypes.string.isRequired,
  workflow_instanceid: React.PropTypes.number.isRequired,
  workflowid: React.PropTypes.number.isRequired,
  workflowstatus: React.PropTypes.string.isRequired,
  status_sessionid: React.PropTypes.number.isRequired,
  parent_workflow_instanceid: React.PropTypes.number.isRequired,
  subworkflow: React.PropTypes.number.isRequired,
  synchronous: React.PropTypes.number.isRequired,
  errors: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  note_count: React.PropTypes.number.isRequired,
  business_error: React.PropTypes.bool.isRequired,
  workflowstatus_orig: React.PropTypes.string.isRequired,
  custom_status: React.PropTypes.string.isRequired,
  scheduled: React.PropTypes.string.isRequired,
  priority: React.PropTypes.number.isRequired,
  started: React.PropTypes.string.isRequired,
  completed: React.PropTypes.string.isRequired,
  modified: React.PropTypes.string.isRequired,
  operator_lock: React.PropTypes.string.isRequired,
  custom_status_desc: React.PropTypes.string.isRequired,
  deprecated: React.PropTypes.bool.isRequired,
  autostart: React.PropTypes.string.isRequired,
  manual_autostart: React.PropTypes.boolean.isRequired,
  max_instances: React.PropTypes.number.isRequired,
  external_order_instanceid: React.PropTypes.number.isRequired,
  staticdata: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  dynamicdata: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  keys: React.PropTypes.string.isRequired,
  warning_count: React.PropTypes.number.isRequired,
  error_count: React.PropTypes.number.isRequired,
  StepInstances: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  ErrorInstances: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  AuditEvents: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  HierarchyInfo: React.PropTypes.objectOf(React.PropTypes.object).isRequired,
  LastModified: React.PropTypes.string.isRequired,
  actions: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
  notes: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
});

module.exports = Order;
