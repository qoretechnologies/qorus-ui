/**
 * @module types/options/schema
 */


require('../setup');


const Http = {
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


module.exports.schema = Http;
