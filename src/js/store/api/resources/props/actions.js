import { createAction } from 'redux-actions';
import { fetchJson } from '../../utils';
import settings from '../../../../settings';
import { error } from '../../../ui/bubbles/actions';

const removeOptimistic: Function = (prop: Object) => ({ prop });
const removePropCall: Function = (prop: Object): Promise<*> => {
  const url = prop.key ? `${prop.domain}/${prop.key}` : prop.domain;

  return fetchJson(
    'DELETE',
    `${settings.REST_BASE_URL}/system/props/${url}`,
  );
};

const addCall = createAction(
  'PROPS_MANAGEPROP',
  async (prop: Object, dispatch: Function) => {
    if (dispatch) {
      const res = await fetchJson(
        'PUT',
        `${settings.REST_BASE_URL}/system/props/${prop.domain}/${prop.origKey || prop.key}`,
        {
          body: JSON.stringify({
            action: 'set',
            key: prop.key,
            args: prop.value,
          }),
        }
      );

      if (res.err) {
        dispatch(error(res.desc));
      }
    }

    return { prop };
  }
);

const removeCall = createAction(
  'PROPS_REMOVEPROP',
  removePropCall,
);

const removeOptimisticCall = createAction(
  'PROPS_REMOVEPROPOPTIMISTIC',
  removeOptimistic,
);

const manageProp: Function = (prop: Object): Function => (dispatch: Function): Promise<*> => {
  dispatch(addCall(prop, dispatch));
  dispatch(addCall(prop));
};

const removeProp: Function = (prop: Object) => (dispatch: Function): Promise<*> => {
  dispatch(removeCall(prop));
  dispatch(removeOptimisticCall(prop));
};

const addPropOptimistic: Function = () => () => true;
const updatePropOptimistic: Function = () => () => true;
const removePropOptimistic: Function = () => () => true;

export {
  manageProp,
  removeProp,
  addPropOptimistic,
  updatePropOptimistic,
  removePropOptimistic,
};
