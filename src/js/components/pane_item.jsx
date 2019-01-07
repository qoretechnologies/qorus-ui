// @flow
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';

type Props = {
  title?: string,
  label?: React.Element<any>,
  children?: any,
};

const PaneItem: Function = ({
  title,
  children,
  label,
}: Props): React.Element<any> => (
  <div className="pane-item">
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
