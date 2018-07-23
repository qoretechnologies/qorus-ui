/* @flow */
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';
import { Button, Intent } from '@blueprintjs/core';

import { Tr, Td } from '../../../components/new_table';
import DateComponent from '../../../components/date';

type Props = {
  name: string,
  datasource: string,
  count: number,
  created: string,
  onClick: Function,
};

const SQLCacheRow: Function = ({
  name,
  datasource,
  count,
  created,
  onClick,
}: Props): React.Element<any> => {
  const handleClick: Function = (): void => {
    onClick(datasource, name);
  };

  return (
    <Tr>
      <Td className="name">{name}</Td>
      <Td className="narrow">{count}</Td>
      <Td className="big">
        <DateComponent date={created} format="YYYY-MM-DD HH:mm:ss" />
      </Td>
      <Td className="narrow">
        <Button
          intent={Intent.DANGER}
          text="Clear"
          onClick={handleClick}
          className="bp3-small"
        />
      </Td>
    </Tr>
  );
};

export default pure(['name'])(SQLCacheRow);
