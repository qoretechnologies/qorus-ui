/* @flow */
import { createAction } from 'redux-actions';

import { fetchJson } from '../../utils';
import settings from '../../../../settings';

const fetchOrderErrors = createAction(
  'ORDERERRORS_FETCHORDERERRORS',
  async (
    fetchMore: boolean,
    offset: number,
    filter: string,
    limit: number,
    searchData: Object,
  ): Object => {
    let url = `${settings.REST_BASE_URL}/orders?action=listErrors&`;
    url += searchData.ids && searchData.ids !== '' ? `workflowid=${searchData.ids}&` : '';
    url += searchData.maxDate ? `maxdate=${searchData.maxDate}&` : '';
    url += `mindate=${searchData.minDate}&`;
    url += searchData.error && searchData.error !== '' ? `error=${searchData.error}&` : '';
    url += searchData.name && searchData.name !== '' ? `name=${searchData.name}&` : '';
    url += searchData.retry && searchData.retry !== '' ? `retry=${searchData.retry}&` : '';
    url += searchData.busErr && searchData.busErr !== '' ?
      `business_error=${searchData.busErr}&` : '';
    url += searchData.filter && searchData.filter !== '' ?
      `workflowstatus=${searchData.filter.toUpperCase()}&` : '';
    url += `offset=${offset}&limit=${limit}`;
    url += '&orderby=workflow_instanceid&desc=true';

    const orders: Array<Object> = await fetchJson(
      'GET',
      url,
      null,
      true
    );

    return { orders, fetchMore };
  }
);

const changeOffset = createAction('ORDERERRORS_CHANGEOFFSET', (newOffset: number): Object => (
  { newOffset }
));

const unsync = createAction('ORDERS_UNSYNC');

export {
  fetchOrderErrors,
  changeOffset,
  unsync,
};
