import _ from 'lodash';

import settings from '../../../settings';
import { DEFAULTS as servicesDefaults } from './services';
import {
  addHasAlerts, checkAlerts, extendDefaults, findMissingBand,
  injectStorageDefaults, normalizeId, normalizeName, normalizeWorkflowLib
} from './utils';
import { DEFAULTS as workflowDefaults } from './workflows';

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
    transform: _.flowRight(normalizeName, normalizeId('stepid')),
  },
  {
    name: 'errors',
    url: `${settings.REST_BASE_URL}/errors`,
  },
  {
    name: 'system',
    url: `${settings.REST_BASE_URL}/system`,
    initialState: { data: {} },
    transform: (item) => {
      if (!item.order_stats) {
        return {
          ...item,
          ...{
            order_stats: [
              {
                l: [
                  { disposition: 'A', count: 0, pct: 0 },
                  { disposition: 'M', count: 0, pct: 0 },
                  { disposition: 'C', count: 0, pct: 0 },
                ],
                label: '1_hour_band',
                sla: [],
              },
              {
                l: [
                  { disposition: 'A', count: 0, pct: 0 },
                  { disposition: 'M', count: 0, pct: 0 },
                  { disposition: 'C', count: 0, pct: 0 },
                ],
                label: '4_hour_band',
                sla: [],
              },
              {
                l: [
                  { disposition: 'A', count: 0, pct: 0 },
                  { disposition: 'M', count: 0, pct: 0 },
                  { disposition: 'C', count: 0, pct: 0 },
                ],
                label: '24_hour_band',
                sla: [],
              },
            ],
          },
        };
      }

      const missingBands: ?Array<string> = findMissingBand(item.order_stats);

      if (missingBands.length !== 0) {
        item.order_stats = [
          ...item.order_stats,
          ...missingBands.map((label) => ({
            l: [
              { disposition: 'A', count: 0, pct: 0 },
              { disposition: 'M', count: 0, pct: 0 },
              { disposition: 'C', count: 0, pct: 0 },
            ],
            label,
            sla: [],
          })),
        ];

        item.order_stats.sort((a, b) => {
          if (parseInt(a.label, 10) < parseInt(b.label, 10)) {
            return -1;
          }

          if (parseInt(a.label, 10) > parseInt(b.label, 10)) {
            return 1;
          }

          return 0;
        });
      }

      return item;
    },
  },
  {
    name: 'systemOptions',
    url: `${settings.REST_BASE_URL}/system/options`,
    transform: _.flowRight(normalizeId('name')),
  },
  {
    name: 'users',
    url: `${settings.REST_BASE_URL}/users`,
    transform: (item) => item,
  },
  {
    name: 'roles',
    url: `${settings.REST_BASE_URL}/roles`,
    transform: (item) => item,
  },
  {
    name: 'currentUser',
    url: `${settings.REST_BASE_URL}/users?action=current`,
    initialState: { data: {} },
    transform: (item) => injectStorageDefaults(item),
  },
  {
    name: 'services',
    url: `${settings.REST_BASE_URL}/services`,
    transform: _.flowRight(
      normalizeName,
      normalizeId('serviceid'),
      addHasAlerts,
      extendDefaults(servicesDefaults)
    ),
  },
  {
    name: 'jobs',
    url: `${settings.REST_BASE_URL}/jobs`,
    transform: _.flowRight(normalizeName, normalizeId('jobid'), addHasAlerts),
  },
  {
    name: 'orders',
    url: `${settings.REST_BASE_URL}/orders`,
    transform: _.flowRight(normalizeId('workflow_instanceid')),
  },
  {
    name: 'alerts',
    url: `${settings.REST_BASE_URL}/system/alerts`,
    transform: _.flowRight(normalizeId('alertid')),
  },
  {
    name: 'health',
    url: `${settings.REST_BASE_URL}/system/health`,
    transform: (item) => item,
  },
  {
    name: 'props',
    url: `${settings.REST_BASE_URL}/system/props`,
    transform: (item) => item,
  },
  {
    name: 'groups',
    url: `${settings.REST_BASE_URL}/groups`,
    transform: (item) => item,
  },
  {
    name: 'remotes',
    url: `${settings.REST_BASE_URL}/remote`,
    transform: _.flowRight(normalizeId('name'), addHasAlerts),
  },
  {
    name: 'userhttp',
    url: `${settings.REST_BASE_URL}/system/userhttp`,
    transform: (item) => item,
  },
  {
    name: 'sqlcache',
    url: `${settings.REST_BASE_URL}/system/sqlcache`,
    transform: (item) => item,
  },
  {
    name: 'classes',
    url: `${settings.REST_BASE_URL}/classes`,
    transform: _.flowRight(normalizeId('classid')),
  },
  {
    name: 'constants',
    url: `${settings.REST_BASE_URL}/constants`,
    transform: _.flowRight(normalizeId('constantid')),
  },
  {
    name: 'functions',
    url: `${settings.REST_BASE_URL}/functions`,
    transform: _.flowRight(normalizeId('function_instanceid')),
  },
  {
    name: 'ocmd',
    url: `${settings.REST_BASE_URL}/system/api`,
    transform: (item) => item,
  },
  {
    name: 'auth',
    url: `${settings.REST_BASE_URL}/public/login`,
    transform: (item) => item,
  },
  {
    name: 'info',
    url: `${settings.REST_BASE_URL}/public/info`,
    transform: (item) => item,
  },
  {
    name: 'logout',
    url: `${settings.REST_BASE_URL}/logout`,
    transform: (item) => item,
  },
  {
    name: 'jobresults',
    url: `${settings.REST_BASE_URL}/jobresults`,
    transform: (item) => item,
  },
  {
    name: 'perms',
    url: `${settings.REST_BASE_URL}/perms/`,
    transform: (item) => item,
  },
  {
    name: 'extensions',
    url: `${settings.REST_BASE_URL}/system/ui/extensions`,
    transform: (item) => item,
  },
  {
    name: 'mappers',
    url: `${settings.REST_BASE_URL}/mappers`,
    transform: (item) => item,
  },
  {
    name: 'valuemaps',
    url: `${settings.REST_BASE_URL}/valuemaps`,
    transform: (item) => item,
  },
  {
    name: 'instances',
    url: `${settings.REST_BASE_URL}/jobs`,
    transform: (item) => item,
  },
  {
    name: 'orderErrors',
    url: `${settings.REST_BASE_URL}/orders?action=listErrors`,
    transform: _.flowRight(normalizeId('workflow_instanceid')),
  },
  {
    name: 'releases',
    url: `${settings.REST_BASE_URL}/releases?with_components=1`,
  },
  {
    name: 'slas',
    url: `${settings.REST_BASE_URL}/slas`,
  },
  {
    name: 'slaevents',
    url: `${settings.REST_BASE_URL}/slas`,
  },
  {
    name: 'slaperf',
    url: `${settings.REST_BASE_URL}/slas`,
  },
  {
    name: 'clients',
    url: `${settings.OAUTH_URL}/clients`,
  },
  {
    name: 'fsms',
    url: `${settings.REST_BASE_URL}/fsms`,
    transform: _.flowRight(normalizeId('name')),
  },
  {
    name: 'pipelines',
    url: `${settings.REST_BASE_URL}/pipelines`,
    transform: _.flowRight(normalizeId('name')),
  },
];
