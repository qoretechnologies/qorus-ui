import React from 'react';
import Flex from '../Flex';

type Props = {
  activeTab: string,
  children: any,
  name: string,
  scrollY: boolean,
};

const SimpleTab: Function = ({ activeTab, children, name, scrollY }: Props) =>
  activeTab === name && (
    <Flex scrollY={scrollY} height="100%">
      {children}
    </Flex>
  );

export default SimpleTab;
