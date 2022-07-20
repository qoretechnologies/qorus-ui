import { createAction } from 'redux-actions';
import settings from '../../../../settings';
import { fetchJson } from '../../utils';

const fetchInstances = createAction(
  'INSTANCES_FETCHINSTANCES',
  async (
    id: number,
    fetchMore: boolean,
    offset: number,
    date: string,
    filter: string,
    limit: number,
    sortDir: boolean,
    sort: string
    // @ts-ignore ts-migrate(1055) FIXME: Type 'ObjectConstructor' is not a valid async func... Remove this comment to see the full error message
  ): any => {
    const status: string = !filter || filter === 'filter' ? '' : `statuses=${filter}&`;

    const url =
      `${settings.REST_BASE_URL}/jobresults?` +
      `ids=${id}&` +
      `date=${date}&` +
      `${status}` +
      `sort=${sort}&` +
      `desc=${sortDir.toString()}&` +
      `offset=${offset}&` +
      `limit=${limit}`;

    // @ts-ignore ts-migrate(2554) FIXME: Expected 5 arguments, but got 4.
    const instances: Array<Object> = await fetchJson('GET', url, null, true);

    return { instances, fetchMore };
  }
);

const addInstance = createAction('INSTANCES_ADDINSTANCE', (events) => ({
  events,
}));
const modifyInstance = createAction('INSTANCES_MODIFYINSTANCE', (events) => ({
  events,
}));

const changeOffset = createAction('INSTANCES_CHANGEOFFSET', (newOffset: number): any => ({
  newOffset,
}));
const changeServerSort = createAction('INSTANCES_CHANGESERVERSORT', (sort: string): any => ({
  sort,
}));

const unsync = createAction('INSTANCES_UNSYNC');

export { fetchInstances, changeOffset, changeServerSort, unsync, addInstance, modifyInstance };
