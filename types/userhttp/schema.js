/**
 * @module types/http/schema
 */


require('../setup');


const UserHttp = {
  type: 'object',
  properties: {
    group: {
      type: 'string',
    },
    title: {
      type: 'string',
    },
    url: {
      type: 'string',
    },
    service: {
      type: 'string',
    },
    serviceid: {
      type: 'number',
    },
    version: {
      type: 'string',
    },
  },
  required: ['name', 'value', 'group', 'url', 'serviceid', 'version', 'service'],
};


module.exports.schema = UserHttp;
