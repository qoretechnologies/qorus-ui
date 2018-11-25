// @flow
import React from 'react';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import { Td, Th } from '../new_table';
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
}: AlertColumnProps): React.Element<any> => (
  <Td className="tiny">
    {hasAlerts && (
      <ButtonGroup>
        <Button iconName="error" btnStyle="danger" onClick={onClick} />
      </ButtonGroup>
    )}
  </Td>
);

const AlertColumnHeader: Function = ({
  ...props
}: AlertColumnProps): React.Element<any> => (
  <Th className="tiny" {...props}>
    <Icon iconName="error" />
  </Th>
);

AlertColumn = compose(onlyUpdateForKeys(['hasAlerts']))(AlertColumn);

export { AlertColumn, AlertColumnHeader };
