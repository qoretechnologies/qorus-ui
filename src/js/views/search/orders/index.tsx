// @flow
import React from 'react';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import pure from 'recompose/onlyUpdateForKeys';
import moment from 'moment';
import { connect } from 'react-redux';

import OrdersView from '../../workflows/tabs/list';
import queryControl from '../../../hocomponents/queryControl';
import { DATE_FORMATS } from '../../../constants/dates';
import SearchToolbar from './toolbar';
import actions from '../../../store/api/actions';
import withModal from '../../../hocomponents/modal';

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
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
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
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
      username: state.api.currentUser.data.username,
    }),
    {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'currentUser' does not exist on type '{}'... Remove this comment to see the full error message
      saveSearch: actions.currentUser.storeSearch,
    }
  ),
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 1.
  queryControl('mindate'),
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 1.
  queryControl('maxdate'),
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 1.
  queryControl('filter'),
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 1.
  queryControl('ids'),
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 1.
  queryControl('keyname'),
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 1.
  queryControl('keyvalue'),
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 0.
  queryControl(),
  mapProps(
    // @ts-expect-error ts-migrate(2740) FIXME: Type '{ defaultDate: string; mindateQuery: any; }'... Remove this comment to see the full error message
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
    // @ts-expect-error ts-migrate(2740) FIXME: Type '{ searchData: { minDate: any; maxDate: any; ... Remove this comment to see the full error message
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
