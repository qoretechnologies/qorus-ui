// @flow
import React from 'react';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import { Td, Th } from '../new_table';
// @ts-expect-error ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
import { Controls as ButtonGroup, Control as Button } from '../controls';
import { Icon } from '@blueprintjs/core';

type AlertColumnProps = {
  hasAlerts: boolean,
  onClick: Function,
  name?: string,
};

let AlertColumn: Function = ({
  hasAlerts,
  onClick,
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}: AlertColumnProps): React.Element<any> => (
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
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}: AlertColumnProps): React.Element<any> => (
  <Th className="tiny" {...props}>
    <Icon icon="error" />
  </Th>
);

AlertColumn = compose(onlyUpdateForKeys(['hasAlerts']))(AlertColumn);

export { AlertColumn, AlertColumnHeader };
