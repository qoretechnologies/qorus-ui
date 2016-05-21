/**
 * @module types/services/schema
 */

require('../setup');
const common = require('../common');

const Order = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
    version: {
      type: 'string',
      format: 'qorus-version',
    },
    author: {
      type: 'string',
    },
    workflow_instanceid: {
      $ref: 'positiveInteger',
    },
    workflowid: {
      $ref: 'positiveInteger',
    },
    workflowstatus: {
      type: 'string',
      pattern: 'COMPLETED|READY|RETRY|SCHEDULED|CANCELED|BLOCKED|WAITING|ASYNC-WAITING|EVENT-WAITING|INCOMPLETE|ERROR',
    },
    status_sessionid: {
      $ref: 'smallNonNegativeInteger',
    },
    parent_workflow_instanceid: {
      $ref: 'smallNonNegativeInteger',
    },
    subworkflow: {
      $ref: 'positiveInteger',
    },
    synchronous: {
      $ref: 'smallNonNegativeInteger',
    },
    errors: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
          },
        },
      },
    },
    note_count: {
      $ref: 'smallNonNegativeInteger',
    },
    busines_error: {
      type: 'boolean',
    },
    workflowstatus_orig: {
      type: 'string',
      pattern: 'C|Y|S|N|V|A|W|R|E|I|X|B',
    },
    custom_status: {
      type: 'string',
      pattern: 'C|Y|S|N|V|A|W|R|E|X|B',
    },
    scheduled: {
      type: 'string',
      format: 'date-time',
    },
    priority: {
      $ref: 'smallNonNegativeInteger',
    },
    started: {
      type: 'string',
      format: 'date-time',
    },
    completed: {
      type: 'string',
      format: 'date-time',
    },
    modified: {
      type: 'string',
      format: 'date-time',
    },
    operator_lock: {
      type: 'string',
      pattern: 'admin|system|otheruser',
    },
    custom_status_desc: {
      type: 'string',
    },
    deprecated: {
      type: 'boolean',
    },
    autostart: {
      type: 'string',
    },
    manual_autostart: {
      type: 'boolean',
    },
    max_instances: {
      $ref: 'positiveInteger',
    },
    external_order_instanceid: {
      $ref: 'positiveInteger',
    },
    keys: {
      type: 'string',
    },
    warning_count: {
      $ref: 'smallNonNegativeInteger',
    },
    error_count: {
      $ref: 'smallNonNegativeInteger',
    },
    notes: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          saved: {
            type: 'boolean',
          },
          note: {
            type: 'string',
          },
          username: {
            type: 'string',
          },
          created: {
            type: 'string',
            format: 'date-time',
          },
          modified: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
    },
  },
  required: [
  ],
};


module.exports.schema = Order;
module.exports.refs = [
  Object.assign({
    id: 'smallNonNegativeInteger',
    maximum: 10,
    exclusiveMaximum: true,
  }, common.nonNegativeInteger),
  Object.assign({ id: 'positiveInteger' }, common.positiveInteger),
  Object.assign({ id: 'nonNegativeInteger' }, common.nonNegativeInteger),
];
