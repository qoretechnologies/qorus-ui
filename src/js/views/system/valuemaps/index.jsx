/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { findBy } from '../../../helpers/search';
import sync from '../../../hocomponents/sync';
import search from '../../../hocomponents/search';
import withPane from '../../../hocomponents/pane';
import { resourceSelector, querySelector } from '../../../selectors';
import actions from '../../../store/api/actions';
import Toolbar from '../../../components/toolbar';
import Search from '../../../components/search';
import Table from './table';
import Pane from './detail';

type Props = {
  onSearchChange: Function,
  defaultSearchValue: string,
  collection: Array<Object>,
  openPane: Function,
}

const ValueMaps: Function = ({
  onSearchChange,
  defaultSearchValue,
  collection,
  openPane,
}: Props): React.Element<any> => (
  <div className="tab-pane active">
    <Toolbar>
      <Search
        onSearchUpdate={onSearchChange}
        defaultValue={defaultSearchValue}
      />
    </Toolbar>
    <Table
      collection={collection}
      openPane={openPane}
    />
  </div>
);

const filterData = (query: string): Function => (collection: Array<Object>): Array<Object> => (
  findBy(['name', 'desc', 'author', 'valuetype'], query, collection)
);

const dataSelector: Function = createSelector(
  [
    resourceSelector('valuemaps'),
    querySelector('q'),
  ],
  (valuemaps, query) => filterData(query)(valuemaps.data)
);

const state = createSelector(
  [
    dataSelector,
    resourceSelector('valuemaps'),
    querySelector('q'),
  ], (collection, valuemaps, query) => ({
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
  withPane(Pane, ['valuemaps', 'location'], null, 'valuemaps'),
)(ValueMaps);
