// @flow
import React from 'react';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import pure from 'recompose/onlyUpdateForKeys';
import moment from 'moment';
import { connect } from 'react-redux';

import OrdersView from './table';
import queryControl from '../../../hocomponents/queryControl';
import sync from '../../../hocomponents/sync';
import unsync from '../../../hocomponents/unsync';
import withModal from '../../../hocomponents/modal';
import { DATE_FORMATS } from '../../../constants/dates';
import SearchToolbar from './toolbar';
import actions from '../../../store/api/actions';

type Props = {
  location: Object,
  mindateQuery: string,
  searchData: Object,
  changeMindateQuery: Function,
  maxdateQuery: string,
  changeMaxdateQuery: Function,
  filterQuery: string,
  changeFilterQuery: Function,
  idsQuery: string,
  changeIdsQuery: Function,
  nameQuery: string,
  changeNameQuery: Function,
  errorQuery: string,
  changeErrorQuery: Function,
  retryQuery: string,
  changeRetryQuery: Function,
  busErrQuery: string,
  changeBuserrQuery: Function,
  changeAllQuery: Function,
  defaultDate: string,
  workflows: Array<string>,
  saveSearch: Function,
  allQuery: string,
  username: string,
  openModal: Function,
  closeModal: Function,
};

const SearchView: Function = ({
  location,
  mindateQuery,
  searchData,
  ...rest,
}: Props): React.Element<any> => (
  <div className="tab-pane active">
    <SearchToolbar
      mindateQuery={mindateQuery}
      {...rest}
    />
    <div className="view-content">
      <OrdersView
        location={location}
        linkDate={mindateQuery}
        searchData={searchData}
        searchPage
      />
    </div>
  </div>
);

export default compose(
  connect(
    (state: Object) => ({
      meta: state.api.workflows,
      workflows: state.api.workflows.data,
      username: state.api.currentUser.data.username,
    }),
    {
      load: actions.workflows.fetchList,
      unsync: actions.workflows.unsync,
      saveSearch: actions.currentUser.storeSearch,
    }
  ),
  sync('meta'),
  queryControl('mindate'),
  queryControl('maxdate'),
  queryControl('filter'),
  queryControl('ids'),
  queryControl('name'),
  queryControl('error'),
  queryControl('retry'),
  queryControl('busErr'),
  queryControl(),
  mapProps(({ mindateQuery, ...rest }): Props => ({
    defaultDate: moment().add(-1, 'weeks').format(DATE_FORMATS.URL_FORMAT),
    mindateQuery: !mindateQuery || mindateQuery === '' ?
      moment().add(-1, 'weeks').format(DATE_FORMATS.URL_FORMAT) :
      mindateQuery,
    ...rest,
  })),
  mapProps(({
    mindateQuery,
    maxdateQuery,
    filterQuery,
    idsQuery,
    nameQuery,
    errorQuery,
    retryQuery,
    busErrQuery,
    ...rest,
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
  })),
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
