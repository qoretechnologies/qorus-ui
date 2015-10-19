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
