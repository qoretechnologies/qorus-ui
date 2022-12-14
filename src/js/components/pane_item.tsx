// @flow
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';

type Props = {
  title?: string;
  // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
  label?;
  children?: any;
  id?: string;
  style?: React.CSSProperties;
};

const PaneItem: Function = ({
  title,
  children,
  label,
  id,
  style,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => (
  <div className="pane-item" id={id} style={style}>
    {(title || label) && (
      <div className="pane-item-header">
        {title && <h5 className="pane-item-title">{title}</h5>}
        {label && <div className="pull-right pane-item-label">{label}</div>}
      </div>
    )}
    {children && <div>{children}</div>}
  </div>
);

export default pure(['title', 'children'])(PaneItem);
