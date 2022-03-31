// @flow
import { updateItemWithId } from '../store/api/utils';

const selectedType: Function = (collection: Array<Object>): string => {
  if (!collection || collection.length === 0) return 'none';

  // @ts-ignore ts-migrate(2339) FIXME: Property '_selected' does not exist on type 'Objec... Remove this comment to see the full error message
  if (collection.every((w: Object): boolean => w._selected)) {
    return 'all';
    // @ts-ignore ts-migrate(2339) FIXME: Property '_selected' does not exist on type 'Objec... Remove this comment to see the full error message
  } else if (collection.some((w: Object): boolean => w._selected)) {
    return 'some';
  }

  return 'none';
};

const select: Function = (state: Object, id: number): Object => {
  // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
  const stateData = [...state.data];
  // @ts-ignore ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
  const item = stateData.find((val: Object) => val.id === parseInt(id, 10));

  if (item) {
    const newData = updateItemWithId(id, { _selected: !item._selected }, stateData);

    return { ...state, ...{ data: newData } };
  }

  return state;
};

const selectAll: Function = (state: Object): Object => {
  // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
  const data = [...state.data];
  const newData = data.map((w) => ({ ...w, ...{ _selected: true } }));

  return { ...state, ...{ data: newData } };
};

const selectNone: Function = (state: Object): Object => {
  // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
  const data = [...state.data];
  const newData = data.map((w) => {
    const copy = { ...w };

    if (w._selected) {
      copy._selected = false;
    }

    return copy;
  });

  return { ...state, ...{ data: newData } };
};

const selectInvert: Function = (state: Object): Object => {
  // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
  const data = [...state.data];
  const newData = data.map((w) => ({ ...w, ...{ _selected: !w._selected } }));

  return { ...state, ...{ data: newData } };
};

const selectAlerts: Function = (state: Object): Object => {
  // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
  const data = [...state.data];
  const newData = data.map((w) => ({ ...w, ...{ _selected: w.has_alerts } }));

  return { ...state, ...{ data: newData } };
};

export { selectedType, select, selectAll, selectNone, selectInvert, selectAlerts };
