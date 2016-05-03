/**
 * @module types/services/schema
 */

require('../setup');
const common = require('../common');
const Option = require('../options/schema').schema;
const Method = require('../methods/schema').schema;
const Alert = require('../alerts/schema').schema;

const Group = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
    enabled: {
      type: 'boolean',
    },
    size: {
      $ref: 'nonNegativeInteger',
    },
  },
  required: ['name', 'enabled', 'size'],
};

const Service = {
  type: 'object',
  properties: {
    serviceid: {
      $ref: 'positiveInteger',
    },
    type: {
      type: 'string',
      pattern: 'user|system',
    },
    name: {
      type: 'string',
    },
    version: {
      type: 'string',
      format: 'qorus-version',
    },
    desc: {
      type: 'string',
    },
    author: {
      type: 'string',
    },
    autostart: {
      $ref: 'smallNonNegativeInteger',
    },
    manual_autostart: {
      type: 'boolean',
    },
    enabled: {
      type: 'boolean',
    },
    created: {
      type: 'string',
      format: 'date-time',
    },
    modified: {
      type: 'string',
      format: 'date-time',
    },
    mappers: {
      type: 'array',
    },
    vmaps: {
      type: 'array',
    },
    latest: {
      type: 'boolean',
    },
    methods: {
      type: 'array',
      items: {
        $ref: 'method',
      },
    },
    groups: {
      type: 'array',
      items: {
        $ref: 'group',
      },
    },
    resource_files: {
      type: 'array',
    },
    status: {
      type: 'string',
      pattern: 'loaded|unloaded',
    },
    threads: {
      $ref: 'smallNonNegativeInteger',
    },
    resources: {
      type: 'array',
    },
    log_url: {
      type: 'string',
    },
    connections: {
      type: 'array',
    },
    alerts: {
      type: 'array',
      items: {
        $ref: 'alert',
      },
    },
    options: {
      type: 'array',
      items: {
        $ref: 'option',
      },
    },
  },
  required: [
    'serviceid', 'name', 'version', 'desc', 'author', 'autostart',
    'manual_autostart', 'enabled', 'created', 'modified',
    'options', 'groups', 'methods', 'status', 'type',
  ],
};


module.exports.schema = Service;
module.exports.refs = [
  Object.assign({
    id: 'smallNonNegativeInteger',
    maximum: 10,
    exclusiveMaximum: true,
  }, common.nonNegativeInteger),
  Object.assign({ id: 'option' }, Option),
  Object.assign({ id: 'group' }, Group),
  Object.assign({ id: 'method' }, Method),
  Object.assign({ id: 'alert' }, Alert),
  Object.assign({ id: 'positiveInteger' }, common.positiveInteger),
  Object.assign({ id: 'nonNegativeInteger' }, common.nonNegativeInteger),
];
