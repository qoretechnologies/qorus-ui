/**
 * @module types/system/schema
 */


require('../setup');
const common = require('../common');


const System = {
  type: 'object',
  properties: {
    'instance-key': {
      type: 'string',
      format: 'qorus-name',
    },
    'omq-version': {
      type: 'string',
      format: 'qorus-system-version',
    },
    'omq-schema': {
      type: 'string',
      format: 'qorus-system-schema',
    },
    'omq-build': {
      $ref: 'positiveInteger',
    },
  },
  required: ['instance-key', 'omq-version'],
};


module.exports.schema = System;
module.exports.refs = [
  Object.assign({ id: 'positiveInteger' }, common.positiveInteger),
];
