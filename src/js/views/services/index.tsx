// @flow
import { ReqoreControlGroup } from '@qoretechnologies/reqore';
import size from 'lodash/size';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import { createSelector } from 'reselect';
import CsvControl from '../../components/CsvControl';
import Flex from '../../components/Flex';
import Box from '../../components/box';
import { Breadcrumbs, Crumb } from '../../components/breadcrumbs';
import { sortDefaults } from '../../constants/sort';
import Search from '../../containers/search';
import { findBy } from '../../helpers/search';
import titleManager from '../../hocomponents/TitleManager';
import withCSV from '../../hocomponents/csv';
import loadMore from '../../hocomponents/loadMore';
import withPane from '../../hocomponents/pane';
import queryControl from '../../hocomponents/queryControl';
import selectable from '../../hocomponents/selectable';
import withSort from '../../hocomponents/sort';
import sync from '../../hocomponents/sync';
import unsync from '../../hocomponents/unsync';
import withInfoBar from '../../hocomponents/withInfoBar';
import { querySelector, resourceSelector } from '../../selectors';
import actions from '../../store/api/actions';
import ServicesDetail from './pane';
import ServicesTable from './table';

type Props = {
  sortData: any;
  sortKeysObj: any;
  onSortChange: Function;
  onCSVClick: Function;
  selected: string;
  selectedIds: Array<number>;
  location: any;
  services: Array<Object>;
  paneId: number | string;
  openPane: Function;
  closePane: Function;
  canLoadMore: boolean;
  isTablet: boolean;
  handleLoadMore: Function;
  handleLoadAll: Function;
  loadMoreCurrent: number;
  loadMoreTotal: number;
  searchQuery: string;
  changeSearchQuery: Function;
  limit: number;
};

const Services: Function = ({
  selected,
  selectedIds,
  onCSVClick,
  openPane,
  closePane,
  paneId,
  services,
  sortData,
  onSortChange,
  canLoadMore,
  handleLoadMore,
  handleLoadAll,
  loadMoreCurrent,
  loadMoreTotal,
  isTablet,
  searchQuery,
  changeSearchQuery,
  limit,
  sortKeysObj,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => (
  <Flex>
    <Breadcrumbs>
      <Crumb active>
        <FormattedMessage id="Services" />
      </Crumb>
      <ReqoreControlGroup fixed style={{ marginLeft: 'auto' }}>
        <CsvControl onClick={onCSVClick} disabled={size(services) === 0} />
        <Search
          defaultValue={searchQuery}
          onSearchUpdate={changeSearchQuery}
          resource="services"
          focusOnMount
        />
      </ReqoreControlGroup>
    </Breadcrumbs>

    <Box top noPadding>
      <ServicesTable
        selected={selected}
        selectedIds={selectedIds}
        collection={services}
        paneId={paneId}
        openPane={openPane}
        closePane={closePane}
        sortData={sortData}
        onSortChange={onSortChange}
        canLoadMore={canLoadMore}
        isTablet={isTablet}
        handleLoadMore={handleLoadMore}
        handleLoadAll={handleLoadAll}
        loadMoreCurrent={loadMoreCurrent}
        loadMoreTotal={loadMoreTotal}
        limit={limit}
        sortKeys={sortKeysObj}
      />
    </Box>
  </Flex>
);

const filterSearch: Function =
  (search: string): Function =>
  (services: Array<Object>): Array<Object> =>
    findBy('name', search, services);

const servicesSelector: Function = createSelector(
  [resourceSelector('services'), querySelector('search')],
  (services, search) => filterSearch(search)(services.data)
);

const systemOptionsSelector: Function = (state: any): Array<Object> =>
  // @ts-ignore ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
  state.api.systemOptions.data.filter(
    // @ts-ignore ts-migrate(2339) FIXME: Property 'service' does not exist on type 'Object'... Remove this comment to see the full error message
    (option: any): boolean => option.service
  );

// @ts-ignore ts-migrate(2339) FIXME: Property 'ui' does not exist on type 'Object'.
const settingsSelector: Function = (state: any): any => state.ui.settings;

const selector: Function = createSelector(
  [servicesSelector, systemOptionsSelector, resourceSelector('services'), settingsSelector],
  (services, systemOptions, meta, settings) => ({
    services,
    systemOptions,
    meta,
    isTablet: settings.tablet,
  })
);

export default compose(
  connect(selector, {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'services' does not exist on type '{}'.
    load: actions.services.fetch,
    // @ts-ignore ts-migrate(2339) FIXME: Property 'services' does not exist on type '{}'.
    unsync: actions.services.unsync,
  }),
  sync('meta'),
  withInfoBar('services'),
  withSort('services', 'services', sortDefaults.services),
  loadMore('services', 'services', true, 50),
  // @ts-ignore ts-migrate(2554) FIXME: Expected 5 arguments, but got 4.
  withPane(ServicesDetail, ['systemOptions', 'location'], 'detail', 'services'),
  selectable('services'),
  withCSV('services', 'services'),
  titleManager('Services'),
  // @ts-ignore ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 1.
  queryControl('search'),
  pure([
    'defaultLogger',
    'services',
    'systemOptions',
    'selected',
    'selectedIds',
    'paneId',
    'canLoadMore',
    'isTablet',
    'searchQuery',
  ]),
  unsync()
)(Services);
