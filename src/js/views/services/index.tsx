// @flow
import React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import pure from 'recompose/onlyUpdateForKeys';
import size from 'lodash/size';

import { querySelector, resourceSelector } from '../../selectors';
import actions from '../../store/api/actions';
import { findBy } from '../../helpers/search';
import withPane from '../../hocomponents/pane';
import sync from '../../hocomponents/sync';
import withCSV from '../../hocomponents/csv';
import unsync from '../../hocomponents/unsync';
import withInfoBar from '../../hocomponents/withInfoBar';
import selectable from '../../hocomponents/selectable';
import ServicesDetail from './pane';
import ServicesTable from './table';
import withSort from '../../hocomponents/sort';
import loadMore from '../../hocomponents/loadMore';
import { sortDefaults } from '../../constants/sort';
import Box from '../../components/box';
import { Breadcrumbs, Crumb } from '../../components/breadcrumbs';
import titleManager from '../../hocomponents/TitleManager';
import Headbar from '../../components/Headbar';
import Pull from '../../components/Pull';
import queryControl from '../../hocomponents/queryControl';
import Search from '../../containers/search';
import CsvControl from '../../components/CsvControl';
import Flex from '../../components/Flex';
import lifecycle from 'recompose/lifecycle';
import showIfPassed from '../../hocomponents/show-if-passed';
import Loader from '../../components/loader';
import { FormattedMessage } from 'react-intl';

type Props = {
  sortData: Object,
  sortKeysObj: Object,
  onSortChange: Function,
  onCSVClick: Function,
  selected: string,
  selectedIds: Array<number>,
  location: Object,
  services: Array<Object>,
  paneId: number | string,
  openPane: Function,
  closePane: Function,
  canLoadMore: boolean,
  isTablet: boolean,
  handleLoadMore: Function,
  handleLoadAll: Function,
  loadMoreCurrent: number,
  loadMoreTotal: number,
  searchQuery: string,
  changeSearchQuery: Function,
  limit: number,
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
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}: Props): React.Element<any> => (
  <Flex>
    <Headbar>
      <Breadcrumbs>
        <Crumb active>
          <FormattedMessage id="Services" />
        </Crumb>
      </Breadcrumbs>
      <Pull right>
        <CsvControl onClick={onCSVClick} disabled={size(services) === 0} />
        <Search
          defaultValue={searchQuery}
          onSearchUpdate={changeSearchQuery}
          resource="services"
          focusOnMount
        />
      </Pull>
    </Headbar>
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

const filterSearch: Function = (search: string): Function => (
  services: Array<Object>
): Array<Object> => findBy('name', search, services);

const servicesSelector: Function = createSelector(
  [resourceSelector('services'), querySelector('search')],
  (services, search) => filterSearch(search)(services.data)
);

const systemOptionsSelector: Function = (state: Object): Array<Object> =>
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
  state.api.systemOptions.data.filter(
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'service' does not exist on type 'Object'... Remove this comment to see the full error message
    (option: Object): boolean => option.service
  );

// @ts-expect-error ts-migrate(2339) FIXME: Property 'ui' does not exist on type 'Object'.
const settingsSelector: Function = (state: Object): Object => state.ui.settings;

const selector: Function = createSelector(
  [
    servicesSelector,
    systemOptionsSelector,
    resourceSelector('services'),
    settingsSelector,
  ],
  (services, systemOptions, meta, settings) => ({
    services,
    systemOptions,
    meta,
    isTablet: settings.tablet,
  })
);

export default compose(
  connect(
    selector,
    {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'services' does not exist on type '{}'.
      load: actions.services.fetch,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'services' does not exist on type '{}'.
      unsync: actions.services.unsync,
    }
  ),
  sync('meta'),
  withInfoBar('services'),
  withSort('services', 'services', sortDefaults.services),
  loadMore('services', 'services', true, 50),
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 5 arguments, but got 4.
  withPane(ServicesDetail, ['systemOptions', 'location'], 'detail', 'services'),
  selectable('services'),
  withCSV('services', 'services'),
  titleManager('Services'),
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 1.
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
