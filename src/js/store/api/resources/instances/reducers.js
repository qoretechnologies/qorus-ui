/* @flow */
import { updateItemWithId, setUpdatedToNull } from '../../utils';
import { normalizeName } from '../utils';

const initialState: Object = {
  data: [],
  sync: false,
  loading: false,
  offset: 0,
  limit: 50,
  sort: 'started',
  sortDir: true,
};

const fetchInstances: Object = {
  next(
    state: Object,
    {
      payload: { instances, fetchMore },
    }: {
      payload: Object,
      instances: Array<Object>,
      fetchMore: boolean,
    }
  ): Object {
    const data = [...state.data];
    const newData = fetchMore
      ? [...data, ...instances]
      : setUpdatedToNull(instances);
    const normalizedIds = newData.map(
      (instance: Object): Object => ({
        ...instance,
        ...{
          id: instance.job_instanceid,
        },
      })
    );
    const normalized = normalizedIds.map(
      (instance: Object): Object => normalizeName(instance)
    );

    return { ...state, ...{ data: normalized, loading: false, sync: true } };
  },
};

const changeOffset: Object = {
  next(
    state: Object = initialState,
    {
      payload: { newOffset },
    }: Object
  ): Object {
    const offset = newOffset || newOffset === 0 ? newOffset : state.offset + 50;

    return { ...state, ...{ offset } };
  },
};

const changeServerSort: Object = {
  next(
    state: Object = initialState,
    {
      payload: { sort },
    }: Object
  ): Object {
    const sortDir = state.sort === sort ? !state.sortDir : state.sortDir;

    return { ...state, ...{ offset: 0, sort, sortDir } };
  },
};

export {
  fetchInstances as FETCHINSTANCES,
  changeOffset as CHANGEOFFSET,
  changeServerSort as CHANGESERVERSORT,
};
