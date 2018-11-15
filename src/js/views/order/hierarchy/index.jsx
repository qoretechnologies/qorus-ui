// @flow
import React from 'react';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import pure from 'recompose/onlyUpdateForKeys';
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
import Pull from '../../../components/Pull';
import LoadMore from '../../../components/LoadMore';
import DataOrEmptyTable from '../../../components/DataOrEmptyTable';

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
  limit: number,
};

const HierarchyTable: Function = ({
  hierarchy,
  hierarchyKeys,
  compact,
  canLoadMore,
  handleLoadMore,
  handleLoadAll,
  isTablet,
  limit,
}: Props): React.Element<any> => (
  <Box noPadding top>
    <Table fixed hover condensed striped>
      <Thead>
        <FixedRow className="toolbar-row" hide={!canLoadMore}>
          <Th colspan="full">
            <Pull right>
              <LoadMore
                canLoadMore={canLoadMore}
                handleLoadMore={handleLoadMore}
                handleLoadAll={handleLoadAll}
                limit={limit}
              />
            </Pull>
          </Th>
        </FixedRow>
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
      <DataOrEmptyTable
        condition={hierarchyKeys.length === 0}
        cols={isTablet ? (compact ? 6 : 10) : compact ? 7 : 12}
        small={compact}
      >
        {props => (
          <Tbody {...props}>
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
        )}
      </DataOrEmptyTable>
    </Table>
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
  withLoadMore('hierarchyKeys', null, true, 50),
  pure(['hierarchy', 'hierarchyKeys', 'canLoadMore', 'isTablet'])
)(HierarchyTable);
