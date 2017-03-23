// @flow
import React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import pure from 'recompose/onlyUpdateForKeys';

import { querySelector, resourceSelector } from '../../selectors';
import actions from '../../store/api/actions';
import { findBy } from '../../helpers/search';
import withPane from '../../hocomponents/pane';
import sync from '../../hocomponents/sync';
import withCSV from '../../hocomponents/csv';
import unsync from '../../hocomponents/unsync';
import selectable from '../../hocomponents/selectable';
import ServicesDetail from './detail';
import ServicesToolbar from './toolbar';
import ServicesTable from './table';
import withSort from '../../hocomponents/sort';
import loadMore from '../../hocomponents/loadMore';
import { sortDefaults } from '../../constants/sort';
import { Control } from '../../components/controls';

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
  canLoadMore: boolean,
  handleLoadMore: Function,
  limit: number,
};

const Services: Function = ({
  selected,
  selectedIds,
  onCSVClick,
  openPane,
  paneId,
  services,
  location,
  sortData,
  onSortChange,
  limit,
  canLoadMore,
  handleLoadMore,
}: Props): React.Element<any> => (
  <div>
    <ServicesToolbar
      selected={selected}
      selectedIds={selectedIds}
      onCSVClick={onCSVClick}
      location={location}
    />
    <ServicesTable
      collection={services}
      paneId={paneId}
      openPane={openPane}
      sortData={sortData}
      onSortChange={onSortChange}
      canLoadMore={canLoadMore}
    />
    { canLoadMore && (
      <Control
        label={`Load ${limit} more...`}
        btnStyle="success"
        big
        onClick={handleLoadMore}
      />
    )}
  </div>
);

const filterSearch: Function = (
  search: string
): Function => (
  services: Array<Object>
): Array<Object> => (
  findBy('name', search, services)
);

const servicesSelector: Function = createSelector(
  [
    resourceSelector('services'),
    querySelector('search'),
  ], (services, search) => filterSearch(search)(services.data)
);

const systemOptionsSelector: Function = (state: Object): Array<Object> => (
  state.api.systemOptions.data.filter((option: Object): boolean => option.service)
);

const selector: Function = createSelector(
  [
    servicesSelector,
    systemOptionsSelector,
    resourceSelector('services'),
  ], (services, systemOptions, meta) => ({
    services,
    systemOptions,
    meta,
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
  withSort('services', 'services', sortDefaults.services),
  loadMore('services', 'services', true, 50),
  sync('meta'),
  withPane(
    ServicesDetail,
    [
      'systemOptions',
      'location',
    ],
    'detail',
    'services'
  ),
  selectable('services'),
  withCSV('services', 'services'),
  pure([
    'services',
    'systemOptions',
    'selected',
    'selectedIds',
    'paneId',
    'canLoadMore',
  ]),
  unsync()
)(Services);
