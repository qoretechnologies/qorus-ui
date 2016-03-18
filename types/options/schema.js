/**
 * @module types/options/schema
 */


require('../setup');


const Option = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
    value: {
      type: ['string', 'number'],
    },
  },
  required: ['name', 'value'],
};


module.exports.schema = Option;
