import { createAction } from 'redux-actions';

import { fetchJson } from '../../utils';
import settings from '../../../../settings';

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
  ): Object => {
    const status: string =
      !filter || filter === 'filter' ? '' : `statuses=${filter}&`;

    const url =
      `${settings.REST_BASE_URL}/jobresults?` +
      `ids=${id}&` +
      `date=${date}&` +
      `${status}` +
      `sort=${sort}&` +
      `desc=${sortDir.toString()}&` +
      `offset=${offset}&` +
      `limit=${limit}`;

    const instances: Array<Object> = await fetchJson('GET', url, null, true);

    return { instances, fetchMore };
  }
);

const changeOffset = createAction(
  'INSTANCES_CHANGEOFFSET',
  (newOffset: number): Object => ({ newOffset })
);
const changeServerSort = createAction(
  'INSTANCES_CHANGESERVERSORT',
  (sort: string): Object => ({ sort })
);

const unsync = createAction('INSTANCES_UNSYNC');

export { fetchInstances, changeOffset, changeServerSort, unsync };
