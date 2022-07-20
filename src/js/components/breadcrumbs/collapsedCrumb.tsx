// @flow
import { Menu, MenuItem, Popover, PopoverInteractionKind, Position } from '@blueprintjs/core';
import map from 'lodash/map';
import React from 'react';
import { browserHistory } from 'react-router';

type Props = {
  links: any;
};

// @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
const CollapsedCrumb: Function = ({ links }: Props) => (
  <li>
    <Popover
      position={Position.BOTTOM_LEFT}
      interactionKind={PopoverInteractionKind.HOVER}
      content={
        <Menu>
          {map(links, (link, name) => (
            <MenuItem key={name} text={name} onClick={() => browserHistory.push(link)} />
          ))}
        </Menu>
      }
    >
      <span className="bp3-breadcrumbs-collapsed" />
    </Popover>
  </li>
);

export default CollapsedCrumb;
