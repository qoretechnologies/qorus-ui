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
    detailId: '',
    tabId: ''
  })
});


export default function goTo(name, path, params, change) {
  const mergedParams = Object.assign({}, DEFAULT_PARAMS[name], params, change);
  const newParams = pick(mergedParams, v => v);
  const url = new UrlPattern(path).stringify(newParams);

  history.pushState(null, '/' + url);
}
