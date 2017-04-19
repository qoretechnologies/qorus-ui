/* @flow */
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';

import { Table, Tbody, Thead, Tr, Th } from '../../../components/new_table';
import { Control as Button } from '../../../components/controls';
import CacheRow from './row';

type Props = {
  name: string,
  data: Object,
  onClick: Function,
  onSingleClick: Function,
}

const SQLCacheTable: Function = (
  { name, data, onClick, onSingleClick }: Props
): React.Element<any> => {
  const handleClick: Function = (): void => {
    onClick(name);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="pull-left">
          <h4>{ name }</h4>
        </div>
        <div className="pull-right">
          <Button
            btnStyle="danger"
            big
            label="Clear datasource"
            icon="trash-o"
            action={handleClick}
          />
        </div>
      </div>
      { Object.keys(data).length > 0 && (
        <Table condensed striped>
          <Thead>
            <Tr>
              <Th className="name">
                Name
              </Th>
              <Th className="narrow">
                Count
              </Th>
              <Th>
                Created
              </Th>
              <Th />
            </Tr>
          </Thead>
          <Tbody>
            { Object.keys(data).map((cache, index) => (
              <CacheRow
                key={index}
                datasource={name}
                name={cache}
                count={data[cache].count}
                created={data[cache].created}
                onClick={onSingleClick}
              />
            ))}
          </Tbody>
        </Table>
      )}
      { Object.keys(data).length <= 0 && (
        <p className="no-data"> No data </p>
      )}
    </div>
  );
};

export default SQLCacheTable;
