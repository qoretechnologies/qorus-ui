import _ from 'lodash';

import { extendDefaults, normalizeId, normalizeName } from './utils';
import { DEFAULTS as workflowDefaults } from './workflows';
import settings from '../../../settings';


export default [
  {
    name: 'workflows',
    url: `${settings.REST_API_PREFIX}/workflows`,
    transform: _.flowRight(
      normalizeName,
      normalizeId('workflowid'),
      extendDefaults(workflowDefaults)
    ),
  },
  {
    name: 'steps',
    url: `${settings.REST_API_PREFIX}/steps`,
    transform: _.flowRight(
      normalizeName,
      normalizeId('stepid')
    ),
  },
  {
    name: 'errors',
    url: `${settings.REST_API_PREFIX}/errors`,
  },
  {
    name: 'system',
    url: `${settings.REST_API_PREFIX}/system`,
    initialState: { data: {} },
    transform: item => item,
  },
  {
    name: 'systemOptions',
    url: `${settings.REST_API_PREFIX}/system/options`,
    transform: item => item,
  },
  {
    name: 'currentUser',
    url: `${settings.REST_API_PREFIX}/users?action=current`,
    initialState: { data: {} },
    transform: item => item,
  },
];
