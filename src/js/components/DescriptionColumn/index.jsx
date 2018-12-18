// @flow
import React from 'react';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import { Td, Th } from '../new_table';

type DescriptionColumnProps = {
  children: any,
  className: string,
};

const DescriptionColumn: Function = compose(onlyUpdateForKeys(['children']))(
  ({
    children,
    className: className = 'text',
  }: DescriptionColumnProps): React.Element<any> => (
    <Td className={className}>{children}</Td>
  )
);

type DescriptionColumnHeaderProps = {
  children: any,
  name: string,
  icon: string,
};

const DescriptionColumnHeader: Function = compose(
  onlyUpdateForKeys(['children'])
)(
  ({
    children: children = 'Description',
    name: name = 'desc',
    icon: icon = 'label',
    ...rest
  }: DescriptionColumnHeaderProps): React.Element<any> => (
    <Th name={name} icon={icon} {...rest}>
      {children}
    </Th>
  )
);

export { DescriptionColumn, DescriptionColumnHeader };
