import React from 'react';

type Props = {
  activeTab: string,
  children: any,
  name: string,
};

const SimpleTab: Function = ({ activeTab, children, name }: Props) =>
  activeTab === name && <div className="simple-tab">{children}</div>;

export default SimpleTab;
