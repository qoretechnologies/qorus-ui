/**
 * @module types/methods/schema
 */

require('../setup');
const common = require('../common');

const Method = {
  type: 'object',
  properties: {
    service_methodid: {
      $ref: 'positiveInteger',
    },
    name: {
      type: 'string',
    },
    description: {
      type: 'string',
    },
    author: {
      type: 'string',
    },
    locktype: {
      type: 'string',
    },
    internal: {
      type: 'boolean',
    },
    write: {
      type: 'boolean',
    },
    created: {
      type: 'string',
    },
    modified: {
      type: 'string',
    },
    tags: {
      type: 'object',
    },
    source: {
      type: 'string',
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
  },
  required: [
    'service_methodid', 'name', 'description', 'author',
    'locktype', 'internal', 'write', 'created', 'modified',
    'tags', 'source', 'offset', 'host', 'user',
  ],
};

module.exports.schema = Method;
module.exports.refs = [
  Object.assign({ id: 'positiveInteger' }, common.positiveInteger),
];
