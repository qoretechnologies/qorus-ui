/**
 * @module types/common
 */


module.exports.nonNegativeInteger = {
  type: 'integer',
  minimum: 0,
  exclusiveMinimum: false,
};


module.exports.positiveInteger = {
  type: 'integer',
  minimum: 0,
  exclusiveMinimum: true,
};
