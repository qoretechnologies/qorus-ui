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
    transform: _.flowRight(
      normalizeId('name'),
    ),
  },
  {
    name: 'users',
    url: `${settings.REST_BASE_URL}/users`,
    transform: item => item,
  },
  {
    name: 'roles',
    url: `${settings.REST_BASE_URL}/roles`,
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
  {
    name: 'jobs',
    url: `${settings.REST_BASE_URL}/jobs`,
    transform: _.flowRight(
      normalizeName,
      normalizeId('jobid'),
      checkAlerts,
      // extendDefaults(servicesDefaults)
    ),
  },
  {
    name: 'orders',
    url: `${settings.REST_BASE_URL}/orders`,
    transform: _.flowRight(
      normalizeId('workflow_instanceid'),
    ),
  },
  {
    name: 'alerts',
    url: `${settings.REST_BASE_URL}/system/alerts`,
    transform: _.flowRight(
      normalizeId('alertid'),
    ),
  },
  {
    name: 'health',
    url: `${settings.REST_BASE_URL}/system/health`,
    transform: item => item,
  },
  {
    name: 'props',
    url: `${settings.REST_BASE_URL}/system/props`,
    transform: item => item,
  },
  {
    name: 'groups',
    url: `${settings.REST_BASE_URL}/groups`,
    transform: item => item,
  },
  {
    name: 'remotes',
    url: `${settings.REST_BASE_URL}/remote`,
    transform: _.flowRight(
      normalizeId('name'),
    ),
  },
  {
    name: 'userhttp',
    url: `${settings.REST_BASE_URL}/system/userhttp`,
    transform: item => item,
  },
  {
    name: 'sqlcache',
    url: `${settings.REST_BASE_URL}/system/sqlcache`,
    transform: item => item,
  },
  {
    name: 'classes',
    url: `${settings.REST_BASE_URL}/classes`,
    transform: _.flowRight(
      normalizeId('classid'),
    ),
  },
  {
    name: 'constants',
    url: `${settings.REST_BASE_URL}/constants`,
    transform: _.flowRight(
      normalizeId('constantid'),
    ),
  },
  {
    name: 'functions',
    url: `${settings.REST_BASE_URL}/functions`,
    transform: _.flowRight(
      normalizeId('function_instanceid'),
    ),
  },
  {
    name: 'ocmd',
    url: `${settings.REST_BASE_URL}/system/api`,
    transform: item => item,
  },
  {
    name: 'auth',
    url: `${settings.REST_BASE_URL}/public/login`,
    transform: item => item,
  },
  {
    name: 'info',
    url: `${settings.REST_BASE_URL}/public/info`,
    transform: item => item,
  },
  {
    name: 'logout',
    url: `${settings.REST_BASE_URL}/logout`,
    transform: item => item,
  },
  {
    name: 'jobresults',
    url: `${settings.REST_BASE_URL}/jobresults`,
    transform: item => item,
  },
  {
    name: 'perms',
    url: `${settings.REST_BASE_URL}/perms/`,
    transform: item => item,
  },
  {
    name: 'extensions',
    url: `${settings.REST_BASE_URL}/system/ui/extensions`,
    transform: item => item,
  },
  {
    name: 'mappers',
    url: `${settings.REST_BASE_URL}/mappers`,
    transform: item => item,
  },
  {
    name: 'valuemaps',
    url: `${settings.REST_BASE_URL}/valuemaps`,
    transform: item => item,
  },
  {
    name: 'orderErrors',
    url: `${settings.REST_BASE_URL}/orders?action=listErrors`,
    transform: _.flowRight(
      normalizeId('workflow_instanceid'),
    ),
  },
  {
    name: 'releases',
    url: `${settings.REST_BASE_URL}/releases?with_components=1`,
  },
];
