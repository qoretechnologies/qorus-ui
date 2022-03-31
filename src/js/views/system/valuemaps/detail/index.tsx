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
// @ts-expect-error ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
} from '../../../../components/controls';
import Pane from '../../../../components/pane';
import search from '../../../../hocomponents/search';
import Table from './table';
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
  onSaveClick,
  location,
  width,
  onResize,
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
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
        { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'valuetype' does not exist on type 'Objec... Remove this comment to see the full error message */ }
        <code>{valuemap.valuetype}</code>
      </PaneItem>
      <PaneItem title="Throws exception">
        { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'throws_exception' does not exist on type... Remove this comment to see the full error message */ }
        <ContentByType content={valuemap.throws_exception} />
      </PaneItem>
      <Table
        paneId={paneId}
        location={location}
        onSearchChange={onSearchChange}
        defaultSearchValue={defaultSearchValue}
        onSaveClick={onSaveClick}
      />
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
  mapProps(
    ({ valuemaps, paneId, ...rest }): Object => ({
      valuemap: valuemaps.data.find(
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
        (vm: Object): boolean => vm.id === parseInt(paneId, 10)
      ),
      paneId,
      ...rest,
    })
  ),
  withHandlers({
    onSaveClick: ({ toggleAdding, paneId, dispatchAction }): Function => (
      key,
      value,
      enabled
    ): void => {
      dispatchAction(addValue, paneId, key, value, enabled);
    },
  }),
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
  search('values')
)(ValuemapsPane);
