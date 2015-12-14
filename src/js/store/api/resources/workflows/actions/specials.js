import 'whatwg-fetch';
import { createAction } from 'redux-actions';


import settings from '../../../../../settings';


async function setOptionsPayload(workflow, name, value) {
  const res = await fetch(
    `${settings.REST_API_PREFIX}/workflows/${workflow.id}`,
    {
      method: 'PUT',
      headers: settings.DEFAULT_REST_HEADERS,
      body: JSON.stringify({
        action: 'setOptions',
        options: `${name}=${value}`
      })
    }
  );

  return res.json();
}

function setOptionsMeta(workflow, name, value) {
  return {
    workflowId: workflow.id,
    option: { name, value }
  };
}

const setOptions = createAction(
  'WORKFLOWS_SETOPTIONS',
  setOptionsPayload,
  setOptionsMeta
);


export { setOptions };
