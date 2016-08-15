/* @flow */
import React from 'react';
import { Row, Cell } from '../../../components/table';
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
    <Row>
      <Cell className="name">
        { name }
      </Cell>
      <Cell className="narrow">
        { count }
      </Cell>
      <Cell>
        <DateComponent date={created} format="YYYY-MM-DD HH:mm:ss" />
      </Cell>
      <Cell className="narrow">
        <Button
          label="Clear"
          icon="trash-o"
          btnStyle="danger"
          action={handleClick}
        />
      </Cell>
    </Row>
  );
};

export default SQLCacheRow;
