// @flow
import React from 'react';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';

type MasonryLayoutProps = {
  children: any;
  columns: number;
};

let MasonryLayout: Function = ({
  children,
  columns = 2,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
MasonryLayoutProps): React.Element<any> => (
  <div className={`masonry-layout columns-${columns}`}>{children}</div>
);

MasonryLayout = onlyUpdateForKeys(['children', 'columns'])(MasonryLayout);

type MasonryPanelProps = {
  children: any;
  columns: number;
};

let MasonryPanel: Function = ({
  children,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
MasonryPanelProps): React.Element<any> => <div className="masonry-panel">{children}</div>;

MasonryPanel = onlyUpdateForKeys(['children'])(MasonryPanel);

export { MasonryLayout, MasonryPanel };
