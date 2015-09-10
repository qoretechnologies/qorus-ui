import settings from '../settings';

const url = settings.REST_API_PREFIX;

import 'whatwg-fetch';
import reduxApi, {transformers} from 'redux-api';
import adapterFetch from 'redux-api/lib/adapters/fetch';

export default reduxApi({
  // simple edpoint description
  workflows: {
    url: `${url}/workflows`,
    transformer: transformers.array
  },
  workflow: {
    url: `${url}/workflows/:id`
  },
  systemInfo: {
    url: `${url}/system`
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
  }
}, adapterFetch(fetch)); // it's nessasary to point using rest backend
