import { createAction } from 'redux-actions';
import { fetchJson } from '../../utils';
import settings from '../../../../settings';

const addOptimistic: Function = (prop: Object) => ({ prop });
const addPropCall: Function = (prop: Object): Promise<*> => (
  fetchJson(
    'POST',
    `${settings.REST_BASE_URL}/system/props/${prop.domain}/${prop.key}`,
    {
      body: JSON.stringify({
        parse_args: prop.value,
      }),
    }
  )
);

const updateOptimistic: Function = (prop: Object) => ({ prop });
const updatePropCall: Function = (prop: Object): Promise<*> => (
  fetchJson(
    'PUT',
    `${settings.REST_BASE_URL}/system/props/${prop.domain}/${prop.origKey || prop.key}`,
    {
      body: JSON.stringify({
        action: 'set',
        key: prop.key,
        parse_args: prop.value,
      }),
    }
  )
);

const removeOptimistic: Function = (prop: Object) => ({ prop });
const removePropCall: Function = (prop: Object): Promise<*> => {
  const url = prop.key ? `${prop.domain}/${prop.key}` : prop.domain;

  return fetchJson(
    'DELETE',
    `${settings.REST_BASE_URL}/system/props/${url}`,
  );
};

const addCall = createAction(
  'PROPS_ADDPROP',
  addPropCall,
);

const addOptimisticCall = createAction(
  'PROPS_ADDPROPOPTIMISTIC',
  addOptimistic,
);

const updateCall = createAction(
  'PROPS_UPDATEPROP',
  updatePropCall,
);

const updateOptimisticCall = createAction(
  'PROPS_UPDATEPROPOPTIMISTIC',
  updateOptimistic,
);

const removeCall = createAction(
  'PROPS_REMOVEPROP',
  removePropCall,
);

const removeOptimisticCall = createAction(
  'PROPS_REMOVEPROPOPTIMISTIC',
  removeOptimistic,
);

const addProp: Function = (prop: Object) => (dispatch: Function): Promise<*> => {
  dispatch(addCall(prop));
  dispatch(addOptimisticCall(prop));
};

const updateProp: Function = (prop: Object) => (dispatch: Function): Promise<*> => {
  dispatch(updateCall(prop));
  dispatch(updateOptimisticCall(prop));
};

const removeProp: Function = (prop: Object) => (dispatch: Function): Promise<*> => {
  dispatch(removeCall(prop));
  dispatch(removeOptimisticCall(prop));
};

const addPropOptimistic: Function = () => () => true;
const updatePropOptimistic: Function = () => () => true;
const removePropOptimistic: Function = () => () => true;

export {
  addProp,
  updateProp,
  removeProp,
  addPropOptimistic,
  updatePropOptimistic,
  removePropOptimistic,
};
