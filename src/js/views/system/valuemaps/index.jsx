/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import pure from 'recompose/onlyUpdateForKeys';

import { findBy } from '../../../helpers/search';
import sync from '../../../hocomponents/sync';
import search from '../../../hocomponents/search';
import withPane from '../../../hocomponents/pane';
import { resourceSelector, querySelector } from '../../../selectors';
import actions from '../../../store/api/actions';
import Toolbar from '../../../components/toolbar';
import Box from '../../../components/box';
import { Breadcrumbs, Crumb } from '../../../components/breadcrumbs';
import Search from '../../../containers/search';
import Table from './table';
import Pane from './detail';
import titleManager from '../../../hocomponents/TitleManager';

type Props = {
  onSearchChange: Function,
  defaultSearchValue: string,
  collection: Array<Object>,
  openPane: Function,
  closePane: Function,
  isTablet: boolean,
  paneId: number,
};

const ValueMaps: Function = ({
  onSearchChange,
  defaultSearchValue,
  collection,
  openPane,
  closePane,
  isTablet,
  paneId,
}: Props): React.Element<any> => (
  <div>
    <Toolbar marginBottom>
      <Breadcrumbs>
        <Crumb>Valuemaps</Crumb>
      </Breadcrumbs>
      <Search
        onSearchUpdate={onSearchChange}
        defaultValue={defaultSearchValue}
        resource="valuemaps"
      />
    </Toolbar>
    <Box top noPadding>
      <Table
        collection={collection}
        openPane={openPane}
        closePane={closePane}
        isTablet={isTablet}
        paneId={paneId}
      />
    </Box>
  </div>
);

const filterData = (query: string): Function => (
  collection: Array<Object>
): Array<Object> =>
  findBy(['name', 'desc', 'author', 'valuetype'], query, collection);

const dataSelector: Function = createSelector(
  [resourceSelector('valuemaps'), querySelector('q')],
  (valuemaps, query) => filterData(query)(valuemaps.data)
);

const settingsSelector = (state: Object): Object => state.ui.settings;

const state = createSelector(
  [
    dataSelector,
    resourceSelector('valuemaps'),
    querySelector('q'),
    settingsSelector,
  ],
  (collection, valuemaps, query, settings) => ({
    collection,
    valuemaps,
    query,
    isTablet: settings.tablet,
  })
);

export default compose(
  connect(
    state,
    {
      load: actions.valuemaps.fetch,
    }
  ),
  sync('valuemaps'),
  search(),
  withPane(Pane, ['valuemaps', 'location', 'isTablet'], null, 'valuemaps'),
  titleManager('Valuemaps'),
  pure(['collection', 'isTablet', 'location'])
)(ValueMaps);
