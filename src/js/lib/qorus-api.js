import authHeader from '../lib/authorization-header';
import fetch from '../lib/authorized-fetch';
import settings from '../settings';
var restful = require('restful.js');

let url = settings.REST_API_PREFIX;
var api = restful(url);
api.header('Authorization', authHeader);

export function getCurrentUser() {
  return fetch(`${url}users/?action=current`);
}
var models = [
  'alerts',
  'class',
  'constants',
  'errors',
  'event',
  'function',
  'group',
  'health',
  'instance',
  'jobs',
  'mapper',
  'notification',
  'option',
  'order',
  'permission',
  'remote',
  'result',
  'roles',
  'services',
  'settings',
  'sqlcache',
  'step',
  'system',
  'users',
  'valueset',
  'workflows'
];
const qorusApi = {};

models.forEach(function (modelName){
   qorusApi[modelName] = api.all(modelName);
});

export default qorusApi;