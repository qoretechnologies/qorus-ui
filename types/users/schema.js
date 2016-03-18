/**
 * @module types/users/schema
 */


require('../setup');


const User = {
  type: 'object',
  properties: {
    username: {
      type: 'string',
      format: 'qorus-name',
    },
    name: {
      type: 'string',
      faker: 'name.findName',
    },
    permissions: {
      type: 'array',
      items: {
        type: 'string',
        format: 'qorus-codename',
      },
    },
  },
  required: ['username', 'name', 'permissions'],
};


module.exports.schema = User;
