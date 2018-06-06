/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import withState from 'recompose/withState';
import withHandlers from 'recompose/withHandlers';
import { Button, Intent } from '@blueprintjs/core';

import { Table, Tbody, Thead, Tr, Th } from '../../../components/new_table';
import { Breadcrumbs, Crumb } from '../../../components/breadcrumbs';
import CacheRow from './row';

type Props = {
  name: string,
  data: Object,
  dataLen: number,
  onClick: Function,
  onSingleClick: Function,
  expanded: boolean,
  handleExpandClick: Function,
  setExpanded: Function,
};

const SQLCacheTable: Function = ({
  name,
  data,
  onClick,
  onSingleClick,
  expanded,
  handleExpandClick,
}: Props): React.Element<any> => {
  const handleClick: Function = (): void => {
    onClick(name);
  };

  return (
    <div>
      <Breadcrumbs onClick={handleExpandClick}>
        <Crumb active={expanded}>{name}</Crumb>
      </Breadcrumbs>
      <div className="pull-right">
        <Button
          intent={Intent.DANGER}
          text="Clear datasource"
          iconName="trash"
          onClick={handleClick}
          className="pt-small"
        />
      </div>

      {Object.keys(data).length > 0 && expanded ? (
        <Table condensed striped>
          <Thead>
            <Tr>
              <Th className="name">Name</Th>
              <Th className="narrow">Count</Th>
              <Th className="big">Created</Th>
              <Th className="narrow"> Actions </Th>
            </Tr>
          </Thead>
          <Tbody>
            {Object.keys(data).map((cache, index) => (
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
      ) : null}
      {Object.keys(data).length <= 0 && <p className="no-data"> No data </p>}
    </div>
  );
};

export default compose(
  withState('expanded', 'setExpanded', true),
  withHandlers({
    handleExpandClick: ({
      expanded,
      setExpanded,
    }: Props): Function => (): void => {
      setExpanded(() => !expanded);
    },
  }),
  pure(['expanded', 'dataLen'])
)(SQLCacheTable);
