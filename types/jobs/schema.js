/**
 * @module types/jobs/schema
 */

require('../setup');
const common = require('../common');
const Option = require('../options/schema').schema;
const Alert = require('../alerts/schema').schema;
const Group = require('../groups/schema').schema;

const Job = {
  type: 'object',
  properties: {
    jobid: {
      $ref: 'positiveInteger',
    },
    name: {
      type: 'string',
    },
    description: {
      type: 'string',
    },
    version: {
      type: 'string',
      format: 'qorus-version',
    },
    author: {
      type: 'string',
    },
    single_instance: {
      type: 'boolean',
    },
    sessionid: {
      $ref: 'positiveInteger',
    },
    run_skipped: {
      type: 'boolean',
    },
    month: {
      type: 'string',
    },
    day: {
      type: 'string',
    },
    wday: {
      type: 'string',
    },
    hour: {
      type: 'string',
    },
    minute: {
      type: 'string',
    },
    manually_updated: {
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
    enabled: {
      type: 'boolean',
    },
    source: {
      type: 'string',
    },
    line: {
      type: 'integer',
    },
    mappers: {
      type: 'array',
    },
    vmaps: {
      type: 'array',
    },
    lib: {
      type: 'object',
    },
    tags: {
      type: 'object',
    },
    groups: {
      type: 'array',
      items: {
        $ref: 'group',
      },
    },
    offset: {
      type: 'string',
    },
    host: {
      type: 'string',
    },
    user: {
      type: 'string',
    },
    code: {
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
    db_active: {
      type: 'boolean',
    },
    active: {
      type: 'boolean',
    },
    options: {
      type: 'array',
      items: {
        $ref: 'option',
      },
    },
    sched_type: {
      type: 'string',
    },
    sched_txt: {
      type: 'string',
    },
    COMPLETE: {
      $ref: 'positiveInteger',
    },
    CRASHED: {
      $ref: 'positiveInteger',
    },
    ERROR: {
      $ref: 'positiveInteger',
    },
    'IN-PROGRESS': {
      $ref: 'positiveInteger',
    },
  },
  required: [
    'jobid', 'name', 'description', 'version', 'sessionid', 'author',
    'created', 'modified', 'last', 'options', 'active', 'month', 'day',
    'wday', 'hour', 'minute', 'run_skipped', 'manually_updated', 'source',
    'line', 'lib', 'tags', 'groups', 'offset', 'host', 'user', 'code',
    'options'
  ],
};

module.exports.schema = Job;
module.exports.refs = [
  Object.assign({
    id: 'smallNonNegativeInteger',
    maximum: 10,
    exclusiveMaximum: true,
  }, common.nonNegativeInteger),
  Object.assign({ id: 'option' }, Option),
  Object.assign({ id: 'group' }, Group),
  Object.assign({ id: 'alert' }, Alert),
  Object.assign({ id: 'positiveInteger' }, common.positiveInteger),
  Object.assign({ id: 'nonNegativeInteger' }, common.nonNegativeInteger),
];
