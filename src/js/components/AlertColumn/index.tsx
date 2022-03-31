// @flow
import { Icon } from '@blueprintjs/core';
import React from 'react';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
// @ts-ignore ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
import { Control as Button, Controls as ButtonGroup } from '../controls';
import { Td, Th } from '../new_table';

type AlertColumnProps = {
  hasAlerts: boolean;
  onClick: Function;
  name?: string;
};

let AlertColumn: Function = ({
  hasAlerts,
  onClick,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
AlertColumnProps): React.Element<any> => (
  <Td className="tiny">
    {hasAlerts && (
      <ButtonGroup>
        <Button icon="error" btnStyle="danger" onClick={onClick} />
      </ButtonGroup>
    )}
  </Td>
);

const AlertColumnHeader: Function = ({
  ...props
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
AlertColumnProps): React.Element<any> => (
  <Th className="tiny" {...props}>
    <Icon icon="error" />
  </Th>
);

AlertColumn = compose(onlyUpdateForKeys(['hasAlerts']))(AlertColumn);

export { AlertColumn, AlertColumnHeader };
