/* @flow */
import { createAction } from 'redux-actions';
import settings from '../../../../settings';
import { fetchJson } from '../../utils';

const fetchOrderErrors = createAction(
  'ORDERERRORS_FETCHORDERERRORS',
  async (
    fetchMore: boolean,
    offset: number,
    filter: string,
    limit: number,
    searchData: any
    // @ts-ignore ts-migrate(1055) FIXME: Type 'ObjectConstructor' is not a valid async func... Remove this comment to see the full error message
  ): any => {
    let url = `${settings.REST_BASE_URL}/orders?action=listErrors&`;
    // @ts-ignore ts-migrate(2339) FIXME: Property 'ids' does not exist on type 'Object'.
    url += searchData.ids && searchData.ids !== '' ? `workflowid=${searchData.ids}&` : '';
    // @ts-ignore ts-migrate(2339) FIXME: Property 'maxDate' does not exist on type 'Object'... Remove this comment to see the full error message
    url += searchData.maxDate ? `maxdate=${searchData.maxDate}&` : '';
    // @ts-ignore ts-migrate(2339) FIXME: Property 'minDate' does not exist on type 'Object'... Remove this comment to see the full error message
    url += `mindate=${searchData.minDate}&`;
    // @ts-ignore ts-migrate(2339) FIXME: Property 'error' does not exist on type 'Object'.
    url += searchData.error && searchData.error !== '' ? `error=${searchData.error}&` : '';
    // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
    url += searchData.name && searchData.name !== '' ? `name=${searchData.name}&` : '';
    // @ts-ignore ts-migrate(2339) FIXME: Property 'retry' does not exist on type 'Object'.
    url += searchData.retry && searchData.retry !== '' ? `retry=${searchData.retry}&` : '';
    // @ts-ignore ts-migrate(2339) FIXME: Property 'busErr' does not exist on type 'Object'.
    url +=
      searchData.busErr && searchData.busErr !== ''
        ? // @ts-ignore ts-migrate(2339) FIXME: Property 'busErr' does not exist on type 'Object'.
          `business_error=${searchData.busErr}&`
        : '';
    // @ts-ignore ts-migrate(2339) FIXME: Property 'filter' does not exist on type 'Object'.
    url +=
      searchData.filter && searchData.filter !== ''
        ? // @ts-ignore ts-migrate(2339) FIXME: Property 'filter' does not exist on type 'Object'.
          `workflowstatus=${searchData.filter.toUpperCase()}&`
        : '';
    url += `offset=${offset}&limit=${limit}`;
    url += '&orderby=workflow_instanceid&desc=true';

    // @ts-ignore ts-migrate(2554) FIXME: Expected 5 arguments, but got 4.
    const orders: Array<Object> = await fetchJson('GET', url, null, true);

    return { orders, fetchMore };
  }
);

const changeOffset = createAction('ORDERERRORS_CHANGEOFFSET', (newOffset: number): any => ({
  newOffset,
}));

const unsync = createAction('ORDERS_UNSYNC');

export { fetchOrderErrors, changeOffset, unsync };
