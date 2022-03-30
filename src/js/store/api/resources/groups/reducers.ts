/* @flow */
import { updateItemWithName, setUpdatedToNull } from '../../utils';
import {
  select,
  selectAll,
  selectNone,
  selectInvert,
} from '../../../../helpers/resources';


const initialState: Object = { data: [], sync: false, loading: false };

const setEnabled: Object = {
  next(state: Object = initialState, { payload: { events } }): Object {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'sync' does not exist on type 'Object'.
    if (state.sync) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
      const data = state.data.slice();
      const updatedData = setUpdatedToNull(data);
      let newData = updatedData;

      events.forEach((dt: Object): void => {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
        newData = updateItemWithName(dt.name, { enabled: dt.enabled, _updated: true }, newData);
      });

      return { ...state, ...{ data: newData } };
    }

    return state;
  },
};

const updateDone = {
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
  next(state: Object, { payload: { name } }: { payload: Object, name: string }) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'sync' does not exist on type 'Object'.
    if (state.sync) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
      const data = state.data.slice();
      const newData = updateItemWithName(name, { _updated: null }, data);

      return { ...state, ...{ data: newData } };
    }

    return state;
  },
  throw(state: Object, action: Object) {
    return Object.assign({}, state, {
      sync: false,
      loading: false,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'payload' does not exist on type 'Object'... Remove this comment to see the full error message
      error: action.payload,
    });
  },
};

const groupAction = {
  next(state: Object = initialState) {
    return state;
  },
};

const selectGroup = {
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
  next(state: Object = initialState, { payload: { id } }: { payload: Object, id: string }) {
    return select(state, id);
  },
};

const selectAllGroups = {
  next(state: Object = initialState) {
    return selectAll(state);
  },
};

const selectNoneGroups = {
  next(state: Object = initialState) {
    return selectNone(state);
  },
};

const invertSelection = {
  next(state: Object = initialState) {
    return selectInvert(state);
  },
};

export {
  setEnabled as SETENABLED,
  updateDone as UPDATEDONE,
  selectGroup as SELECT,
  selectAllGroups as SELECTALL,
  selectNoneGroups as SELECTNONE,
  invertSelection as SELECTINVERT,
  groupAction as GROUPACTION,
};
