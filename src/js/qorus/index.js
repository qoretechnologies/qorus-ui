import settings from '../settings';

const url = settings.REST_API_PREFIX;

import 'whatwg-fetch';
import reduxApi, {transformers} from 'redux-api';
import adapterFetch from 'redux-api/lib/adapters/fetch';
import workflowsApi from './workflows';
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

const qorusApi = {
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
};


export default reduxApi(
  Object.assign(
    {},
    qorusApi,
    workflowsApi
  ),
  adapterFetch(fetch)
); // it's nessasary to point using rest backend
