import React from 'react';
import Flex from '../Flex';

type Props = {
  activeTab: string,
  children: any,
  name: string,
};

const SimpleTab: Function = ({ activeTab, children, name }: Props) =>
  activeTab === name && <Flex height="100%">{children}</Flex>;

export default SimpleTab;
