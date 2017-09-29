import { createAction } from 'redux-actions';

import { fetchJson } from '../../../utils';
import settings from '../../../../../settings';

const fetchPerfData = createAction(
  'SLAPERF_FETCHPERFDATA',
  async (
    id: number,
    searchData: Object,
  ): Object => {
    const url = `${settings.REST_BASE_URL}/slas/${id}?action=performance&` +
      `mindate=${searchData.minDate || '19700101'}&` +
      `maxdate=${searchData.maxDate || '29991231'}&` +
      `err=${searchData.err || ''}&` +
      `errdesc=${searchData.errDesc || ''}&` +
      `producer=${searchData.producer || ''}&` +
      `grouping=${searchData.grouping || 'hourly'}&` +
      `success=${searchData.success}`;

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
