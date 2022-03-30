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
    className = 'tiny',
  // @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
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
    children = 'ID',
    name = 'id',
    icon = 'numbered-list',
    ...rest
  // @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
  }: IdColumnHeaderProps): React.Element<any> => (
    <Th icon={icon} name={name} {...rest}>
      {children}
    </Th>
  )
);

export { IdColumn, IdColumnHeader };
