'use strict';


/**
 * System data.
 *
 * Based on `NODE_ENV` exports either fixtures or generated data.
 *
 * @module api/system/data
 */


function buildFromFixtures() {
  const path = require('path');
  const fs = require('fs');

  const FIXTURES = path.join(__dirname, '..', '..', 'fixtures', 'system');

  return fs.readdirSync(FIXTURES).
    filter(file => path.extname(file) === '.json').
    reduce((obj, file) => (
      Object.assign(obj, {
        [path.basename(file, '.json')]:
        JSON.parse(fs.readFileSync(path.join(FIXTURES, file))),
      })
    ), {});
}


function generateFromSchema() {
  const jsf = require('json-schema-faker');
  const system = require('../../types/system/schema');
  const options = require('../../types/options/schema');

  return {
    system: jsf(system.schema, system.refs),
    options: jsf({
      type: 'array',
      items: options.schema,
      minItems: 5,
      maxItems: 50,
      uniqueItems: true,
    }),
  };
}


/**
 * @return {!{
 *   system: !module:types/system.System,
 *   options: !Array<!module:types/options.Options>,
 * }}
 */
module.exports = () => {
  switch (process.env.NODE_ENV || 'development') {
    case 'test':
      return buildFromFixtures();
    default:
      return generateFromSchema();
  }
};
