// @flow
import React from 'react';
import {
  Popover,
  Menu,
  MenuItem,
  Position,
  PopoverInteractionKind,
} from '@blueprintjs/core';
import map from 'lodash/map';
import { browserHistory } from 'react-router';

type Props = {
  links: Object,
};

const CollapsedCrumb: Function = ({ links }: Props): React.Element<any> => (
  <li>
    <Popover
      position={Position.BOTTOM_LEFT}
      interactionKind={PopoverInteractionKind.HOVER}
      content={
        <Menu>
          {map(links, (link, name) => (
            <MenuItem
              key={name}
              text={name}
              onClick={() => browserHistory.push(link)}
            />
          ))}
        </Menu>
      }
    >
      <span className="bp3-breadcrumbs-collapsed" />
    </Popover>
  </li>
);

export default CollapsedCrumb;
