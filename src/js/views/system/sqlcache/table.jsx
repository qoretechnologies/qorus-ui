/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import withState from 'recompose/withState';
import withHandlers from 'recompose/withHandlers';

import { Table, Tbody, Thead, Tr, Th } from '../../../components/new_table';
import { Control as Button } from '../../../components/controls';
import Icon from '../../../components/icon';
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

const SQLCacheTable: Function = (
  { name, data, onClick, onSingleClick, expanded, handleExpandClick }: Props
): React.Element<any> => {
  const handleClick: Function = (): void => {
    onClick(name);
  };

  return (
    <div>
      <div className="row">
        <div className="col-lg-12">
          <div className="pull-left">
            <h4 onClick={handleExpandClick} className="cpointer">
              <Icon icon={expanded ? 'minus-square-o' : 'plus-square-o'} />
              {' '}
              { name }
            </h4>
          </div>
          <div className="pull-right">
            <Button
              btnStyle="danger"
              label="Clear datasource"
              icon="trash-o"
              action={handleClick}
            />
          </div>
        </div>
      </div>
      { Object.keys(data).length > 0 && expanded ? (
        <Table condensed striped>
          <Thead>
            <Tr>
              <Th className="name">
                Name
              </Th>
              <Th className="narrow">
                Count
              </Th>
              <Th className="big">
                Created
              </Th>
              <Th className="narrow"> Actions </Th>
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
      ) : null}
      { Object.keys(data).length <= 0 && (
        <p className="no-data"> No data </p>
      )}
    </div>
  );
};

export default compose(
  withState('expanded', 'setExpanded', true),
  withHandlers({
    handleExpandClick: ({ expanded, setExpanded }: Props): Function => (): void => {
      setExpanded(() => !expanded);
    },
  }),
  pure([
    'expanded',
    'dataLen',
  ])
)(SQLCacheTable);
