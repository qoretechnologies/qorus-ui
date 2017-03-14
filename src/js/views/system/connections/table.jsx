/* @flow */
import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import compose from 'recompose/compose';
import defaultProps from 'recompose/defaultProps';
import pure from 'recompose/onlyUpdateForKeys';
import mapProps from 'recompose/mapProps';

import { Table, Tbody, Thead, Tr, Th } from '../../../components/new_table';
import sync from '../../../hocomponents/sync';
import patch from '../../../hocomponents/patchFuncArgs';
import checkNoData from '../../../hocomponents/check-no-data';
import Icon from '../../../components/icon';
import actions from '../../../store/api/actions';
import withSort from '../../../hocomponents/sort';
import withLoadMore from '../../../hocomponents/loadMore';
import { sortDefaults } from '../../../constants/sort';
import { resourceSelector } from '../../../selectors';
import withPane from '../../../hocomponents/pane';
import ConnectionPane from './pane';
import ConnectionRow from './row';
import { Control as Button } from '../../../components/controls';

const CONN_MAP: Object = {
  datasources: 'DATASOURCE',
  user: 'USER-CONNECTION',
  qorus: 'REMOTE',
};

type Props = {
  location: Object,
  load: Function,
  remotes: Array<Object>,
  updateDone: Function,
  handleHighlightEnd: Function,
  paneId: string,
  openPane: Function,
  sortData: Object,
  onSortChange: Function,
  params: Object,
  type: string,
  canLoadMore?: boolean,
  handleLoadMore: Function,
};

const remotesSelector: Function = (state: Object, props: Object): Array<*> => (
  state.api.remotes.data.filter(a =>
    (a.conntype.toLowerCase() === CONN_MAP[props.params.type].toLowerCase())
  )
);

const viewSelector: Function = createSelector(
  [
    resourceSelector('remotes'),
    remotesSelector,
  ],
  (meta, remotes) => ({
    meta,
    remotes,
  })
);

const ConnectionTable: Function = ({
  sortData,
  onSortChange,
  paneId,
  openPane,
  remotes,
  type,
  canLoadMore,
  handleLoadMore,
}: Props): React.Element<any> => (
  <div>
    <Table
      fixed
      hover
      striped
      key={type}
      marginBottom={canLoadMore ? 40 : 0}
    >
      <Thead>
        <Tr
          sortData={sortData}
          onSortChange={onSortChange}
        >
          <Th className="narrow" name="up">Up</Th>
          <Th className="narrow">-</Th>
          <Th className="tiny">
            <Icon icon="exclamation-triangle" />
          </Th>
          <Th className="name" name="name">Name</Th>
          {type !== 'datasources' && (
            <Th className="text" name="url">URL</Th>
          )}
          <Th className="text" name="desc">Description</Th>
          <Th className="normal">-</Th>
        </Tr>
      </Thead>
      <Tbody>
        {remotes.map((remote: Object): React.Element<any> => (
          <ConnectionRow
            key={`connection_${remote.name}`}
            isActive={remote.id === paneId}
            hasAlerts={remote.alerts.length > 0}
            openPane={openPane}
            remoteType={type}
            {...remote}
          />
        ))}
      </Tbody>
    </Table>
    {canLoadMore && (
      <Button
        label="Load 30 more..."
        btnStyle="success"
        onClick={handleLoadMore}
        big
      />
    )}
  </div>
);

export default compose(
  connect(
    viewSelector,
    {
      load: actions.remotes.fetch,
    }
  ),
  defaultProps({ query: { action: 'all' } }),
  mapProps(({ params, ...rest }: Props): Props => ({
    type: params.type,
    params,
    ...rest,
  })),
  patch('load', ['query']),
  sync('meta'),
  checkNoData(({ remotes }: { remotes: Array<Object> }): number => remotes.length),
  withSort(
    ({ type }: Props): string => type,
    'remotes',
    sortDefaults.remote
  ),
  withLoadMore('remotes', 'remotes', true, 50),
  withPane(ConnectionPane, ['type']),
  pure([
    'location',
    'remotes',
    'paneId',
    'sortData',
  ])
)(ConnectionTable);
