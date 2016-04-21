/**
 * @module types/groups/schema
 */

require('../setup');
const common = require('../common');

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

module.exports.schema = Group;

module.exports.refs = [
  Object.assign({ id: 'nonNegativeInteger' }, common.nonNegativeInteger),
];
