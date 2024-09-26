// @flow
import moment from 'moment';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import pure from 'recompose/onlyUpdateForKeys';
import { DATE_FORMATS } from '../../../constants/dates';
import withModal from '../../../hocomponents/modal';
import queryControl from '../../../hocomponents/queryControl';
import actions from '../../../store/api/actions';
import OrdersView from '../../workflows/tabs/list';
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
  keynameQuery: string;
  changeKeynameQuery: Function;
  keyvalueQuery: string;
  changeKeyvalueQuery: Function;
  changeAllQuery: Function;
  defaultDate: string;
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
Props) => {
  console.log('Search bar updated');
  return (
    <OrdersView location={location} linkDate={mindateQuery} searchData={searchData} searchPage>
      <SearchToolbar mindateQuery={mindateQuery} {...rest} />
    </OrdersView>
  );
};

export default compose(
  connect(
    (state: any): any => ({
      // @ts-ignore ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
      username: state.api.currentUser.data.username,
    }),
    {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'currentUser' does not exist on type '{}'... Remove this comment to see the full error message
      saveSearch: actions.currentUser.storeSearch,
    }
  ),
  // @ts-ignore ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 1.
  queryControl('mindate'),
  // @ts-ignore ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 1.
  queryControl('maxdate'),
  // @ts-ignore ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 1.
  queryControl('filter'),
  // @ts-ignore ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 1.
  queryControl('ids'),
  // @ts-ignore ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 1.
  queryControl('keyname'),
  // @ts-ignore ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 1.
  queryControl('keyvalue'),
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
      keynameQuery,
      keyvalueQuery,
      ...rest
      // @ts-ignore ts-migrate(2740) FIXME: Type '{ searchData: { minDate: any; maxDate: any; ... Remove this comment to see the full error message
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
