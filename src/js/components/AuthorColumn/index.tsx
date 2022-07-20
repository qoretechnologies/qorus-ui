// @flow
import React from 'react';
import { injectIntl } from 'react-intl';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import { Td, Th } from '../new_table';
import Text from '../text';

type AuthorColumnProps = {
  children: any;
  className: string;
};

const AuthorColumn: Function = compose(onlyUpdateForKeys(['children']))(
  ({
    children,
    className = 'text',
  }: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
  AuthorColumnProps) => (
    <Td className={className}>
      <Text text={children || '-'} />
    </Td>
  )
);

type AuthorColumnHeaderProps = {
  children: any;
  name: string;
  icon: string;
};

const AuthorColumnHeader: Function = compose(
  onlyUpdateForKeys(['children', 'sortData']),
  injectIntl
)(
  ({
    children,
    name = 'author',
    icon = 'person',
    // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'AuthorColu... Remove this comment to see the full error message
    intl,
    ...rest
  }: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
  AuthorColumnHeaderProps) => (
    <Th icon={icon} name={name} className="text" {...rest}>
      {children || intl.formatMessage({ id: 'table.author' })}
    </Th>
  )
);

export { AuthorColumn, AuthorColumnHeader };
