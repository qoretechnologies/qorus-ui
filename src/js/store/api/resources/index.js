import _ from 'lodash';

import {
  extendDefaults,
  normalizeId,
  normalizeName,
  checkAlerts,
  normalizeWorkflowLib,
} from './utils';
import { DEFAULTS as workflowDefaults } from './workflows';
import { DEFAULTS as servicesDefaults } from './services';
import settings from '../../../settings';


export default [
  {
    name: 'workflows',
    url: `${settings.REST_BASE_URL}/workflows`,
    transform: _.flowRight(
      normalizeName,
      normalizeId('workflowid'),
      checkAlerts,
      normalizeWorkflowLib,
      extendDefaults(workflowDefaults)
    ),
  },
  {
    name: 'steps',
    url: `${settings.REST_BASE_URL}/steps`,
    transform: _.flowRight(
      normalizeName,
      normalizeId('stepid')
    ),
  },
  {
    name: 'errors',
    url: `${settings.REST_BASE_URL}/errors`,
  },
  {
    name: 'system',
    url: `${settings.REST_BASE_URL}/system`,
    initialState: { data: {} },
    transform: item => item,
  },
  {
    name: 'systemOptions',
    url: `${settings.REST_BASE_URL}/system/options`,
    transform: item => item,
  },
  {
    name: 'currentUser',
    url: `${settings.REST_BASE_URL}/users?action=current`,
    initialState: { data: {} },
    transform: item => item,
  },
  {
    name: 'services',
    url: `${settings.REST_BASE_URL}/services`,
    transform: _.flowRight(
      normalizeName,
      normalizeId('serviceid'),
      checkAlerts,
      extendDefaults(servicesDefaults)
    ),
  },
];
