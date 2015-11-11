/*
 * TODO Take a look at react-router and its Link componet whether it
 * can replace all this.
 */

import UrlPattern from 'url-pattern';
import history from 'history';
import { pick } from 'lodash';


const DEFAULT_PARAMS = Object.freeze({
  workflows: Object.freeze({
    date: '24h',
    filter: 'all',
    detailId: null,
    tabId: null
  })
});


export default function goTo(name, path, params, change) {
  const mergedParams = Object.assign({}, params, change);
  const clearParams = pick(mergedParams, v => v);
  const paramsWDefaults = Object.assign({}, DEFAULT_PARAMS[name], clearParams);
  const newParams = pick(paramsWDefaults, v => v);
  const url = new UrlPattern(path).stringify(newParams);

  history.pushState(null, '/' + url);
}
