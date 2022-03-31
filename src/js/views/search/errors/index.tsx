// @flow
import moment from 'moment';
import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import pure from 'recompose/onlyUpdateForKeys';
import { DATE_FORMATS } from '../../../constants/dates';
import withModal from '../../../hocomponents/modal';
import queryControl from '../../../hocomponents/queryControl';
import sync from '../../../hocomponents/sync';
import unsync from '../../../hocomponents/unsync';
import actions from '../../../store/api/actions';
import ErrorsTable from './table';
import SearchToolbar from './toolbar';

type Props = {
  location: any;
  mindateQuery: string;
  searchData: any;
  changeMindateQuery: Function;
  maxdateQuery: string;
  changeMaxdateQuery: Function;
  filterQuery: string;
  changeFilterQuery: Function;
  idsQuery: string;
  changeIdsQuery: Function;
  nameQuery: string;
  changeNameQuery: Function;
  errorQuery: string;
  changeErrorQuery: Function;
  retryQuery: string;
  changeRetryQuery: Function;
  busErrQuery: string;
  changeBuserrQuery: Function;
  changeAllQuery: Function;
  defaultDate: string;
  workflows: Array<string>;
  saveSearch: Function;
  allQuery: string;
  username: string;
  openModal: Function;
  closeModal: Function;
};

const SearchView: Function = ({
  location,
  mindateQuery,
  searchData,
  ...rest
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => (
  <ErrorsTable location={location} linkDate={mindateQuery} searchData={searchData} searchPage>
    <SearchToolbar mindateQuery={mindateQuery} {...rest} />
  </ErrorsTable>
);

export default compose(
  connect(
    (state: any) => ({
      // @ts-ignore ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
      meta: state.api.workflows,
      // @ts-ignore ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
      workflows: state.api.workflows.data,
      // @ts-ignore ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
      username: state.api.currentUser.data.username,
    }),
    {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'workflows' does not exist on type '{}'.
      load: actions.workflows.fetchList,
      // @ts-ignore ts-migrate(2339) FIXME: Property 'workflows' does not exist on type '{}'.
      unsync: actions.workflows.unsync,
      // @ts-ignore ts-migrate(2339) FIXME: Property 'currentUser' does not exist on type '{}'... Remove this comment to see the full error message
      saveSearch: actions.currentUser.storeSearch,
    }
  ),
  sync('meta'),
  // @ts-ignore ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 1.
  queryControl('mindate'),
  // @ts-ignore ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 1.
  queryControl('maxdate'),
  // @ts-ignore ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 1.
  queryControl('filter'),
  // @ts-ignore ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 1.
  queryControl('ids'),
  // @ts-ignore ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 1.
  queryControl('name'),
  // @ts-ignore ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 1.
  queryControl('error'),
  // @ts-ignore ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 1.
  queryControl('retry'),
  // @ts-ignore ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 1.
  queryControl('busErr'),
  // @ts-ignore ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 0.
  queryControl(),
  mapProps(
    // @ts-ignore ts-migrate(2740) FIXME: Type '{ defaultDate: string; mindateQuery: any; }'... Remove this comment to see the full error message
    ({ mindateQuery, ...rest }): Props => ({
      defaultDate: moment().add(-1, 'weeks').format(DATE_FORMATS.URL_FORMAT),
      mindateQuery:
        !mindateQuery || mindateQuery === ''
          ? moment().add(-1, 'weeks').format(DATE_FORMATS.URL_FORMAT)
          : mindateQuery,
      ...rest,
    })
  ),
  mapProps(
    ({
      mindateQuery,
      maxdateQuery,
      filterQuery,
      idsQuery,
      nameQuery,
      errorQuery,
      retryQuery,
      busErrQuery,
      ...rest
      // @ts-ignore ts-migrate(2740) FIXME: Type '{ searchData: { minDate: any; maxDate: any; ... Remove this comment to see the full error message
    }): Props => ({
      searchData: {
        minDate: mindateQuery,
        maxDate: maxdateQuery,
        ids: idsQuery,
        name: nameQuery,
        error: errorQuery,
        filter: filterQuery,
        retry: retryQuery,
        busErr: busErrQuery,
      },
      mindateQuery,
      maxdateQuery,
      filterQuery,
      idsQuery,
      nameQuery,
      errorQuery,
      retryQuery,
      busErrQuery,
      ...rest,
    })
  ),
  pure([
    'mindateQuery',
    'maxdateQuery',
    'idsQuery',
    'nameQuery',
    'retryQuery',
    'errorQuery',
    'busErrQuery',
    'filterQuery',
    'location',
    'searchData',
    'workflows',
  ]),
  withModal(),
  unsync()
)(SearchView);
