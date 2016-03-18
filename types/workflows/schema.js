/**
 * @module types/workflows/schema
 */


require('../setup');
const common = require('../common');
const Option = require('../options/schema').schema;


const WorkflowSegment = {
  type: 'object',
  properties: {
    steplist: {
      type: 'array',
      items: {
        type: 'integer',
      },
    },
    steps: {
      type: 'object',
      patternProperties: {
        '^\\d+$': {
          type: 'array',
          items: {
            type: 'integer',
          },
        },
      },
    },
  },
  required: ['steplist', 'steps'],
};


const WorkflowGroup = {
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


const Workflow = {
  type: 'object',
  properties: {
    workflowid: {
      $ref: 'positiveInteger',
    },
    name: {
      type: 'string',
    },
    version: {
      type: 'string',
      format: 'qorus-version',
    },
    description: {
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
    onetimeinit_func_instanceid: {
      type: 'integer',
    },
    deprecated: {
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
    keylist: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    stepmap: {
      type: 'object',
      patternProperties: {
        '^\\d+$': {
          type: 'string',
        },
      },
    },
    steps: {
      type: 'object',
      patternProperties: {
        '^\\d+$': {
          type: 'array',
          items: {
            type: 'integer',
          },
        },
      },
    },
    segment: {
      type: 'array',
      items: {
        $ref: 'segment',
      },
    },
    options: {
      type: 'array',
      items: {
        $ref: 'option',
      },
    },
    exec_count: {
      $ref: 'nonNegativeInteger',
    },
    groups: {
      type: 'array',
      items: {
        $ref: 'group',
      },
    },
    COMPLETE: {
      $ref: 'smallNonNegativeInteger',
    },
    READY: {
      $ref: 'smallNonNegativeInteger',
    },
    SCHEDULED: {
      $ref: 'smallNonNegativeInteger',
    },
    INCOMPLETE: {
      $ref: 'smallNonNegativeInteger',
    },
    'EVENT-WAITING': {
      $ref: 'smallNonNegativeInteger',
    },
    'ASYNC-WAITING': {
      $ref: 'smallNonNegativeInteger',
    },
    WAITING: {
      $ref: 'smallNonNegativeInteger',
    },
    RETRY: {
      $ref: 'smallNonNegativeInteger',
    },
    'IN-PROGRESS': {
      $ref: 'smallNonNegativeInteger',
    },
    CANCELED: {
      $ref: 'smallNonNegativeInteger',
    },
    BLOCKED: {
      $ref: 'smallNonNegativeInteger',
    },
    TOTAL: {
      $ref: 'smallNonNegativeInteger',
    },
  },
  required: [
    'workflowid', 'name', 'version', 'description', 'author', 'autostart',
    'manual_autostart', 'enabled', 'onetimeinit_func_instanceid',
    'deprecated', 'created', 'modified', 'keylist', 'stepmap', 'steps',
    'segment', 'options', 'exec_count', 'groups',
  ],
};


module.exports.schema = Workflow;
module.exports.refs = [
  Object.assign({
    id: 'smallNonNegativeInteger',
    maximum: 10,
    exclusiveMaximum: true,
  }, common.nonNegativeInteger),
  Object.assign({ id: 'segment' }, WorkflowSegment),
  Object.assign({ id: 'option' }, Option),
  Object.assign({ id: 'group' }, WorkflowGroup),
  Object.assign({ id: 'nonNegativeInteger' }, common.nonNegativeInteger),
  Object.assign({ id: 'positiveInteger' }, common.positiveInteger),
];
