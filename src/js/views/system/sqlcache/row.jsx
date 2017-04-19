/* @flow */
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';

import { Tr, Td } from '../../../components/new_table';
import { Control as Button } from '../../../components/controls';
import DateComponent from '../../../components/date';

type Props = {
  name: string,
  datasource: string,
  count: number,
  created: string,
  onClick: Function,
}

const SQLCacheRow: Function = (
  { name, datasource, count, created, onClick }: Props
): React.Element<any> => {
  const handleClick: Function = (): void => {
    onClick(datasource, name);
  };

  return (
    <Tr>
      <Td className="name">
        { name }
      </Td>
      <Td className="narrow">
        { count }
      </Td>
      <Td>
        <DateComponent date={created} format="YYYY-MM-DD HH:mm:ss" />
      </Td>
      <Td className="narrow">
        <Button
          label="Clear"
          icon="trash-o"
          btnStyle="danger"
          action={handleClick}
        />
      </Td>
    </Tr>
  );
};

export default pure(['name'])(SQLCacheRow);
