/**
 * @module types/alerts/schema
 */


require('../setup');
const common = require('../common');

const Alert = {
  type: 'object',
  properties: {
    type: {
      type: 'string',
      pattern: 'ONGOING|TRANSIENT',
    },
    id: {
      type: 'string',
    },
    alerttype: {
      type: 'string',
    },
    local: {
      type: 'boolean',
    },
    alert: {
      type: 'string',
    },
    alertid: {
      $ref: 'positiveInteger',
    },
    reason: {
      type: 'string',
    },
    who: {
      type: 'string',
    },
    source: {
      type: 'string',
    },
    object: {
      type: 'string',
    },
    instance: {
      type: 'string',
    },
    name: {
      type: 'string',
    },
    version: {
      type: 'number',
      format: 'qorus-version',
    },
    auditid: {
      $ref: 'positiveInteger',
    },
    first_raised: {
      type: 'string',
    },
  },
  required: [
    'type', 'id', 'alerttype', 'local', 'alert', 'alertid', 'reason',
    'who', 'source', 'object', 'instance', 'name', 'version', 'auditid',
    'first_raised',
  ],
  definitions: {
    smallPositiveInteger: Object.assign({
      maximum: 500 },
      common.positiveInteger
    ),
  },
};

module.exports.schema = Alert;
module.exports.refs = [
  Object.assign({ id: 'positiveInteger', maximum: 500 }, common.positiveInteger),
];
