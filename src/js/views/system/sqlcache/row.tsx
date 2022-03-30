/* @flow */
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';

import { Tr, Td } from '../../../components/new_table';
import DateComponent from '../../../components/date';
import NameColumn from '../../../components/NameColumn';
import {
  Controls as ButtonGroup,
  Control as Button,
// @ts-expect-error ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
} from '../../../components/controls';
import { ActionColumn } from '../../../components/ActionColumn';

type Props = {
  name: string,
  datasource: string,
  count: number,
  created: string,
  onClick: Function,
  first: boolean,
};

const SQLCacheRow: Function = ({
  name,
  datasource,
  count,
  created,
  onClick,
  first,
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}: Props): React.Element<any> => {
  const handleClick: Function = (): void => {
    onClick(datasource, name);
  };

  return (
    <Tr first={first}>
      <NameColumn name={name} />
      <ActionColumn>
        <ButtonGroup>
          <Button
            btnStyle="danger"
            text="Clear"
            onClick={handleClick}
            className="bp3-small"
          />
        </ButtonGroup>
      </ActionColumn>
      <Td className="medium">{count}</Td>
      <Td className="big">
        <DateComponent date={created} format="YYYY-MM-DD HH:mm:ss" />
      </Td>
    </Tr>
  );
};

export default pure(['name'])(SQLCacheRow);
