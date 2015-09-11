import settings from '../settings';

const url = settings.REST_API_PREFIX;

import 'whatwg-fetch';
import reduxApi, {transformers} from 'redux-api';
import adapterFetch from 'redux-api/lib/adapters/fetch';

function makeBaseAuth(user, pass) {
  const tok = user + ':' + pass;
  const hash = btoa(tok);
  return 'Basic ' + hash;
}

const options = {
  headers: {
    'Authorization': makeBaseAuth('admin', 'admin')
  },
  mode: 'no-cors',
  credentials: 'include'
};

export default reduxApi({
  // simple edpoint description
  workflows: {
    url: `${url}/workflows`,
    transformer: transformers.array
    // options: options
  },
  workflow: {
    url: `${url}/workflows/:id`
    // options: options
  },
  systemInfo: {
    url: `${url}/system`,
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
