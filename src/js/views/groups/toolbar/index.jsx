// @flow
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';

import Toolbar from '../../../components/toolbar';
import Selector from './selectors';
import Actions from './actions';
import Search from '../../../containers/search';
import { Control as Button } from '../../../components/controls';
import { InfoBar, InfoBarItem } from '../../../components/infobar';
import queryControl from '../../../hocomponents/queryControl';

type Props = {
  selected: string,
  selectedIds: Array<number>,
  onCSVClick: Function,
  searchQuery: string,
  changeSearchQuery: Function,
  location: Object,
  collectionCount: number,
  collectionTotal: number,
  withAlertsCount: number,
  enabledCount: number,
};

const GroupsToolbar: Function = ({
  selected,
  selectedIds,
  searchQuery,
  changeSearchQuery,
  onCSVClick,
  collectionCount,
  collectionTotal,
  withAlertsCount,
  enabledCount,
}: Props): React.Element<any> => (
  <div>
    <Toolbar>
      <Selector selected={selected} />
      { selected !== 'none' && (
        <Actions selectedIds={selectedIds} />
      )}
      <Button
        label="CSV"
        btnStyle="default"
        big
        action={onCSVClick}
      />
      <Search
        defaultValue={searchQuery}
        onSearchUpdate={changeSearchQuery}
        resource="groups"
      />
    </Toolbar>
    {collectionCount > 0 && (
      <InfoBar>
        {(selectedIds.length > 0) && (
          <InfoBarItem icon="check" style="success">{ selectedIds.length }</InfoBarItem>
        )}
        <InfoBarItem icon="eye" style="info">
          { collectionCount } of { collectionTotal }
        </InfoBarItem>
        <InfoBarItem icon="warning" style="danger">{ withAlertsCount }</InfoBarItem>
        <InfoBarItem icon="power-off" style="success">{ enabledCount }</InfoBarItem>
      </InfoBar>
    )}
  </div>
);

export default compose(
  queryControl('search'),
  pure(['selected', 'selectedIds', 'searchQuery'])
)(GroupsToolbar);
