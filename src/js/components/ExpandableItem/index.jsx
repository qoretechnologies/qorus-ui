import React from 'react';
import compose from 'recompose/compose';
import withState from 'recompose/withState';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';

import { Icon } from '@blueprintjs/core';

type Props = {
  children: any,
  expanded: boolean,
  toggleExpand: Function,
  setExpanded: Function,
  title?: string,
};

const ExpandableItem: Function = ({
  children,
  expanded,
  toggleExpand,
  title,
}: Props): React.Element<HTMLDivElement> => (
  <div className="expandable-item">
    <div className="expandable-item_title" onClick={toggleExpand}>
      <Icon iconName={expanded ? 'small-minus' : 'small-plus'} />{' '}
      <h5>{title}</h5>
    </div>
    {expanded && (
      <div className="expandable-item_content">
        {typeof children === 'function' ? children() : children}
      </div>
    )}
  </div>
);

export default compose(
  withState('expanded', 'setExpanded', ({ show }) => show),
  withHandlers({
    toggleExpand: ({ setExpanded }: Props): Function => (): void => {
      setExpanded(expanded => !expanded);
    },
  }),
  onlyUpdateForKeys(['children', 'expanded'])
)(ExpandableItem);
