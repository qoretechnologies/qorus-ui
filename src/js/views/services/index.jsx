// @flow
import React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import pure from 'recompose/onlyUpdateForKeys';
import { ButtonGroup, Button, Intent } from '@blueprintjs/core';

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
import ServicesToolbar from './toolbar';
import ServicesTable from './table';
import withSort from '../../hocomponents/sort';
import loadMore from '../../hocomponents/loadMore';
import { sortDefaults } from '../../constants/sort';
import Box from '../../components/box';
import { Breadcrumbs, Crumb } from '../../components/breadcrumbs';
import titleManager from '../../hocomponents/TitleManager';

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
  limit: number,
  infoTotalCount: number,
  infoEnabled: number,
  infoWithAlerts: number,
};

const Services: Function = ({
  selected,
  selectedIds,
  onCSVClick,
  openPane,
  closePane,
  paneId,
  services,
  location,
  sortData,
  onSortChange,
  limit,
  canLoadMore,
  handleLoadMore,
  handleLoadAll,
  isTablet,
  infoEnabled,
  infoTotalCount,
  infoWithAlerts,
}: Props): React.Element<any> => (
  <div>
    <Breadcrumbs>
      <Crumb>Services</Crumb>
    </Breadcrumbs>
    <Box top>
      <ServicesToolbar
        selected={selected}
        selectedIds={selectedIds}
        onCSVClick={onCSVClick}
        location={location}
        collectionCount={services.length}
        collectionTotal={infoTotalCount}
        withAlertsCount={infoWithAlerts}
        enabledCount={infoEnabled}
      />
    </Box>
    <Box noPadding>
      <ServicesTable
        collection={services}
        paneId={paneId}
        openPane={openPane}
        closePane={closePane}
        sortData={sortData}
        onSortChange={onSortChange}
        canLoadMore={canLoadMore}
        isTablet={isTablet}
      />
      {canLoadMore && (
        <ButtonGroup style={{ padding: '0 15px 15px 15px' }}>
          <Button
            text={`Showing ${services.length} of ${infoTotalCount}`}
            intent={Intent.NONE}
            className="pt-minimal"
          />
          <Button
            text={`Show ${limit} more...`}
            intent={Intent.PRIMARY}
            onClick={handleLoadMore}
          />
          <Button
            text="Show all"
            intent={Intent.PRIMARY}
            onClick={handleLoadAll}
          />
        </ButtonGroup>
      )}
    </Box>
  </div>
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
  pure([
    'services',
    'systemOptions',
    'selected',
    'selectedIds',
    'paneId',
    'canLoadMore',
    'isTablet',
  ]),
  unsync()
)(Services);
