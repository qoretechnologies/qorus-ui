import 'whatwg-fetch';
import { createAction } from 'redux-actions';
import settings from '../../settings';

const url = settings.REST_API_PREFIX;
const workflowsUrl = `${url}/workflows`;

export const fetchWorkflows = createAction('WORKFLOWS_FETCH', async () => {
  const result = await fetch(workflowsUrl);
  return result.json();
});

export const setAutostart = createAction('WORKFLOWS_AUTOSTART',
  async (id, value) => {
    const result = await fetch(`${workflowsUrl}/${id}`, {
      body: JSON.stringify({
        action: 'setAutostart',
        autostart: value
      }),
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return result.json();
  },
  (id, value) => {
    return {
      id,
      value
    };
  }
);
