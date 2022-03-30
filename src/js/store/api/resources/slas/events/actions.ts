import { createAction } from 'redux-actions';

import { fetchJson } from '../../../utils';
import settings from '../../../../../settings';

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
  // @ts-expect-error ts-migrate(1055) FIXME: Type 'ObjectConstructor' is not a valid async func... Remove this comment to see the full error message
  ): Object => {
    const url = `${settings.REST_BASE_URL}/slas/${id}?action=events&` +
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'minDate' does not exist on type 'Object'... Remove this comment to see the full error message
      `mindate=${searchData.minDate || '19700101'}&` +
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'maxDate' does not exist on type 'Object'... Remove this comment to see the full error message
      `maxdate=${searchData.maxDate || '29991231'}&` +
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'err' does not exist on type 'Object'.
      `err=${searchData.err || ''}&` +
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'errDesc' does not exist on type 'Object'... Remove this comment to see the full error message
      `errDesc=${searchData.errDesc || ''}&` +
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'producer' does not exist on type 'Object... Remove this comment to see the full error message
      `producer=${searchData.producer || ''}&` +
      `sort=${sort}&` +
      `desc=${sortDir.toString()}&` +
      `offset=${offset}&` +
      `limit=${limit}`;

    // @ts-expect-error ts-migrate(2554) FIXME: Expected 5 arguments, but got 4.
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
