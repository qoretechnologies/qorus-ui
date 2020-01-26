// @flow
import React from 'react';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import { Position } from '@blueprintjs/core';
import map from 'lodash/map';
import Dropdown, { Control, Item } from '../../../../components/dropdown';

type NodesDropdownProps = {
  nodeTab: string,
  onNodeTabChange: () => any,
  nodes: Array<string>,
};

const NodesDropdown: Function = ({
  nodeTab,
  onNodeTabChange,
  nodes,
}: NodesDropdownProps): React.Element<any> => (
  <Dropdown position={Position.LEFT}>
    <Control small>{nodeTab}</Control>
    {map(nodes, (nodeName: string) => (
      <Item
        key={nodeName}
        title={nodeName}
        action={(event, tab) => onNodeTabChange(event, tab)}
      />
    ))}
  </Dropdown>
);

export default compose(onlyUpdateForKeys(['nodeTab']))(NodesDropdown);
