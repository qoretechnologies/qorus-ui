// @flow
import React from 'react';
import SimpleTab from './tab';
import Flex from '../Flex';

type Props = {
  activeTab: string,
  children: any,
};

const SimpleTabs: Function = ({ activeTab, children }: Props) => (
  <Flex>
    {React.Children.map(
      children,
      (child: Object): React.Element<any> =>
        React.cloneElement(child, {
          activeTab,
        })
    )}
  </Flex>
);

export { SimpleTabs, SimpleTab };
