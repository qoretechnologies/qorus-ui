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

import settings from '../settings';

const url = settings.REST_API_PREFIX;

import "whatwg-fetch";
import reduxApi, {transformers} from "redux-api";
import adapterFetch from "redux-api/lib/adapters/fetch";

export default reduxApi({
  // simple edpoint description
  workflows: {
    url: `${url}/workflows`,
  },
  workflow: {
    url: `${url}/workflows/:id`,
  },
  systemInfo: {
    url: `${url}/system`
  }
 }, adapterFetch(fetch)); // it's nessasary to point using rest backend
