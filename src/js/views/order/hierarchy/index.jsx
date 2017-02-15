// @flow
import React from 'react';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import pure from 'recompose/onlyUpdateForKeys';

import checkNoData from '../../../hocomponents/check-no-data';
import { Table, Tbody, Thead, Tr, Th } from '../../../components/new_table';
import HierarchyRow from './row';

type Props = {
  hierarchy: Object,
  hierarchyKeys: Array<string | number>,
  compact?: boolean,
  expanded: Object,
  order: Object,
  toggleRow: Function,
  handleExpandClick: Function,
};

const HierarchyTable: Function = ({
  hierarchy,
  hierarchyKeys,
  compact,
}: Props): React.Element<any> => (
  <Table
    fixed
    hover
    condensed
    striped
  >
    <Thead>
      <Tr>
        <Th className="normal">ID</Th>
        <Th className="name">Workflow</Th>
        <Th className="medium">Status</Th>
        <Th className="narrow">Bus.Err.</Th>
        <Th className="narrow">Errors</Th>
        <Th className="narrow">Priority</Th>
        { !compact && (
          <Th className="big">Scheduled</Th>
        )}
        { !compact && (
          <Th className="big">Started</Th>
        )}
        <Th className="big">Completed</Th>
        { !compact && (
          <Th className="narrow">Sub WF</Th>
        )}
        { !compact && (
          <Th className="narrow">Sync</Th>
        )}
        { !compact && (
          <Th className="medium">Warnings</Th>
        )}
      </Tr>
    </Thead>
    <Tbody>
      {hierarchyKeys.map((id: string | number): ?React.Element<any> => {
        const item: Object = hierarchy[id];
        const parentId: ?number = item.parent_workflow_instanceid;

        return (
          <HierarchyRow
            key={id}
            id={item.workflow_instanceid}
            compact={compact}
            item={item}
            hasParent={parentId}
          />
        );
      })}
    </Tbody>
  </Table>
);

export default compose(
  mapProps(({ order, ...rest }: Props): Object => ({
    hierarchy: order.HierarchyInfo,
    hierarchyKeys: Object.keys(order.HierarchyInfo),
    ...rest,
  })),
  checkNoData(({ hierarchy }) => hierarchy && Object.keys(hierarchy).length),
  pure(['hierarchy'])
)(HierarchyTable);
