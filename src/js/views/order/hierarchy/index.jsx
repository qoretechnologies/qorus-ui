// @flow
import React from 'react';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import pure from 'recompose/onlyUpdateForKeys';
import { ButtonGroup, Button, Intent } from '@blueprintjs/core';

import checkNoData from '../../../hocomponents/check-no-data';
import withLoadMore from '../../../hocomponents/loadMore';
import Box from '../../../components/box';
import {
  Table,
  Tbody,
  Thead,
  FixedRow,
  Th,
} from '../../../components/new_table';
import HierarchyRow from './row';

type Props = {
  hierarchy: Object,
  hierarchyKeys: Array<string | number>,
  compact?: boolean,
  expanded: Object,
  order: Object,
  toggleRow: Function,
  handleExpandClick: Function,
  canLoadMore: boolean,
  handleLoadMore: Function,
  handleLoadAll: Function,
  isTablet: boolean,
  loadMoreTotal: number,
};

const HierarchyTable: Function = ({
  hierarchy,
  hierarchyKeys,
  compact,
  canLoadMore,
  handleLoadMore,
  handleLoadAll,
  isTablet,
  loadMoreTotal,
}: Props): React.Element<any> => (
  <Box noPadding>
    <Table fixed hover condensed striped>
      <Thead>
        <FixedRow>
          <Th className="normal">ID</Th>
          {!isTablet && <Th className="name">Workflow</Th>}
          <Th className="medium">Status</Th>
          <Th className="narrow">Bus.Err.</Th>
          <Th className="narrow">Errors</Th>
          <Th className="narrow">Priority</Th>
          {!compact && !isTablet && <Th className="big">Scheduled</Th>}
          {!compact && <Th className="big">Started</Th>}
          <Th className="big">Completed</Th>
          {!compact && <Th className="narrow">Sub WF</Th>}
          {!compact && <Th className="narrow">Sync</Th>}
          {!compact && <Th className="medium">Warnings</Th>}
        </FixedRow>
      </Thead>
      <Tbody>
        {hierarchyKeys.map(
          (id: string | number, index: number): ?React.Element<any> => {
            const item: Object = hierarchy[id];
            const parentId: ?number = item.parent_workflow_instanceid;

            return (
              <HierarchyRow
                key={id}
                first={index === 0}
                id={item.workflow_instanceid}
                compact={compact}
                item={item}
                hasParent={parentId}
                isTablet={isTablet}
              />
            );
          }
        )}
      </Tbody>
    </Table>
    {canLoadMore && (
      <ButtonGroup style={{ padding: '15px' }}>
        <Button
          text={`Showing ${hierarchyKeys.length} of ${loadMoreTotal}`}
          intent={Intent.NONE}
          className="pt-minimal"
        />
        <Button
          text={'Show 50 more...'}
          intent={Intent.PRIMARY}
          onClick={handleLoadMore}
        />
        <Button
          text="Show all"
          intent={Intent.PRIMARY}
          onClick={handleLoadAll}
        />
      </ButtonGroup>
    )}
  </Box>
);

export default compose(
  mapProps(
    ({ order, ...rest }: Props): Object => ({
      hierarchy: order.HierarchyInfo,
      hierarchyKeys: Object.keys(order.HierarchyInfo),
      ...rest,
    })
  ),
  checkNoData(({ hierarchy }) => hierarchy && Object.keys(hierarchy).length),
  withLoadMore('hierarchyKeys', null, true, 50),
  pure(['hierarchy', 'hierarchyKeys', 'canLoadMore', 'isTablet'])
)(HierarchyTable);
