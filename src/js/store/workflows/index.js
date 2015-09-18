// import actions from './actions';
import { ORDER_STATES } from '../../constants/orders';

let DEFAULTS = {
  TOTAL: 0
};

ORDER_STATES.forEach((val) => { DEFAULTS[val.name] = 0; });

const initialState = {
  workflows: {
    data: [],
    sync: false,
    loading: false
  }
};

const transform = (data) => {
  if (!data) return [];

  const resp = data.map((item) => {
    if (!item.id) {
      item.id = item.workflowid;
      delete item.workflowid;
    }
    return Object.assign({}, DEFAULTS, item);
  });
  return resp;
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
  case 'REQUEST_WORKFLOWS':
    return Object.assign({}, state, {
      workflows: Object.assign({}, state.workflows, {
        loading: true
      })
    });
  case 'RECEIVE_WORKFLOWS':
    return Object.assign({}, state, {
      workflows: {
        data: transform(action.payload.response),
        sync: true,
        loading: false
      }
    });
  default:
    return state;
  }

  return state;
}
