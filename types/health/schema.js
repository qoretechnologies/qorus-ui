/**
 * @module types/health/schema
 */

require('../setup');
const common = require('../common');

const Remote = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
    url: {
      type: 'string',
    },
    'instance-key': {
      type: 'string',
    },
    health: {
      type: 'string',
      pattern: 'RED|YELLOW|GREEN',
    },
    error: {
      type: 'string',
    },
    updated: {
      type: 'string',
    },
  },
  required: [
    'name', 'url', 'health',
  ],
};

const Health = {
  type: 'object',
  properties: {
    transient: {
      $ref: 'positiveInteger',
    },
    ongoing: {
      $ref: 'positiveInteger',
    },
    health: {
      type: 'string',
      pattern: 'RED|YELLOW|GREEN',
    },
    'instance-key': {
      type: 'string',
    },
    remote: {
      type: 'array',
      items: {
        $ref: 'remote',
      },
    },
  },
  required: [
    'transient', 'ongoing', 'health', 'instance-key', 'remote',
  ],
};

module.exports.schema = Health;
module.exports.refs = [
  Object.assign({ id: 'positiveInteger' }, common.positiveInteger),
  Object.assign({ id: 'remote' }, Remote),
];
