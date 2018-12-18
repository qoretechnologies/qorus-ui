// @flow
import React from 'react';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import { Td, Th } from '../new_table';

type ActionColumnProps = {
  children: any,
  className: string,
};

const ActionColumn: Function = compose(onlyUpdateForKeys(['children']))(
  ({
    children,
    className: className = 'normal',
  }: ActionColumnProps): React.Element<any> => (
    <Td className={className}>{children}</Td>
  )
);

type ActionColumnHeaderProps = {
  children: any,
  name: string,
  icon: string,
};

const ActionColumnHeader: Function = compose(
  onlyUpdateForKeys(['children', 'sortData'])
)(
  ({
    children: children = 'Actions',
    icon: icon = 'wrench',
    ...rest
  }: ActionColumnHeaderProps): React.Element<any> => (
    <Th icon={icon} {...rest}>
      {children}
    </Th>
  )
);

export { ActionColumn, ActionColumnHeader };
