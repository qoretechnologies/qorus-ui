/* @flow */
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';
import { ActionColumn } from '../../../components/ActionColumn';
import { Control as Button, Controls as ButtonGroup } from '../../../components/controls';
import DateComponent from '../../../components/date';
import NameColumn from '../../../components/NameColumn';
import { Td, Tr } from '../../../components/new_table';

type Props = {
  name: string;
  datasource: string;
  count: number;
  created: string;
  onClick: Function;
  first: boolean;
};

const SQLCacheRow: Function = ({
  name,
  datasource,
  count,
  created,
  onClick,
  first,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => {
  const handleClick: Function = (): void => {
    onClick(datasource, name);
  };

  return (
    <Tr first={first}>
      <NameColumn name={name} />
      <ActionColumn>
        <ButtonGroup>
          <Button btnStyle="danger" text="Clear" onClick={handleClick} className="bp3-small" />
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
