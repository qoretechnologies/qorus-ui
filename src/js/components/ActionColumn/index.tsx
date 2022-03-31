import React from 'react';
import { injectIntl } from 'react-intl';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import { Td, Th } from '../new_table';

type ActionColumnProps = {
  children: any;
  className: string;
};

const ActionColumn: Function = compose(onlyUpdateForKeys(['children']))(
  ({
    children,
    className = 'normal',
  }: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
  ActionColumnProps): React.Element<any> => <Td className={className}>{children || '-'}</Td>
);

type ActionColumnHeaderProps = {
  children?: any;
  name: string;
  icon: string;
};

const ActionColumnHeader: Function = compose(
  onlyUpdateForKeys(['children', 'sortData']),
  injectIntl
)(
  ({
    children,
    icon = 'wrench',
    // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'ActionColu... Remove this comment to see the full error message
    intl,
    ...rest
  }: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
  ActionColumnHeaderProps): React.Element<any> => (
    <Th icon={icon} {...rest}>
      {children || intl.formatMessage({ id: 'table.actions' })}
    </Th>
  )
);

export { ActionColumn, ActionColumnHeader };
