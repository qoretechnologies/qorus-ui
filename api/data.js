'use strict';


/**
 * @module api/data
 */


/**
 * Generates data from JSON schema.
 *
 * @param {string} source
 * @return {!Array<!Object>}
 */
function generateData(source) {
  const jsf = require('json-schema-faker');
  const type = require(`../types/${source}/schema`);

  return jsf({
    type: 'array',
    items: type.schema,
    minItems: 5,
    maxItems: 100,
    uniqueItems: true,
  }, type.refs);
}


/**
 * Returns parsed mock data from JSON files.
 *
 * @param {string} source
 * @return {!Array<!Object>}
 */
function fixtureData(source) {
  const path = require('path');
  const fs = require('fs');

  const FIXTURES = path.join(__dirname, '..', 'fixtures', source);

  return fs.readdirSync(FIXTURES).
    filter(file => path.extname(file) === '.json').
    map(file => JSON.parse(fs.readFileSync(path.join(FIXTURES, file))));
}


/**
 * Returns data based on `NODE_ENV`.
 *
 * @param {string} source
 * @return {!Array<!Object>}
 * @see generateData
 * @see serveMockData
 */
function getData(source) {
  switch (process.env.NODE_ENV || 'development') {
    case 'test':
      return fixtureData(source);
    default:
      return generateData(source);
  }
}


module.exports.generateData = generateData;
module.exports.fixtureData = fixtureData;
module.exports.getData = getData;
