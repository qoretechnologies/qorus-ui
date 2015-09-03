import fetch from '../lib/authorized-fetch'
import settings from '../settings'

let url = settings.REST_API_PREFIX;

export function getCurrentUser() {
  return fetch(`${url}users/?action=current`);
}
var models = [
  'errors',
  'alert',
  'class',
  'constant',
  'error',
  'event',
  'function',
  'group',
  'health',
  'instance',
  'job',
  'mapper',
  'notification',
  'option',
  'order',
  'permission',
  'remote',
  'result',
  'role',
  'service',
  'settings',
  'sqlcache',
  'step',
  'system',
  'user',
  'valueset',
  'workflow'
];
const qorusApi = {};

export default qorusApi;