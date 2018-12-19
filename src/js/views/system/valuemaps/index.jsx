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
import Box from '../../../components/box';
import { Breadcrumbs, Crumb } from '../../../components/breadcrumbs';
import Search from '../../../containers/search';
import ValueMapsContainer from '../../../containers/valuemaps';
import Pane from './detail';
import titleManager from '../../../hocomponents/TitleManager';
import Headbar from '../../../components/Headbar';
import Pull from '../../../components/Pull';
import Flex from '../../../components/Flex';

type Props = {
  onSearchChange: Function,
  defaultSearchValue: string,
  collection: Array<Object>,
  openPane: Function,
  closePane: Function,
  paneId: number,
};

const ValueMaps: Function = ({
  onSearchChange,
  defaultSearchValue,
  collection,
  openPane,
  closePane,
  paneId,
}: Props): React.Element<any> => (
  <Flex>
    <Headbar>
      <Breadcrumbs>
        <Crumb active>Valuemaps</Crumb>
      </Breadcrumbs>
      <Pull right>
        <Search
          onSearchUpdate={onSearchChange}
          defaultValue={defaultSearchValue}
          resource="valuemaps"
        />
      </Pull>
    </Headbar>
    <Box top noPadding>
      <ValueMapsContainer
        vmaps={collection}
        openPane={openPane}
        closePane={closePane}
        paneId={paneId}
        compact={false}
      />
    </Box>
  </Flex>
);

const filterData = (query: string): Function => (
  collection: Array<Object>
): Array<Object> =>
  findBy(['name', 'desc', 'author', 'valuetype', 'mapsize'], query, collection);

const dataSelector: Function = createSelector(
  [resourceSelector('valuemaps'), querySelector('q')],
  (valuemaps, query) => filterData(query)(valuemaps.data)
);

const state = createSelector(
  [dataSelector, resourceSelector('valuemaps'), querySelector('q')],
  (collection, valuemaps, query) => ({
    collection,
    valuemaps,
    query,
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
  pure(['collection', 'location'])
)(ValueMaps);
