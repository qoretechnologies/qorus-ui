import { createAction } from 'redux-actions';
import settings from '../../../../../settings';
import { fetchJson } from '../../../utils';

const fetchPerfData = createAction(
  'SLAPERF_FETCHPERFDATA',
  async (
    id: number,
    searchData: Object
    // @ts-ignore ts-migrate(1055) FIXME: Type 'ObjectConstructor' is not a valid async func... Remove this comment to see the full error message
  ): Object => {
    const url =
      `${settings.REST_BASE_URL}/slas/${id}?action=performance&` +
      // @ts-ignore ts-migrate(2339) FIXME: Property 'minDate' does not exist on type 'Object'... Remove this comment to see the full error message
      `mindate=${searchData.minDate || '19700101'}&` +
      // @ts-ignore ts-migrate(2339) FIXME: Property 'maxDate' does not exist on type 'Object'... Remove this comment to see the full error message
      `maxdate=${searchData.maxDate || '29991231'}&` +
      // @ts-ignore ts-migrate(2339) FIXME: Property 'err' does not exist on type 'Object'.
      `err=${searchData.err || ''}&` +
      // @ts-ignore ts-migrate(2339) FIXME: Property 'errDesc' does not exist on type 'Object'... Remove this comment to see the full error message
      `errdesc=${searchData.errDesc || ''}&` +
      // @ts-ignore ts-migrate(2339) FIXME: Property 'producer' does not exist on type 'Object... Remove this comment to see the full error message
      `producer=${searchData.producer || ''}&` +
      // @ts-ignore ts-migrate(2339) FIXME: Property 'grouping' does not exist on type 'Object... Remove this comment to see the full error message
      `grouping=${searchData.grouping || 'hourly'}&` +
      // @ts-ignore ts-migrate(2339) FIXME: Property 'success' does not exist on type 'Object'... Remove this comment to see the full error message
      `success=${searchData.success}`;

    // @ts-ignore ts-migrate(2554) FIXME: Expected 5 arguments, but got 4.
    const perf: Array<Object> = await fetchJson('GET', url, null, true);

    return { perf };
  }
);

export { fetchPerfData };
