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
      `errDesc=${searchData.errDesc || ''}&` +
      `producer=${searchData.producer || ''}&` +
      `grouping=${searchData.grouping || 'hourly'}&` +
      `success=${searchData.success || 0}&`;

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
