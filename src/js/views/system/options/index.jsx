// @flow
import React from 'react';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { compose } from 'redux';
import sync from '../../../hocomponents/sync';
import { sortDefaults } from '../../../constants/sort';

import actions from '../../../store/api/actions';
import { findBy } from '../../../helpers/search';
import sort from '../../../hocomponents/sort';
import queryControl from '../../../hocomponents/queryControl';
import { Table, Thead, Tbody, Tr, Th } from '../../../components/new_table';
import Toolbar from '../../../components/toolbar';
import Search from '../../../containers/search';
import { querySelector, resourceSelector } from '../../../selectors';
import OptionRow from './row';

type Props = {
  load: Function,
  collection: Array<Object>,
  params: Object,
  sortData: Object,
  onSortChange: Function,
  user: Object,
  setOption: Function,
  changeSearchQuery: Function,
  searchQuery: Function,
  openModal: Function,
  closeModal: Function,
};

const OptionsView: Function = ({
  searchQuery,
  changeSearchQuery,
  sortData,
  onSortChange,
  collection,
}: Props): React.Element<any> => (
  <div className="tab-pane active">
    <Toolbar>
      <Search
        defaultValue={searchQuery}
        onSearchUpdate={changeSearchQuery}
        resource="options"
      />
    </Toolbar>
    {collection.length ? (
      <Table
        fixed
        condensed
        striped
      >
        <Thead>
          <Tr
            {...{ sortData, onSortChange }}
          >
            <Th className="narrow" name="status">Status</Th>
            <Th className="name" name="name">Name</Th>
            <Th className="big">Type</Th>
            <Th className="text" name="default">Default value</Th>
            <Th className="text" name="value">Current value</Th>
            <Th className="narrow">-</Th>
          </Tr>
        </Thead>
        <Tbody>
          {collection.map((option: Object): React.Element<any> => (
            <OptionRow
              key={option.name}
              {...option}
            />
          ))}
        </Tbody>
      </Table>
    ) : (
      <p className="no-data"> No data </p>
    )}
  </div>
);

const filterOptions = srch => collection => (
  findBy(['name', 'default', 'expects', 'value', 'description'], srch, collection)
);

const collectionSelector = createSelector(
  [
    resourceSelector('systemOptions'),
    querySelector('search'),
  ], (options, search) => filterOptions(search)(options.data)
);

const viewSelector = createSelector(
  [
    resourceSelector('systemOptions'),
    collectionSelector,
  ],
  (options: Object, collection: Array<Object>): Object => ({
    collection,
    options,
  })
);

export default compose(
  connect(
    viewSelector,
    {
      load: actions.systemOptions.fetch,
    }
  ),
  sort('options', 'collection', sortDefaults.options),
  sync('options'),
  queryControl('search'),
)(OptionsView);
