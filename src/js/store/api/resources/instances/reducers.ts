/* @flow */
import { setUpdatedToNull, updateItemWithId } from '../../utils';
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
      // @ts-ignore ts-migrate(2339) FIXME: Property 'instances' does not exist on type 'Objec... Remove this comment to see the full error message
      payload: { instances, fetchMore },
    }: {
      payload: Object;
      instances: Array<Object>;
      fetchMore: boolean;
    }
  ): Object {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
    const data = [...state.data];
    const newData = fetchMore ? [...data, ...instances] : setUpdatedToNull(instances);
    const normalizedIds = newData.map(
      (instance: Object): Object => ({
        ...instance,
        ...{
          // @ts-ignore ts-migrate(2339) FIXME: Property 'job_instanceid' does not exist on type '... Remove this comment to see the full error message
          id: instance.job_instanceid,
        },
      })
    );
    const normalized = normalizedIds.map((instance: Object): Object => normalizeName(instance));

    return { ...state, ...{ data: normalized, loading: false, sync: true } };
  },
};

const changeOffset: Object = {
  next(
    state: Object = initialState,
    {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'payload' does not exist on type 'Object'... Remove this comment to see the full error message
      payload: { newOffset },
    }: Object
  ): Object {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'offset' does not exist on type 'Object'.
    const offset = newOffset || newOffset === 0 ? newOffset : state.offset + 50;

    return { ...state, ...{ offset } };
  },
};

const changeServerSort: Object = {
  next(
    state: Object = initialState,
    {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'payload' does not exist on type 'Object'... Remove this comment to see the full error message
      payload: { sort },
    }: Object
  ): Object {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'sort' does not exist on type 'Object'.
    const sortDir = state.sort === sort ? !state.sortDir : state.sortDir;

    return { ...state, ...{ offset: 0, sort, sortDir } };
  },
};

const unsync = {
  next() {
    return initialState;
  },
};

const addInstance = {
  next(
    state: Object,
    {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'payload' does not exist on type 'Object'... Remove this comment to see the full error message
      payload: { events },
    }: Object
  ) {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
    let newData = [...state.data];

    events.forEach((dt: Object) => {
      newData.push({
        // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
        jobid: dt.data.jobid,
        // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
        job_instanceid: dt.data.job_instanceid,
        // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
        id: dt.data.job_instanceid,
        // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
        name: dt.data.name,
        // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
        version: dt.data.version,
        // @ts-ignore ts-migrate(2339) FIXME: Property 'started' does not exist on type 'Object'... Remove this comment to see the full error message
        started: dt.started,
        jobstatus: 'IN-PROGRESS',
        _updated: true,
      });
    });

    return { ...state, ...{ data: newData } };
  },
};

const modifyInstance = {
  next(
    state: Object,
    {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'payload' does not exist on type 'Object'... Remove this comment to see the full error message
      payload: { events },
    }: Object
  ) {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
    let newData = [...state.data];

    events.forEach((dt: Object) => {
      const {
        // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
        data: { job_instanceid, status },
        // @ts-ignore ts-migrate(2339) FIXME: Property 'completed' does not exist on type 'Objec... Remove this comment to see the full error message
        completed,
        // @ts-ignore ts-migrate(2339) FIXME: Property 'modified' does not exist on type 'Object... Remove this comment to see the full error message
        modified,
      } = dt;

      newData = updateItemWithId(
        job_instanceid,
        {
          _updated: true,
          jobstatus: status,
          modified,
          completed,
        },
        newData
      );
    });

    return { ...state, ...{ data: newData } };
  },
};

export {
  fetchInstances as FETCHINSTANCES,
  changeOffset as CHANGEOFFSET,
  changeServerSort as CHANGESERVERSORT,
  unsync as UNSYNC,
  addInstance as ADDINSTANCE,
  modifyInstance as MODIFYINSTANCE,
};
