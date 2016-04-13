/*
 * TODO Take a look at react-router and its Link componet whether it
 * can replace all this.
 */

import UrlPattern from 'url-pattern';
import { pickBy } from 'lodash';
import { WORKFLOW_FILTERS } from 'constants/filters';

const routes = {
  workflows: {
    date: '24h',
    filter: WORKFLOW_FILTERS.ALL,
  },
  groups: {},
};


export default function goTo(router, name, path, params, change) {
  const mergedParams = Object.assign({}, params, change);
  const clearParams = pickBy(mergedParams, v => v);
  const newParams = Object.assign({}, routes[name], clearParams);
  const url = new UrlPattern(path).stringify(newParams);

  router.push(`/${url}`);
}
