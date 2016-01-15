import settings from '../../../settings';
import { flowRight } from 'lodash';
import { extendDefaults, normalizeId, normalizeName } from './utils';
import { DEFAULTS as workflowDefaults } from './workflows';

const url = settings.REST_API_PREFIX;

export default [
  {
    name: 'workflows',
    url: `${url}/workflows`,
    transform: flowRight(
      normalizeName,
      normalizeId('workflowid'),
      extendDefaults(workflowDefaults)
    )
  },
  {
    name: 'orders',
    url: `${url}/orders`,
    transform: normalizeId('workflow_instanceid')
  },
  {
    name: 'services',
    url: `${url}/services`,
    transform: flowRight(
      normalizeName,
      normalizeId('serviceid')
    )
  },
  {
    name: 'jobs',
    url: `${url}/jobs`,
    transform: flowRight(
      normalizeName,
      normalizeId('jobid')
    )
  },
  {
    name: 'errors',
    url: `${url}/errors`
  },
  {
    name: 'system',
    url: `${url}/system`,
    initialState: { data: {} },
    transform: item => item
  },
  {
    name: 'systemOptions',
    url: `${url}/system/options`,
    transform: item => item
  },
  {
    name: 'currentUser',
    url: `${url}/users?action=current`,
    initialState: { data: {} },
    transform: item => item
  }
];
