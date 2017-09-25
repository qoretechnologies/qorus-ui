import { createAction } from 'redux-actions';

import { fetchJson } from '../../../utils';
import settings from '../../../../../settings';
import { error, success } from '../../../../ui/bubbles/actions';

const fetchEvents = createAction(
  'SLAEVENTS_FETCHEVENTS',
  async (
    id: number,
    fetchMore: boolean,
    offset: number,
    limit: number,
    sortDir: boolean,
    sort: string,
    searchData: Object,
  ): Object => {
    const url = `${settings.REST_BASE_URL}/slas/${id}?action=events&` +
      `mindate=${searchData.minDate || '19700101'}&` +
      `maxdate=${searchData.maxDate || '29991231'}&` +
      `err=${searchData.err || ''}&` +
      `errDesc=${searchData.errDesc || ''}&` +
      `producer=${searchData.producer || ''}&` +
      `sort=${sort}&` +
      `desc=${sortDir.toString()}&` +
      `offset=${offset}&` +
      `limit=${limit}`;

    const events: Array<Object> = await fetchJson(
      'GET',
      url,
      null,
      true
    );

    return { events, fetchMore };
  }
);

const changeOffset = createAction('SLAEVENTS_CHANGEOFFSET', (newOffset: number): Object => (
  { newOffset }
));
const changeServerSort = createAction('SLAEVENTS_CHANGESERVERSORT', (sort: string): Object => (
  { sort }
));

const unsync = createAction('SLAEVENTS_UNSYNC');

export {
  changeOffset,
  changeServerSort,
  fetchEvents,
  unsync,
};
