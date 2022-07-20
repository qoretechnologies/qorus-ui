/* @flow */
import { select, selectAll, selectInvert, selectNone } from '../../../../helpers/resources';
import { setUpdatedToNull, updateItemWithName } from '../../utils';

const initialState: any = { data: [], sync: false, loading: false };

const setEnabled: any = {
  next(state: any = initialState, { payload: { events } }): any {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'sync' does not exist on type 'Object'.
    if (state.sync) {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
      const data = state.data.slice();
      const updatedData = setUpdatedToNull(data);
      let newData = updatedData;

      events.forEach((dt: any): void => {
        // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
        newData = updateItemWithName(dt.name, { enabled: dt.enabled, _updated: true }, newData);
      });

      return { ...state, ...{ data: newData } };
    }

    return state;
  },
};

const updateDone = {
  // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
  next(state: any, { payload: { name } }: { payload: any; name: string }) {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'sync' does not exist on type 'Object'.
    if (state.sync) {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
      const data = state.data.slice();
      const newData = updateItemWithName(name, { _updated: null }, data);

      return { ...state, ...{ data: newData } };
    }

    return state;
  },
  throw(state: any, action: any) {
    return Object.assign({}, state, {
      sync: false,
      loading: false,
      // @ts-ignore ts-migrate(2339) FIXME: Property 'payload' does not exist on type 'Object'... Remove this comment to see the full error message
      error: action.payload,
    });
  },
};

const groupAction = {
  next(state: any = initialState) {
    return state;
  },
};

const selectGroup = {
  // @ts-ignore ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
  next(state: any = initialState, { payload: { id } }: { payload: any; id: string }) {
    return select(state, id);
  },
};

const selectAllGroups = {
  next(state: any = initialState) {
    return selectAll(state);
  },
};

const selectNoneGroups = {
  next(state: any = initialState) {
    return selectNone(state);
  },
};

const invertSelection = {
  next(state: any = initialState) {
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
