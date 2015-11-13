/*
 * TODO Take a look at react-router and its Link componet whether it
 * can replace all this.
 */

import UrlPattern from 'url-pattern';
import history from 'history';
import { pick } from 'lodash';


const routes = {
  workflows: {
    date: '24h',
    filter: 'all'
  },
  groups: {}
};


export default function goTo(name, path, params, change) {
  const mergedParams = Object.assign({}, params, change);
  const clearParams = pick(mergedParams, v => v);
  const newParams = Object.assign({}, routes[name], clearParams);
  const url = new UrlPattern(path).stringify(newParams);

  history.pushState(null, '/' + url);
}
