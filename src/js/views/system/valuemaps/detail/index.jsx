/* @flow */
import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import compose from 'recompose/compose';
import withState from 'recompose/withState';
import withHandlers from 'recompose/withHandlers';
import mapProps from 'recompose/mapProps';

import Pane from '../../../../components/pane';
import Search from '../../../../components/search';
import { Control as Button } from '../../../../components/controls';
import search from '../../../../hocomponents/search';
import Table from './table';
import AddValue from './add';
import { addValue } from '../../../../store/api/resources/valuemaps/actions';
import { querySelector } from '../../../../selectors';

type Props = {
  onClose: Function,
  paneId: number,
  valuemaps: Object,
  onSearchChange: Function,
  defaultSearchValue: string,
  adding: boolean,
  onAddClick: Function,
  onSaveClick: Function,
  location: Object,
}

const ValuemapsPane: Function = ({
  onClose,
  paneId,
  valuemaps,
  onSearchChange,
  defaultSearchValue,
  adding,
  onAddClick,
  onSaveClick,
  location,
}: Props): React.Element<any> => (
  <Pane
    name="valuemaps"
    width={500}
    onClose={onClose}
  >
    <h3>{valuemaps.data.find((vm: Object): boolean => vm.id === parseInt(paneId, 10)).name}</h3>
    <Search
      onSearchUpdate={onSearchChange}
      defaultValue={defaultSearchValue}
    />
    <Table
      paneId={paneId}
      location={location}
    />
    <Button
      label={adding ? 'Cancel' : 'Add value'}
      onClick={onAddClick}
      big
      btnStyle={adding ? 'default' : 'success'}
    />
    {adding && (
      <AddValue
        id={paneId}
        add={onSaveClick}
      />
    )}
  </Pane>
);

const selector = createSelector([querySelector('values')], (query) => ({ query }));

export default compose(
  connect(
    selector,
    {
      addAction: addValue,
    }
  ),
  withState('adding', 'setAdding', false),
  mapProps(({ setAdding, ...rest }): Object => ({
    toggleAdding: () => setAdding((adding: boolean): boolean => !adding),
    ...rest,
  })),
  withHandlers({
    onAddClick: ({ toggleAdding }): Function => (): void => {
      toggleAdding();
    },
    onSaveClick: ({ toggleAdding, paneId, addAction }): Function => (key, value, enabled): void => {
      toggleAdding();
      addAction(paneId, key, value, enabled);
    },
  }),
  search('values'),
)(ValuemapsPane);
