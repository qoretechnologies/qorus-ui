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
import ServicesDetail from './detail';
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

type Props = {
  sortData: Object,
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
  isTablet,
  searchQuery,
  changeSearchQuery,
  limit,
}: Props): React.Element<any> => (
  <Flex>
    <Headbar>
      <Breadcrumbs>
        <Crumb active>Services</Crumb>
      </Breadcrumbs>
      <Pull right>
        <CsvControl onClick={onCSVClick} disabled={size(services) === 0} />
        <Search
          defaultValue={searchQuery}
          onSearchUpdate={changeSearchQuery}
          resource="services"
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
        limit={limit}
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
  state.api.systemOptions.data.filter(
    (option: Object): boolean => option.service
  );

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
      load: actions.services.fetch,
      unsync: actions.services.unsync,
    }
  ),
  withInfoBar('services'),
  withSort('services', 'services', sortDefaults.services),
  loadMore('services', 'services', true, 50),
  sync('meta'),
  withPane(ServicesDetail, ['systemOptions', 'location'], 'detail', 'services'),
  selectable('services'),
  withCSV('services', 'services'),
  titleManager('Services'),
  queryControl('search'),
  pure([
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
