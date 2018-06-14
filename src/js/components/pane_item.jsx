// @flow
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';

type Props = {
  title?: string,
  children?: any,
};

const PaneItem: Function = ({ title, children }: Props): React.Element<any> => (
  <div className="pane-item">
    {title && <h5 className="pane-item-title">{title}</h5>}
    <div>{children}</div>
  </div>
);

export default pure(['title', 'children'])(PaneItem);
