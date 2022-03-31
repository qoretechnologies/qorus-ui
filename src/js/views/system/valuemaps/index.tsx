/* @flow */
import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import { createSelector } from 'reselect';
import Box from '../../../components/box';
import { Breadcrumbs, Crumb } from '../../../components/breadcrumbs';
import Flex from '../../../components/Flex';
import Headbar from '../../../components/Headbar';
import Pull from '../../../components/Pull';
import Search from '../../../containers/search';
import ValueMapsContainer from '../../../containers/valuemaps';
import { findBy } from '../../../helpers/search';
import hasInterfaceAccess from '../../../hocomponents/hasInterfaceAccess';
import withPane from '../../../hocomponents/pane';
import search from '../../../hocomponents/search';
import sync from '../../../hocomponents/sync';
import titleManager from '../../../hocomponents/TitleManager';
import { querySelector, resourceSelector } from '../../../selectors';
import actions from '../../../store/api/actions';
import Pane from './detail';

type Props = {
  onSearchChange: Function;
  defaultSearchValue: string;
  collection: Array<Object>;
  openPane: Function;
  closePane: Function;
  paneId: number;
};

const ValueMaps: Function = ({
  onSearchChange,
  defaultSearchValue,
  collection,
  openPane,
  closePane,
  paneId,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props): React.Element<any> => (
  <Flex>
    <Headbar>
      <Breadcrumbs>
        <Crumb active>Value maps</Crumb>
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

const filterData =
  (query: string): Function =>
  (collection: Array<Object>): Array<Object> =>
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
  hasInterfaceAccess('vmaps', 'Value maps'),
  connect(state, {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'valuemaps' does not exist on type '{}'.
    load: actions.valuemaps.fetch,
  }),
  sync('valuemaps'),
  // @ts-ignore ts-migrate(2554) FIXME: Expected 2 arguments, but got 0.
  search(),
  // @ts-ignore ts-migrate(2554) FIXME: Expected 5 arguments, but got 4.
  withPane(Pane, ['valuemaps', 'location', 'isTablet'], null, 'valuemaps'),
  titleManager('Valuemaps'),
  pure(['collection', 'location'])
)(ValueMaps);
