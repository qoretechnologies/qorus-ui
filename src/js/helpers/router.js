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

export { routes, isActive, changeQuery };
