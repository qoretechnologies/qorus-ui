import React from 'react';
import SimpleTab from './tab';

type Props = {
  activeTab: string,
  children: any,
};

const SimpleTabs: Function = ({ activeTab, children }: Props) => (
  <div className="simple-tabs">
    {React.Children.map(
      children,
      (child: Object): React.Element<any> =>
        React.cloneElement(child, {
          activeTab,
        })
    )}
  </div>
);

export { SimpleTabs, SimpleTab };
