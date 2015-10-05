import 'whatwg-fetch';
import { createAction } from 'redux-actions';
import settings from 'settings';

const url = settings.REST_API_PREFIX;
const resourceUrl = `${url}/users`;

export const fetchCurrentUser = createAction('CURRENT_USER_FETCH', async () => {
  const result = await fetch(`${resourceUrl}?action=current`);
  return result.json();
});
