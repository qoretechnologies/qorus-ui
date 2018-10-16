/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import { Button, ButtonGroup } from '@blueprintjs/core';

import Toolbar from '../../../../../components/toolbar';
import Search from '../../../../../containers/search';
import Datepicker from '../../../../../components/datepicker';
import queryControl from '../../../../../hocomponents/queryControl';
import Actions from './actions';
import Selector from './selector';
import Filters from './filters';

type Props = {
  selected: string,
  selectedIds: Array<number>,
  searchQuery: string,
  changeSearchQuery: Function,
  dateQuery: string,
  changeDateQuery: Function,
  onCSVClick: Function,
  location: Object,
  searchPage?: boolean,
  isTablet: boolean,
};

const OrdersToolbar: Function = ({
  selected,
  selectedIds,
  searchQuery,
  changeSearchQuery,
  dateQuery,
  changeDateQuery,
  onCSVClick,
  location,
  searchPage,
  isTablet,
}: Props): React.Element<any> => (
  <Toolbar mb>
    <div className="pull-left">
      <Selector selected={selected} />{' '}
      <Actions
        show={selected !== 'none'}
        isTablet={isTablet}
        selectedIds={selectedIds}
      />
      {!searchPage && ' '}
      {!searchPage && (
        <Datepicker
          date={dateQuery || '24h'}
          onApplyDate={changeDateQuery}
          className="toolbar-item"
        />
      )}
      {!searchPage && ' '}
      {!searchPage && <Filters location={location} />}
      {!searchPage && ' '}
      <ButtonGroup>
        <Button text="CSV" onClick={onCSVClick} />
      </ButtonGroup>
    </div>
    {!searchPage && (
      <Search
        defaultValue={searchQuery}
        onSearchUpdate={changeSearchQuery}
        resource="workflow"
      />
    )}
  </Toolbar>
);

export default compose(
  queryControl('search'),
  queryControl('date'),
  pure(['selected', 'selectedIds', 'searchQuery', 'dateQuery', 'isTablet'])
)(OrdersToolbar);
