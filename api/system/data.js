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
  const http = require('../../types/userhttp/schema');
  const health = require('../../types/health/schema');
  const alerts = require('../../types/alerts/schema');
  // const rbac = require('../../types/rbac/schema');

  return {
    system: jsf(system.schema, system.refs),
    options: jsf({
      type: 'array',
      items: options.schema,
      minItems: 5,
      maxItems: 50,
      uniqueItems: true,
    }),
    userhttp: jsf({
      type: 'array',
      items: http.schema,
      minItems: 1,
      maxItems: 10,
      uniqueItems: true,
    }),
    health: jsf(health.schema, health.refs),
    alerts: jsf({
      type: 'array',
      items: alerts.schema,
      minItems: 0,
      maxItems: 50,
      uniqueItems: true,
    }, alerts.refs),
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
    case 'dev_fix':
      return buildFromFixtures();
    default:
      return generateFromSchema();
  }
};
