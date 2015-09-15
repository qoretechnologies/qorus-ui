import settings from '../settings';

const url = settings.REST_API_PREFIX;

import 'whatwg-fetch';
import reduxApi, {transformers} from 'redux-api';
import adapterFetch from 'redux-api/lib/adapters/fetch';
// import { normalize, Schema, arrayOf } from 'normalizr';

// function makeBaseAuth(user, pass) {
//   const tok = user + ':' + pass;
//   const hash = btoa(tok);
//   return 'Basic ' + hash;
// }
//
// const options = {
//   headers: {
//     'Authorization': makeBaseAuth('admin', 'admin')
//   },
//   mode: 'no-cors',
//   credentials: 'include'
// };

// let workflow = new Schema('workflows', { idAttribute: 'workflowid'});
//
// function processSchema(data) {
//   if (!data) return [];
//   console.log(data);
//   const resp = normalize(data, { workflows: arrayOf(workflow) });
//   console.log(resp);
//   return resp;
// }

const ORDER_STATES = [
  { name: 'IN-PROGRESS', short: 'I'},
  { name: 'READY', short: 'Y'},
  { name: 'SCHEDULED', short: 'S'},
  { name: 'COMPLETE', short: 'C'},
  { name: 'INCOMPLETE', short: 'N'},
  { name: 'ERROR', short: 'E'},
  { name: 'CANCELED', short: 'Y'},
  { name: 'RETRY', short: 'R'},
  { name: 'WAITING', short: 'W'},
  { name: 'ASYNC-WAITING', short: 'A'},
  { name: 'EVENT-WAITING', short: 'V'},
  { name: 'BLOCKED', short: 'B'},
  { name: 'CRASH', short: 'C'}
];

let DEFAULTS = {};

ORDER_STATES.forEach((val) => { DEFAULTS[val.name] = 0; });

export default reduxApi({
  // simple edpoint description
  workflows: {
    url: `${url}/workflows`,
    transformer: (data) => {
      if (!data) return [];

      const resp = data.map((item) => {
        if (!item.id) {
          item.id = item.workflowid;
          delete item.workflowid;
        }
        return Object.assign({}, DEFAULTS, item);
      });
      return resp;
    }
    // options: options
    // transformer: processSchema
  },
  workflow: {
    url: `${url}/workflows/:id`
    // options: options
  },
  systemInfo: {
    url: `${url}/system`
    // options: options
  },
  users: {
    url: `${url}/users`,
    transformer: transformers.array
  },
  user: {
    url: `${url}/users/:id`
  },
  currentUser: {
    url: `${url}/users/?action=current`
    // options: options
  }
}, adapterFetch(fetch)); // it's nessasary to point using rest backend
