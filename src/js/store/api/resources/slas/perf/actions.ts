import { createAction } from 'redux-actions';

import { fetchJson } from '../../../utils';
import settings from '../../../../../settings';

const fetchPerfData = createAction(
  'SLAPERF_FETCHPERFDATA',
  async (
    id: number,
    searchData: Object,
  // @ts-expect-error ts-migrate(1055) FIXME: Type 'ObjectConstructor' is not a valid async func... Remove this comment to see the full error message
  ): Object => {
    const url = `${settings.REST_BASE_URL}/slas/${id}?action=performance&` +
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'minDate' does not exist on type 'Object'... Remove this comment to see the full error message
      `mindate=${searchData.minDate || '19700101'}&` +
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'maxDate' does not exist on type 'Object'... Remove this comment to see the full error message
      `maxdate=${searchData.maxDate || '29991231'}&` +
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'err' does not exist on type 'Object'.
      `err=${searchData.err || ''}&` +
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'errDesc' does not exist on type 'Object'... Remove this comment to see the full error message
      `errdesc=${searchData.errDesc || ''}&` +
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'producer' does not exist on type 'Object... Remove this comment to see the full error message
      `producer=${searchData.producer || ''}&` +
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'grouping' does not exist on type 'Object... Remove this comment to see the full error message
      `grouping=${searchData.grouping || 'hourly'}&` +
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'success' does not exist on type 'Object'... Remove this comment to see the full error message
      `success=${searchData.success}`;

    // @ts-expect-error ts-migrate(2554) FIXME: Expected 5 arguments, but got 4.
    const perf: Array<Object> = await fetchJson(
      'GET',
      url,
      null,
      true
    );

    return { perf };
  }
);

export {
  fetchPerfData,
};
