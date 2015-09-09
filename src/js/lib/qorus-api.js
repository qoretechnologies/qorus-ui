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
export default reduxApi({
  // simple edpoint description
  workflows: {
    url: `${url}/workflows/:id`,

  }
}, fetch); // it's nessasary to point using rest backend
