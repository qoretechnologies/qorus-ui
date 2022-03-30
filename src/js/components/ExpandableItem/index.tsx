import React from 'react';
import compose from 'recompose/compose';
import withState from 'recompose/withState';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';

import { Icon } from '@blueprintjs/core';
import lifecycle from 'recompose/lifecycle';
import Pull from '../Pull';

type Props = {
  children: any,
  expanded: boolean,
  toggleExpand: Function,
  setExpanded: Function,
  title?: string,
  show?: boolean,
  label?: any,
};

const ExpandableItem: Function = ({
  children,
  expanded,
  toggleExpand,
  title,
  label,
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}: Props): React.Element<HTMLDivElement> => (
  <div className="expandable-item">
    <div>
      <div
        className={`expandable-item_title ${expanded && 'expanded'}`}
        // @ts-expect-error ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'MouseEv... Remove this comment to see the full error message
        onClick={toggleExpand}
      >
        <Icon icon={expanded ? 'small-minus' : 'small-plus'} />{' '}
        <h4>{title}</h4>
      </div>
      {label && (
        <Pull right className="expandable-label">
          {label}
        </Pull>
      )}
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
  lifecycle({
    componentWillReceiveProps (nextProps: Props) {
      if (this.props.show !== nextProps.show) {
        nextProps.setExpanded(() => nextProps.show);
      }
    },
  }),
  onlyUpdateForKeys(['children', 'expanded'])
)(ExpandableItem);
