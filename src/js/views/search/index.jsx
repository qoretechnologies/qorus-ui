// @flow
import React from 'react';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import pure from 'recompose/onlyUpdateForKeys';
import moment from 'moment';

import OrdersView from '../workflow/tabs/list';
import queryControl from '../../hocomponents/queryControl';
import { DATE_FORMATS } from '../../constants/dates';
import SearchToolbar from './toolbar';

type Props = {
  location: Object,
  mindateQuery: string,
  searchData: Object,
  changeMindateQuery: Function,
  maxdateQuery: string,
  changeMaxdateQuery: Function,
  statusQuery: string,
  changeStatusQuery: Function,
  idsQuery: string,
  changeIdsQuery: Function,
  keynameQuery: string,
  changeKeynameQuery: Function,
  keyvalueQuery: string,
  changeKeyvalueQuery: Function,
  changeAllQuery: Function,
  defaultDate: string,
};

const SearchView: Function = ({
  location,
  mindateQuery,
  searchData,
  ...rest
}: Props): React.Element<any> => (
  <div>
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
  queryControl('mindate'),
  queryControl('maxdate'),
  queryControl('status'),
  queryControl('ids'),
  queryControl('keyname'),
  queryControl('keyvalue'),
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
    statusQuery,
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
      status: statusQuery,
    },
    mindateQuery,
    maxdateQuery,
    statusQuery,
    idsQuery,
    keynameQuery,
    keyvalueQuery,
    ...rest,
  })),
  pure([
    'mindateQuery',
    'maxdateQuery',
    'idsQuery',
    'keynameQuery',
    'keyvalueQuery',
    'statusQuery',
    'location',
    'searchData',
  ])
)(SearchView);
