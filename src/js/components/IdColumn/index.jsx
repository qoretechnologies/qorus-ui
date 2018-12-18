// @flow
import React from 'react';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import { Td, Th } from '../new_table';

type IdColumnProps = {
  children: any,
  className: string,
};

const IdColumn: Function = compose(onlyUpdateForKeys(['children']))(
  ({
    children,
    className: className = 'narrow',
  }: IdColumnProps): React.Element<any> => (
    <Td className={className}>{children}</Td>
  )
);

type IdColumnHeaderProps = {
  children: any,
  name: string,
  icon: string,
};

const IdColumnHeader: Function = compose(
  onlyUpdateForKeys(['children', 'sortData'])
)(
  ({
    children: children = 'ID',
    name: name = 'id',
    icon: icon = 'numbered-list',
    ...rest
  }: IdColumnHeaderProps): React.Element<any> => (
    <Th name={name} icon={icon} {...rest}>
      {children}
    </Th>
  )
);

export { IdColumn, IdColumnHeader };
