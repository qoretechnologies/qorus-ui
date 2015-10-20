import settings from '../../../settings';
import { compose } from 'lodash';
import { extendDefaults, normalizeId, normalizeName } from './utils';
import { DEFAULTS as workflowDefaults } from './workflows';

const url = settings.REST_API_PREFIX;

export default [
  {
    name: 'workflows',
    url: `${url}/workflows`,
    transform: compose(
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
    transform: compose(
      normalizeName,
      normalizeId('serviceid')
    )
  },
  {
    name: 'jobs',
    url: `${url}/jobs`,
    transform: compose(
      normalizeName,
      normalizeId('jobid')
    )
  },
  {
    name: 'system',
    url: `${url}/system`,
    transform: item => item
  },
  {
    name: 'currentUser',
    url: `${url}/users?action=current`,
    transform: item => item
  }
];
