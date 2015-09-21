import 'whatwg-fetch';
import { createAction } from 'redux-actions';
import settings from '../../settings';

const url = settings.REST_API_PREFIX;
const workflowsUrl = `${url}/system`;

export const fetchSystem = createAction('SYSTEM_FETCH', async () => {
  const result = await fetch(systemUrl);
  return result.json();
});
