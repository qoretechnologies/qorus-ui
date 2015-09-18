import 'whatwg-fetch';
import { createAction } from 'redux-actions';
import settings from '../../settings';

const url = settings.REST_API_PREFIX;

export const fetchWorkflows = createAction('FETCH_WORKFLOWS', async () => {
  const result = await fetch(`${url}/workflows`);
  return result.json();
});
