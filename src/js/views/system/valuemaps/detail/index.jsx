/* @flow */
import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import compose from 'recompose/compose';
import withState from 'recompose/withState';
import withHandlers from 'recompose/withHandlers';
import mapProps from 'recompose/mapProps';
import {
  Controls as ButtonGroup,
  Control as Button,
} from '../../../../components/controls';
import Pane from '../../../../components/pane';
import search from '../../../../hocomponents/search';
import Table from './table';
import AddValue from './add';
import { addValue } from '../../../../store/api/resources/valuemaps/actions';
import { querySelector } from '../../../../selectors';
import Box from '../../../../components/box';
import InfoHeader from '../../../../components/InfoHeader';
import PaneItem from '../../../../components/pane_item';
import withDispatch from '../../../../hocomponents/withDispatch';
import ContentByType from '../../../../components/ContentByType';

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
};

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
}: Props): React.Element<any> => (
  <Pane
    name="valuemaps"
    width={width}
    onClose={onClose}
    onResize={onResize}
    title="Value map detail"
  >
    <Box top fill scrollY>
      <InfoHeader model={valuemap} />
      <PaneItem title="Type">
        <code>{valuemap.valuetype}</code>
      </PaneItem>
      <PaneItem title="Throws exception">
        <ContentByType content={valuemap.throws_exception} />
      </PaneItem>

      <Table
        paneId={paneId}
        location={location}
        onSearchChange={onSearchChange}
        defaultSearchValue={defaultSearchValue}
      />
      <ButtonGroup>
        <Button
          text={adding ? 'Cancel' : 'Add value'}
          onClick={onAddClick}
          iconName={adding ? 'cross' : 'plus'}
          btnStyle={!adding ? 'primary' : null}
        />
      </ButtonGroup>
      {adding && <AddValue id={paneId} add={onSaveClick} />}
    </Box>
  </Pane>
);

const selector = createSelector(
  [querySelector('values')],
  query => ({
    query,
  })
);

export default compose(
  connect(selector),
  withDispatch(),
  withState('adding', 'setAdding', false),
  mapProps(
    ({ setAdding, valuemaps, paneId, ...rest }): Object => ({
      toggleAdding: () => setAdding((adding: boolean): boolean => !adding),
      valuemap: valuemaps.data.find(
        (vm: Object): boolean => vm.id === parseInt(paneId, 10)
      ),
      paneId,
      ...rest,
    })
  ),
  withHandlers({
    onAddClick: ({ toggleAdding }): Function => (): void => {
      toggleAdding();
    },
    onSaveClick: ({ toggleAdding, paneId, dispatchAction }): Function => (
      key,
      value,
      enabled
    ): void => {
      toggleAdding();
      dispatchAction(addValue, paneId, key, value, enabled);
    },
  }),
  search('values')
)(ValuemapsPane);
