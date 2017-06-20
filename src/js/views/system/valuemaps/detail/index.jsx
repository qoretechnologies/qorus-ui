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
import Autocomponent from '../../../../components/autocomponent';
import Date from '../../../../components/date';
import { Control as Button } from '../../../../components/controls';
import search from '../../../../hocomponents/search';
import Table from './table';
import AddValue from './add';
import { addValue } from '../../../../store/api/resources/valuemaps/actions';
import { querySelector } from '../../../../selectors';

type Props = {
  onClose: Function,
  paneId: number,
  valuemap: Object,
  onSearchChange: Function,
  defaultSearchValue: string,
  adding: boolean,
  onAddClick: Function,
  onSaveClick: Function,
  location: Object,
  width: number,
  onResize: Function,
  isTablet: boolean,
}

const ValuemapsPane: Function = ({
  onClose,
  paneId,
  valuemap,
  onSearchChange,
  defaultSearchValue,
  adding,
  onAddClick,
  onSaveClick,
  location,
  width,
  onResize,
  isTablet,
}: Props): React.Element<any> => (
  <Pane
    name="valuemaps"
    width={width || 500}
    onClose={onClose}
    onResize={onResize}
  >
    <h3>{valuemap.name}</h3>
    <p>{valuemap.description}</p>
    {isTablet && (
      <p>
        Created: <Date date={valuemap.created} />
        {' | '}
        Modified: <Date date={valuemap.modified} />
      </p>
    )}
    <p>
      Type: <code>{valuemap.valuetype}</code>
      {' | '}
      Throws exception: <Autocomponent>{valuemap.throws_exception}</Autocomponent>
    </p>
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
  mapProps(({ setAdding, valuemaps, paneId, ...rest }): Object => ({
    toggleAdding: () => setAdding((adding: boolean): boolean => !adding),
    valuemap: valuemaps.data.find((vm: Object): boolean => vm.id === parseInt(paneId, 10)),
    paneId,
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
