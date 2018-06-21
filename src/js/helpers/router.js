import UrlPattern from 'url-pattern';
import qs from 'qs';
import { pickBy } from 'lodash';
import { WORKFLOW_FILTERS } from '../constants/filters';

const routes = {
  workflows: {
    date: '24h',
    filter: WORKFLOW_FILTERS.ALL,
  },
  workflow: {
    date: '24h',
    filter: 'All',
    tabId: 'list',
  },
  order: {
    tabId: 'diagram',
  },
  jobs: {
    date: '24h',
  },
  groups: {},
};

/**
 * Page changing function accepts params and queries
 *
 * @param {Object} router
 * @param {String} name
 * @param {String} path
 * @param {Object} params
 * @param {Object} change
 * @param {!Object} query
 */
const goTo = (router, name, path, params, change, query = null) => {
  let newPath = path;

  if (query && Object.keys(query).length !== 0) {
    const queryString = qs.stringify(query);
    newPath = `${path}?${queryString}`;
  }

  const mergedParams = Object.assign({}, params, change);
  const clearParams = pickBy(mergedParams, v => v);
  const newParams = Object.assign({}, routes[name], clearParams);
  const url = new UrlPattern(newPath).stringify(newParams);

  router.push(`/${url}`);
};

const changeQuery = (
  router: Object,
  location: Object,
  change: Object,
  merge: boolean = true
) => {
  const { pathname, query } = location;
  let newQuery = merge ? Object.assign(query, change) : change;

  if (!merge && query.tab && !change.tab) {
    newQuery = { ...newQuery, ...{ tab: query.tab } };
  }

  router.push({
    pathname,
    query: newQuery,
  });
};

const isActive = (to, location) => location.startsWith(to);

export { routes, goTo, isActive, changeQuery };
