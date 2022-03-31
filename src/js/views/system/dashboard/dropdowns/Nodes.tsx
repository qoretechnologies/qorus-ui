// @flow
import { Position } from '@blueprintjs/core';
import map from 'lodash/map';
import React from 'react';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import Dropdown, { Control, Item } from '../../../../components/dropdown';

type NodesDropdownProps = {
  nodeTab: string;
  onNodeTabChange: () => any;
  nodes: Array<string>;
};

const NodesDropdown: Function = ({
  nodeTab,
  onNodeTabChange,
  nodes,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
NodesDropdownProps): React.Element<any> => (
  // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
  <Dropdown position={Position.LEFT}>
    {/* @ts-expect-error ts-migrate(2739) FIXME: Type '{ children: string; small: true; }' is missi... Remove this comment to see the full error message */}
    <Control small>{nodeTab}</Control>
    {map(nodes, (nodeName: string) => (
      <Item
        key={nodeName}
        title={nodeName}
        // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
        action={(event, tab) => onNodeTabChange(event, tab)}
      />
    ))}
  </Dropdown>
);

export default compose(onlyUpdateForKeys(['nodeTab']))(NodesDropdown);
