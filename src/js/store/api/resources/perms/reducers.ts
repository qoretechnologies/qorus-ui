import remove from 'lodash/remove';
import RBAC from '../../../../constants/rbac';
import { updateItemWithId } from '../../utils';

const initialState: Object = {
  data: [],
  loading: false,
  sync: false,
};

const createPerm: Object = {
  next(state: Object = initialState, action: Object): Object {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'payload' does not exist on type 'Object'... Remove this comment to see the full error message
    if (action.payload) {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
      const data: Array<Object> = state.data.slice();
      // @ts-ignore ts-migrate(2339) FIXME: Property 'payload' does not exist on type 'Object'... Remove this comment to see the full error message
      const { name, desc } = action.payload;

      data.push({
        name,
        desc,
        permission_type: RBAC.PERMS_TYPE,
      });

      return Object.assign({}, state, { data });
    }

    return state;
  },
  throw(state: Object = initialState): Object {
    return state;
  },
};

const removePerm: Object = {
  next(state: Object = initialState, action: Object): Object {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'payload' does not exist on type 'Object'... Remove this comment to see the full error message
    if (action.payload) {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
      const data: Array<Object> = state.data.slice();

      // @ts-ignore ts-migrate(2339) FIXME: Property 'payload' does not exist on type 'Object'... Remove this comment to see the full error message
      remove(data, (p) => p.name === action.payload.name);

      return Object.assign({}, state, { data });
    }
    return state;
  },
  throw(state: Object = initialState): Object {
    return state;
  },
};

const updatePerm: Object = {
  next(state: Object = initialState, action: Object): Object {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'payload' does not exist on type 'Object'... Remove this comment to see the full error message
    if (action.payload) {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'payload' does not exist on type 'Object'... Remove this comment to see the full error message
      const { name, desc } = action.payload;
      // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
      let data: Array<Object> = state.data.slice();

      data = updateItemWithId(name, { desc, permission_type: RBAC.PERMS_TYPE }, data, 'name');

      return Object.assign({}, state, { data });
    }

    return state;
  },
  throw(state: Object = initialState): Object {
    return state;
  },
};

export { createPerm as CREATEPERM, removePerm as REMOVEPERM, updatePerm as UPDATEPERM };
