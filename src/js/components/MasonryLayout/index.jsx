// @flow
import React from 'react';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';

type MasonryLayoutProps = {
  children: any,
  columns: number,
};

let MasonryLayout: Function = ({
  children,
  columns: columns = 2,
}: MasonryLayoutProps): React.Element<any> => (
  <div className={`masonry-layout columns-${columns}`}>{children}</div>
);

MasonryLayout = onlyUpdateForKeys(['children', 'columns'])(MasonryLayout);

type MasonryPanelProps = {
  children: any,
  columns: number,
};

let MasonryPanel: Function = ({
  children,
}: MasonryPanelProps): React.Element<any> => (
  <div className="masonry-panel">{children}</div>
);

MasonryPanel = onlyUpdateForKeys(['children'])(MasonryPanel);

export { MasonryLayout, MasonryPanel };
