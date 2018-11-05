// @flow
import React from 'react';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import pure from 'recompose/onlyUpdateForKeys';
import moment from 'moment';
import { connect } from 'react-redux';

import OrdersView from '../../workflow/tabs/list';
import queryControl from '../../../hocomponents/queryControl';
import { DATE_FORMATS } from '../../../constants/dates';
import SearchToolbar from './toolbar';
import actions from '../../../store/api/actions';
import withModal from '../../../hocomponents/modal';
import Box from '../../../components/box';

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
  keynameQuery: string,
  changeKeynameQuery: Function,
  keyvalueQuery: string,
  changeKeyvalueQuery: Function,
  changeAllQuery: Function,
  defaultDate: string,
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
  ...rest
}: Props): React.Element<any> => (
  <OrdersView
    location={location}
    linkDate={mindateQuery}
    searchData={searchData}
    searchPage
  >
    <SearchToolbar mindateQuery={mindateQuery} {...rest} />
  </OrdersView>
);

export default compose(
  connect(
    (state: Object): Object => ({
      username: state.api.currentUser.data.username,
    }),
    {
      saveSearch: actions.currentUser.storeSearch,
    }
  ),
  queryControl('mindate'),
  queryControl('maxdate'),
  queryControl('filter'),
  queryControl('ids'),
  queryControl('keyname'),
  queryControl('keyvalue'),
  queryControl(),
  mapProps(
    ({ mindateQuery, ...rest }): Props => ({
      defaultDate: moment()
        .add(-1, 'weeks')
        .format(DATE_FORMATS.URL_FORMAT),
      mindateQuery:
        !mindateQuery || mindateQuery === ''
          ? moment()
              .add(-1, 'weeks')
              .format(DATE_FORMATS.URL_FORMAT)
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
      keynameQuery,
      keyvalueQuery,
      ...rest
    }): Props => ({
      searchData: {
        minDate: mindateQuery,
        maxDate: maxdateQuery,
        ids: idsQuery,
        keyName: keynameQuery,
        keyValue: keyvalueQuery,
        filter: filterQuery,
      },
      mindateQuery,
      maxdateQuery,
      filterQuery,
      idsQuery,
      keynameQuery,
      keyvalueQuery,
      ...rest,
    })
  ),
  pure([
    'mindateQuery',
    'maxdateQuery',
    'idsQuery',
    'keynameQuery',
    'keyvalueQuery',
    'filterQuery',
    'location',
    'searchData',
  ]),
  withModal()
)(SearchView);
